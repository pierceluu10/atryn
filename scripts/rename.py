import json

INPUT_FILE = "uoft_ece_research.json"
OUTPUT_FILE = "uoft_ece_research_import.json"

def to_dynamodb_value(value):
    if isinstance(value, str):
        return {"S": value}
    if isinstance(value, bool):
        return {"BOOL": value}
    if isinstance(value, (int, float)):
        return {"N": str(value)}
    if isinstance(value, list):
        return {"L": [to_dynamodb_value(v) for v in value]}
    if isinstance(value, dict):
        return {"M": {k: to_dynamodb_value(v) for k, v in value.items()}}
    if value is None:
        return {"NULL": True}
    raise TypeError(f"Unsupported type: {type(value)}")

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    for item in data:
        dyn_item = {"Item": {k: to_dynamodb_value(v) for k, v in item.items()}}
        f.write(json.dumps(dyn_item, ensure_ascii=False) + "\n")

print(f"Wrote {len(data)} items to {OUTPUT_FILE}")