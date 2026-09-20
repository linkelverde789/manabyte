# Create your views here.

from rest_framework import status
from rest_framework.decorators import action
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
        data = request.data
        deck = Deck.objects.create(
            name=data["name"],
            format=data["format"],
            user=user,
            folder_id=data.get("folder_id", None),
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

        data = request.data

        print(data)

        DeckCard.objects.create(
            scryfall_id=data["scryfall_id"],
            deck=deck,
            quantity=data["quantity"],
            zone=data.get("zone", "mainboard"),
            folder_id=data.get("folder_id", None),
        )

        cards = DeckCard.objects.filter(deck=deck).order_by("id")

        return Response(
            DeckCardResponseSerializer(
                cards, many=True, context={"request": request}
            ).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"], url_path="bulk-create")
    def bulk_create(self, request, deck_id=None):
        user = request.user

        deck = Deck.objects.filter(user=user, id=deck_id).first()

        cards_data = request.data

        cards = [
            DeckCard(
                scryfall_id=card["scryfall_id"],
                deck=deck,
                quantity=card["quantity"],
                zone=card.get("zone", "mainboard"),
            )
            for card in cards_data
        ]
        DeckCard.objects.bulk_create(cards)

        cards = DeckCard.objects.filter(deck=deck).order_by("id")

        return Response(
            DeckCardResponseSerializer(
                cards,
                many=True,
                context={"request": request},
            ).data,
            status=status.HTTP_201_CREATED,
        )

    # def update(self, request, pk, deck_id=None):
    #    pass

    def partial_update(self, request, pk, deck_id=None):
        deck = Deck.objects.filter(user=request.user, id=deck_id).first()
        data = request.data

        card = DeckCard.objects.filter(deck=deck, id=pk).first()

        if "quantity" in data:
            card.quantity = data["quantity"]

        if "scryfall_id" in data:
            card.scryfall_id = data["scryfall_id"]

        card.save()

        return Response(
            DeckCardResponseSerializer(card, context={"request": request}).data
        )

    def destroy(self, request, pk, deck_id=None):
        deck = Deck.objects.filter(user=request.user, id=deck_id).first()
        DeckCard.objects.filter(id=pk, deck=deck).first().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
