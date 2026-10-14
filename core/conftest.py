import json
from decimal import InvalidOperation
from pathlib import Path

import pytest
from cards.models import ScryfallCard
from cards.utils.scryfall_importer import parse_file, process_set
from config import settings
from django.db import transaction
from rest_framework.test import APIClient
from sets.models import ScryfallSet
from users.models import User


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    return User.objects.create_user(
        username="testuser",
        email="test@test.com",
        password="pass1234",
    )


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture(scope="session", autouse=True)
def load_set_catalog(django_db_setup, django_db_blocker):
    with django_db_blocker.unblock():
        sets = ScryfallSet.objects.using("default")

        if not sets.exists():
            _parse_set_file(Path(settings.BASE_DIR) / "fixtures" / "set_test.jsonl")

        count = ScryfallSet.objects.using("default").count()

        print(count)

        if count == 0:
            raise RuntimeError("Can't load set on test database.")


# TODO: Make one fixture to load needed data from fixture module
@pytest.fixture(scope="session", autouse=True)
def load_cards_catalog(django_db_setup, django_db_blocker, load_set_catalog):
    with django_db_blocker.unblock():
        cards = ScryfallCard.objects.using("default")

        if not cards.exists():
            parse_file(Path(settings.BASE_DIR) / "fixtures" / "card_test.jsonl")

        count = ScryfallCard.objects.using("default").count()

        if count == 0:
            raise RuntimeError("Can't load cards on test database.")


def _parse_set_file(file_path):
    processed = 0
    with file_path.open("r", encoding="utf-8") as file:
        for line_number, line in enumerate(file, start=1):
            line = line.strip()

            if not line:
                continue

            try:
                set_data = json.loads(line)

                with transaction.atomic():
                    process_set(
                        set_id=set_data["id"],
                        set_code=set_data["code"],
                        set_name=set_data["name"],
                        set_type=set_data["set_type"],
                        card_count=set_data["card_count"],
                        icon_url=set_data["icon_svg_uri"],
                    )

                processed += 1

            except (
                json.JSONDecodeError,
                KeyError,
                ValueError,
                TypeError,
                InvalidOperation,
            ) as exc:
                print(f"Line {line_number}: {exc}")
            except Exception as exc:  # noqa: BLE001
                print(f"Unexpected error at line {line_number}: {exc}")
