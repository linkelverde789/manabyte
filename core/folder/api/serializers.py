from collection.models import CollectionItem
from deck.models import Deck
from rest_framework import serializers


class FolderResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    type = serializers.CharField()
    card_count = serializers.SerializerMethodField()

    def get_card_count(self, obj):
        if obj.type == "Deck":
            return Deck.objects.filter(folder=obj).count()

        if obj.type == "Collection":
            return CollectionItem.objects.filter(folder=obj).count()
