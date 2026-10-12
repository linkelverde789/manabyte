from rest_framework import serializers


class ScryfallFaceSerializer(serializers.Serializer):
    face_index = serializers.IntegerField()
    name = serializers.CharField()
    mana_cost = serializers.CharField()
    type_line = serializers.CharField()
    oracle_text = serializers.CharField()
    image_url = serializers.CharField()
    colors = serializers.JSONField()
