from deck.exceptions import DeckException
from deck.models import Deck
from deck.selectors.deck import DeckSelector
from users.models import User


class GetDeckForUserUseCase:
    def execute(self, deck_id: int, user: User) -> Deck | None:
        deck = DeckSelector.get_deck_by_user(user=user, deck_id=deck_id)

        if deck is None:
            raise DeckException(f"Deck {deck_id} not found", "404")

        return deck
