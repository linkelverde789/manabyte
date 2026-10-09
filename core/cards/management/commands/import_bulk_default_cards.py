import gzip
import urllib
from pathlib import Path

import requests
from django.core.management.base import BaseCommand
from export.utils.scryfall_api import ScryfallAPI


class Command(BaseCommand):
    help = "Import bulk_data from Scryfall"

    def handle(self, *args, **options):

        try:
            data = ScryfallAPI.download_bulk_data()

            bulk_uri = None
            for item in data["data"]:
                if item["type"] == "default_cards":
                    bulk_uri = item["jsonl_download_uri"]
                    break

            if bulk_uri is None:
                raise Exception("JSONL url not found")  # noqa: TRY002

            print("Starting download...")

            save_folder = Path("data")
            save_folder.mkdir(exist_ok=True)

            temp_file = save_folder / "temp_scryfall_data.jsonl.gz"
            final_file = save_folder / "scryfall_cards.jsonl"

            urllib.request.urlretrieve(bulk_uri, temp_file)

            print("Download complete. Extracting...")

            with gzip.open(temp_file, "rb") as f_in, open(final_file, "wb") as f_out:
                f_out.write(f_in.read())

            temp_file.unlink()

            print(f"Successfully downloaded and extracted to {final_file}")

        except requests.RequestException as e:
            print(f"Error downloading data: {e}")
            raise
        except Exception as e:
            print(f"Error processing data: {e}")
            if "temp_file" in locals() and temp_file.exists():
                temp_file.unlink()
            raise
