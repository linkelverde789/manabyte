from collection.models import CollectionItem
from deck.models import DeckCard
from django.forms.models import model_to_dict
from events.services.events import EventServices
from events.utils import basic_checks
from users.models import User


class CreateEventForCreateActionUseCase:
    def execute(
        self,
        user: User,
        type: str,
        aggregate_id: str,
        aggregate_type: str,
        data_after: CollectionItem | DeckCard,
    ):
        basic_checks(type=type, aggregate_type=aggregate_type)

        event = EventServices.create_event(
            user=user,
            type=type,
            aggregate_id=aggregate_id,
            aggregate_type=aggregate_type,
        )

        EventServices.create_event_item(
            event=event,
            card=data_after.card,
            data_after=model_to_dict(data_after),
        )
