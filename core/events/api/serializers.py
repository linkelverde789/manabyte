from cards.api.serializers.card_serializer import ScryfallCardResponseSerializer
from deck.api.serializers import DeckResponseSerializer
from deck.selectors.deck import DeckSelector
from events.consts import COLLECTION_TYPE_EVENT, DECK_TYPE_EVENT
from folder.api.serializers import FolderResponseSerializer
from folder.selectors.folder import FolderSelector
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
    aggregate_id = serializers.CharField(allow_null=True)
    created_at = serializers.DateTimeField()
    items = EventItemResponseSerializer(many=True)
    aggregate_obj = serializers.SerializerMethodField()

    def get_aggregate_obj(self, obj):
        if obj.aggregate_id is None:
            return None

        if obj.aggregate_type == COLLECTION_TYPE_EVENT:
            folder = FolderSelector.get_folder_by_id(int(obj.aggregate_id))
            return FolderResponseSerializer(folder).data

        if obj.aggregate_type == DECK_TYPE_EVENT:
            deck = DeckSelector.get_deck_by_id(int(obj.aggregate_id))
            return DeckResponseSerializer(deck).data

        return None


class ProfileEventsResponseSerializer(serializers.Serializer):
    today = EventResponseSerializer(many=True)
    yesterday = EventResponseSerializer(many=True)
