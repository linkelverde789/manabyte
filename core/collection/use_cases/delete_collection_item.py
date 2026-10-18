import copy

from collection.exceptions import CollectionItemException
from collection.selectors.collection import CollectionSelector
from collection.services.collection import CollectionItemService
from django.forms.models import model_to_dict
from events.consts import CARD_REMOVED, COLLECTION_TYPE_EVENT
from events.use_cases.create_event_for_delete import (
    CreateEventForDeleteActionUseCase,
)
from users.models import User


class DeleteCollectionItemUseCase:
    def execute(self, item_id: int, user: User) -> None:
        item = CollectionSelector.get_collection_item_from_user(
            item_id=item_id, user=user
        )

        frozen_item = copy.deepcopy(item)

        if item is None:
            raise CollectionItemException(f"Item: {item_id} not found", "404")

        CollectionItemService.delete_collection_item(item)

        CreateEventForDeleteActionUseCase().execute(
            user=user,
            type=CARD_REMOVED,
            aggregate_type=COLLECTION_TYPE_EVENT,
            aggregate_id=frozen_item.folder.id
            if frozen_item.folder is not None
            else None,
            data_before=model_to_dict(frozen_item),
        )
