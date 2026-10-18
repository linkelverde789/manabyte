from events.models import EventItem
from events.utils import basic_checks, create_event
from users.models import User


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
        basic_checks(type=type, aggregate_type=aggregate_type)

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
