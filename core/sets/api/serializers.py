from cards.api.serializers.face_serializer import ScryfallFaceSerializer
from rest_framework import serializers


class ScryfallSetSerializer(serializers.Serializer):
    name = serializers.CharField()
    code = serializers.CharField()
    icon_url = serializers.CharField()
    external_id = serializers.UUIDField()


class AlbumCardSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(read_only=True)
    foil = serializers.BooleanField(read_only=True)
    condition = serializers.CharField(read_only=True)

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
