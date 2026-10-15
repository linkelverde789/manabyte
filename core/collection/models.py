from cards.models import ScryfallCard
from django.db import models
from django.utils import timezone
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

    card = models.ForeignKey(
        ScryfallCard, on_delete=models.PROTECT, null=True, blank=True
    )

    quantity = models.PositiveIntegerField(default=1)

    foil = models.BooleanField(default=False)
    language = models.CharField(max_length=10, default="en")
    condition = models.CharField(max_length=20, default="NM")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
