from deck.dto.deck_card import CreateDeckCardInput
from deck.exceptions import DeckException
from deck.selectors.deck import DeckSelector
from deck.selectors.deck_card import DeckCardSelector
from deck.services.deck_card import DeckCardService
from users.models import User


class BulkCreateDeckCardUseCase:
    def execute(self, deck_id: int, user: User, data):

        deck = DeckSelector.get_deck_by_user(deck_id=deck_id, user=user)

        if not deck:
            raise DeckException(f"Deck {deck_id} not found")

        create_data_dto = [
            CreateDeckCardInput(
                deck=deck,
                scryfall_id=card["scryfall_id"],
                quantity=card["quantity"],
                zone=card.get("zone", None),
            ).validate()
            for card in data
        ]

        DeckCardService.bulk_create_deck_card(create_data_dto)

        return DeckCardSelector.list_cards_from_deck(deck=deck)
