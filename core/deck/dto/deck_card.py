from dataclasses import dataclass

from deck.exceptions import DeckCardException
from deck.models import Deck


@dataclass
class CreateDeckCardInput:
    deck: Deck
    scryfall_id: str
    quantity: int = 1
    zone: str = "mainboard"

    def validate(self) -> "CreateDeckCardInput":
        self.scryfall_id = self.scryfall_id.strip()
        self.zone = self.zone.strip()

        if not self.scryfall_id:
            raise DeckCardException("Scryfall ID can't be empty")

        if self.quantity < 1:
            raise DeckCardException("Quantity should be higher than 1")

        if not self.zone:
            raise DeckCardException("Zone can't be empty")

        return self


@dataclass
class UpdateDeckCardInput:
    deck: Deck | None = None
    scryfall_id: str | None = None
    quantity: int | None = 1
    zone: str | None = None

    def validate(self) -> "UpdateDeckCardInput":
        if self.scryfall_id is not None:
            self.scryfall_id = self.scryfall_id.strip()

            if not self.scryfall_id:
                raise DeckCardException("Scryfall ID can't be empty")

        if self.quantity is not None and self.quantity < 1:
            raise DeckCardException("Quantity should be higher than 1")

        if self.zone is not None:
            self.zone = self.zone.strip()
            if not self.zone:
                raise DeckCardException("Zone can't be empty")

        return self
