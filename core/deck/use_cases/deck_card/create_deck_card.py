from cards.api.exceptions import ScryfallCardException
from cards.selectors.cards import CardSelector
from deck.dto.deck_card import CreateDeckCardInput
from deck.exceptions import DeckException
from deck.selectors.deck import DeckSelector
from deck.selectors.deck_card import DeckCardSelector
from deck.services.deck_card import DeckCardService
from events.consts import CARD_ADDED, DECK_TYPE_EVENT
from events.use_cases.create_event_for_create import (
    CreateEventForCreateActionUseCase,
)
from users.models import User


class CreateDeckCardUseCase:
    def execute(
        self, scryfall_id: str, zone: str, deck_id: int, quantity: int, user: User
    ):

        deck = DeckSelector.get_deck_by_user(deck_id=deck_id, user=user)

        if deck is None:
            raise DeckException(f"Deck {deck_id} not found", "404")

        card = CardSelector.get_card_from_scryfall_id(scryfall_id=scryfall_id)

        if card is None:
            raise ScryfallCardException(f"Card {scryfall_id} not found", "404")

        create_deck_card_dto = CreateDeckCardInput(
            deck=deck, card=card, quantity=quantity, zone=zone
        ).validate()

        deck_card = DeckCardService.create_deck_card(data=create_deck_card_dto)

        CreateEventForCreateActionUseCase().execute(
            user=user,
            type=CARD_ADDED,
            aggregate_type=DECK_TYPE_EVENT,
            aggregate_id=deck_id,
            data_after=deck_card,
        )

        return DeckCardSelector.list_cards_from_deck(deck=deck)
