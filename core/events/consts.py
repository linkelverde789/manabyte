CARD_ADDED = "card_added"
CARD_REMOVED = "card_removed"
CARD_QUANTITY_CHANGED = "card_quantity_changed"
CARDS_BULK_ADDED = "cards_bulk_added"
CARD_PRINT_CHANGED = "card_print_changed"
CARD_UPDATED = "card_updated"
DECK_CREATED = "deck_created"
DECK_DELETED = "deck_deleted"
FOLDER_CREATED = "folder_created"
FOLDER_DELETED = "folder_deleted"


CHOICES = [
    (CARD_ADDED, "Card added"),
    (CARD_REMOVED, "Card removed"),
    (CARD_QUANTITY_CHANGED, "Quantity changed"),
    (CARDS_BULK_ADDED, "Added bulk cards"),
    (CARD_PRINT_CHANGED, "Card print changed"),
    (CARD_UPDATED, "Card updated"),
    (DECK_CREATED, "Deck created"),
    (DECK_DELETED, "Deck removed"),
    (FOLDER_CREATED, "Folder created"),
    (FOLDER_DELETED, "Folder removed"),
]

FOLDER_TYPE_EVENT = "folder"
DECK_TYPE_EVENT = "deck"
DECKCARD_TYPE_EVENT = "deckcard"
COLLECTIONITEM_TYPE_EVENT = "collectionitem"
COLLECTION_TYPE_EVENT = "collection"


AGGREGATE_TYPE_CHOICES = [
    (FOLDER_TYPE_EVENT, "Folder"),
    (DECK_TYPE_EVENT, "Deck"),
    (DECKCARD_TYPE_EVENT, "Deck card"),
    (COLLECTIONITEM_TYPE_EVENT, "Collection item"),
    (COLLECTION_TYPE_EVENT, "Collection"),
]

EVENT_LIMIT = 18

ALLOWED_AGGREGATE_TYPES = [
    FOLDER_TYPE_EVENT,
    DECK_TYPE_EVENT,
    DECKCARD_TYPE_EVENT,
    COLLECTIONITEM_TYPE_EVENT,
    COLLECTION_TYPE_EVENT,
]

ALLOWED_EVENT_TYPES = [
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
