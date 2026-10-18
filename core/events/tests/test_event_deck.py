import pytest
from cards.models import ScryfallCard
from deck.models import Deck, DeckCard
from django.urls import reverse
from events.consts import (
    CARD_ADDED,
    CARD_REMOVED,
    CARD_UPDATED,
    CARDS_BULK_ADDED,
    DECK_TYPE_EVENT,
)


@pytest.mark.django_db
def test_create_event_when_create_deckcard(user, auth_client):
    card = ScryfallCard.objects.all().first()
    deck = Deck.objects.create(name="Deck 1", user=user, format="Commander")

    zone = "mainboard"
    quantity = 999

    auth_client.post(
        reverse("card-list", kwargs={"deck_id": deck.id}),
        {"scryfall_id": card.external_id, "quantity": quantity, "zone": zone},
    )

    res = auth_client.get(
        reverse("user-events", kwargs={"event_type": DECK_TYPE_EVENT})
    )

    assert len(res.data) == 1

    data = res.data[0]
    assert data["type"] == CARD_ADDED
    assert data["aggregate_type"] == DECK_TYPE_EVENT
    assert int(data["aggregate_id"]) == deck.id
    assert len(data["items"]) == 1

    event_item = data["items"][0]

    assert event_item["card"]["external_id"] == str(card.external_id)
    assert event_item["data_before"] == {}
    assert event_item["values_changed"] == {}

    data_after = event_item["data_after"]

    assert data_after["card"] == card.id
    assert data_after["deck"] == deck.id
    assert data_after["zone"] == zone
    assert data_after["quantity"] == quantity


@pytest.mark.django_db
def test_create_event_when_update_deckcard(user, auth_client):
    original_card = ScryfallCard.objects.all().first()
    deck = Deck.objects.create(name="Deck 1", user=user, format="Commander")
    deckcard = DeckCard.objects.create(
        card=original_card, quantity=1, zone="sideboard", deck=deck
    )

    zone = "mainboard"
    quantity = 999
    updated_card = ScryfallCard.objects.all().last()

    auth_client.patch(
        reverse("card-detail", kwargs={"deck_id": deck.id, "pk": deckcard.id}),
        {"quantity": quantity, "scryfall_id": updated_card.external_id, "zone": zone},
        format="json",
    )

    res = auth_client.get(
        reverse("user-events", kwargs={"event_type": DECK_TYPE_EVENT})
    )

    assert len(res.data) == 1

    data = res.data[0]
    assert data["type"] == CARD_UPDATED
    assert data["aggregate_type"] == DECK_TYPE_EVENT
    assert int(data["aggregate_id"]) == deck.id
    assert len(data["items"]) == 1

    event_item = data["items"][0]
    assert event_item["card"]["external_id"] == str(updated_card.external_id)

    data_before = event_item["data_before"]

    assert data_before["id"] == deckcard.id
    assert data_before["card"] == original_card.id
    assert data_before["deck"] == deck.id
    assert data_before["zone"] == "sideboard"
    assert data_before["quantity"] == 1

    data_after = event_item["data_after"]

    assert data_after["id"] == deckcard.id
    assert data_after["card"] == updated_card.id
    assert data_after["deck"] == deck.id
    assert data_after["zone"] == zone
    assert data_after["quantity"] == quantity

    values_changed = event_item["values_changed"]

    assert values_changed["card"]["from"] == original_card.id
    assert values_changed["card"]["to"] == updated_card.id
    assert values_changed["zone"]["from"] == "sideboard"
    assert values_changed["zone"]["to"] == zone
    assert values_changed["quantity"]["from"] == 1
    assert values_changed["quantity"]["to"] == quantity


@pytest.mark.django_db
def test_create_event_when_delete_deckcard(user, auth_client):
    original_card = ScryfallCard.objects.all().first()

    deck = Deck.objects.create(name="Deck 1", user=user, format="Commander")
    zone = "mainboard"
    quantity = 999

    deckcard = DeckCard.objects.create(
        card=original_card, quantity=quantity, zone=zone, deck=deck
    )

    auth_client.delete(
        reverse("card-detail", kwargs={"deck_id": deck.id, "pk": deckcard.id})
    )

    res = auth_client.get(
        reverse("user-events", kwargs={"event_type": DECK_TYPE_EVENT})
    )

    assert len(res.data) == 1

    data = res.data[0]

    assert data["aggregate_type"] == DECK_TYPE_EVENT
    assert data["type"] == CARD_REMOVED
    assert data["aggregate_id"] == str(deck.id)
    assert len(data["items"]) == 1

    event_item = data["items"][0]

    assert event_item["card"]["external_id"] == str(original_card.external_id)

    assert event_item["data_after"] == {}
    assert event_item["values_changed"] == {}

    data_before = event_item["data_before"]

    assert data_before["card"] == original_card.id
    assert data_before["deck"] == deck.id
    assert data_before["zone"] == zone
    assert data_before["quantity"] == quantity


@pytest.mark.django_db
def test_create_event_when_bulk_create_deckcard(user, auth_client):
    scryfall_cards = ScryfallCard.objects.all().order_by("id")[:10]

    deck = Deck.objects.create(name="Deck 1", user=user, format="Commander")
    cards = []

    items = 10

    zone = "mainboard"
    quantity = 1

    for item in range(items):
        cards.append(
            {
                "scryfall_id": scryfall_cards[item].external_id,
                "quantity": quantity,
                "zone": zone,
            }
        )

    auth_client.post(
        reverse("card-bulk-create", kwargs={"deck_id": deck.id}), cards, format="json"
    )

    res = auth_client.get(
        reverse("user-events", kwargs={"event_type": DECK_TYPE_EVENT})
    )

    assert len(res.data) == 1

    data = res.data[0]
    assert data["aggregate_type"] == DECK_TYPE_EVENT
    assert data["type"] == CARDS_BULK_ADDED
    assert data["aggregate_id"] == str(deck.id)
    assert len(data["items"]) == items

    for event_item in data["items"]:
        assert event_item["data_before"] == {}
        assert event_item["values_changed"] == {}
        assert event_item["data_after"]["deck"] == deck.id
        assert event_item["data_after"]["zone"] == zone
        assert event_item["data_after"]["quantity"] == quantity
