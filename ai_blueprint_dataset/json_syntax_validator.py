import json
import argparse
from pathlib import Path

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", default="training_data.jsonl", help="Path to JSONL dataset")
    args = parser.parse_args()

    path = Path(args.file)
    if not path.exists():
        print(f"File not found: {path}")
        return

    valid_lines = 0
    invalid_lines = 0

    print("--- Starting JSON Syntax Check ---")
    with path.open("r", encoding="utf-8") as f:
        for i, line in enumerate(f, start=1):
            try:
                obj = json.loads(line)
                if "prompt" in obj and "completion" in obj:
                    valid_lines += 1
                else:
                    print(f"Line {i}: Missing 'prompt' or 'completion'.")
                    invalid_lines += 1
            except json.JSONDecodeError as e:
                print(f"Line {i}: JSON syntax error - {e}")
                invalid_lines += 1
            except Exception as e:
                print(f"Line {i}: Unexpected error - {e}")
                invalid_lines += 1

    print("\n--- JSON Syntax Check Complete ---")
    print(f"Total valid JSON lines: {valid_lines}")
    print(f"Total invalid JSON lines: {invalid_lines}")
    if invalid_lines > 0:
        print("ACTION REQUIRED: Fix invalid lines.")
    else:
        print("All JSON lines are syntactically valid!")

if __name__ == "__main__":
    main()
