from rest_framework import serializers


class ScryfallSetSerializer(serializers.Serializer):
    name = serializers.CharField()
    code = serializers.CharField()
    external_id = serializers.UUIDField()
