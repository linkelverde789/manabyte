import json
from pathlib import Path

from django.core.management.base import BaseCommand
from scryfall.api import ScryfallAPI


class Command(BaseCommand):
    help = "Export to JSONL sets"

    def handle(self, *args, **options):
        save_folder = Path("data")
        save_folder.mkdir(exist_ok=True)
        data = ScryfallAPI.get_complete_set_information()["data"]

        output_file = save_folder / "scryfall_sets.jsonl"

        with open(output_file, "w", encoding="utf-8") as outfile:
            for set in data:
                outfile.write(json.dumps(set) + "\n")
