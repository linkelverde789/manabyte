from deck.exceptions import DeckException
from deck.services.deck import DeckService
from deck.use_cases.deck.get_deck_for_user import GetDeckForUserUseCase
from users.models import User


class DeleteDeckUseCase:
    def execute(self, deck_id: int, user: User) -> None:
        deck = GetDeckForUserUseCase().execute(pk=deck_id, user=user)

        if deck is None:
            raise DeckException(f"Deck {deck_id} not found")

        DeckService.delete_deck(deck)
