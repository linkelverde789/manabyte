import json
from pathlib import Path

# Filtered sets
sets_to_keep = {"fin", "fdn", "ltr"}

# Files
current_dir = Path(__file__).parent
input_file = current_dir.parent / "data" / "scryfall_cards.jsonl"
output_file = current_dir / "card_test.jsonl"


with (
    open(input_file, "r", encoding="utf-8") as infile,
    open(output_file, "w", encoding="utf-8") as outfile,
):
    for line in infile:
        card = json.loads(line.strip())
        if card.get("set") in sets_to_keep:
            outfile.write(json.dumps(card) + "\n")
