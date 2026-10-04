from deck.exceptions import DeckException
from deck.selectors.deck import DeckSelector
from export.actions import (
    export_deck,
)
from users.models import User


class ExportDeckUseCase:
    def execute(self, user: User, deck_id: int | None, format: str = "csv"):

        if deck_id is None:
            raise DeckException("Deck id can't be None")

        deck = DeckSelector.get_deck_by_user(deck_id=deck_id, user=user)

        if deck is None:
            raise DeckException(f"Deck {deck_id} not found", "404")

        return export_deck(deck=deck, format_type=format)
