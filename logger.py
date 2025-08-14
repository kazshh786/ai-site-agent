import logging
import uuid
import time
import hashlib
import re
from collections import defaultdict, deque
from contextvars import ContextVar
from typing import Optional, Dict, Any, List
from dataclasses import dataclass, field
from pythonjsonlogger import jsonlogger

# Use contextvars instead of threading.local for better async support
_trace_context: ContextVar[Optional['TraceContext']] = ContextVar('trace_context', default=None)

@dataclass
class TraceContext:
    """Complete tracing context for distributed operations"""
    trace_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    span_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    parent_span_id: Optional[str] = None
    operation_name: str = ""
    start_time: float = field(default_factory=time.time)
    tags: Dict[str, Any] = field(default_factory=dict)

    def create_child_span(self, operation_name: str) -> 'TraceContext':
        """Create a child span for nested operations"""
        return TraceContext(
            trace_id=self.trace_id,
            span_id=str(uuid.uuid4()),
            parent_span_id=self.span_id,
            operation_name=operation_name,
            tags=self.tags.copy()
        )

def set_trace_context(context: TraceContext):
    """Sets the current trace context for the active thread/task."""
    _trace_context.set(context)

class TracingFilter(logging.Filter):
    """Inject tracing context into all log records"""
    def filter(self, record):
        context = _trace_context.get()
        if context:
            record.trace_id = context.trace_id
            record.span_id = context.span_id
            record.parent_span_id = context.parent_span_id
            record.operation_name = context.operation_name
        else:
            record.trace_id = None
            record.span_id = None
            record.parent_span_id = None
            record.operation_name = None
        return True

class SecretsScrubbingFilter(logging.Filter):
    """Scrub sensitive information from log records."""
    REDACTED = "***REDACTED***"
    SENSITIVE_KEYS = [
        "password",
        "token",
        "api_key",
        "secret",
        "credentials",
        "auth",
    ]

    def filter(self, record: logging.LogRecord) -> bool:
        self.scrub(record)
        return True

    def scrub(self, record: logging.LogRecord):
        # Scrub message
        if isinstance(record.msg, str):
            for key in self.SENSITIVE_KEYS:
                record.msg = re.sub(
                    f'"{key}":\\s*".*?"',
                    f'"{key}": "{self.REDACTED}"',
                    record.msg,
                    flags=re.IGNORECASE,
                )

        # Scrub extra dictionary
        if hasattr(record, "__dict__"):
            for key, value in record.__dict__.items():
                if any(sensitive_key in key.lower() for sensitive_key in self.SENSITIVE_KEYS):
                    setattr(record, key, self.REDACTED)

class SmartSamplingFilter(logging.Filter):
    """
    Intelligent log sampling that:
    - Always logs ERROR and CRITICAL
    - Samples repetitive INFO/DEBUG based on content similarity
    - Uses exponential backoff for repeated similar messages
    - Preserves first/last occurrence of message patterns
    """

    def __init__(self, default_sample_rate: float = 0.1, default_burst_limit: int = 10, rules: Optional[Dict[str, Dict]] = None):
        super().__init__()
        self.default_sample_rate = default_sample_rate
        self.default_burst_limit = default_burst_limit
        self.rules = rules or {}

        self.message_counts: Dict[str, int] = defaultdict(int)
        self.message_timestamps: Dict[str, deque] = defaultdict(lambda: deque(maxlen=100))
        self.last_logged: Dict[str, float] = {}

    def _get_message_signature(self, record: logging.LogRecord) -> str:
        """Create a signature for similar messages"""
        message = str(record.getMessage())
        normalized = re.sub(r'\d+', 'N', message)
        normalized = re.sub(r'[a-f0-9-]{8,}', 'ID', normalized)
        normalized = re.sub(r'\d{4}-\d{2}-\d{2}[\s\d:-]+', 'TIMESTAMP', normalized)

        signature_input = f"{record.name}:{record.levelname}:{normalized}"
        return hashlib.md5(signature_input.encode()).hexdigest()[:16]

    def filter(self, record: logging.LogRecord) -> bool:
        if record.levelno >= logging.ERROR:
            return True

        extra = getattr(record, '__dict__', {})
        if extra.get('success') == False or 'error' in str(extra):
            return True

        rule = self.rules.get(record.name, {})
        sample_rate = rule.get("sample_rate", self.default_sample_rate)
        burst_limit = rule.get("burst_limit", self.default_burst_limit)

        signature = self._get_message_signature(record)
        current_time = time.time()

        self.message_counts[signature] += 1
        self.message_timestamps[signature].append(current_time)

        count = self.message_counts[signature]

        if count <= burst_limit:
            return True

        time_since_last = current_time - self.last_logged.get(signature, 0)
        backoff_interval = min(300, 2 ** min(count // 10, 8))

        if time_since_last > backoff_interval:
            self.last_logged[signature] = current_time
            return True

        return hash(signature + str(current_time)) % 100 < (sample_rate * 100)

def get_logger(name: str) -> logging.Logger:
    """Gets a logger with tracing and sampling."""
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    
    logger.propagate = False

    if logger.handlers:
        return logger

    logHandler = logging.StreamHandler()
    
    logHandler.addFilter(SecretsScrubbingFilter())
    logHandler.addFilter(TracingFilter())
    
    sampling_rules = {
        "agent.file_writer": {"sample_rate": 0.1, "burst_limit": 5},
        "utils.commands": {"sample_rate": 0.3, "burst_limit": 10},
    }
    logHandler.addFilter(SmartSamplingFilter(rules=sampling_rules))

    formatter = jsonlogger.JsonFormatter()
    logHandler.setFormatter(formatter)
    logger.addHandler(logHandler)
    return logger

log = get_logger("AIAgent")

def start_trace(operation_name: str, **tags) -> TraceContext:
    """Start a new distributed trace"""
    context = TraceContext(operation_name=operation_name, tags=tags)
    _trace_context.set(context)

    log.info("Trace started", extra={
        "event": "trace.start",
        "operation": operation_name,
        **tags
    })
    return context

def start_span(operation_name: str, **tags) -> TraceContext:
    """Start a child span within current trace"""
    parent = _trace_context.get()
    if parent:
        context = parent.create_child_span(operation_name)
        context.tags.update(tags)
    else:
        context = TraceContext(operation_name=operation_name, tags=tags)

    _trace_context.set(context)

    log.info("Span started", extra={
        "event": "span.start",
        "operation": operation_name,
        **tags
    })
    return context

def finish_span(success: bool = True, **extra_tags):
    """Finish current span with outcome"""
    context = _trace_context.get()
    if context:
        duration = time.time() - context.start_time

        log.info("Span finished", extra={
            "event": "span.finish",
            "operation": context.operation_name,
            "success": success,
            "duration_seconds": duration,
            **context.tags,
            **extra_tags
        })
