import re
import shlex

from cards.consts import FIELD_LOOKUPS
from cards.dto.dto import SearchCardsFilters
from cards.models import ScryfallCard
from rest_framework.exceptions import ValidationError
from sets.consts import SET_TYPES_TO_EXCLUDE
from users.models import User


def _parse_q(q, cards):
    cards = _exclude_some_sets(cards)

    try:
        tokens = shlex.split(q)
    except ValueError as exc:
        raise ValidationError({"q": str(exc)})

    parsed = _parse_tokens(tokens)

    return _parse_fields(parsed=parsed, cards=cards)


def _parse_tokens(tokens):
    parsed = []

    for token in tokens:
        field, value, negated = _parse_token(token)

        parsed.append((field, value, negated))

    return parsed


def _parse_token(token):
    match = re.match(
        r"^(-?)([a-z_]+):(.*)$",
        token,
        flags=re.IGNORECASE,
    )

    if match:
        negated, field, value = match.groups()
        field = field.lower()
        value = value.strip()

        if field not in FIELD_LOOKUPS:
            raise ValidationError({"q": f"Unknown field: {field}"})

        if not value:
            raise ValidationError({"q": f"Value is missing: {field}"})

        return field, value, bool(negated)
    else:
        return "text", token, False


def _parse_fields(parsed, cards):

    for field, value, negated in parsed:
        condition = FIELD_LOOKUPS[field](value)

        if negated:
            cards = cards.exclude(condition)
        else:
            cards = cards.filter(condition)

    return cards


# TODO: Refactor this. Maybe need research on sets
def _exclude_some_sets(cards):
    cards = cards.exclude(set__set_type__in=SET_TYPES_TO_EXCLUDE)

    return cards


class CardSelector:
    @staticmethod
    def search_card(filters: SearchCardsFilters):

        page = filters.page
        limit = filters.limit
        q = filters.q

        cards = (
            ScryfallCard.objects.all().order_by("oracle_id", "id").distinct("oracle_id")
        )

        if q is not None:
            cards = _parse_q(q, cards)

        return cards[(page - 1) * limit : limit * page]

    @staticmethod
    def list_card_prints(oracle_id: str):
        return ScryfallCard.objects.filter(oracle_id=oracle_id).order_by("id")

    @staticmethod
    def get_card_from_scryfall_id(scryfall_id: str) -> ScryfallCard | None:
        return ScryfallCard.objects.filter(external_id=scryfall_id).first()

    @staticmethod
    def get_cards_from_deck(deck_id: int):
        return ScryfallCard.objects.filter(deckcard__deck_id=deck_id)

    @staticmethod
    def get_cards_from_folder(folder_id: int):
        return ScryfallCard.objects.filter(collectionitem__folder_id=folder_id)

    @staticmethod
    def get_cards_from_user_collection(user: User):
        return ScryfallCard.objects.filter(collectionitem__user=user)
