CARD_ADDED = "card_added", "Card added"
CARD_REMOVED = "card_removed", "Card removed"
CARD_QUANTITY_CHANGED = (
    "card_quantity_changed",
    "Quantity changed",
)
CARD_UPDATED = "card_updated", "Card updated"
CARD_PRINT_CHANGED = "card_print_changed", "Card print changed"
DECK_CREATED = "deck_created", "Deck created"
DECK_DELETED = "deck_deleted", "Deck removed"
FOLDER_CREATED = "folder_created", "Folder created"
FOLDER_DELETED = "folder_deleted", "Folder removed"
CARDS_BULK_ADDED = "cards_bulk_added", "Added bulk cards"

CHOICES = [
    CARD_ADDED,
    CARD_REMOVED,
    CARD_QUANTITY_CHANGED,
    CARDS_BULK_ADDED,
    CARD_PRINT_CHANGED,
    CARD_UPDATED,
    DECK_CREATED,
    DECK_DELETED,
    FOLDER_CREATED,
    FOLDER_DELETED,
]

FOLDER_TYPE_EVENT = "folder"
DECK_TYPE_EVENT = "deck"
DECKCARD_TYPE_EVENT = "deckcard"
COLLECTIONITEM_TYPE_EVENT = "collectionitem"

AGGREGATE_TYPE_CHOICES = [
    (FOLDER_TYPE_EVENT, "Folder"),
    (DECK_TYPE_EVENT, "Deck"),
    (DECKCARD_TYPE_EVENT, "Deck card"),
    (COLLECTIONITEM_TYPE_EVENT, "Collection item"),
]
