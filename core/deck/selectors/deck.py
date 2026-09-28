from deck.models import Deck
from users.models import User


class DeckSelector:
    @staticmethod
    def get_deck_by_id(deck_id: int) -> Deck | None:
        return Deck.objects.filter(id=deck_id).first()

    @staticmethod
    def list_decks():
        return Deck.objects.all().order_by("id")

    @staticmethod
    def list_decks_by_user(user: User):
        return Deck.objects.filter(user=user).order_by("id")
