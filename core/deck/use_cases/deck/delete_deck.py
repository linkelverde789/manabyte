from deck.exceptions import DeckException
from deck.selectors.deck import DeckSelector
from deck.services.deck import DeckService
from users.models import User


class DeleteDeckUseCase:
    def execute(self, deck_id: int, user: User) -> None:
        deck = DeckSelector.get_deck_by_user(deck_id=deck_id, user=user)

        if deck is None:
            raise DeckException(f"Deck {deck_id} not found")

        DeckService.delete_deck(deck)
