from cards.api.serializers.card_serializer import (
    ScryfallCardResponseSerializer,
)
from rest_framework import serializers


class ExtraImportSerializer(serializers.Serializer):
    foil = serializers.BooleanField()
    quantity = serializers.IntegerField(min_value=1)


class ImportSerializer(serializers.Serializer):
    cards = ScryfallCardResponseSerializer(many=True)
    extra = ExtraImportSerializer()
    warning = serializers.CharField(required=False)
