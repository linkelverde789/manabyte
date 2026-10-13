from cards.api.serializers.card_serializer import (
    ScryfallCardResponseSerializer,
    SearchCardQuerySerializer,
)
from cards.use_cases.list_prints import ListPrintsUseCase
from cards.use_cases.search_card import SearchCardUseCase
from rest_framework.response import Response
from rest_framework.views import APIView


class SearchCardViewSet(APIView):
    def get(self, request):
        query = SearchCardQuerySerializer(data=request.query_params)

        query.is_valid(raise_exception=True)

        cards = SearchCardUseCase().execute(**query.validated_data)

        return Response(
            ScryfallCardResponseSerializer(
                cards,
                many=True,
                context={"request": request},
            ).data
        )


class PrintingsCardViewSet(APIView):
    def get(self, request, oracle_id):

        prints = ListPrintsUseCase().execute(oracle_id=oracle_id)

        return Response(
            ScryfallCardResponseSerializer(
                prints,
                many=True,
                context={"request": request},
            ).data
        )
