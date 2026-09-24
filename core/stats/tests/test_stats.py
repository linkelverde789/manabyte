from uuid import uuid4

import pytest
from collection.models import CollectionItem
from deck.models import Deck
from django.urls import reverse


@pytest.mark.django_db
def test_get_user_stats(auth_client, user):
    collection = []
    decks = []

    items = 10
    total_cards = items * (items + 1) / 2

    for item in range(items):
        collection.append(
            CollectionItem(
                user=user,
                scryfall_id=uuid4(),
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

    same_scryfall_id = uuid4()

    CollectionItem.objects.filter(user=user).update(scryfall_id=same_scryfall_id)

    res = auth_client.get(reverse("user-stats"))
    data = res.data
    assert data["decks"] == items
    assert data["collection"]["total"] == total_cards
    assert data["collection"]["unique_cards"] == 1
