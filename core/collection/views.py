from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT
from rest_framework.viewsets import ViewSet

from collection.models import CollectionItem
from collection.serializers import CollectionItemResponseSerializer


class CollectionItemView(ViewSet):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def list(self, request):
        user = request.user

        params = request.query_params

        collection_items = CollectionItem.objects.filter(user=user).order_by("-id")

        if "folder_id" in params:
            collection_items = collection_items.filter(
                folder_id=params.get("folder_id")
            )

        return Response(
            CollectionItemResponseSerializer(
                collection_items, many=True, context={"request": request}
            ).data
        )

    def create(self, request):
        user = request.user
        data = request.data

        collection_item = CollectionItem.objects.create(
            user=user,
            scryfall_id=data["scryfall_id"],
            quantity=data["quantity"],
            foil=data["foil"],
            language=data["language"],
            condition=data["condition"],
        )

        return Response(
            CollectionItemResponseSerializer(
                collection_item, context={"request": request}
            ).data,
            status=HTTP_201_CREATED,
        )

    @action(detail=False, methods=["post"], url_path="bulk")
    def bulk_create(self, request):
        user = request.user
        data = request.data

        collection_items = [
            CollectionItem(
                user=user,
                scryfall_id=item["scryfall_id"],
                quantity=item["quantity"],
                foil=item["foil"],
                language=item["language"],
                condition=item["condition"],
            )
            for item in data
        ]

        result = CollectionItem.objects.bulk_create(collection_items)

        return Response(
            CollectionItemResponseSerializer(
                result, many=True, context={"request": request}
            ).data,
            status=HTTP_201_CREATED,
        )

    def partial_update(self, request, pk):
        user = request.user
        data = request.data

        collectionItem = CollectionItem.objects.filter(id=pk, user=user).first()

        if "scryfall_id" in data:
            collectionItem.scryfall_id = data["scryfall_id"]

        if "quantity" in data:
            collectionItem.quantity = data["quantity"]

        if "foil" in data:
            collectionItem.foil = data["foil"]

        if "language" in data:
            collectionItem.language = data["language"]

        if "condition" in data:
            collectionItem.condition = data["condition"]

        collectionItem.save()

        return Response(
            CollectionItemResponseSerializer(
                collectionItem, context={"request": request}
            ).data
        )

    def destroy(self, request, pk):
        CollectionItem.objects.filter(id=pk, user=request.user).first().delete()
        return Response(status=HTTP_204_NO_CONTENT)
