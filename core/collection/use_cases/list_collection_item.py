from collection.exceptions import CollectionItemException
from collection.models import CollectionItem
from collection.selectors.collection import CollectionSelector


class ListCollectionItemUseCase:
    def execute(self):
        items = CollectionSelector.list_collection_item()

        return items
