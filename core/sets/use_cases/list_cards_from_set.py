from sets.selectors.sets import SetSelector


class ListCardsFromSetUseCase:
    def execute(self, set_code: str):

        cards = SetSelector.list_cards_from_set(set_code=set_code)

        return cards
