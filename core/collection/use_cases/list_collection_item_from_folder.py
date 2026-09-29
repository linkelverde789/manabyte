from collection.selectors.collection import CollectionSelector
from folder.exceptions import FolderException
from folder.selectors.folder import FolderSelector
from users.models import User


class ListCollectionItemFromFolderUseCase:
    def execute(self, user: User, folder_id: int):
        folder = FolderSelector.get_folder_from_user(folder_id=folder_id, user=user)

        if folder is None:
            raise FolderException(f"Folder: {folder_id} not found", "404")

        return CollectionSelector.list_collection_item_from_folder(folder=folder)
