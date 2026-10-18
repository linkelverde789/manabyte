from collection.models import CollectionItem
from deck.models import DeckCard
from django.forms.models import model_to_dict
from events.models import EventItem
from events.utils import basic_checks, create_event
from users.models import User


class CreateEventForBulkActionUseCase:
    def execute(
        self,
        user: User,
        type: str,
        aggregate_type: str,
        aggregate_id: str | None,
        data_after: [CollectionItem] | [DeckCard],
    ):

        basic_checks(type=type, aggregate_type=aggregate_type)

        event = create_event(
            type=type,
            aggregate_type=aggregate_type,
            user=user,
            aggregate_id=aggregate_id,
        )

        event_items = []

        for item in data_after:
            event_items.append(
                EventItem(card=item.card, data_after=model_to_dict(item), event=event)
            )

        EventItem.objects.bulk_create(event_items)
