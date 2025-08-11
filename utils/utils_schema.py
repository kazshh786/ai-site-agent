#!/usr/bin/env python3
import argparse
#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

# ── Ensure project root is importable ───────────────────────────────────────────
PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

try:
    from agent.schemas import SiteBlueprint, example_instance  # noqa
except ModuleNotFoundError as e:
    print("FATAL: Couldn't import agent.schemas. Check your folder structure and PYTHONPATH.")
    print("  PROJECT_ROOT:", PROJECT_ROOT)
    print("  sys.path[0]:", sys.path[0])
    print("  agent exists?:", (PROJECT_ROOT / 'agent' / 'schemas.py').exists())
    print("  Try:  PYTHONPATH=$(pwd) python3 utils/schema_utils.py")
    raise

def write_example(path: Path) -> None:
    data = example_instance.model_dump(mode="json")
    with path.open("w") as f:
        json.dump(data, f, indent=2)
    print(f"✅ Wrote {path}")

def write_json_schema(path: Path) -> None:
    schema = SiteBlueprint.model_json_schema()
    with path.open("w") as f:
        json.dump(schema, f, indent=2)
    print(f"✅ Wrote {path}")

def main() -> None:
    parser = argparse.ArgumentParser(description="Generate blueprint_example.json and blueprint_schema.json")
    parser.add_argument("--example", action="store_true", help="Write blueprint_example.json")
    parser.add_argument("--schema", action="store_true", help="Write blueprint_schema.json")
    parser.add_argument("--out-example", default="blueprint_example.json", help="Output path for the example JSON")
    parser.add_argument("--out-schema", default="blueprint_schema.json", help="Output path for the JSON Schema")
    args = parser.parse_args()

    if not (args.example or args.schema):
        args.example = args.schema = True

    if args.example:
        write_example(PROJECT_ROOT / args.out_example)

    if args.schema:
        write_json_schema(PROJECT_ROOT / args.out_schema)

if __name__ == "__main__":
    main()
