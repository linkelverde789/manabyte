from rest_framework import serializers


class CollectionItemResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    scryfall_id = serializers.UUIDField()
    quantity = serializers.IntegerField()
    foil = serializers.BooleanField()
    language = serializers.CharField()
    condition = serializers.CharField()
