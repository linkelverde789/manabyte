from cards.dto.dto import SearchCardsFilters
from cards.selectors.cards import CardSelector


class SearchCardUseCase:
    def execute(self, limit: int, page: int, q: str | None = None):

        filters = SearchCardsFilters(limit=limit, page=page, q=q)

        cards = CardSelector.search_card(filters)

        return cards
