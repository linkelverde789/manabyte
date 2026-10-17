import uuid

from cards.models import ScryfallCard
from django.conf import settings
from django.db import models

from events.consts import AGGREGATE_TYPE_CHOICES, CHOICES


class Event(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="events",
    )

    type = models.CharField(
        max_length=50,
        choices=CHOICES,
    )

    aggregate_type = models.CharField(max_length=100, choices=AGGREGATE_TYPE_CHOICES)
    aggregate_id = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "-id"]  # noqa: RUF012
        indexes = [  # noqa: RUF012
            models.Index(
                fields=[
                    "aggregate_type",
                    "aggregate_id",
                    "-created_at",
                ],
            ),
            models.Index(fields=["user", "-created_at"]),
        ]


class EventItem(models.Model):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="items",
    )

    card = models.ForeignKey(
        ScryfallCard,
        on_delete=models.PROTECT,
        related_name="event_items",
    )

    data_before = models.JSONField(default=dict)
    data_after = models.JSONField(default=dict)
    values_changed = models.JSONField(default=dict)

    class Meta:
        indexes = [  # noqa: RUF012
            models.Index(fields=["event", "card"]),
        ]
