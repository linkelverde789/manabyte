from deck.dto.deck_card import CreateDeckCardInput, UpdateDeckCardInput
from deck.models import DeckCard
from django.db import transaction


class DeckCardService:
    @transaction.atomic
    @staticmethod
    def create_deck_card(data: CreateDeckCardInput) -> DeckCard:
        card = DeckCard.objects.create(
            deck=data.deck,
            card=data.card,
            quantity=data.quantity,
            zone=data.zone,
        )

        return card

    @transaction.atomic
    @staticmethod
    def bulk_create_deck_card(data: [CreateDeckCardInput]):
        items = DeckCard.objects.bulk_create(
            [
                DeckCard(
                    deck=item.deck,
                    card=item.card,
                    quantity=item.quantity,
                    zone=item.zone,
                )
                for item in data
            ]
        )

        return items

    @transaction.atomic
    @staticmethod
    def update_deck_card(card: DeckCard, data: UpdateDeckCardInput) -> DeckCard:
        if data.card is not None:
            card.card = data.card

        if data.quantity is not None:
            card.quantity = data.quantity

        if data.zone is not None:
            card.zone = data.zone

        if data.deck is not None:
            card.deck = data.deck

        card.save()
        return card

    @transaction.atomic
    @staticmethod
    def delete_deck_card(card: DeckCard) -> None:
        card.delete()


def pruebas(cards):
    return
