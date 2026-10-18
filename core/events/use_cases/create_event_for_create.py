from collection.models import CollectionItem
from deck.models import DeckCard
from django.forms.models import model_to_dict
from events.models import EventItem
from events.utils import basic_checks, create_event
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

        event = create_event(
            type=type,
            aggregate_type=aggregate_type,
            user=user,
            aggregate_id=aggregate_id,
        )

        EventItem.objects.create(
            event=event,
            card=data_after.card,
            data_after=model_to_dict(data_after),
        )
