from events.api.exceptions import EventException
from events.consts import ALLOWED_AGGREGATE_TYPES, ALLOWED_EVENT_TYPES


def basic_checks(type: str, aggregate_type: str):
    if type not in ALLOWED_EVENT_TYPES:
        raise EventException(f"Event type not allowed: {type}")

    if aggregate_type not in ALLOWED_AGGREGATE_TYPES:
        raise EventException(f"Aggregate type not allowed: {aggregate_type}")
