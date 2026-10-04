from collection.selectors.collection import CollectionSelector
from export.actions import (
    export_collection,
)
from users.models import User


class ExportCollectionUseCase:
    def execute(self, user: User, format: str = "csv"):

        collection_items = CollectionSelector.get_collection_item_from_user(user=user)

        return export_collection(collection=collection_items, format_type=format)
