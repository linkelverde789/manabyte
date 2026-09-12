# Create your views here.

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from deck.models import Deck
from deck.serializers import DeckResponseSerializer


class UserDeckView(ViewSet):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def list(self, request):
        user = request.user

        decks = Deck.objects.filter(user=user).order_by("id")

        return Response(
            DeckResponseSerializer(decks, many=True, context={"request": request}).data
        )

    def retrieve(self, request, pk):
        user = request.user

        deck = Deck.objects.filter(id=pk, user=user).first()

        return Response(DeckResponseSerializer(deck, context={"request": request}).data)

    def create(self, request):
        pass
