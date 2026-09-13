from rest_framework import serializers


class FolderResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
