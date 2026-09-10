from django.db import models
from folder.models import Folder
from users.models import User


class CollectionItem(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="collection_items",
    )

    folder = models.ForeignKey(
        Folder,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="items",
    )

    scryfall_id = models.UUIDField()

    quantity = models.PositiveIntegerField(default=1)

    foil = models.BooleanField(default=False)
    language = models.CharField(max_length=10, default="en")
    condition = models.CharField(max_length=20, default="NM")
