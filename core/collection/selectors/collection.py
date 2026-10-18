from cards.models import ScryfallCard
from cards.utils.utils import filter_cards_from_query
from collection.consts import SORTING_OPTIONS
from collection.dto.collection import FilterCollectionParams
from collection.models import CollectionItem
from deck.services.deck_card import pruebas
from django.db.models import Case, DecimalField, F, When
from folder.models import Folder
from users.models import User


def _apply_filters(items, filters: FilterCollectionParams):
    if filters.q is not None:
        cards = ScryfallCard.objects.filter(id__in=items.values("card_id"))
        filtered_cards = filter_cards_from_query(q=filters.q, cards=cards)
        items = items.filter(card__in=filtered_cards)

    if filters.sorting is not None:
        sorting = filters.sorting

        if sorting == "price":
            items = items.annotate(
                price=Case(
                    When(foil=True, then=F("card__price_foil")),
                    default=F("card__price_nonfoil"),
                    output_field=DecimalField(max_digits=12, decimal_places=2),
                )
            )

        items = items.order_by(SORTING_OPTIONS[sorting])

    return items


class CollectionSelector:
    @staticmethod
    def get_collection_item_from_id(item_id: int) -> CollectionItem | None:
        return CollectionItem.objects.filter(id=item_id).first()

    @staticmethod
    def get_collection_item_from_user(
        item_id: int, user: User
    ) -> CollectionItem | None:
        return CollectionItem.objects.filter(user=user, id=item_id).first()

    @staticmethod
    def list_collection_item_from_user(
        user: User, filters: FilterCollectionParams | None = None
    ):
        items = CollectionItem.objects.filter(user=user).select_related(
            "card", "card__set"
        )
        if filters:
            items = _apply_filters(items=items, filters=filters)

        return items

    @staticmethod
    def list_collection_item():
        return CollectionItem.objects.all().order_by("-id")

    @staticmethod
    def list_collection_item_from_folder(
        folder: Folder, filters: FilterCollectionParams | None = None
    ):
        items = CollectionItem.objects.filter(folder=folder).select_related(
            "card", "card__set"
        )
        pruebas(items)

        if filters:
            items = _apply_filters(items=items, filters=filters)

        return items
