from uuid import uuid4

from users.models import User

from events.consts import ALLOWED_AGGREGATE_TYPES, ALLOWED_EVENT_TYPES
from events.models import Event


def create_event(
    user: User,
    type: str,
    aggregate_type: str,
    aggregate_id: str | None,
):
    event = Event.objects.create(
        id=uuid4(),
        user=user,
        type=type,
        aggregate_type=aggregate_type,
        aggregate_id=aggregate_id,
    )
    return event


def basic_checks(type: str, aggregate_type: str):
    if type not in ALLOWED_EVENT_TYPES:
        raise Exception()

    if aggregate_type not in ALLOWED_AGGREGATE_TYPES:
        raise Exception()
