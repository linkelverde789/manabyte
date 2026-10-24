import re
import shlex

from cards.consts import FIELD_LOOKUPS
from rest_framework.exceptions import ValidationError
from sets.consts import SET_TYPES_TO_EXCLUDE


def check_name_in_response(data: list, qs):
    """This is a auxiliar function for test."""
    for index, card in enumerate(qs):
        assert card.name == data[index]["name"]


def collector_number_sort_key(card):
    value = card.collector_number.strip()
    match = re.match(r"^(\d+)(.*)$", value)

    if match:
        number = int(match.group(1))
        suffix = match.group(2).lower()
        return (0, number, suffix)

    return (1, 0, value.lower())


def filter_cards_from_query(q, cards):

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


def exclude_some_sets(cards):
    """This function exclude some sets from const SET_TYPES_TO_EXCLUDE.
    Some sets are minigames, tokens... wich are not needed when searching
    """
    cards = cards.exclude(set__type__in=SET_TYPES_TO_EXCLUDE)

    return cards
