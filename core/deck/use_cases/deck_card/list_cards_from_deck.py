from deck.exceptions import DeckException
from deck.selectors.deck import DeckSelector
from deck.selectors.deck_card import DeckCardSelector
from users.models import User


class ListCardsFromDeckUseCase:
    def execute(self, deck_id: int, user: User):
        deck = DeckSelector.get_deck_by_user(deck_id=deck_id, user=user)

        if deck is None:
            raise DeckException(f"Deck {deck_id} not found", "404")

        return DeckCardSelector.list_cards_from_deck(deck=deck)
