from django.db import models


class ScryfallSet(models.Model):
    external_id = models.UUIDField(unique=True)
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class ScryfallCard(models.Model):
    external_id = models.UUIDField(unique=True)
    oracle_id = models.UUIDField(db_index=True)

    name = models.CharField(max_length=255)

    set = models.ForeignKey(
        ScryfallSet,
        on_delete=models.PROTECT,
        related_name="cards",
    )

    collector_number = models.CharField(max_length=50, blank=True)
    lang = models.CharField(max_length=10, default="en")

    can_nonfoil = models.BooleanField(default=True)
    can_foil = models.BooleanField(default=True)

    price_nonfoil = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )
    price_foil = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    keywords = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.name


class ScryfallCardFace(models.Model):
    card = models.ForeignKey(
        ScryfallCard,
        on_delete=models.CASCADE,
        related_name="faces",
    )

    face_index = models.PositiveSmallIntegerField()

    name = models.CharField(max_length=255)
    mana_cost = models.CharField(max_length=100, blank=True)
    type_line = models.CharField(max_length=255, blank=True)
    oracle_text = models.TextField(blank=True)
    image_url = models.URLField(max_length=500, blank=True)

    colors = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ["face_index"]
        constraints = [
            models.UniqueConstraint(
                fields=["card", "face_index"],
                name="unique_card_face_index",
            ),
        ]

    def __str__(self):
        return f"{self.card.name} - {self.name}"
