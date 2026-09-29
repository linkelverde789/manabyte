from deck.dto.deck_card import CreateDeckCardInput
from deck.models import Deck
from deck.selectors.deck_card import DeckCardSelector
from deck.services.deck_card import DeckCardService


class CreateDeckCardUseCase:
    def execute(self, scryfall_id: str, zone: str, deck: Deck, quantity: int):
        create_deck_card_dto = CreateDeckCardInput(
            deck=deck, scryfall_id=scryfall_id, quantity=quantity, zone=zone
        ).validate()

        DeckCardService.create_deck_card(data=create_deck_card_dto)

        return DeckCardSelector.list_cards_from_deck(deck=deck)
