# in check_status.py
import sys
from celery.result import AsyncResult
from tasks import app # Import the celery app instance from tasks.py

def check_status(task_id):
    """Checks and prints the status of a given Celery task."""
    result = AsyncResult(task_id, app=app)
    
    print(f"--- Status for Task ID: {task_id} ---")
    print(f"State: {result.state}")

    if result.state == 'PENDING':
        print("Info: The task is waiting in the queue to be processed.")
    elif result.state == 'PROGRESS':
        print(f"Info: {result.info.get('status', 'In progress...')}")
    elif result.state == 'SUCCESS':
        print(f"Info: Task completed successfully.")
        print(f"Result: {result.result}")
    elif result.state == 'FAILURE':
        print(f"Info: Task failed.")
        print(f"Error: {result.info.get('status', 'Unknown error')}")
    else:
        print(f"Info: {result.info}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 check_status.py <TASK_ID>")
        sys.exit(1)
    
    task_id_to_check = sys.argv[1]
    check_status(task_id_to_check)
