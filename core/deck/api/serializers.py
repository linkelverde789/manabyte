from cards.api.serializers.card_serializer import ScryfallCardResponseSerializer
from django.db.models import Sum
from folder.api.serializers import FolderResponseSerializer
from rest_framework import serializers


class DeckResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    folder = FolderResponseSerializer()
    name = serializers.CharField()
    format = serializers.CharField()
    card_count = serializers.SerializerMethodField()

    def get_card_count(self, obj):
        return obj.cards.aggregate(total=Sum("quantity"))["total"] or 0


class DeckCardResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    card = ScryfallCardResponseSerializer()
    quantity = serializers.IntegerField()
    zone = serializers.CharField()
