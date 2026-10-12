from django.db import models


class ScryfallSet(models.Model):
    external_id = models.UUIDField(unique=True)
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
