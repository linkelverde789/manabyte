# Create your views here.

from rest_framework import status
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
        user = request.user

        deck = Deck.objects.create(
            name=request.data["name"], format=request.data["format"], user=user
        )

        return Response(DeckResponseSerializer(deck, context={"request": request}).data)

    def update(self, request):
        pass

    def destroy(self, request, pk):
        Deck.objects.filter(id=pk, user=request.user).first().delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class DeckCardsView(ViewSet):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def list(self, request, deck_id=None):

        user = request.user
        deck = Deck.objects.filter(id=deck_id, user=user).first()
        cards = DeckCard.objects.filter(deck=deck).order_by("id")
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

        cards = DeckCard.objects.filter(deck=deck).order_by("id")

        return Response(
            DeckCardResponseSerializer(
                cards, many=True, context={"request": request}
            ).data,
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, pk):
        pass

    def destroy(self, request, pk, deck_id=None):
        deck = Deck.objects.filter(user=request.user, id=deck_id).first()
        DeckCard.objects.filter(id=pk, deck=deck).first().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
