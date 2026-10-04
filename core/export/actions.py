import csv
from io import StringIO

from collection.models import CollectionItem
from collection.selectors.collection import CollectionSelector
from deck.models import Deck
from deck.selectors.deck_card import DeckCardSelector
from django.http import HttpResponse
from folder.models import Folder
from openpyxl import Workbook

from export.utils.scryfall_api import ScryfallAPI


def export_deck(deck: Deck, format_type: str = "csv"):
    cards = list(DeckCardSelector.list_cards_from_deck(deck=deck))
    data_list = get_card_data_list(cards)
    return export_to_file(data_list, f"{deck.name.lower()}_deck", format_type)


def export_folder(folder: Folder, format_type: str = "csv"):
    cards = list(CollectionSelector.list_collection_item_from_folder(folder=folder))
    data_list = get_card_data_list(cards)
    return export_to_file(data_list, f"{folder.name.lower()}_folder", format_type)


def export_collection(collection: CollectionItem, format_type: str = "csv"):
    data_list = get_card_data_list(list[collection])
    return export_to_file(data_list, "collection", format_type)


def get_card_data_list(cards):
    scryfall_collection = ScryfallAPI.load_collection(cards=cards)
    result = []

    for card in cards:
        card_data = next(
            (c for c in scryfall_collection if c.get("id") == str(card.scryfall_id)),
            None,
        )
        if not card_data:
            continue

        row = {
            "quantity": card.quantity,
            "name": card_data.get("name"),
            "set_name": card_data.get("set_name"),
            "set": card_data.get("set"),
            "collector_number": card_data.get("collector_number"),
            "foil": getattr(card, "foil", None),
        }
        result.append(row)

    return result


def export_to_file(data_list, filename, file_type):
    if file_type == "csv":
        return _export_to_csv(data_list, filename)
    elif file_type == "xlsx":
        return _export_to_xlsx(data_list, filename)
    else:
        raise ValueError("Unsupported file type")


def _export_to_csv(data_list, filename):
    output = StringIO()
    writer = csv.writer(output)

    writer.writerow(
        ["Quantity", "Card Name", "Set", "Set code", "Collector Number", "foil"]
    )

    for row in data_list:
        writer.writerow(
            [
                row["quantity"],
                row["name"],
                row["set_name"],
                row["set"],
                row["collector_number"],
                row.get("foil", ""),
            ]
        )

    response = HttpResponse(output.getvalue(), content_type="text/csv")
    response["Content-Disposition"] = f'attachment; filename="{filename}.csv"'
    return response


def _export_to_xlsx(data_list, filename):
    wb = Workbook()
    ws = wb.active
    ws.title = "Deck"

    ws.append(["Quantity", "Card Name", "Set", "Set code", "Collector Number", "foil"])

    for row in data_list:
        ws.append(
            [
                row["quantity"],
                row["name"],
                row["set_name"],
                row["set"],
                row["collector_number"],
                row.get("foil", ""),
            ]
        )

    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = f'attachment; filename="{filename}.xlsx"'

    wb.save(response)
    return response
