from rest_framework import serializers


class CollectionItemStatsResponseSerializer(serializers.Serializer):
    unique_cards = serializers.IntegerField()
    total = serializers.IntegerField()


class UserStatsResponseSerializer(serializers.Serializer):
    decks = serializers.IntegerField()
    collection = CollectionItemStatsResponseSerializer()


class FolderStatsResponseSerializer(serializers.Serializer):
    folder_name = serializers.CharField()
    entries = serializers.IntegerField()
    cards = serializers.IntegerField()
    price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )


class CollectionStatsResponseSerializer(serializers.Serializer):
    entries = serializers.IntegerField()
    cards = serializers.IntegerField()
    price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
