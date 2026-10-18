from uuid import uuid4

from cards.models import ScryfallCard
from events.models import Event, EventItem
from users.models import User


class EventServices:
    @staticmethod
    def create_event(
        user: User,
        type: str,
        aggregate_id: str,
        aggregate_type: str,
    ) -> Event:
        return Event.objects.create(
            id=uuid4(),
            user=user,
            type=type,
            aggregate_type=aggregate_type,
            aggregate_id=aggregate_id,
        )

    @staticmethod
    def create_event_item(
        event: Event,
        data_after: dict | None = None,
        data_before: dict | None = None,
        values_changed: dict | None = None,
        card: ScryfallCard | None = None,
    ) -> EventItem:
        return EventItem.objects.create(
            event=event,
            data_after=data_after if data_after is not None else {},
            data_before=data_before if data_before is not None else {},
            values_changed=values_changed if values_changed is not None else {},
            card=card,
        )

    @staticmethod
    def create_bulk_event_item(data: [EventItem]):
        EventItem.objects.bulk_create(data)
