from collection.models import CollectionItem
from deck.models import Deck
from folder.consts import FOLDER_TYPE_COLLECTION, FOLDER_TYPE_DECK
from rest_framework import serializers


class FolderResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    type = serializers.CharField()
    card_count = serializers.SerializerMethodField()

    def get_card_count(self, obj):
        if obj.type == FOLDER_TYPE_DECK:
            return Deck.objects.filter(folder=obj).count()

        if obj.type == FOLDER_TYPE_COLLECTION:
            return CollectionItem.objects.filter(folder=obj).count()
