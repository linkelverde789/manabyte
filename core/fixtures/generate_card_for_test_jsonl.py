import json
from pathlib import Path

# Filtered sets
sets_to_keep = {"fin", "fdn", "ltr"}

# Files
current_dir = Path(__file__).parent
input_file = current_dir.parent / "data" / "scryfall_sets.jsonl"
output_file = current_dir / "set_test.jsonl"


with (
    open(input_file, "r", encoding="utf-8") as infile,
    open(output_file, "w", encoding="utf-8") as outfile,
):
    for line in infile:
        set = json.loads(line.strip())
        if set.get("code") in sets_to_keep:
            outfile.write(json.dumps(set) + "\n")
