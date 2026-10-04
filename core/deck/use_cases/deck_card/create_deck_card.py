from deck.dto.deck_card import CreateDeckCardInput
from deck.exceptions import DeckException
from deck.selectors.deck import DeckSelector
from deck.selectors.deck_card import DeckCardSelector
from deck.services.deck_card import DeckCardService
from users.models import User


class CreateDeckCardUseCase:
    def execute(
        self, scryfall_id: str, zone: str, deck_id: int, quantity: int, user: User
    ):

        deck = DeckSelector.get_deck_by_user(deck_id=deck_id, user=user)

        if deck is None:
            raise DeckException(f"Deck {deck_id} not found", "404")

        create_deck_card_dto = CreateDeckCardInput(
            deck=deck, scryfall_id=scryfall_id, quantity=quantity, zone=zone
        ).validate()

        DeckCardService.create_deck_card(data=create_deck_card_dto)

        return DeckCardSelector.list_cards_from_deck(deck=deck)
