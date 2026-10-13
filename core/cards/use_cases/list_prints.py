from cards.selectors.cards import CardSelector


class ListPrintsUseCase:
    def execute(self, oracle_id: str):
        prints = CardSelector.list_card_prints(oracle_id=oracle_id)
        return prints
