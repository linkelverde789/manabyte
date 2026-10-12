from sets.selectors.sets import SetSelector
from users.models import User


class ListCardForAlbumUseCase:
    def execute(self, set_code: str, user: User):

        cards = SetSelector.list_cards_for_album(set_code=set_code, user=user)

        return cards
