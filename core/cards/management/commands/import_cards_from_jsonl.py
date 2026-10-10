import json
from decimal import Decimal, InvalidOperation
from pathlib import Path

from cards.models import ScryfallCard, ScryfallCardFace, ScryfallSet
from config import settings
from django.core.management.base import BaseCommand
from django.db import transaction


def _decimal_price(value):
    if value in (None, ""):
        return Decimal("0.00")

    try:
        return Decimal(str(value))
    except (InvalidOperation, ValueError):
        return Decimal("0.00")


def _process_set(set_id, set_code, set_name):
    scryfall_set, _ = ScryfallSet.objects.update_or_create(
        external_id=set_id,
        defaults={
            "code": set_code,
            "name": set_name,
        },
    )
    return scryfall_set


def _process_card(card_data, scryfall_set):
    prices = card_data.get("prices") or {}

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
            "keywords": card_data.get("keywords") or [],
        },
    )

    return card


def _process_one_face(card, face_index, face_data, fallback=None):
    fallback = fallback or {}

    image_uris = face_data.get("image_uris") or {}
    if not image_uris:
        image_uris = fallback.get("image_uris") or {}

    colors = face_data.get("colors")
    if colors is None:
        colors = fallback.get("colors") or []

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
            "image_url": (image_uris.get("normal") or image_uris.get("large") or ""),
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
    scryfall_set = _process_set(
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


class Command(BaseCommand):
    help = "Import all default cards from scryfall_cards.jsonl"

    def handle(self, *args, **options):
        file_path = Path(settings.BASE_DIR) / "data" / "scryfall_cards.jsonl"

        if not file_path.exists():
            self.stdout.write(self.style.ERROR(f"File {file_path} not found"))
            return

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
                    self.stderr.write(self.style.ERROR(f"Line {line_number}: {exc}"))
                except Exception as exc:
                    self.stderr.write(
                        self.style.ERROR(
                            f"Unexpected error at line {line_number}: {exc}"
                        )
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f"Finish import. Processed: {processed}. Errors: {len(failed)}."
            )
        )
