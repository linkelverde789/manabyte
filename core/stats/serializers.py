from rest_framework import serializers


class CollectionItemStatsResponseSerializer(serializers.Serializer):
    unique_cards = serializers.IntegerField()
    total = serializers.IntegerField()


class UserStatsResponseSerializer(serializers.Serializer):
    decks = serializers.IntegerField()
    collection = CollectionItemStatsResponseSerializer()
