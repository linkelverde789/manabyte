import pytest
from cards.models import ScryfallCard
from collection.models import CollectionItem
from django.urls import reverse
from events.consts import (
    CARD_ADDED,
    CARD_REMOVED,
    CARD_UPDATED,
    CARDS_BULK_ADDED,
    COLLECTION_TYPE_EVENT,
)
from folder.consts import FOLDER_TYPE_COLLECTION
from folder.models import Folder


@pytest.mark.django_db
def test_create_event_when_create_item(user, auth_client):
    card = ScryfallCard.objects.all().first()
    quantity = 2
    foil = True
    language = "ESP"
    condition = "PSA 10"
    data = {
        "scryfall_id": card.external_id,
        "quantity": quantity,
        "foil": foil,
        "language": language,
        "condition": condition,
    }

    auth_client.post(reverse("collection-list"), data, format="json")

    res = auth_client.get(
        reverse("user-events", kwargs={"event_type": COLLECTION_TYPE_EVENT})
    )

    data = res.data[0]
    assert data["type"] == CARD_ADDED
    assert data["aggregate_type"] == COLLECTION_TYPE_EVENT
    assert data["aggregate_id"] == None  # no folder
    assert len(data["items"]) == 1

    event_item = data["items"][0]

    assert event_item["card"]["external_id"] == str(card.external_id)
    assert event_item["data_before"] == {}
    assert event_item["values_changed"] == {}

    data_after = event_item["data_after"]

    assert data_after["card"] == card.id
    assert data_after["folder"] == None
    assert data_after["foil"] == foil
    assert data_after["language"] == language
    assert data_after["condition"] == condition
    assert data_after["quantity"] == quantity


@pytest.mark.django_db
def test_create_event_when_update_item(user, auth_client):
    original_card = ScryfallCard.objects.all().first()
    folder = Folder.objects.create(
        name="Folder 1", user=user, type=FOLDER_TYPE_COLLECTION
    )

    item = CollectionItem.objects.create(
        card=original_card,
        foil=False,
        language="es",
        condition="PSA 1",
        quantity=1,
        folder=folder,
        user=user,
    )

    foil = True
    language = "ESP"
    condition = "PSA 10"
    quantity = 999

    updated_card = ScryfallCard.objects.all().last()

    data = {
        "foil": foil,
        "language": language,
        "condition": condition,
        "quantity": quantity,
        "scryfall_id": updated_card.external_id,
    }

    auth_client.patch(
        reverse("collection-detail", kwargs={"pk": item.id}),
        data,
        format="json",
    )

    res = auth_client.get(
        reverse("user-events", kwargs={"event_type": COLLECTION_TYPE_EVENT})
    )

    assert len(res.data) == 1

    data = res.data[0]
    assert data["type"] == CARD_UPDATED
    assert data["aggregate_type"] == COLLECTION_TYPE_EVENT
    assert int(data["aggregate_id"]) == folder.id
    assert len(data["items"]) == 1

    event_item = data["items"][0]

    assert event_item["card"]["external_id"] == str(updated_card.external_id)

    data_before = event_item["data_before"]

    assert data_before["card"] == original_card.id
    assert data_before["folder"] == folder.id
    assert data_before["foil"] == item.foil
    assert data_before["language"] == item.language
    assert data_before["condition"] == item.condition
    assert data_before["quantity"] == item.quantity

    data_after = event_item["data_after"]

    assert data_after["card"] == updated_card.id
    assert data_after["folder"] == folder.id
    assert data_after["foil"] == foil
    assert data_after["language"] == language
    assert data_after["condition"] == condition
    assert data_after["quantity"] == quantity

    values_changed = event_item["values_changed"]
    assert values_changed["card"]["from"] == original_card.id
    assert values_changed["card"]["to"] == updated_card.id
    assert values_changed["foil"]["from"] == item.foil
    assert values_changed["foil"]["to"] == foil
    assert values_changed["condition"]["from"] == item.condition
    assert values_changed["condition"]["to"] == condition
    assert values_changed["language"]["from"] == item.language
    assert values_changed["language"]["to"] == language
    assert values_changed["quantity"]["from"] == item.quantity
    assert values_changed["quantity"]["to"] == quantity


@pytest.mark.django_db
def test_create_event_when_bulk_create_item(user, auth_client):
    scryfall_cards = ScryfallCard.objects.all().order_by("id")[:10]

    folder = Folder.objects.create(
        name="Folder 1", user=user, type=FOLDER_TYPE_COLLECTION
    )
    cards = []

    items = 10

    foil = False
    quantity = 1
    language = "es"
    condition = "DMG"

    for item in range(items):
        cards.append(
            {
                "scryfall_id": scryfall_cards[item].external_id,
                "quantity": quantity,
                "foil": foil,
                "language": language,
                "condition": condition,
            }
        )

    auth_client.post(
        reverse("collection-bulk-create"),
        {"items": cards, "folder_id": folder.id},
        format="json",
    )

    res = auth_client.get(
        reverse("user-events", kwargs={"event_type": COLLECTION_TYPE_EVENT})
    )

    assert len(res.data) == 1

    data = res.data[0]
    assert data["aggregate_type"] == COLLECTION_TYPE_EVENT
    assert data["type"] == CARDS_BULK_ADDED
    assert data["aggregate_id"] == str(folder.id)
    assert len(data["items"]) == items

    for event_item in data["items"]:
        assert event_item["data_before"] == {}
        assert event_item["values_changed"] == {}
        assert event_item["data_after"]["folder"] == folder.id
        assert event_item["data_after"]["foil"] == foil
        assert event_item["data_after"]["quantity"] == quantity
        assert event_item["data_after"]["language"] == language
        assert event_item["data_after"]["condition"] == condition


@pytest.mark.django_db
def test_create_event_when_delete_item(user, auth_client):
    original_card = ScryfallCard.objects.all().first()

    folder = Folder.objects.create(
        name="Folder 1", user=user, type=FOLDER_TYPE_COLLECTION
    )

    foil = False
    quantity = 1
    language = "es"
    condition = "DMG"

    item = CollectionItem.objects.create(
        card=original_card,
        foil=foil,
        language=language,
        condition=condition,
        quantity=quantity,
        folder=folder,
        user=user,
    )

    auth_client.delete(reverse("collection-detail", kwargs={"pk": item.id}))

    res = auth_client.get(
        reverse("user-events", kwargs={"event_type": COLLECTION_TYPE_EVENT})
    )

    assert len(res.data) == 1

    data = res.data[0]

    assert data["aggregate_type"] == COLLECTION_TYPE_EVENT
    assert data["type"] == CARD_REMOVED
    assert data["aggregate_id"] == str(folder.id)
    assert len(data["items"]) == 1

    event_item = data["items"][0]

    assert event_item["card"]["external_id"] == str(original_card.external_id)

    assert event_item["data_after"] == {}
    assert event_item["values_changed"] == {}

    data_before = event_item["data_before"]

    assert data_before["card"] == original_card.id
    assert data_before["language"] == language
    assert data_before["condition"] == condition
    assert data_before["quantity"] == quantity
    assert data_before["foil"] == foil
