from cards.dto.dto import SearchCardsFilters
from cards.models import ScryfallCard
from cards.utils.utils import exclude_some_sets, filter_cards_from_query
from users.models import User


class CardSelector:
    @staticmethod
    def search_card(filters: SearchCardsFilters):

        page = filters.page
        limit = filters.limit
        q = filters.q

        cards = (
            ScryfallCard.objects.all()
            .order_by("oracle_id", "is_borderless", "collector_number")
            .distinct("oracle_id")
        )

        cards = exclude_some_sets(cards)

        if q is not None:
            cards = filter_cards_from_query(q, cards)

        for card in cards:
            print(card.id, card.is_borderless)

        return cards[(page - 1) * limit : limit * page]

    @staticmethod
    def list_card_prints(oracle_id: str):
        return ScryfallCard.objects.filter(oracle_id=oracle_id).order_by("id")

    @staticmethod
    def get_card_from_scryfall_id(scryfall_id: str) -> ScryfallCard | None:
        return ScryfallCard.objects.filter(external_id=scryfall_id).first()

    @staticmethod
    def get_cards_from_deck(deck_id: int):
        return ScryfallCard.objects.filter(deckcard__deck_id=deck_id)

    @staticmethod
    def get_cards_from_folder(folder_id: int):
        return ScryfallCard.objects.filter(collectionitem__folder_id=folder_id)

    @staticmethod
    def get_cards_from_user_collection(user: User):
        return ScryfallCard.objects.filter(collectionitem__user=user)
