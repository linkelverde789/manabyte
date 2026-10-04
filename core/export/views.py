from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from export.use_cases.export_collection import ExportCollectionUseCase
from export.use_cases.export_deck import ExportDeckUseCase
from export.use_cases.export_folder import ExportFolderUseCase


class ExportDeck(APIView):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def get(self, request, deck_id=None, format_type="csv"):
        user = request.user

        return ExportDeckUseCase().execute(
            deck_id=deck_id, format=format_type, user=user
        )


class ExportFolder(APIView):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def get(self, request, folder_id=None, format_type="csv"):
        user = request.user

        return ExportFolderUseCase().execute(
            user=user, format=format_type, folder_id=folder_id
        )


class ExportCollection(APIView):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def get(self, request, format_type="csv"):
        user = request.user

        return ExportCollectionUseCase().execute(user=user, format=format_type)
