import logging
import sys
import json

class JsonFormatter(logging.Formatter):
    """Formats log records as a single line of JSON."""
    def format(self, record):
        # Create a base log record
        log_record = {
            "asctime": self.formatTime(record, self.datefmt),
            "name": record.name,
            "levelname": record.levelname,
        }

        # Add any extra fields passed to the logger
        # This is where 'task_id', 'command', etc. will go
        if hasattr(record, 'extra_info'):
            log_record.update(record.extra_info)

        # Add the main message
        log_record["message"] = record.getMessage()

        # Add exception info if it exists
        if record.exc_info:
            log_record['exc_info'] = self.formatException(record.exc_info)
        
        return json.dumps(log_record)

def get_logger(name, level=logging.INFO):
    """Initializes and returns a logger with a JSON formatter."""
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    # Prevent the logger from propagating to the root logger
    logger.propagate = False

    # Check if the logger already has handlers to avoid adding them again
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        # We will use 'extra_info' to pass our custom dict
        formatter = JsonFormatter()
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    # Return a wrapper to handle the 'extra' dict correctly
    def wrapper(msg, *args, **kwargs):
        extra_data = kwargs.pop('extra', {})
        # Use a consistent key for our custom data
        kwargs['extra'] = {'extra_info': extra_data}
        logger.log(level, msg, *args, **kwargs)
    
    # This is a bit of a hack to attach info, error, etc. methods
    # to our wrapper so it behaves like a real logger instance.
    wrapper.info = lambda msg, *args, **kwargs: logger.info(msg, *args, **{'extra': {'extra_info': kwargs.pop('extra', {})}})
    wrapper.debug = lambda msg, *args, **kwargs: logger.debug(msg, *args, **{'extra': {'extra_info': kwargs.pop('extra', {})}})
    wrapper.warning = lambda msg, *args, **kwargs: logger.warning(msg, *args, **{'extra': {'extra_info': kwargs.pop('extra', {})}})
    wrapper.error = lambda msg, *args, **kwargs: logger.error(msg, *args, **{'extra': {'extra_info': kwargs.pop('extra', {})}})
    
    return wrapper
