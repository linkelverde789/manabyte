from deck.dto.deck_card import UpdateDeckCardInput
from deck.exceptions import DeckCardException
from deck.models import Deck
from deck.selectors.deck_card import DeckCardSelector
from deck.services.deck_card import DeckCardService


class UpdateDeckCardUseCase:
    def execute(
        self,
        card_id: int,
        scryfall_id: str | None = None,
        zone: str | None = None,
        deck: Deck | None = None,
        quantity: int | None = None,
    ):
        card = DeckCardSelector.get_card_from_id(card_id=card_id)

        if not card:
            raise DeckCardException(f"Card: {card_id} not found")

        update_deck_card_dto = UpdateDeckCardInput(
            deck=deck, scryfall_id=scryfall_id, quantity=quantity, zone=zone
        ).validate()

        return DeckCardService.update_deck_card(card=card, data=update_deck_card_dto)
