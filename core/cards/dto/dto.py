from dataclasses import dataclass

from cards.consts import SEARCH_LIMIT


@dataclass
class SearchCardsFilters:
    q: str | None = None
    page: int = 1
    limit: int = SEARCH_LIMIT
