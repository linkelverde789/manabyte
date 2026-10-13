from cards.api.exceptions import ScryfallCardException
from cards.selectors.cards import CardSelector
from collection.dto.collection import CreateCollectionItemInput
from collection.models import CollectionItem
from collection.services.collection import CollectionItemService
from folder.exceptions import FolderException
from folder.selectors.folder import FolderSelector
from users.models import User


class CreateCollectionItemUseCase:
    def execute(
        self,
        scryfall_id: str,
        quantity: int,
        language: str,
        condition: str,
        foil: bool,
        user: User,
        folder_id: int | None = None,
    ) -> CollectionItem:

        folder = None

        if folder_id is not None:
            folder = FolderSelector.get_folder_from_user(user=user, folder_id=folder_id)

            if folder is None:
                raise FolderException(f"Folder: {folder_id} not found", "404")

        card = CardSelector.get_card_from_scryfall_id(scryfall_id=scryfall_id)

        if card is None:
            raise ScryfallCardException(f"Card: {scryfall_id} not found", "404")

        input_dto = CreateCollectionItemInput(
            card=card,
            quantity=quantity,
            foil=foil,
            folder=folder,
            user=user,
            condition=condition,
            language=language,
        ).validate()

        return CollectionItemService.create_collection_item(data=input_dto)
