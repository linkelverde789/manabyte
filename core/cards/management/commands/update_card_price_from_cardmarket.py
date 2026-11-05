from decimal import Decimal, InvalidOperation

from cardmarket.api import CardMarket
from cards.models import ScryfallCard
from django.core.management.base import BaseCommand


def _decimal_price(value):
    if value in (None, ""):
        return Decimal("0.00")

    try:
        return Decimal(str(value))
    except (InvalidOperation, ValueError):
        return Decimal("0.00")


class Command(BaseCommand):
    help = "Import bulk_data from Scryfall"

    def handle(self, *args, **options):

        price_guide = CardMarket.download_price_guide()

        cards = ScryfallCard.objects.exclude(cardmarket_id__isnull=True).iterator(
            chunk_size=2000
        )

        updated = []

        for card in cards:
            market_data = price_guide.get(str(card.cardmarket_id))

            if market_data is None:
                continue

            card.price_foil = _decimal_price(market_data.get("avg30-foil"))
            card.price_nonfoil = _decimal_price(market_data.get("avg30"))

            updated.append(card)

            if len(updated) >= 2000:
                ScryfallCard.objects.bulk_update(
                    updated,
                    ["price_foil", "price_nonfoil"],
                    batch_size=2000,
                )
                updated.clear()

        if updated:
            ScryfallCard.objects.bulk_update(
                updated,
                ["price_foil", "price_nonfoil"],
                batch_size=2000,
            )
