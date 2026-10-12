from cards.api.serializers.face_serializer import ScryfallFaceSerializer
from rest_framework import serializers
from sets.serializers import ScryfallSetSerializer


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
    keywords = serializers.JSONField()

    set = ScryfallSetSerializer()
    card_faces = ScryfallFaceSerializer(
        source="faces",
        many=True,
    )
