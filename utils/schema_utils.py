# agent/schema_utils.py
import json
from agent.schemas import SiteBlueprint

def write_json_schema(path: str = "blueprint_schema.json") -> None:
    schema = SiteBlueprint.model_json_schema()  # Pydantic v2
    with open(path, "w") as f:
        json.dump(schema, f, indent=2)
    print(f"✅ Wrote {path}")

def write_example(path: str = "blueprint_example.json") -> None:
    # You already have this in schemas.py; keep a single place if you prefer.
    from agent.schemas import example_instance  # if you expose it
    with open(path, "w") as f:
        json.dump(example_instance.model_dump(mode="json"), f, indent=2)
    print(f"✅ Wrote {path}")

if __name__ == "__main__":
    write_json_schema()
