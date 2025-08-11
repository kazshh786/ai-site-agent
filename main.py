# in main.py
import argparse
from tasks import create_website_task

def main():
    """
    This script is the "producer". It queues a background job and prints the Task ID.
    """
    parser = argparse.ArgumentParser(description='AI Website Generator - Task Producer')
    parser.add_argument('--company', required=True, help='The name of the company.')
    parser.add_argument('--domain', required=True, help='The domain name for the site.')
    parser.add_argument('--industry', required=True, help='The industry of the company.')
    parser.add_argument('--model', default='gemini', choices=['gemini', 'gpt'], help='The AI model to use.')
    parser.add_argument('--force', action='store_true', help='Force overwrite of existing site directory.')
    parser.add_argument('--deploy', action='store_true', help='Deploy the site to the server after generation.')

    args = parser.parse_args()

    # Capture the result object, which contains the task ID
    task = create_website_task.delay(
        company=args.company,
        domain=args.domain,
        industry=args.industry,
        model=args.model,
        force=args.force,
        deploy=args.deploy
    )

    print(f"[✔] Job for domain '{args.domain}' has been successfully queued.")
    print(f"    TASK ID: {task.id}")
    print("Use 'python3 check_status.py <TASK_ID>' to monitor its progress.")

if __name__ == '__main__':
    main()
