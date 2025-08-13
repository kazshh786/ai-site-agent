import time
import psutil
import threading
from collections import defaultdict, deque
from typing import Dict, List, Optional, Callable, Any
from dataclasses import dataclass
from datetime import datetime, timedelta
import json
from logger import get_logger

log = get_logger(__name__)

@dataclass
class MetricPoint:
    """A single metric measurement"""
    timestamp: float
    value: float
    tags: Dict[str, str]

@dataclass
class HealthCheck:
    """Health check configuration"""
    name: str
    check_func: Callable[[], bool]
    interval_seconds: int
    timeout_seconds: int = 5
    consecutive_failures_threshold: int = 3

class MetricsCollector:
    """
    Real-time metrics collection system that:
    - Tracks custom business metrics
    - Monitors system resources
    - Provides health checks
    - Generates alerts
    """

    def __init__(self, retention_hours: int = 24):
        self.metrics: Dict[str, deque] = defaultdict(lambda: deque(maxlen=10000))
        self.counters: Dict[str, float] = defaultdict(float)
        self.gauges: Dict[str, float] = defaultdict(float)
        self.histograms: Dict[str, List[float]] = defaultdict(list)

        self.retention_seconds = retention_hours * 3600
        self.health_checks: Dict[str, HealthCheck] = {}
        self.health_status: Dict[str, bool] = {}
        self.failure_counts: Dict[str, int] = defaultdict(int)

        self._start_background_collection()

    def counter(self, name: str, value: float = 1, **tags):
        """Increment a counter metric"""
        self.counters[self._metric_key(name, tags)] += value
        self._record_metric(name, self.counters[self._metric_key(name, tags)], tags)

        # Log significant counter changes
        if value > 10 or name.endswith('_errors'):
            log.info("Counter updated", extra={
                "metric_name": name,
                "metric_value": value,
                "metric_total": self.counters[self._metric_key(name, tags)],
                "metric_tags": tags
            })

    def gauge(self, name: str, value: float, **tags):
        """Set a gauge metric"""
        key = self._metric_key(name, tags)
        self.gauges[key] = value
        self._record_metric(name, value, tags)

    def histogram(self, name: str, value: float, **tags):
        """Add a value to histogram"""
        key = self._metric_key(name, tags)
        self.histograms[key].append(value)

        # Keep only recent values
        cutoff = time.time() - self.retention_seconds
        self.histograms[key] = [v for v in self.histograms[key] if v > cutoff]

        self._record_metric(name, value, tags)

    def timing(self, name: str, duration_seconds: float, **tags):
        """Record timing metric"""
        self.histogram(f"{name}_duration", duration_seconds, **tags)

        # Log slow operations
        if duration_seconds > 30:  # Configurable threshold
            log.warning("Slow operation detected", extra={
                "operation": name,
                "duration_seconds": duration_seconds,
                "tags": tags,
                "performance_alert": True
            })

    def _metric_key(self, name: str, tags: Dict[str, str]) -> str:
        """Generate unique key for metric with tags"""
        tag_str = ",".join(f"{k}={v}" for k, v in sorted(tags.items()))
        return f"{name}[{tag_str}]" if tag_str else name

    def _record_metric(self, name: str, value: float, tags: Dict[str, str]):
        """Store metric point"""
        point = MetricPoint(time.time(), value, tags)
        self.metrics[name].append(point)

        # Clean old metrics
        self._clean_old_metrics(name)

    def _clean_old_metrics(self, name: str):
        """Remove old metric points"""
        cutoff = time.time() - self.retention_seconds
        metrics = self.metrics[name]
        while metrics and metrics[0].timestamp < cutoff:
            metrics.popleft()

    def add_health_check(self, health_check: HealthCheck):
        """Add a health check"""
        self.health_checks[health_check.name] = health_check
        self.health_status[health_check.name] = True
        self.failure_counts[health_check.name] = 0

    def get_metrics_summary(self, minutes: int = 5) -> Dict[str, Any]:
        """Get metrics summary for recent time period"""
        cutoff = time.time() - (minutes * 60)
        summary = {}

        for name, points in self.metrics.items():
            recent_points = [p for p in points if p.timestamp >= cutoff]
            if recent_points:
                values = [p.value for p in recent_points]
                summary[name] = {
                    "count": len(values),
                    "min": min(values),
                    "max": max(values),
                    "avg": sum(values) / len(values),
                    "latest": values[-1]
                }

        return summary

    def _start_background_collection(self):
        """Start background thread for system metrics and health checks"""
        def collect():
            while True:
                try:
                    # Collect system metrics
                    self._collect_system_metrics()

                    # Run health checks
                    self._run_health_checks()

                    time.sleep(30)  # Collect every 30 seconds
                except Exception as e:
                    log.error("Background metrics collection failed", extra={
                        "error": str(e),
                        "error_type": type(e).__name__
                    })
                    time.sleep(60)  # Back off on error

        thread = threading.Thread(target=collect, daemon=True)
        thread.start()

    def _collect_system_metrics(self):
        """Collect system resource metrics"""
        try:
            process = psutil.Process()

            # CPU and Memory
            self.gauge("system.cpu_percent", psutil.cpu_percent())
            self.gauge("system.memory_percent", psutil.virtual_memory().percent)
            self.gauge("system.disk_percent", psutil.disk_usage('/').percent)

            # Process metrics
            memory_info = process.memory_info()
            self.gauge("process.memory_mb", memory_info.rss / 1024 / 1024)
            self.gauge("process.cpu_percent", process.cpu_percent())

            # Network I/O
            net_io = psutil.net_io_counters()
            self.counter("system.network_bytes_sent", net_io.bytes_sent)
            self.counter("system.network_bytes_recv", net_io.bytes_recv)

        except Exception as e:
            log.warning("Failed to collect system metrics", extra={"error": str(e)})

    def _run_health_checks(self):
        """Execute all registered health checks"""
        for name, check in self.health_checks.items():
            try:
                start_time = time.time()
                is_healthy = check.check_func()
                duration = time.time() - start_time

                self.timing(f"health_check.{name}", duration)

                if is_healthy:
                    if not self.health_status[name]:
                        log.info("Health check recovered", extra={
                            "health_check": name,
                            "status": "healthy",
                            "previous_failures": self.failure_counts[name]
                        })

                    self.health_status[name] = True
                    self.failure_counts[name] = 0

                else:
                    self.failure_counts[name] += 1

                    if self.failure_counts[name] >= check.consecutive_failures_threshold:
                        if self.health_status[name]:  # First time failing
                            log.error("Health check failed", extra={
                                "health_check": name,
                                "status": "unhealthy",
                                "consecutive_failures": self.failure_counts[name],
                                "alert": True
                            })
                        self.health_status[name] = False

                self.gauge(f"health.{name}", 1.0 if is_healthy else 0.0)

            except Exception as e:
                log.error("Health check execution failed", extra={
                    "health_check": name,
                    "error": str(e),
                    "error_type": type(e).__name__
                })
                self.failure_counts[name] += 1
                self.health_status[name] = False

# Global metrics instance
metrics = MetricsCollector()

# Example health checks
def database_health_check() -> bool:
    """Check if database is accessible"""
    try:
        # Pseudo database check
        return True
    except:
        return False

def disk_space_health_check() -> bool:
    """Check if sufficient disk space available"""
    return psutil.disk_usage('/').percent < 90

# Register health checks
metrics.add_health_check(HealthCheck(
    name="database",
    check_func=database_health_check,
    interval_seconds=60,
    consecutive_failures_threshold=3
))

metrics.add_health_check(HealthCheck(
    name="disk_space",
    check_func=disk_space_health_check,
    interval_seconds=30,
    consecutive_failures_threshold=2
))
