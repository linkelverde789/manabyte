from pathlib import Path

import pytest
from cards.models import ScryfallCard
from cards.utils.scryfall_importer import parse_file
from config import settings
from rest_framework.test import APIClient
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
def load_cards_catalog(django_db_setup, django_db_blocker):
    with django_db_blocker.unblock():
        cards = ScryfallCard.objects.using("default")

        if not cards.exists():
            parse_file(Path(settings.BASE_DIR) / "fixtures" / "card_test.jsonl")

        count = ScryfallCard.objects.using("default").count()

        if count == 0:
            raise RuntimeError("Can't load cards on test database.")


@pytest.fixture
def cards_db(load_cards_catalog, django_db_blocker):
    with django_db_blocker.unblock():
        yield ScryfallCard.objects.using("default")
