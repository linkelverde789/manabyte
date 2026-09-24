from collection.models import CollectionItem
from deck.models import Deck
from django.db.models import Sum
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from stats.serializers import UserStatsResponseSerializer


class UserStatsView(APIView):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def get(self, request):
        user = request.user
        decks = Deck.objects.filter(user=user).count()
        collection_items = CollectionItem.objects.filter(user=user)

        data = {
            "decks": decks,
            "collection": {
                "unique_cards": collection_items.distinct("scryfall_id").count(),
                "total": collection_items.aggregate(total=Sum("quantity"))["total"]
                or 0,
            },
        }

        return Response(
            UserStatsResponseSerializer(data, context={"request": request}).data
        )
