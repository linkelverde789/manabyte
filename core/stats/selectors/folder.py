from collection.selectors.collection import CollectionSelector
from deck.selectors.deck import DeckSelector
from django.db.models import Case, DecimalField, F, IntegerField, Sum, Value, When
from django.db.models.base import Coalesce
from folder.models import Folder
from users.models import User


class StatsSelector:
    @staticmethod
    def get_folder_stats(folder: Folder):
        items = CollectionSelector.list_collection_item_from_folder(folder=folder)

        items = items.annotate(
            final_price=Case(
                When(foil=True, then=F("card__price_foil")),
                default=F("card__price_nonfoil"),
                output_field=DecimalField(
                    max_digits=12,
                    decimal_places=2,
                ),
            ),
        )

        stats = items.aggregate(
            price=Coalesce(
                Sum(F("final_price") * F("quantity")),
                Value(0),
                output_field=DecimalField(
                    max_digits=12,
                    decimal_places=2,
                ),
            ),
            cards=Coalesce(Sum(F("quantity")), Value(0), output_field=IntegerField()),
        )

        return {
            "folder_name": folder.name,
            "entries": items.values("card__external_id").distinct().count(),
            "cards": stats["cards"],
            "price": stats["price"],
        }

    @staticmethod
    def get_user_stats(user: User):
        deck_count = DeckSelector.list_decks_by_user(user).count()
        items = CollectionSelector.list_collection_item_from_user(user)

        return {
            "decks": deck_count,
            "collection": {
                "unique_cards": items.distinct("card__external_id").count(),
                "total": items.aggregate(total=Sum("quantity"))["total"] or 0,
            },
        }
