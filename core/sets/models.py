from django.db import models


class ScryfallSet(models.Model):
    external_id = models.UUIDField(unique=True)
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=255)
    card_count = models.IntegerField(default=1)
    icon_url = models.URLField(max_length=500, blank=True)

    def __str__(self):
        return self.name
