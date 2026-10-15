from collection.models import CollectionItem
from deck.models import Deck
from django.db.models import Case, DecimalField, F, Sum, Value, When
from django.db.models.base import Coalesce
from folder.models import Folder
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from stats.serializers import FolderStatsResponseSerializer, UserStatsResponseSerializer


class UserStatsView(APIView):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def get(self, request):
        user = request.user
        decks = Deck.objects.filter(user=user).count()
        collection_items = CollectionItem.objects.filter(user=user)

        data = {
            "decks": decks,
            "collection": {
                "unique_cards": collection_items.distinct("card__external_id").count(),
                "total": collection_items.aggregate(total=Sum("quantity"))["total"]
                or 0,
            },
        }

        return Response(
            UserStatsResponseSerializer(data, context={"request": request}).data
        )


class FolderStatsView(APIView):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def get(self, request, folder_id):
        folder = Folder.objects.filter(
            user=request.user,
            id=folder_id,
        ).first()

        if folder is None:
            return Response(
                {"detail": "Folder not found"},
                status=404,
            )

        collection_items = CollectionItem.objects.filter(folder=folder)

        collection_items = collection_items.annotate(
            final_price=Case(
                When(foil=True, then=F("card__price_foil")),
                default=F("card__price_nonfoil"),
                output_field=DecimalField(
                    max_digits=12,
                    decimal_places=2,
                ),
            ),
        )

        stats = collection_items.aggregate(
            price=Coalesce(
                Sum(F("final_price") * F("quantity")),
                Value(0),
                output_field=DecimalField(
                    max_digits=12,
                    decimal_places=2,
                ),
            ),
        )

        data = {
            "folder_name": folder.name,
            "entries": collection_items.values("card__external_id").distinct().count(),
            "cards": collection_items.count(),
            "price": stats["price"],
        }

        return Response(
            FolderStatsResponseSerializer(data, context={"request": request}).data
        )
