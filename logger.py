import logging
from pythonjsonlogger import jsonlogger
from threading import local

# Use a thread-local storage for the task_id
_thread_locals = local()

class TaskIdFilter(logging.Filter):
    """Injects the celery task_id into the log record."""
    def filter(self, record):
        record.task_id = getattr(_thread_locals, 'task_id', 'N/A')
        return True

def setup_logger():
    """Sets up a JSON logger."""
    logger = logging.getLogger("AIAgent")
    logger.setLevel(logging.INFO)
    
    # Prevent logs from being propagated to the root logger
    logger.propagate = False

    # Remove existing handlers to avoid duplicate logs
    if logger.handlers:
        logger.handlers = []

    logHandler = logging.StreamHandler()
    
    # Add our custom filter
    logHandler.addFilter(TaskIdFilter())
    
    # Define the format of the JSON logs
    formatter = jsonlogger.JsonFormatter(
        '%(asctime)s %(name)s %(levelname)s %(task_id)s %(message)s'
    )
    logHandler.setFormatter(formatter)
    logger.addHandler(logHandler)
    return logger

def set_task_id(task_id):
    """Sets the task_id for the current thread."""
    _thread_locals.task_id = task_id

# Create a single logger instance to be used by all modules
log = setup_logger()
