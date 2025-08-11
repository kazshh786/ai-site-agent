import json
from pathlib import Path

IN_PATH = "training_data.jsonl"
OUT_PATH = "training_data.normalized.jsonl"

def normalize(entry):
    try:
        comp = json.loads(entry["completion"])
    except Exception:
        return entry

    for page in comp.get("pages", []):
        for section in page.get("sections", []):
            c = section.get("component")
            props = section.get("props", {})

            # Example normalization logic
            if c == "Footer":
                for link in props.get("socialLinks", []):
                    if "url" in link and "href" not in link:
                        link["href"] = link.pop("url")

    entry["completion"] = json.dumps(comp, separators=(",", ":"))
    return entry

def main():
    in_path = Path(IN_PATH)
    out_path = Path(OUT_PATH)

    if not in_path.exists():
        print(f"Missing {IN_PATH}")
        return

    with in_path.open("r", encoding="utf-8") as fin, out_path.open("w", encoding="utf-8") as fout:
        for line in fin:
            try:
                obj = json.loads(line)
                obj = normalize(obj)
                fout.write(json.dumps(obj, ensure_ascii=False) + "\n")
            except Exception as e:
                print("Error normalizing line:", e)

    print(f"Normalized dataset written to {OUT_PATH}")

if __name__ == "__main__":
    main()
