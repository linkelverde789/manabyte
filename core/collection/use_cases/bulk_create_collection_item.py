from collection.dto.collection import CreateCollectionItemInput
from collection.selectors.collection import CollectionSelector
from collection.services.collection import CollectionItemService
from folder.exceptions import FolderException
from folder.selectors.folder import FolderSelector
from users.models import User


class BulkCreateCollectionItemUseCase:
    def execute(self, items, user: User, folder_id: int | None = None):

        folder = None
        if folder_id is not None:
            folder = FolderSelector.get_folder_from_user(user=user, folder_id=folder_id)

            if folder is None:
                raise FolderException(f"Folder: {folder_id} not found", "404")

        bulk_dto = [
            CreateCollectionItemInput(
                language=item["language"],
                foil=item["foil"],
                condition=item["condition"],
                folder=folder,
                quantity=item["quantity"],
                scryfall_id=item["scryfall_id"],
                user=user,
            ).validate()
            for item in items
        ]

        CollectionItemService.bulk_create_collection_item(data=bulk_dto)

        return CollectionSelector.list_collection_item_from_folder(folder=folder)
