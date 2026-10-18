from cards.selectors.cards import CardSelector
from deck.dto.deck_card import CreateDeckCardInput
from deck.exceptions import DeckException
from deck.selectors.deck import DeckSelector
from deck.selectors.deck_card import DeckCardSelector
from deck.services.deck_card import DeckCardService
from events.consts import CARDS_BULK_ADDED, DECK_TYPE_EVENT
from events.utils.create_event import CreateEventForBulkActionUseCase
from users.models import User


class BulkCreateDeckCardUseCase:
    def execute(self, deck_id: int, user: User, data):

        deck = DeckSelector.get_deck_by_user(deck_id=deck_id, user=user)

        if not deck:
            raise DeckException(f"Deck {deck_id} not found", "404")

        create_data_dto = [
            CreateDeckCardInput(
                deck=deck,
                card=CardSelector.get_card_from_scryfall_id(card["scryfall_id"]),
                quantity=card["quantity"],
                zone=card.get("zone", "mainboard"),
            ).validate()
            for card in data
        ]

        items = DeckCardService.bulk_create_deck_card(create_data_dto)

        CreateEventForBulkActionUseCase().execute(
            user=user,
            type=CARDS_BULK_ADDED,
            aggregate_type=DECK_TYPE_EVENT,
            aggregate_id=str(deck.id),
            data_after=items,
        )

        return DeckCardSelector.list_cards_from_deck(deck=deck)
