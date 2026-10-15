from collection.dto.collection import FilterCollectionParams
from collection.selectors.collection import CollectionSelector
from users.models import User


class ListCollectionItemFromUserUseCase:
    def execute(self, user: User, sorting: str | None = None, q: str | None = None):
        filters = FilterCollectionParams(sorting=sorting, q=q)
        return CollectionSelector.list_collection_item_from_user(
            user=user, filters=filters
        )
