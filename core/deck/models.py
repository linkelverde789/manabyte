from django.db import models
from folder.models import Folder
from users.models import User


class Deck(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="decks",
    )

    folder = models.ForeignKey(
        Folder,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="decks",
    )

    name = models.CharField(max_length=100)
    format = models.CharField(max_length=20)


class DeckCard(models.Model):
    deck = models.ForeignKey(
        Deck,
        on_delete=models.CASCADE,
        related_name="cards",
    )

    scryfall_id = models.UUIDField()

    quantity = models.PositiveIntegerField(default=1)

    zone = models.CharField(
        max_length=20,
        choices=[
            ("mainboard", "Mainboard"),
            ("sideboard", "Sideboard"),
            ("commander", "Commander"),
            ("companion", "Companion"),
        ],
        default="mainboard",
    )
