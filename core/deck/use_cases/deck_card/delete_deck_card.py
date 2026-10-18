import copy

from deck.exceptions import DeckCardException, DeckException
from deck.selectors.deck import DeckSelector
from deck.selectors.deck_card import DeckCardSelector
from deck.services.deck_card import DeckCardService
from django.forms.models import model_to_dict
from events.consts import CARD_REMOVED, DECK_TYPE_EVENT
from events.use_cases.create_event_for_delete import (
    CreateEventForDeleteActionUseCase,
)
from users.models import User


class DeleteDeckCardUseCase:
    def execute(self, card_id: int, deck_id: int, user: User) -> None:

        deck = DeckSelector.get_deck_by_user(user=user, deck_id=deck_id)

        if deck is None:
            raise DeckException(f"Deck {deck_id} not found", "404")

        card = DeckCardSelector.get_card_from_id_and_deck(card_id=card_id, deck=deck)

        if not card:
            raise DeckCardException(f"Card: {card_id} not found", "404")

        data_before = model_to_dict(copy.deepcopy(card))

        DeckCardService.delete_deck_card(card=card)
        CreateEventForDeleteActionUseCase().execute(
            user=user,
            data_before=data_before,
            aggregate_type=DECK_TYPE_EVENT,
            type=CARD_REMOVED,
            aggregate_id=deck_id,
        )
