import pytest
from django.urls import reverse
from rest_framework.status import HTTP_200_OK

from deck.models import Deck


@pytest.mark.django_db
def test_list_user_decks(user, auth_client):
    Deck.objects.create(name="Deck 1", user=user, format="Commander")
    Deck.objects.create(name="Deck 2", user=user, format="Modern")

    res = auth_client.get(reverse("deck-list"))

    assert res.status_code == HTTP_200_OK
    assert len(res.data) == 2


@pytest.mark.django_db
def test_retrieve_user_deck():
    pass
