from cards.api.serializers.card_serializer import ScryfallCardResponseSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from sets.api.serializers import AlbumCardSerializer, ScryfallSetSerializer
from sets.use_cases.list_card_for_album import ListCardForAlbumUseCase
from sets.use_cases.list_cards_from_set import ListCardsFromSetUseCase
from sets.use_cases.list_sets import ListSetsUseCase


class ListSetsViewSet(APIView):
    def get(self, request):

        sets = ListSetsUseCase().execute()

        return Response(
            ScryfallSetSerializer(
                sets,
                many=True,
                context={"request": request},
            ).data
        )


class ListCardFromSetViewSet(APIView):
    def get(self, request, set_code):

        cards = ListCardsFromSetUseCase().execute(set_code=set_code)

        return Response(
            ScryfallCardResponseSerializer(
                cards,
                many=True,
                context={"request": request},
            ).data
        )


class ListAlbumViewSet(APIView):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def get(self, request, set_code):

        cards = ListCardForAlbumUseCase().execute(user=request.user, set_code=set_code)

        return Response(
            AlbumCardSerializer(
                cards,
                many=True,
                context={"request": request},
            ).data
        )
