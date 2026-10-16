from cards.api.serializers.face_serializer import ScryfallFaceSerializer
from cards.consts import SEARCH_LIMIT
from rest_framework import serializers
from sets.api.serializers import ScryfallSetSerializer


class ScryfallCardResponseSerializer(serializers.Serializer):
    external_id = serializers.UUIDField()
    oracle_id = serializers.UUIDField()
    name = serializers.CharField()
    collector_number = serializers.CharField()
    lang = serializers.CharField()
    can_nonfoil = serializers.BooleanField()
    can_foil = serializers.BooleanField()
    price_nonfoil = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    price_foil = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    layout = serializers.CharField()
    rarity = serializers.CharField()
    keywords = serializers.JSONField()

    set = ScryfallSetSerializer()
    card_faces = ScryfallFaceSerializer(
        source="faces",
        many=True,
    )


class SearchCardQuerySerializer(serializers.Serializer):
    q = serializers.CharField(required=False, default="", trim_whitespace=True)
    page = serializers.IntegerField(required=False, default=1, min_value=1)
    limit = serializers.IntegerField(
        required=False,
        default=SEARCH_LIMIT,
        min_value=1,
        max_value=100,
    )
