from deck.dto.deck import CreateDeckInput
from deck.models import Deck
from deck.services.deck import DeckService
from users.models import User


class CreateDeckUseCase:
    def execute(
        self, name: str, format: str, user: User, folder_id: int | None = None
    ) -> Deck:
        folder = None

        if folder_id is not None:
            # TODO
            folder = None

        input_deck_dto = CreateDeckInput(
            name=name, format=format, folder=folder, user=user
        ).validate()

        return DeckService.create_deck(data=input_deck_dto)
