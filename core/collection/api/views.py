from collection.api.serializers import CollectionItemResponseSerializer
from collection.models import CollectionItem
from collection.use_cases.bulk_create_collection_item import (
    BulkCreateCollectionItemUseCase,
)
from collection.use_cases.create_collection_item import CreateCollectionItemUseCase
from collection.use_cases.delete_collection_item import DeleteCollectionItemUseCase
from collection.use_cases.list_collection_item_from_folder import (
    ListCollectionItemFromFolderUseCase,
)
from collection.use_cases.list_collection_item_from_user import (
    ListCollectionItemFromUserUseCase,
)
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT
from rest_framework.viewsets import ViewSet


class CollectionItemView(ViewSet):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    @action(detail=False, methods=["get"], url_path="set")
    def set(self, request):

        scryfall_ids = request.query_params.get("scryfall_ids", "").split(",")

        collection_items = CollectionItem.objects.filter(
            user=request.user, scryfall_id__in=scryfall_ids
        )

        return Response(
            CollectionItemResponseSerializer(
                collection_items, many=True, context={"request": request}
            ).data
        )

    def list(self, request):
        user = request.user

        params = request.query_params

        collection_items = None

        if "folder_id" in params:
            collection_items = ListCollectionItemFromFolderUseCase().execute(
                user=user, folder_id=params["folder_id"]
            )
        else:
            collection_items = ListCollectionItemFromUserUseCase().execute(user=user)

        return Response(
            CollectionItemResponseSerializer(
                collection_items, many=True, context={"request": request}
            ).data
        )

    def create(self, request):
        user = request.user
        data = request.data

        collection_item = CreateCollectionItemUseCase().execute(
            user=user,
            scryfall_id=data["scryfall_id"],
            quantity=data["quantity"],
            foil=data["foil"],
            language=data["language"],
            condition=data["condition"],
            folder_id=data.get("folder_id", None),
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

        result = BulkCreateCollectionItemUseCase().execute(
            user=user, folder_id=data["folder_id"], items=data["items"]
        )

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
        DeleteCollectionItemUseCase().execute(user=request.user, item_id=pk)

        return Response(status=HTTP_204_NO_CONTENT)
