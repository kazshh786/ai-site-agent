# in main-test.py
import argparse
# 1. IMPORT THE RAW FUNCTION, NOT THE CELERY TASK OBJECT
from tasks import create_website_task_func as create_website_task

def main():
    """
    This script now runs the task DIRECTLY in the foreground.
    It does NOT require Redis or a Celery worker.
    """
    parser = argparse.ArgumentParser(description='AI Website Generator - Direct Executor')
    parser.add_argument('--company', required=False, help='The name of the company.')
    parser.add_argument('--domain', required=False, help='The domain name for the site.')
    parser.add_argument('--brief', required=True, help='A detailed, multi-line brief for the website.')
    parser.add_argument('--model', default='gemini', choices=['gemini', 'gpt'], help='The AI model to use.')
    parser.add_argument('--force', action='store_true', help='Force overwrite of existing site directory.')
    parser.add_argument('--deploy', action='store_true', help='Deploy the site to the server after generation.')

    args = parser.parse_args()

    print(f"🚀 Starting job for domain '{args.domain}' directly...")

    try:
        # 2. CALL THE FUNCTION DIRECTLY instead of using .delay()
        result = create_website_task(
            company=args.company,
            domain=args.domain,
            brief=args.brief,
            model=args.model,
            force=args.force,
            deploy=args.deploy
        )

        print(f"✅ Job for domain '{args.domain}' has been completed successfully.")
        print(f"   Result: {result}")

    except Exception as e:
        print(f"❌ An error occurred during task execution: {e}")


if __name__ == '__main__':
    main()
