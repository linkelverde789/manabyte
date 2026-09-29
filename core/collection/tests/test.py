from uuid import uuid4

import pytest
from collection.models import CollectionItem
from django.urls import reverse
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT


@pytest.mark.django_db
def test_create_collection_item(auth_client):
    data = {
        "scryfall_id": uuid4(),
        "quantity": 2,
        "foil": True,
        "language": "en",
        "condition": "PSA 10",
    }

    res = auth_client.post(reverse("collection-list"), data, format="json")

    assert res.status_code == HTTP_201_CREATED

    assert res.data["scryfall_id"] == str(data["scryfall_id"])


@pytest.mark.django_db
def test_bulk_create_collection_item(auth_client):
    data = []

    for item in range(10):
        data.append(
            {
                "scryfall_id": uuid4(),
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

    assert len(res.data) == 10


@pytest.mark.django_db
def test_partial_update_collection_item(user, auth_client):
    original_uuid = uuid4()
    collectionItem = CollectionItem.objects.create(
        user=user,
        scryfall_id=original_uuid,
        quantity=1,
        language="en",
        foil=False,
        condition="PSA 1",
    )

    data = {
        "scryfall_id": uuid4(),
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

    assert res.data["scryfall_id"] != str(collectionItem.scryfall_id)
    assert res.data["quantity"] != collectionItem.quantity
    assert res.data["language"] != collectionItem.language
    assert res.data["foil"] != collectionItem.foil
    assert res.data["condition"] != collectionItem.condition

    collectionItem.refresh_from_db()

    assert res.data["scryfall_id"] == str(collectionItem.scryfall_id)
    assert res.data["quantity"] == collectionItem.quantity
    assert res.data["language"] == collectionItem.language
    assert res.data["foil"] == collectionItem.foil
    assert res.data["condition"] == collectionItem.condition


@pytest.mark.django_db
def test_list_collection_item(user, auth_client):
    data = []

    for item in range(10):
        data.append(
            CollectionItem(
                scryfall_id=uuid4(),
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
    assert len(res.data) == 10


@pytest.mark.django_db
def test_destroy_collection_item(user, auth_client):
    collection_item = CollectionItem.objects.create(
        scryfall_id=uuid4(),
        quantity=1,
        foil=True,
        language="en",
        condition="PSA 10",
        user=user,
    )

    res = auth_client.get(reverse("collection-list"))

    assert res.status_code == HTTP_200_OK
    assert len(res.data) == 1

    res = auth_client.delete(
        reverse("collection-detail", kwargs={"pk": collection_item.id})
    )

    assert res.status_code == HTTP_204_NO_CONTENT

    res = auth_client.get(reverse("collection-list"))

    assert res.status_code == HTTP_200_OK
    assert len(res.data) == 0
