from folder.serializers import FolderResponseSerializer
from rest_framework import serializers


class DeckResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    folder = FolderResponseSerializer()
    name = serializers.CharField()
    format = serializers.CharField()
