from dataclasses import dataclass

from folder.exceptions import FolderException
from users.models import User


@dataclass
class CreateFolderInput:
    name: str
    user: User
    type: str

    def validate(self) -> "CreateFolderInput":
        self.name = self.name.strip()
        self.type = self.type.strip()

        if not self.name:
            raise FolderException("Name can't be empty", "401")

        if not self.type:
            raise FolderException("Type can't be empty", "401")

        if self.type != "deck" and self.type != "collection":
            raise FolderException("Type must be deck or collection", "401")

        return self
