import math

import pytest
from cards.consts import SEARCH_LIMIT
from cards.models import ScryfallCard
from collection.models import CollectionItem
from django.urls import reverse
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT


@pytest.mark.django_db
def test_create_collection_item(auth_client):
    scryfall_id = ScryfallCard.objects.all().first().external_id
    data = {
        "scryfall_id": scryfall_id,
        "quantity": 2,
        "foil": True,
        "language": "en",
        "condition": "PSA 10",
    }

    res = auth_client.post(reverse("collection-list"), data, format="json")

    assert res.status_code == HTTP_201_CREATED

    assert res.data["card"]["external_id"] == str(data["scryfall_id"])


@pytest.mark.django_db
def test_bulk_create_collection_item(auth_client):
    data = []

    cards = ScryfallCard.objects.all()[:10]

    for item in range(10):
        data.append(
            {
                "scryfall_id": cards[item].external_id,
                "quantity": item + 1,
                "foil": True,
                "language": "en",
                "condition": f"PSA {item}",
            }
        )

    res = auth_client.post(
        reverse("collection-bulk-create"),
        {"items": data, "folder_id": None},
        format="json",
    )
    assert res.status_code == HTTP_201_CREATED

    assert len(res.data["data"]) == 10


@pytest.mark.django_db
def test_partial_update_collection_item(user, auth_client):
    card = ScryfallCard.objects.all().first()

    collectionItem = CollectionItem.objects.create(
        user=user,
        card=card,
        quantity=1,
        language="en",
        foil=False,
        condition="PSA 1",
    )

    updated_id = ScryfallCard.objects.all().last().external_id

    data = {
        "scryfall_id": updated_id,
        "quantity": 999,
        "language": "es",
        "foil": True,
        "condition": "PSA 10",
    }

    res = auth_client.patch(
        reverse("collection-detail", kwargs={"pk": collectionItem.id}),
        data,
        format="json",
    )

    data = res.data

    assert data["card"]["external_id"] != str(collectionItem.card.external_id)
    assert data["quantity"] != collectionItem.quantity
    assert data["language"] != collectionItem.language
    assert data["foil"] != collectionItem.foil
    assert data["condition"] != collectionItem.condition

    collectionItem.refresh_from_db()

    assert data["card"]["external_id"] == str(collectionItem.card.external_id)
    assert data["quantity"] == collectionItem.quantity
    assert data["language"] == collectionItem.language
    assert data["foil"] == collectionItem.foil
    assert data["condition"] == collectionItem.condition


@pytest.mark.django_db
def test_list_collection_item(user, auth_client):
    data = []

    cards = ScryfallCard.objects.all()[:10]

    for item in range(10):
        data.append(
            CollectionItem(
                card=cards[item],
                quantity=item,
                foil=True,
                language="en",
                condition=f"PSA {item}",
                user=user,
            )
        )

    CollectionItem.objects.bulk_create(data)

    res = auth_client.get(reverse("collection-list"))

    assert res.status_code == HTTP_200_OK
    assert len(res.data["data"]) == 10


@pytest.mark.django_db
def test_pagination_collection_item(user, auth_client):

    object_count = 100

    cards = ScryfallCard.objects.all()[:object_count]

    data = []

    for card in cards:
        data.append(
            CollectionItem(
                card=card,
                quantity=1,
                foil=False,
                language="en",
                condition="Near Mint",
                user=user,
            )
        )

    CollectionItem.objects.bulk_create(data)

    res = auth_client.get(reverse("collection-list"))

    data = res.data

    assert len(data["data"]) == SEARCH_LIMIT
    assert data["count"] == object_count
    assert data["pages"] == math.ceil(object_count / SEARCH_LIMIT)

    res = auth_client.get(reverse("collection-list"), {"page": 2}, format="json")

    data = res.data

    assert len(data["data"]) == object_count - SEARCH_LIMIT
    assert data["count"] == object_count
    assert data["pages"] == math.ceil(object_count / SEARCH_LIMIT)


@pytest.mark.django_db
def test_destroy_collection_item(user, auth_client):
    card = ScryfallCard.objects.first()
    collection_item = CollectionItem.objects.create(
        card=card,
        quantity=1,
        foil=True,
        language="en",
        condition="PSA 10",
        user=user,
    )

    res = auth_client.get(reverse("collection-list"))

    assert res.status_code == HTTP_200_OK
    assert len(res.data["data"]) == 1

    res = auth_client.delete(
        reverse("collection-detail", kwargs={"pk": collection_item.id})
    )

    assert res.status_code == HTTP_204_NO_CONTENT

    res = auth_client.get(reverse("collection-list"))

    assert res.status_code == HTTP_200_OK
    assert len(res.data["data"]) == 0


@pytest.mark.django_db
def test_merge_bulk(auth_client):
    data = []

    card = ScryfallCard.objects.first()

    for item in range(10):
        data.append(
            {
                "scryfall_id": card.external_id,
                "quantity": 1,
                "foil": True,
                "language": "en",
                "condition": "PSA",
            }
        )

    res = auth_client.post(
        reverse("collection-bulk-create"),
        {"items": data, "folder_id": None, "allow_merge": True},
        format="json",
    )
    assert res.status_code == HTTP_201_CREATED

    assert len(res.data["data"]) == 1
    assert res.data["data"][0]["quantity"] == 10
