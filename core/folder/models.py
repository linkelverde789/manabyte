from django.db import models
from users.models import User


class Folder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    type = models.CharField(
        max_length=20,
        choices=[
            ("deck", "Deck"),
            ("collection", "Collection"),
        ],
        default="deck",
    )
