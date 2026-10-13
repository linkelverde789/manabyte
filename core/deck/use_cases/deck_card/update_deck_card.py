from cards.api.exceptions import ScryfallCardException
from cards.selectors.cards import CardSelector
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
            raise DeckCardException(f"Card: {card_id} not found", "404")

        scryfall_card = None

        if scryfall_id is not None:
            scryfall_card = CardSelector.get_card_from_scryfall_id(
                scryfall_id=scryfall_id
            )

            if scryfall_card is None:
                raise ScryfallCardException(f"Card: {scryfall_id} not found", "404")

        update_deck_card_dto = UpdateDeckCardInput(
            deck=deck, card=scryfall_card, quantity=quantity, zone=zone
        ).validate()

        return DeckCardService.update_deck_card(card=card, data=update_deck_card_dto)
