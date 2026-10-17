from decimal import Decimal

import pytest
from cards.models import ScryfallCard
from collection.models import CollectionItem
from deck.models import Deck
from django.db.models import DecimalField, F, Sum, Value
from django.db.models.base import Coalesce
from django.urls import reverse
from folder.consts import FOLDER_TYPE_COLLECTION
from folder.models import Folder
from rest_framework.status import HTTP_200_OK


@pytest.mark.django_db
def test_get_user_stats(auth_client, user):
    collection = []
    decks = []

    items = 10
    total_cards = items * (items + 1) / 2

    cards = ScryfallCard.objects.all()[:items]

    for item in range(items):
        collection.append(
            CollectionItem(
                user=user,
                card=cards[item],
                quantity=item + 1,
                foil=True,
                condition=f"PSA {item}",
                language="en",
            )
        )

        decks.append(Deck(user=user, name=f"Name {item}", format="Modern"))

    CollectionItem.objects.bulk_create(collection)
    Deck.objects.bulk_create(decks)

    res = auth_client.get(reverse("user-stats"))
    data = res.data
    assert data["decks"] == items
    assert data["collection"]["unique_cards"] == items
    assert data["collection"]["total"] == total_cards

    same_card = ScryfallCard.objects.last()

    CollectionItem.objects.filter(user=user).update(card=same_card)

    res = auth_client.get(reverse("user-stats"))
    data = res.data
    assert data["decks"] == items
    assert data["collection"]["total"] == total_cards
    assert data["collection"]["unique_cards"] == 1


def test_get_user_folder_stats(auth_client, user):
    collection = []

    items = 10

    cards = ScryfallCard.objects.all().distinct("external_id")[:items]

    folder_name = "Test name"

    folder = Folder.objects.create(
        name=folder_name, user=user, type=FOLDER_TYPE_COLLECTION
    )

    for item in range(items):
        collection.append(
            CollectionItem(
                user=user,
                card=cards[item],
                quantity=1,
                foil=False,
                condition=f"PSA {item}",
                language="en",
                folder=folder,
            )
        )

    CollectionItem.objects.bulk_create(collection)

    res = auth_client.get(reverse("folder-stats", kwargs={"folder_id": folder.id}))

    assert res.status_code == HTTP_200_OK

    prices = CollectionItem.objects.filter(user=user).aggregate(
        price=Coalesce(
            Sum(F("card__price_nonfoil")),
            Value(0),
            output_field=DecimalField(
                max_digits=12,
                decimal_places=2,
            ),
        )
    )["price"]

    data = res.data

    assert Decimal(data["price"]) == prices
    assert data["folder_name"] == folder_name
    assert data["cards"] == items
    assert data["entries"] == cards.count()


def test_get_user_folder_stats_with_same_cards(auth_client, user):
    collection = []

    items = 10

    card = ScryfallCard.objects.first()

    folder_name = "Test name"

    folder = Folder.objects.create(
        name=folder_name, user=user, type=FOLDER_TYPE_COLLECTION
    )

    for item in range(items):
        collection.append(
            CollectionItem(
                user=user,
                card=card,
                quantity=1,
                foil=False,
                condition=f"PSA {item}",
                language="en",
                folder=folder,
            )
        )

    CollectionItem.objects.bulk_create(collection)

    res = auth_client.get(reverse("folder-stats", kwargs={"folder_id": folder.id}))

    assert res.status_code == HTTP_200_OK

    prices = CollectionItem.objects.filter(user=user).aggregate(
        price=Coalesce(
            Sum(F("card__price_nonfoil")),
            Value(0),
            output_field=DecimalField(
                max_digits=12,
                decimal_places=2,
            ),
        )
    )["price"]

    data = res.data

    assert Decimal(data["price"]) == prices
    assert data["folder_name"] == folder_name
    assert data["cards"] == items
    assert data["entries"] == 1
