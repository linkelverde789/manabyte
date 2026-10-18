from cards.selectors.cards import CardSelector
from events.services.events import EventServices
from events.utils import basic_checks
from users.models import User


class CreateEventForDeleteActionUseCase:
    def execute(
        self,
        user: User,
        type: str,
        aggregate_type: str,
        aggregate_id: str | None,
        data_before: dict,
    ):

        basic_checks(type=type, aggregate_type=aggregate_type)

        card = CardSelector.get_card_from_id(data_before["card"])
        event = EventServices.create_event(
            user=user,
            type=type,
            aggregate_id=aggregate_id,
            aggregate_type=aggregate_type,
        )

        EventServices.create_event_item(
            event=event,
            card=card,
            data_before=data_before,
        )
