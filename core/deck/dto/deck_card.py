from dataclasses import dataclass

from cards.models import ScryfallCard
from deck.exceptions import DeckCardException
from deck.models import Deck


@dataclass
class CreateDeckCardInput:
    deck: Deck
    card: ScryfallCard
    quantity: int = 1
    zone: str = "mainboard"

    def validate(self) -> "CreateDeckCardInput":
        self.zone = self.zone.strip()

        if self.quantity < 1:
            raise DeckCardException("Quantity should be higher or equal than 1", "400")

        if not self.zone:
            raise DeckCardException("Zone can't be empty", "400")

        return self


@dataclass
class UpdateDeckCardInput:
    deck: Deck | None = None
    card: ScryfallCard | None = None
    quantity: int | None = 1
    zone: str | None = None

    def validate(self) -> "UpdateDeckCardInput":
        if self.quantity is not None and self.quantity < 1:
            raise DeckCardException("Quantity should be higher or equal than 1", "400")

        if self.zone is not None:
            self.zone = self.zone.strip()
            if not self.zone:
                raise DeckCardException("Zone can't be empty", "400")

        return self
