from deck.models import Deck
from deck.selectors.deck_card import DeckCardSelector


class GetCardsFromDeckUseCase:
    def execute(self, deck: Deck):
        return DeckCardSelector.list_cards_from_deck(deck=deck)
