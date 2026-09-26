from collection.models import CollectionItem
from deck.models import Deck
from folder.models import Folder
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from export.actions import (
    export_collection_to_csv,
    export_collection_to_xlsx,
    export_deck_to_csv,
    export_deck_to_xlsx,
    export_folder_to_csv,
    export_folder_to_xlsx,
)


class ExportDeck(APIView):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def get(self, request, deck_id=None, format_type="csv"):
        user = request.user

        deck = Deck.objects.filter(id=deck_id, user=user).first()

        if format_type == "csv":
            return export_deck_to_csv(deck)
        else:
            return export_deck_to_xlsx(deck)


class ExportFolder(APIView):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def get(self, request, folder_id=None, format_type="csv"):
        user = request.user

        folder = Folder.objects.filter(id=folder_id, user=user).first()

        if format_type == "csv":
            return export_folder_to_csv(folder)
        else:
            return export_folder_to_xlsx(folder)


class ExportCollection(APIView):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def get(self, request, format_type="csv"):
        user = request.user

        collection_items = CollectionItem.object.filter(user=user)

        if format_type == "csv":
            return export_collection_to_csv(collection_items)
        else:
            return export_collection_to_xlsx(collection_items)
