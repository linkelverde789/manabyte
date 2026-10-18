from uuid import uuid4

from cards.selectors.cards import CardSelector
from collection.models import CollectionItem
from deck.models import DeckCard
from django.forms.models import model_to_dict
from events.consts import ALLOWED_AGGREGATE_TYPES, ALLOWED_EVENT_TYPES
from events.models import Event, EventItem
from users.models import User


def _basic_checks(type: str, aggregate_type: str):
    if type not in ALLOWED_EVENT_TYPES:
        raise Exception()

    if aggregate_type not in ALLOWED_AGGREGATE_TYPES:
        raise Exception()


def _generate_changed_values(data_before: dict, data_after: dict):
    data_changed = {}

    if data_before["quantity"] is not data_after["quantity"]:
        data_changed["quantity"] = {
            "from": data_before["quantity"],
            "to": data_after["quantity"],
        }

    if data_before["card"] is not data_after["card"]:
        data_changed["card"] = {
            "from": data_before["card"],
            "to": data_after["card"],
        }

    if "foil" in data_before and data_before["foil"] is not data_after["foil"]:
        data_changed["foil"] = {
            "from": data_before["foil"],
            "to": data_after["foil"],
        }

    if (
        "language" in data_before
        and data_before["language"] is not data_after["language"]
    ):
        data_changed["language"] = {
            "from": data_before["language"],
            "to": data_after["language"],
        }

    if (
        "condition" in data_before
        and data_before["condition"] is not data_after["condition"]
    ):
        data_changed["condition"] = {
            "from": data_before["condition"],
            "to": data_after["condition"],
        }

    if "zone" in data_before and data_before["zone"] is not data_after["zone"]:
        data_changed["zone"] = {
            "from": data_before["zone"],
            "to": data_after["zone"],
        }

    return data_changed


class CreateEventForCreateActionUseCase:
    def execute(
        self,
        user: User,
        type: str,
        aggregate_id: str,
        aggregate_type: str,
        data_after: CollectionItem | DeckCard,
    ):
        _basic_checks(type=type, aggregate_type=aggregate_type)
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


class CreateEventForUpdateActionUseCase:
    def execute(
        self,
        user: User,
        type: str,
        aggregate_type: str,
        aggregate_id: str,
        data_before: dict,
        data_after: dict,
    ):
        _basic_checks(type=type, aggregate_type=aggregate_type)
        event = create_event(
            type=type,
            aggregate_type=aggregate_type,
            user=user,
            aggregate_id=aggregate_id,
        )

        EventItem.objects.create(
            event=event,
            card_id=data_after["card"],
            data_before=data_before,
            data_after=data_after,
            values_changed=_generate_changed_values(
                data_before=data_before, data_after=data_after
            ),
        )


class CreateEventForBulkActionUseCase:
    def execute(
        self,
        user: User,
        type: str,
        aggregate_type: str,
        aggregate_id: str | None,
        data_after: [CollectionItem] | [DeckCard],
    ):

        _basic_checks(type=type, aggregate_type=aggregate_type)
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
