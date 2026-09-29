from dataclasses import dataclass

from collection.exceptions import CollectionItemException
from folder.models import Folder
from users.models import User


@dataclass
class CreateCollectionItemInput:
    user: User
    scryfall_id: str
    quantity: int = 1
    foil: bool = False
    language: str = "en"
    condition: str = "NM"
    folder: Folder | None = None

    def validate(self) -> "CreateCollectionItemInput":
        self.language = self.language.strip()
        self.condition = self.condition.strip()

        if self.quantity < 1:
            raise CollectionItemException("Quantity can't be lower than 1", "400")

        if not self.language:
            raise CollectionItemException("Language can't be empty", "400")

        if not self.condition:
            raise CollectionItemException("Condition can't be empty", "400")

        return self


@dataclass
class UpdateCollectionItemInput:
    scryfall_id: str | None = None
    quantity: int | None = None
    foil: bool | None = None
    language: str | None = None
    condition: str | None = None
    folder: Folder | None = None

    def validate(self) -> "UpdateCollectionItemInput":
        if self.quantity is not None and self.quantity < 1:
            raise CollectionItemException("Quantity can't be lower than 1", "400")

        if self.language is not None:
            self.language = self.language.strip()
            if not self.language:
                raise CollectionItemException("Language can't be empty", "400")

        if self.condition is not None:
            self.condition = self.condition.strip()
            if not self.condition:
                raise CollectionItemException("Condition can't be empty", "400")

        return self
