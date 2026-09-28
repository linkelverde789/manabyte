from deck.models import Deck, DeckCard


class DeckCardSelector:
    @staticmethod
    def get_card_from_id(card_id: int):
        return DeckCard.filter(id=card_id).first()

    @staticmethod
    def list_cards_from_deck(deck: Deck):
        return DeckCard.objects.filter(deck=deck).order_by("id")
