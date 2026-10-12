from sets.selectors.sets import SetSelector


class ListSetsUseCase:
    def execute(self):
        sets = SetSelector.list_sets()

        return sets
