from cards.models import ScryfallCard
from cards.utils.utils import collector_number_sort_key
from collection.models import CollectionItem
from django.contrib.postgres.aggregates import BoolOr
from django.db.models import (
    BooleanField,
    CharField,
    IntegerField,
    OuterRef,
    Subquery,
    Sum,
    Value,
)
from django.db.models.functions import Coalesce
from sets.models import ScryfallSet
from users.models import User


class SetSelector:
    @staticmethod
    def list_sets():
        return ScryfallSet.objects.all().order_by("name")

    @staticmethod
    def list_cards_from_set(set_code: str):
        cards = list(
            ScryfallCard.objects.filter(set__code=set_code).prefetch_related("faces")
        )

        cards.sort(key=collector_number_sort_key)

        return cards

    @staticmethod
    def list_cards_for_album(set_code: str, user: User):
        collection = (
            CollectionItem.objects.filter(
                user=user,
                scryfall_id=OuterRef("external_id"),
            )
            .values("scryfall_id")
            .annotate(
                total_quantity=Sum("quantity"),
                has_foil=BoolOr("foil"),
            )
        )

        cards = list(
            ScryfallCard.objects.filter(set__code=set_code)
            .annotate(
                quantity=Coalesce(
                    Subquery(collection.values("total_quantity")[:1]),
                    Value(0),
                    output_field=IntegerField(),
                ),
                foil=Coalesce(
                    Subquery(collection.values("has_foil")[:1]),
                    Value(False),
                    output_field=BooleanField(),
                ),
                condition=Coalesce(
                    Subquery(collection.values("condition")[:1]),
                    Value("NM"),
                    output_file=CharField(),
                ),
            )
            .order_by("collector_number")
        )

        cards.sort(key=collector_number_sort_key)

        return cards
