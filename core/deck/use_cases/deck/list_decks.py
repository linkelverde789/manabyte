from deck.selectors.deck import DeckSelector


class ListDecksUseCase:
    def execute(self):
        decks = DeckSelector.list_decks()

        return decks
