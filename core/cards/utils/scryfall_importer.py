import json
from decimal import Decimal, InvalidOperation

from cards.models import ScryfallCard, ScryfallCardFace
from django.db import transaction
from sets.models import ScryfallSet


def _decimal_price(value):
    if value in (None, ""):
        return Decimal("0.00")

    try:
        return Decimal(str(value))
    except (InvalidOperation, ValueError):
        return Decimal("0.00")


def process_set(
    set_id: str,
    set_code: str,
    set_name: str,
    set_type: str | None = None,
    card_count: int | None = None,
    icon_url: str | None = None,
):
    default = {
        "code": set_code,
        "name": set_name,
    }
    if card_count is not None:
        default["card_count"] = card_count

    if icon_url is not None:
        default["icon_url"] = icon_url

    if set_type is not None:
        default["type"] = set_type

    scryfall_set, _ = ScryfallSet.objects.update_or_create(
        external_id=set_id, defaults=default
    )
    return scryfall_set


def _process_card(card_data, scryfall_set):
    prices = card_data.get("prices") or {}

    border_color = (
        card_data.get("border_color") is not None
        and card_data.get("border_color").lower() == "borderless"
    )

    card, _ = ScryfallCard.objects.update_or_create(
        external_id=card_data["id"],
        defaults={
            "oracle_id": card_data["oracle_id"],
            "name": card_data["name"],
            "set": scryfall_set,
            "collector_number": card_data.get("collector_number", ""),
            "lang": card_data.get("lang", "en"),
            "can_foil": card_data.get("foil", card_data.get("can_foil", True)),
            "can_nonfoil": card_data.get("nonfoil", card_data.get("can_nonfoil", True)),
            "price_nonfoil": _decimal_price(prices.get("usd")),
            "price_foil": _decimal_price(prices.get("usd_foil")),
            "keywords": card_data.get("keywords", []),
            "layout": card_data.get("layout", "normal"),
            "released_at": card_data.get("released_at", None),
            "is_borderless": border_color,
            "rarity": card_data.get("rarity", "common"),
        },
    )

    return card


def _process_one_face(card, face_index, face_data, fallback=None):
    fallback = fallback or {}

    image_uris = face_data.get("image_uris") or {}
    if not image_uris:
        image_uris = fallback.get("image_uris") or {}

    colors = face_data.get("color_identity")

    if colors is None:
        colors = fallback.get("color_identity") or []

    ScryfallCardFace.objects.update_or_create(
        card=card,
        face_index=face_index,
        defaults={
            "name": face_data.get("name", card.name),
            "mana_cost": face_data.get("mana_cost") or "",
            "type_line": (
                face_data.get("type_line") or fallback.get("type_line") or ""
            ),
            "oracle_text": face_data.get("oracle_text") or "",
            "flavor_text": face_data.get("flavor_text") or "",
            "image_url": (image_uris.get("crop") or image_uris.get("normal") or ""),
            "colors": colors,
        },
    )


def _process_multiple_faces(card, faces, fallback=None):
    for index, face in enumerate(faces):
        _process_one_face(
            card=card,
            face_index=index,
            face_data=face,
            fallback=fallback,
        )


def _process_line(card_data):
    scryfall_set = process_set(
        set_id=card_data["set_id"],
        set_code=card_data["set"],
        set_name=card_data["set_name"],
    )

    card = _process_card(
        card_data=card_data,
        scryfall_set=scryfall_set,
    )

    faces = card_data.get("card_faces")

    if faces:
        _process_multiple_faces(
            card=card,
            faces=faces,
            fallback=card_data,
        )
    else:
        _process_one_face(
            card=card,
            face_index=0,
            face_data=card_data,
        )

    return card


def parse_file(file_path):
    processed = 0

    # Maybe save the failed cards for future try
    failed = []
    with file_path.open("r", encoding="utf-8") as file:
        for line_number, line in enumerate(file, start=1):
            line = line.strip()

            if not line:
                continue

            try:
                card_data = json.loads(line)

                with transaction.atomic():
                    _process_line(card_data)

                processed += 1

            except (
                json.JSONDecodeError,
                KeyError,
                ValueError,
                TypeError,
                InvalidOperation,
            ) as exc:
                failed.append(json.loads(line)["id"])
                print(f"Line {line_number}: {exc}")
            except Exception as exc:  # noqa: BLE001
                print(f"Unexpected error at line {line_number}: {exc}")

    return failed, processed
