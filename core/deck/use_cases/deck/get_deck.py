from deck.exceptions import DeckException
from deck.models import Deck
from deck.selectors.deck import DeckSelector


class GetDeckUseCase:
    def execute(self, pk) -> Deck | None:
        deck = DeckSelector.get_deck_by_id(deck_id=pk)

        if deck is None:
            raise DeckException(f"Deck {pk} not found")

        return deck
