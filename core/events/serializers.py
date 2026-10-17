from rest_framework import serializers


class EventResponseSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    type = serializers.CharField()
    aggregate_type = serializers.CharField()
    aggregate_id = serializers.CharField()
    created_at = serializers.DateTimeField()


class ProfileEventsResponseSerializer(serializers.Serializer):
    today = EventResponseSerializer(many=True)
    yesterday = EventResponseSerializer(many=True)
