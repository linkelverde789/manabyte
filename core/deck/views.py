# Create your views here.

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from deck.models import Deck, DeckCard
from deck.serializers import DeckCardResponseSerializer, DeckResponseSerializer


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


class DeckCardsView(ViewSet):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def list(self, request, deck_id=None):

        user = request.user
        deck = Deck.objects.filter(id=deck_id, user=user).first()
        cards = DeckCard.objects.filter(deck=deck)
        return Response(
            DeckCardResponseSerializer(
                cards, many=True, context={"request": request}
            ).data
        )

    def create(self, request, deck_id=None):
        user = request.user
        deck = Deck.objects.filter(id=deck_id, user=user).first()

        DeckCard.objects.create(
            scryfall_id=request.data["scryfall_id"],
            deck=deck,
            quantity=request.data["quantity"],
            zone=request.data["zone"],
        )
