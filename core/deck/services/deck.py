from deck.dto.deck import CreateDeckInput, UpdateDeckInput
from deck.models import Deck
from django.db import transaction


class DeckService:
    @transaction.atomic
    @staticmethod
    def create_deck(data: CreateDeckInput) -> Deck:
        deck = Deck.objects.create(
            name=data.name, folder=data.folder, format=data.format, user=data.user
        )

        return deck

    @transaction.atomic
    @staticmethod
    def update_deck(deck: Deck, data: UpdateDeckInput) -> Deck:
        if data.name is not None:
            deck.name = data.name

        if data.folder is not None:
            deck.folder = data.folder

        if data.format is not None:
            deck.format = data.format

        deck.save()
        return deck

    @transaction.atomic
    @staticmethod
    def delete_deck(deck: Deck) -> None:
        deck.delete()
