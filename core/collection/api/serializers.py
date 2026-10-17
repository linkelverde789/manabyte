from cards.api.serializers.card_serializer import ScryfallCardResponseSerializer
from rest_framework import serializers


class CollectionItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    card = ScryfallCardResponseSerializer()
    quantity = serializers.IntegerField()
    foil = serializers.BooleanField()
    language = serializers.CharField()
    condition = serializers.CharField()


class CollectionItemResponseSerializer(serializers.Serializer):
    data = CollectionItemSerializer(many=True)
    pages = serializers.IntegerField()
    count = serializers.IntegerField()
