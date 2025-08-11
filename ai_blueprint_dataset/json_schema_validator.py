import json
import argparse
from pathlib import Path
from jsonschema import Draft7Validator

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--schema", default="site_blueprint_schema.json", help="Path to JSON schema")
    parser.add_argument("--file", default="training_data.jsonl", help="Path to JSONL dataset")
    args = parser.parse_args()

    schema_path = Path(args.schema)
    file_path = Path(args.file)

    if not schema_path.exists():
        print(f"Schema not found: {schema_path}")
        return
    if not file_path.exists():
        print(f"JSONL file not found: {file_path}")
        return

    with schema_path.open("r", encoding="utf-8") as s:
        schema = json.load(s)

    validator = Draft7Validator(schema)

    valid, invalid = 0, 0

    print("\n--- Starting JSON Schema Validation ---")
    with file_path.open("r", encoding="utf-8") as f:
        for i, line in enumerate(f, start=1):
            try:
                entry = json.loads(line)
                completion_str = entry.get("completion")
                if completion_str is None:
                    print(f"Line {i}: Missing 'completion' field in entry.")
                    invalid += 1
                    continue

                try:
                    completion = json.loads(completion_str)
                except json.JSONDecodeError as e:
                    print(f"Line {i}: Completion string is invalid JSON: {e}")
                    invalid += 1
                    continue

                errors = sorted(validator.iter_errors(completion), key=lambda e: e.path)
                if errors:
                    print(f"\nLine {i}: SCHEMA VALIDATION FAILED!")
                    for e in errors:
                        print(f"  - Error: {e.message}")
                        print(f"    Path: {'/'.join(str(p) for p in e.path)}")
                    invalid += 1
                else:
                    valid += 1

            except Exception as e:
                print(f"Line {i}: Unexpected error: {e}")
                invalid += 1

    print("\n--- JSON Schema Validation Complete ---")
    print(f"Total valid completions: {valid}")
    print(f"Total invalid completions: {invalid}")
    if invalid > 0:
        print("ACTION REQUIRED: Fix the invalid lines.")
    else:
        print("All completions pass the schema!")

if __name__ == "__main__":
    main()
