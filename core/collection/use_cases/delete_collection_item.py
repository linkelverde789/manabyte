from collection.exceptions import CollectionItemException
from collection.selectors.collection import CollectionSelector
from collection.services.collection import CollectionItemService
from users.models import User


class DeleteCollectionItemUseCase:
    def execute(self, item_id: int, user: User) -> None:
        item = CollectionSelector.get_collection_item_from_user(
            item_id=item_id, user=user
        )

        if item is None:
            raise CollectionItemException(f"Item: {item_id} not found", "404")

        CollectionItemService.delete_collection_item(item)
