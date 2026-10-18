import copy

from cards.api.exceptions import ScryfallCardException
from cards.selectors.cards import CardSelector
from deck.dto.deck_card import UpdateDeckCardInput
from deck.exceptions import DeckCardException, DeckException
from deck.selectors.deck import DeckSelector
from deck.selectors.deck_card import DeckCardSelector
from deck.services.deck_card import DeckCardService
from django.forms.models import model_to_dict
from events.consts import CARD_UPDATED, DECK_TYPE_EVENT
from events.utils.create_event import CreateEventForUpdateActionUseCase
from users.models import User


class UpdateDeckCardUseCase:
    def execute(
        self,
        user: User,
        deck_id: int,
        card_id: int,
        scryfall_id: str | None = None,
        zone: str | None = None,
        quantity: int | None = None,
    ):

        deck = None

        if deck_id is not None:
            deck = DeckSelector.get_deck_by_user(user=user, deck_id=deck_id)

            if deck is None:
                raise DeckException(f"Deck: {deck_id} not found", "404")

        card = DeckCardSelector.get_card_from_id(card_id=card_id)

        original_data = copy.deepcopy(model_to_dict(card))
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

        updated_card = DeckCardService.update_deck_card(
            card=card, data=update_deck_card_dto
        )

        updated_data = model_to_dict(updated_card)

        CreateEventForUpdateActionUseCase().execute(
            user=user,
            type=CARD_UPDATED,
            aggregate_type=DECK_TYPE_EVENT,
            aggregate_id=deck_id,
            data_before=original_data,
            data_after=updated_data,
        )

        return updated_card
