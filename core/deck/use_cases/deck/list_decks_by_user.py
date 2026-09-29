from deck.selectors.deck import DeckSelector
from users.models import User


class ListDecksByUserUseCase:
    def execute(self, user: User):
        decks = DeckSelector.list_decks_by_user(user=user)

        return decks
