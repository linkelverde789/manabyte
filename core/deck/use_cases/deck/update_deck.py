from deck.dto.deck import UpdateDeckInput
from deck.exceptions import DeckException
from deck.models import Deck
from deck.services.deck import DeckService
from deck.use_cases.deck.get_deck_for_user import GetDeckForUserUseCase
from users.models import User


class UpdateDeckUseCase:
    def execute(
        self,
        deck_id: int,
        user: User,
        name: str | None = None,
        format: str | None = None,
        folder_id: int | None = None,
    ) -> Deck:
        folder = None
        if folder_id is not None:
            folder = None
        update_deck_dto = UpdateDeckInput(
            name=name, format=format, folder=folder
        ).validate()

        deck = GetDeckForUserUseCase().execute(pk=deck_id, user=user)

        if deck is None:
            raise DeckException("Deck not found")

        return DeckService.update_deck(deck=deck, data=update_deck_dto)
