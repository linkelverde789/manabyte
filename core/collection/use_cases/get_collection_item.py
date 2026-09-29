from collection.exceptions import CollectionItemException
from collection.models import CollectionItem
from collection.selectors.collection import CollectionSelector


class GetCollectionItemUseCase:
    def execute(self, item_id: int) -> CollectionItem:
        item = CollectionSelector.get_collection_item_from_id(item_id=item_id)

        if item is None:
            raise CollectionItemException(f"Item: {item_id} not found", "404")

        return item
