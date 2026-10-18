from cards.api.serializers.card_serializer import ScryfallCardResponseSerializer
from rest_framework import serializers


class EventItemResponseSerializer(serializers.Serializer):
    card = ScryfallCardResponseSerializer()
    data_before = serializers.JSONField()
    data_after = serializers.JSONField()
    values_changed = serializers.JSONField()


class EventResponseSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    type = serializers.CharField()
    aggregate_type = serializers.CharField()
    aggregate_id = serializers.CharField()
    created_at = serializers.DateTimeField()
    items = EventItemResponseSerializer(many=True)


class ProfileEventsResponseSerializer(serializers.Serializer):
    today = EventResponseSerializer(many=True)
    yesterday = EventResponseSerializer(many=True)
