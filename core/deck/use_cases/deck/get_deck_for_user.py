from deck.exceptions import DeckException
from deck.models import Deck
from deck.selectors.deck import DeckSelector
from users.models import User


class GetDeckForUserUseCase:
    def execute(self, pk, user=User) -> Deck | None:
        decks = DeckSelector.list_decks_by_user(user=user)

        deck = decks.filter(id=pk).first()

        if deck is None:
            raise DeckException(f"Deck {pk} not found")

        return deck
