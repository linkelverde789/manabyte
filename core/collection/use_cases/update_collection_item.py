from collection.dto.collection import UpdateCollectionItemInput
from collection.exceptions import CollectionItemException
from collection.models import CollectionItem
from collection.selectors.collection import CollectionSelector
from collection.services.collection import CollectionItemService
from folder.exceptions import FolderException
from folder.selectors.folder import FolderSelector
from users.models import User


class UpdateCollectionItemUseCase:
    def execute(self, item_id: int, user: User, data) -> CollectionItem:
        collection_item = CollectionSelector.get_collection_item_from_user(
            item_id=item_id, user=user
        )

        if collection_item is None:
            raise CollectionItemException(f"Collection item {item_id} not found", "404")

        folder = None

        if "folder_id" in data:
            folder = FolderSelector.get_folder_from_user(
                folder_id=data["folder_id"], user=user
            )

            if folder is None:
                raise FolderException(f"Folder {data['folder_id']} not found", "404")

        update_input = UpdateCollectionItemInput(
            quantity=data.get("quantity", None),
            scryfall_id=data.get("scryfall_id", None),
            foil=data.get("foil", None),
            language=data.get("language", None),
            condition=data.get("condition", None),
            folder=folder,
        ).validate()

        return CollectionItemService.update_collection_item(
            item=collection_item, data=update_input
        )
