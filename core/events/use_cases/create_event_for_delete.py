from events.models import EventItem
from events.utils import basic_checks, create_event
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

        event = create_event(
            type=type,
            aggregate_type=aggregate_type,
            user=user,
            aggregate_id=aggregate_id,
        )

        EventItem.objects.create(
            event=event,
            card_id=data_before["card"],
            data_before=data_before,
        )
