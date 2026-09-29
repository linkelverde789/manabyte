from deck.dto.deck_card import CreateDeckCardInput, UpdateDeckCardInput
from deck.models import DeckCard
from django.db import transaction


class DeckCardService:
    @transaction.atomic
    @staticmethod
    def create_deck_card(data: CreateDeckCardInput) -> DeckCard:
        card = DeckCard.objects.create(
            deck=data.deck,
            scryfall_id=data.scryfall_id,
            quantity=data.quantity,
            zone=data.zone,
        )

        return card

    @transaction.atomic
    @staticmethod
    def bulk_create_deck_card(data: [CreateDeckCardInput]):
        DeckCard.objects.bulk_create(
            [
                DeckCard(
                    deck=item.deck,
                    scryfall_id=item.scryfall_id,
                    quantity=item.quantity,
                    zone=item.zone,
                )
                for item in data
            ]
        )

    @transaction.atomic
    @staticmethod
    def update_deck_card(card: DeckCard, data: UpdateDeckCardInput) -> DeckCard:
        if data.scryfall_id is not None:
            card.scryfall_id = data.scryfall_id

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
