import pytest
from cards.models import ScryfallCard
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


@pytest.fixture
def cards_db(django_db_blocker):
    with django_db_blocker.unblock():
        yield ScryfallCard.objects.using("cards_readonly")
