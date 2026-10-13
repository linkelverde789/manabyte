from uuid import uuid4

import pytest
from cards.models import ScryfallCard
from collection.models import CollectionItem
from deck.models import Deck
from django.urls import reverse


@pytest.mark.django_db
def test_get_user_stats(auth_client, user):
    collection = []
    decks = []

    items = 10
    total_cards = items * (items + 1) / 2

    cards = ScryfallCard.objects.all()[0:items]

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
