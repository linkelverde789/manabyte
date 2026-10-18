import copy

from cards.api.exceptions import ScryfallCardException
from cards.selectors.cards import CardSelector
from collection.dto.collection import UpdateCollectionItemInput
from collection.exceptions import CollectionItemException
from collection.models import CollectionItem
from collection.selectors.collection import CollectionSelector
from collection.services.collection import CollectionItemService
from django.forms.models import model_to_dict
from events.consts import CARD_UPDATED, COLLECTION_TYPE_EVENT
from events.use_cases.create_event_for_update import (
    CreateEventForUpdateActionUseCase,
)
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

        frozen_item = copy.deepcopy(collection_item)
        folder = None

        if "folder_id" in data:
            folder = FolderSelector.get_folder_from_user(
                folder_id=data["folder_id"], user=user
            )

            if folder is None:
                raise FolderException(f"Folder {data['folder_id']} not found", "404")

        card = None

        if "scryfall_id" in data:
            card = CardSelector.get_card_from_scryfall_id(data["scryfall_id"])

            if card is None:
                raise ScryfallCardException(
                    f"Card: {data['scryfall_id']} not found", "404"
                )

        update_input = UpdateCollectionItemInput(
            quantity=data.get("quantity", None),
            card=card,
            foil=data.get("foil", None),
            language=data.get("language", None),
            condition=data.get("condition", None),
            folder=folder,
        ).validate()

        updated_item = CollectionItemService.update_collection_item(
            item=collection_item, data=update_input
        )

        CreateEventForUpdateActionUseCase().execute(
            user=user,
            type=CARD_UPDATED,
            aggregate_type=COLLECTION_TYPE_EVENT,
            aggregate_id=updated_item.folder.id
            if updated_item.folder is not None
            else None,
            data_before=model_to_dict(frozen_item),
            data_after=model_to_dict(updated_item),
        )
