from cards.utils.scryfall_importer import process_set
from django.core.management.base import BaseCommand
from scryfall.api import ScryfallAPI


class Command(BaseCommand):
    help = "Import all set from scryfall API"

    def handle(self, *args, **options):

        self.stdout.write("Starting import")

        data = ScryfallAPI.get_complete_set_information()["data"]

        processed = 0

        for set in data:
            process_set(
                set_id=set["id"],
                set_code=set["code"],
                set_name=set["name"],
                card_count=set["card_count"],
                icon_url=set["icon_svg_uri"],
            )
            processed += 1

        self.stdout.write(
            self.style.SUCCESS(f"Finish import. Processed: {processed}. Errors: {0}.")
        )
