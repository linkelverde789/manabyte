from collection.exceptions import CollectionItemException
from collection.models import CollectionItem
from collection.selectors.collection import CollectionSelector
from folder.models import Folder
from users.models import User


class ListCollectionItemFromFolderUseCase:
    def execute(self, item_id: int, user: User, folder_id: int) -> CollectionItem:
        folder = FolderSelector.get_folder_from_user(folder_id=folder_id, user=user)

        if folder is None:
            raise FolderException(f"Folder: {folder_id} not found", "404")

        item = CollectionSelector.list_collection_item_from_folder(
            item_id=item_id, folder=folder
        )

        if item is None:
            raise CollectionItemException(f"Item: {item_id} not found", "404")

        return item
