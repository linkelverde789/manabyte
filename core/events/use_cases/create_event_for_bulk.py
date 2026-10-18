from collection.models import CollectionItem
from deck.models import DeckCard
from django.forms.models import model_to_dict
from events.models import EventItem
from events.services.events import EventServices
from events.utils import basic_checks
from users.models import User


class CreateEventForBulkActionUseCase:
    def execute(
        self,
        user: User,
        type: str,
        aggregate_type: str,
        aggregate_id: str | None,
        data_after: list[CollectionItem] | list[DeckCard],
    ):

        basic_checks(type=type, aggregate_type=aggregate_type)

        event = EventServices.create_event(
            user=user,
            type=type,
            aggregate_id=aggregate_id,
            aggregate_type=aggregate_type,
        )

        event_items = []

        for item in data_after:
            event_items.append(
                EventItem(card=item.card, data_after=model_to_dict(item), event=event)
            )

        EventServices.create_bulk_event_item(event_items)
