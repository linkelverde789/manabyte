from cards.api.serializers.card_serializer import ScryfallCardResponseSerializer
from rest_framework import serializers


class CollectionItemResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    card = ScryfallCardResponseSerializer()
    quantity = serializers.IntegerField()
    foil = serializers.BooleanField()
    language = serializers.CharField()
    condition = serializers.CharField()
