import uuid

import pytest
from cards.models import ScryfallCard
from django.urls import reverse
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT

from deck.models import Deck, DeckCard


@pytest.mark.django_db
def test_list_deck_cards(user, auth_client):
    deck = Deck.objects.create(name="Deck 1", user=user, format="Commander")

    scryfall_card_one = ScryfallCard.objects.all().first()
    card_one = DeckCard.objects.create(
        card=scryfall_card_one, deck=deck, zone="mainboard", quantity=2
    )

    scryfall_card_two = ScryfallCard.objects.all().last()

    card_two = DeckCard.objects.create(
        card=scryfall_card_two, deck=deck, zone="mainboard", quantity=2
    )

    res = auth_client.get(reverse("card-list", kwargs={"deck_id": deck.id}))

    data = res.data

    assert res.status_code == HTTP_200_OK
    assert len(data) == 2

    assert data[0]["card"]["external_id"] == str(scryfall_card_two.external_id)
    assert data[0]["id"] == card_two.id
    assert data[1]["card"]["external_id"] == str(scryfall_card_one.external_id)
    assert data[1]["id"] == card_one.id


@pytest.mark.django_db
def test_create_card(user, auth_client):
    scryfall_id = ScryfallCard.objects.all().first().external_id

    deck = Deck.objects.create(name="Deck 1", user=user, format="Commander")

    res = auth_client.post(
        reverse("card-list", kwargs={"deck_id": deck.id}),
        {"scryfall_id": scryfall_id, "quantity": 2, "zone": "mainboard"},
    )

    assert res.status_code == HTTP_201_CREATED
    res = auth_client.get(reverse("card-list", kwargs={"deck_id": deck.id}))
    assert res.data[0]["card"]["external_id"] == str(scryfall_id)


@pytest.mark.django_db
def test_create_card_bulk(user, auth_client):
    scryfall_cards = ScryfallCard.objects.all()[:10]

    deck = Deck.objects.create(name="Deck 1", user=user, format="Commander")
    cards = []

    for item in range(10):
        cards.append(
            {
                "scryfall_id": scryfall_cards[item].external_id,
                "quantity": item + 1,
                "zone": "mainboard",
            }
        )

    res = auth_client.post(
        reverse("card-bulk-create", kwargs={"deck_id": deck.id}), cards, format="json"
    )

    assert res.status_code == HTTP_201_CREATED

    res = auth_client.get(reverse("card-list", kwargs={"deck_id": deck.id}))

    assert len(res.data) == 10


@pytest.mark.django_db
def test_partial_update_card(user, auth_client):
    deck = Deck.objects.create(name="Deck 1", user=user, format="Commander")

    original_scryfall_card = ScryfallCard.objects.all().first()
    card = DeckCard.objects.create(
        card=original_scryfall_card, deck=deck, zone="mainboard", quantity=1
    )

    updated_scryfall_id = ScryfallCard.objects.all().last().external_id

    res = auth_client.patch(
        reverse("card-detail", kwargs={"deck_id": deck.id, "pk": card.id}),
        {"quantity": 99, "scryfall_id": updated_scryfall_id},
        format="json",
    )

    assert res.status_code == HTTP_200_OK
    assert res.data["quantity"] == 99
    assert res.data["card"]["external_id"] == str(updated_scryfall_id)

    card.refresh_from_db()

    assert card.quantity == 99
    assert card.card.external_id == updated_scryfall_id


@pytest.mark.django_db
def test_delete_card(user, auth_client):
    deck = Deck.objects.create(name="Deck 1", user=user, format="Commander")
    scryfall_card = ScryfallCard.objects.all().first()
    card = DeckCard.objects.create(
        card=scryfall_card, deck=deck, zone="mainboard", quantity=2
    )

    res = auth_client.get(reverse("card-list", kwargs={"deck_id": deck.id}))
    assert len(res.data) == 1

    res = auth_client.delete(
        reverse("card-detail", kwargs={"deck_id": deck.id, "pk": card.id})
    )
    assert res.status_code == HTTP_204_NO_CONTENT

    res = auth_client.get(reverse("card-list", kwargs={"deck_id": deck.id}))
    assert len(res.data) == 0
