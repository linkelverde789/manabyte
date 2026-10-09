import requests
from collection.models import CollectionItem
from deck.models import DeckCard


class ScryfallAPI:
    BASE_URL = "https://api.scryfall.com"
    HEADERS = {"Content-Type": "application/json", "User-Agent": "Manabyte/1.0"}

    @staticmethod
    def load_collection(cards: list[DeckCard] | list[CollectionItem]):
        collection = []
        for i, batch in enumerate(batch_generator(cards)):
            identifiers = []
            for item in batch:
                identifiers.append({"id": str(item.scryfall_id)})

            response = requests.post(
                f"{ScryfallAPI.BASE_URL}/cards/collection",
                json={"identifiers": identifiers},
                headers=ScryfallAPI.HEADERS,
            )

            data = response.json()

            collection.extend([card for card in data["data"]])

        return collection

    @staticmethod
    def download_bulk_data():
        response = requests.get(
            f"{ScryfallAPI.BASE_URL}/bulk-data",
            headers=ScryfallAPI.HEADERS,
            timeout=30,
        )
        response.raise_for_status()
        return response.json()


def batch_generator(data, size=75):
    for i in range(0, len(data), size):
        yield data[i : i + size]
