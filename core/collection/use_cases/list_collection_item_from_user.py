from collection.selectors.collection import CollectionSelector
from users.models import User


class ListCollectionItemFromUserUseCase:
    def execute(self, user: User):
        return CollectionSelector.list_collection_item_from_user(user=user)
