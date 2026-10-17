import math
import time

from cards.consts import SEARCH_LIMIT
from collection.api.serializers import (
    CollectionItemResponseSerializer,
    CollectionItemSerializer,
)
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
from collection.use_cases.update_collection_item import UpdateCollectionItemUseCase
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT
from rest_framework.viewsets import ViewSet


def _generate_paginated_response(items, limit: int, page: int):
    start = (page - 1) * limit
    end = start + limit
    response = items[start:end]

    total = (
        items.count()
        if hasattr(items, "count") and not isinstance(items, list)
        else len(items)
    )

    return {"data": response, "pages": math.ceil(total / limit), "count": items.count()}


class CollectionItemView(ViewSet):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def list(self, request):
        user = request.user
        params = request.query_params

        folder_id = params.get("folder_id")
        q = params.get("q")
        sorting = params.get("sorting")

        page = int(params.get("page", 1))
        limit = int(params.get("limit", SEARCH_LIMIT))

        if page < 1 or limit < 1:
            return Response(
                {"detail": "page and limit must be positive integers."},
                status=400,
            )

        if folder_id is not None:
            collection_items = ListCollectionItemFromFolderUseCase().execute(
                user=user,
                q=q,
                folder_id=int(folder_id),
                sorting=sorting,
            )
        else:
            collection_items = ListCollectionItemFromUserUseCase().execute(
                user=user,
                q=q,
                sorting=sorting,
            )

        data = _generate_paginated_response(
            items=collection_items, limit=limit, page=page
        )

        serializer = CollectionItemResponseSerializer(
            data,
            context={"request": request},
        )

        return Response(serializer.data)

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
            CollectionItemSerializer(
                collection_item, context={"request": request}
            ).data,
            status=HTTP_201_CREATED,
        )

    @action(detail=False, methods=["post"], url_path="bulk")
    def bulk_create(self, request):
        user = request.user
        data = request.data

        items = BulkCreateCollectionItemUseCase().execute(
            user=user,
            folder_id=data.get("folder_id", None),
            items=data["items"],
        )

        data = _generate_paginated_response(items=items, limit=60, page=1)

        return Response(
            CollectionItemResponseSerializer(data, context={"request": request}).data,
            status=HTTP_201_CREATED,
        )

    def partial_update(self, request, pk):
        user = request.user
        data = request.data

        collection_item = UpdateCollectionItemUseCase().execute(
            user=user, data=data, item_id=pk
        )

        return Response(
            CollectionItemSerializer(collection_item, context={"request": request}).data
        )

    def destroy(self, request, pk):
        DeleteCollectionItemUseCase().execute(user=request.user, item_id=pk)

        return Response(status=HTTP_204_NO_CONTENT)
