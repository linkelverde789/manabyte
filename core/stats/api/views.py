from collection.models import CollectionItem
from deck.models import Deck
from django.db.models import Sum
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from stats.api.serializers import (
    FolderStatsResponseSerializer,
    UserStatsResponseSerializer,
)
from stats.use_cases.folder_stats import FolderStatsUseCase
from stats.use_cases.user_stats import UserStatsUseCase


class UserStatsView(APIView):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def get(self, request):
        user = request.user
        data = UserStatsUseCase().execute(user=user)

        return Response(
            UserStatsResponseSerializer(data, context={"request": request}).data
        )


class FolderStatsView(APIView):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def get(self, request, folder_id):

        data = FolderStatsUseCase().execute(user=request.user, folder_id=folder_id)

        return Response(
            FolderStatsResponseSerializer(data, context={"request": request}).data
        )
