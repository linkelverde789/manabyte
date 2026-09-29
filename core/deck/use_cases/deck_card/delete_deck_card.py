from deck.exceptions import DeckCardException
from deck.models import Deck
from deck.selectors.deck_card import DeckCardSelector
from deck.services.deck_card import DeckCardService


class DeleteDeckCardUseCase:
    def execute(self, card_id: int, deck: Deck) -> None:
        card = DeckCardSelector.get_card_from_id(card_id=card_id)

        if not card:
            raise DeckCardException(f"Card: {card_id} not found")

        DeckCardService.delete_deck_card(card=card)
