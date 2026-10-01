from collection.selectors.collection import CollectionSelector
from users.models import User


class ListCollectionItemFromScryfallIdsUseCase:
    def execute(self, user: User, scryfall_ids: list[str]):
        return CollectionSelector.list_collection_item_from_scryfall_ids(
            user=user, scryfall_ids=scryfall_ids
        )
