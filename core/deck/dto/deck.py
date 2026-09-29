from dataclasses import dataclass

from deck.exceptions import DeckException
from folder.models import Folder
from users.models import User


@dataclass
class DeckTypeOutput:
    id: int
    name: str


@dataclass
class CreateDeckInput:
    name: str
    user: User
    folder: Folder | None = None
    format: str = "Standar"

    def validate(self) -> "CreateDeckInput":
        self.name = self.name.strip()
        self.format = self.format.strip()

        if not self.name:
            raise DeckException("The name is required")

        if not self.format:
            raise DeckException("The format is required")

        return self


@dataclass
class UpdateDeckInput:
    name: str | None = None
    folder: Folder | None = None
    format: str | None = None

    def validate(self) -> "UpdateDeckInput":
        if self.name is not None:
            self.name = self.name.strip()

            if not self.name:
                raise DeckException("The name can't be empty")

        if self.format is not None:
            self.format = self.format.strip()

            if not self.format:
                raise DeckException("The format can't be empty")

        return self
