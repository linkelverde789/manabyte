from cards.models import ScryfallCard
from cards.serializers import ScryfallCardResponseSerializer
from cards.utils.utils import collector_number_sort_key
from rest_framework.response import Response
from rest_framework.views import APIView

from sets.models import ScryfallSet
from sets.serializers import ScryfallSetSerializer


class ListSetsViewSet(APIView):
    def get(self, request):

        sets = ScryfallSet.objects.all().order_by("name")

        return Response(
            ScryfallSetSerializer(
                sets,
                many=True,
                context={"request": request},
            ).data
        )


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
