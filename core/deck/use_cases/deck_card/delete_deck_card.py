from deck.exceptions import DeckCardException, DeckException
from deck.models import Deck
from deck.selectors.deck_card import DeckCardSelector
from deck.services.deck_card import DeckCardService

from core.deck.selectors.deck import DeckSelector
from core.users.models import User


class DeleteDeckCardUseCase:
    def execute(self, card_id: int, deck_id: int, user: User) -> None:

        deck = DeckSelector.get_deck_by_user(user=user, deck_id=deck_id)

        if deck is None:
            raise DeckException(f"Deck {deck_id} not found", "404")

        card = DeckCardSelector.get_card_from_id_and_deck(card_id=card_id, deck=deck)

        if not card:
            raise DeckCardException(f"Card: {card_id} not found", "404")

        DeckCardService.delete_deck_card(card=card)
