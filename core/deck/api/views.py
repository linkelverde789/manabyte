# Create your views here.


from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from deck.api.serializers import DeckCardResponseSerializer, DeckResponseSerializer
from deck.models import Deck, DeckCard
from deck.use_cases.deck.create_deck import CreateDeckUseCase
from deck.use_cases.deck.delete_deck import DeleteDeckUseCase
from deck.use_cases.deck.get_deck_for_user import GetDeckForUserUseCase
from deck.use_cases.deck.list_decks_by_user import ListDecksByUserUseCase
from deck.use_cases.deck_card.bulk_create_deck_card import (
    BulkCreateDeckCardUseCase,
)
from deck.use_cases.deck_card.create_deck_card import CreateDeckCardUseCase
from deck.use_cases.deck_card.delete_deck_card import DeleteDeckCardUseCase
from deck.use_cases.deck_card.list_cards_from_deck import ListCardsFromDeckUseCase
from deck.use_cases.deck_card.update_deck_card import UpdateDeckCardUseCase


class UserDeckView(ViewSet):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def list(self, request):
        user = request.user

        decks = ListDecksByUserUseCase().execute(user=user)

        return Response(
            DeckResponseSerializer(decks, many=True, context={"request": request}).data
        )

    def retrieve(self, request, pk):
        user = request.user

        deck = GetDeckForUserUseCase().execute(deck_id=pk, user=user)

        return Response(DeckResponseSerializer(deck, context={"request": request}).data)

    def create(self, request):
        user = request.user
        data = request.data

        deck = CreateDeckUseCase.execute(
            name=data["name"],
            format=data["format"],
            user=user,
            folder_id=data.get("folder_id", None),
        )

        return Response(DeckResponseSerializer(deck, context={"request": request}).data)

    def update(self, request):
        pass

    def destroy(self, request, pk):
        DeleteDeckUseCase().execute(deck_id=pk, user=request.user)

        return Response(status=status.HTTP_204_NO_CONTENT)


class DeckCardsView(ViewSet):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def list(self, request, deck_id=None):

        user = request.user

        deck = GetDeckForUserUseCase().execute(deck_id=deck_id, user=user)

        cards = ListCardsFromDeckUseCase().execute(deck=deck)

        return Response(
            DeckCardResponseSerializer(
                cards, many=True, context={"request": request}
            ).data
        )

    def create(self, request, deck_id=None):
        user = request.user
        data = request.data

        deck = GetDeckForUserUseCase().execute(user=user, deck_id=deck_id)

        cards = CreateDeckCardUseCase().execute(
            scryfall_id=data["scryfall_id"],
            zone=data.get("zone", "mainboard"),
            deck=deck,
            quantity=int(data["quantity"]),
        )

        return Response(
            DeckCardResponseSerializer(
                cards, many=True, context={"request": request}
            ).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"], url_path="bulk-create")
    def bulk_create(self, request, deck_id=None):
        user = request.user

        cards_data = request.data

        cards = BulkCreateDeckCardUseCase().execute(
            deck_id=deck_id, user=user, data=cards_data
        )

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
        user = request.user
        data = request.data

        deck = GetDeckForUserUseCase().execute(user=user, deck_id=deck_id)

        card = UpdateDeckCardUseCase().execute(
            card_id=pk,
            deck=deck,
            scryfall_id=data.get("scryfall_id", None),
            quantity=data.get("quantity", None),
            zone=data.get("zone", None),
        )

        return Response(
            DeckCardResponseSerializer(card, context={"request": request}).data
        )

    def destroy(self, request, pk, deck_id=None):
        user = request.user

        deck = GetDeckForUserUseCase().execute(deck_id=deck_id, user=user)
        DeleteDeckCardUseCase().execute(deck=deck, card_id=pk)

        return Response(status=status.HTTP_204_NO_CONTENT)
