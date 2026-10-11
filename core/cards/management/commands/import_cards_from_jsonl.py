from pathlib import Path

from cards.utils.scryfal_importer import parse_file
from config import settings
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Import all default cards from scryfall_cards.jsonl"

    def handle(self, *args, **options):
        file_path = Path(settings.BASE_DIR) / "data" / "scryfall_cards.jsonl"

        if not file_path.exists():
            self.stdout.write(self.style.ERROR(f"File {file_path} not found"))
            return

        failed, processed = parse_file(file_path)

        self.stdout.write(
            self.style.SUCCESS(
                f"Finish import. Processed: {processed}. Errors: {len(failed)}."
            )
        )
