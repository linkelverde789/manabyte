import csv
from io import StringIO

from cards.utils.utils import collector_number_sort_key
from collection.selectors.collection import CollectionSelector
from deck.models import Deck
from deck.selectors.deck_card import DeckCardSelector
from django.http import HttpResponse
from folder.models import Folder
from openpyxl import Workbook


def export_deck(deck: Deck, format_type: str = "csv"):
    deck_cards = DeckCardSelector.list_cards_from_deck(deck)
    deck_cards = [item for item in deck_cards if item.card is not None]
    deck_cards.sort(
        key=lambda item: (
            item.card.set.code.lower(),
            collector_number_sort_key(item.card),
        )
    )

    data_list = [
        {
            "quantity": item.quantity,
            "name": item.card.name,
            "set_name": item.card.set.name,
            "set": item.card.set.code,
            "collector_number": item.card.collector_number,
            "foil": "",
        }
        for item in deck_cards
    ]

    return export_to_file(
        data_list,
        f"{deck.name.lower()}_deck",
        format_type,
    )


def export_folder(folder: Folder, format_type: str = "csv"):
    items = CollectionSelector.list_collection_item_from_folder(folder)
    items = [item for item in items if item.card is not None]
    items.sort(
        key=lambda item: (
            item.card.set.code.lower(),
            collector_number_sort_key(item.card),
        )
    )

    data_list = [
        {
            "quantity": item.quantity,
            "name": item.card.name,
            "set_name": item.card.set.name,
            "set": item.card.set.code,
            "collector_number": item.card.collector_number,
            "foil": item.foil,
        }
        for item in items
    ]

    return export_to_file(
        data_list,
        f"{folder.name.lower()}_folder",
        format_type,
    )


def export_collection(user, format_type: str = "csv"):
    items = CollectionSelector.list_collection_item_from_user(user)
    items = [item for item in items if item.card is not None]
    items.sort(
        key=lambda item: (
            item.card.set.code.lower(),
            collector_number_sort_key(item.card),
        )
    )

    data_list = [
        {
            "quantity": item.quantity,
            "name": item.card.name,
            "set_name": item.card.set.name,
            "set": item.card.set.code,
            "collector_number": item.card.collector_number,
            "foil": item.foil,
        }
        for item in items
    ]

    return export_to_file(data_list, "collection", format_type)


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
