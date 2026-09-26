import csv
from io import StringIO

from collection.models import CollectionItem
from deck.models import Deck, DeckCard
from django.http import HttpResponse
from folder.models import Folder
from openpyxl import Workbook

from export.utils.scryfall_api import ScryfallAPI


def export_deck_to_csv(deck: Deck):
    output = StringIO()
    writer = csv.writer(output)

    writer.writerow(
        [
            "Quantity",
            "Card Name",
            "Set",
            "Set code",
            "Collector Number",
        ]
    )

    cards = list(DeckCard.objects.filter(deck=deck).order_by("id"))

    scryfall_collection = ScryfallAPI.load_collection(cards=cards)

    for deck_card in cards:
        card_data = next(
            (
                c
                for c in scryfall_collection
                if c.get("id") == str(deck_card.scryfall_id)
            ),
            None,
        )
        if not card_data:
            continue

        writer.writerow(
            [
                deck_card.quantity,
                card_data.get("name"),
                card_data.get("set_name"),
                card_data.get("set"),
                card_data.get("collector_number"),
            ]
        )

    response = HttpResponse(output.getvalue(), content_type="text/csv")
    response["Content-Disposition"] = (
        f'attachment; filename="{deck.name.lower()}_deck.csv"'
    )
    return response


def export_deck_to_xlsx(deck: Deck):
    wb = Workbook()
    ws = wb.active
    ws.title = "Deck"

    ws.append(
        [
            "Quantity",
            "Card Name",
            "Set",
            "Set code",
            "Collector Number",
        ]
    )

    cards = list(DeckCard.objects.filter(deck=deck).order_by("id"))

    scryfall_collection = ScryfallAPI.load_collection(cards=cards)

    for deck_card in cards:
        card_data = next(
            (
                c
                for c in scryfall_collection
                if c.get("id") == str(deck_card.scryfall_id)
            ),
            None,
        )
        if not card_data:
            continue

        ws.append(
            [
                deck_card.quantity,
                card_data.get("name"),
                card_data.get("set_name"),
                card_data.get("set"),
                card_data.get("collector_number"),
            ]
        )

    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = (
        f'attachment; filename="{deck.name.lower()}_deck.xlsx"'
    )

    wb.save(response)
    return response


def export_folder_to_csv(folder: Folder):
    output = StringIO()
    writer = csv.writer(output)

    writer.writerow(
        [
            "Quantity",
            "Card Name",
            "Set",
            "Set code",
            "Collector Number",
            "foil",
        ]
    )

    cards = list(CollectionItem.objects.filter(folder=folder).order_by("id"))

    scryfall_collection = ScryfallAPI.load_collection(cards=cards)

    for deck_card in cards:
        card_data = next(
            (
                c
                for c in scryfall_collection
                if c.get("id") == str(deck_card.scryfall_id)
            ),
            None,
        )
        if not card_data:
            continue

        writer.writerow(
            [
                deck_card.quantity,
                card_data.get("name"),
                card_data.get("set_name"),
                card_data.get("set"),
                card_data.get("collector_number"),
                deck_card.foil,
            ]
        )

    response = HttpResponse(output.getvalue(), content_type="text/csv")
    response["Content-Disposition"] = (
        f'attachment; filename="{folder.name.lower()}_folder.csv"'
    )
    return response


def export_folder_to_xlsx(folder: Folder):
    wb = Workbook()
    ws = wb.active
    ws.title = "Folder"

    ws.append(
        [
            "Quantity",
            "Card Name",
            "Set",
            "Set code",
            "Collector Number",
            "foil",
        ]
    )

    cards = list(CollectionItem.objects.filter(folder=folder).order_by("id"))

    scryfall_collection = ScryfallAPI.load_collection(cards=cards)

    for card in cards:
        card_data = next(
            (c for c in scryfall_collection if c.get("id") == str(card.scryfall_id)),
            None,
        )
        if not card_data:
            continue

        ws.append(
            [
                card.quantity,
                card_data.get("name"),
                card_data.get("set_name"),
                card_data.get("set"),
                card_data.get("collector_number"),
                card.foil,
            ]
        )

    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = (
        f'attachment; filename="{folder.name.lower()}_folder.xlsx"'
    )

    wb.save(response)
    return response


def export_collection_to_csv(collection: CollectionItem):
    pass


def export_collection_to_xlsx(collection: CollectionItem):
    pass
