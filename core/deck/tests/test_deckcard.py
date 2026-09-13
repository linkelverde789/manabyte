import uuid

import pytest
from django.urls import reverse
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT

from deck.models import Deck, DeckCard


@pytest.mark.django_db
def test_list_deck_cards(user, auth_client):
    deck = Deck.objects.create(name="Deck 1", user=user, format="Commander")
    card_one = DeckCard.objects.create(
        scryfall_id=uuid.uuid4(), deck=deck, zone="mainboard", quantity=2
    )

    card_two = DeckCard.objects.create(
        scryfall_id=uuid.uuid4(), deck=deck, zone="mainboard", quantity=2
    )

    res = auth_client.get(reverse("card-list", kwargs={"deck_id": deck.id}))

    assert res.status_code == HTTP_200_OK
    assert len(res.data) == 2
    assert res.data[0]["scryfall_id"] == str(card_one.scryfall_id)
    assert res.data[0]["id"] == card_one.id
    assert res.data[1]["scryfall_id"] == str(card_two.scryfall_id)
    assert res.data[1]["id"] == card_two.id


@pytest.mark.django_db
def test_create_card(user, auth_client):
    deck = Deck.objects.create(name="Deck 1", user=user, format="Commander")

    scryfall_id = uuid.uuid4()

    res = auth_client.post(
        reverse("card-list", kwargs={"deck_id": deck.id}),
        {"scryfall_id": scryfall_id, "quantity": 2, "zone": "mainboard"},
    )

    assert res.status_code == HTTP_201_CREATED
    res = auth_client.get(reverse("card-list", kwargs={"deck_id": deck.id}))
    assert res.data[0]["scryfall_id"] == str(scryfall_id)


@pytest.mark.django_db
def test_delete_card(user, auth_client):
    deck = Deck.objects.create(name="Deck 1", user=user, format="Commander")
    card = DeckCard.objects.create(
        scryfall_id=uuid.uuid4(), deck=deck, zone="mainboard", quantity=2
    )

    res = auth_client.get(reverse("card-list", kwargs={"deck_id": deck.id}))
    assert len(res.data) == 1

    res = auth_client.delete(
        reverse("card-detail", kwargs={"deck_id": deck.id, "pk": card.id})
    )
    assert res.status_code == HTTP_204_NO_CONTENT

    res = auth_client.get(reverse("card-list", kwargs={"deck_id": deck.id}))
    assert len(res.data) == 0
