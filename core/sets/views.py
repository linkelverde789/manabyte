from cards.models import ScryfallCard
from cards.serializers import ScryfallCardResponseSerializer
from cards.utils.utils import collector_number_sort_key
from rest_framework.response import Response
from rest_framework.views import APIView


class ListCardFromSetViewSet(APIView):
    def get(self, request, set_code):

        cards = list(
            ScryfallCard.objects.filter(set__code=set_code).prefetch_related("faces")
        )

        cards.sort(key=collector_number_sort_key)

        return Response(
            ScryfallCardResponseSerializer(
                cards,
                many=True,
                context={"request": request},
            ).data
        )


class ListSetsViewSet(APIView):
    pass
