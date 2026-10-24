from cards.models import ScryfallCard
from sets.selectors.sets import SetSelector

from imports.consts import (
    QUANTITY_RE,
    SET_AND_NUMBER_RE,
    SET_ONLY_RE,
    SET_PAREN_RE,
)


def resolve_card(parsed):
    result = {
        "cards": [],
        "extra": {
            "foil": parsed["foil"],
            "quantity": parsed["quantity"],
        },
    }

    if parsed["error"]:
        result["warning"] = parsed["error"]
        return result

    name = parsed["name"]
    set_code = parsed["set"]
    collector_number = parsed["collector_number"]

    if set_code and collector_number:
        card_set = SetSelector.get_set_by_code(set_code=set_code)

        if card_set is None:
            result["warning"] = f"Set not found: {set_code}"
        else:
            matches = list(
                ScryfallCard.objects.filter(
                    set=card_set,
                    collector_number=collector_number,
                ).order_by("pk")
            )

            if matches:
                result["cards"] = matches
                if len(matches) > 1:
                    result["warning"] = (
                        f"Multiple matches for line: {parsed['raw']}. Choose one."
                    )
                return result

    queryset = ScryfallCard.objects.all()

    if name:
        queryset = queryset.filter(name__icontains=name)

    if collector_number:
        queryset = queryset.filter(
            collector_number=collector_number,
        )

    if set_code:
        queryset = queryset.filter(set__code__iexact=set_code)

    matches = list(queryset.order_by("name", "set__code", "pk"))

    result["cards"] = matches

    if len(matches) > 1:
        result["warning"] = f"Multiple matches for line: {parsed['raw']}. Choose one."
    elif not matches and "warning" not in result:
        result["warning"] = f"No cards found for line: {parsed['raw']}."

    return result


def parse_card(raw: str) -> dict:
    raw = raw.strip()

    result = {
        "raw": raw,
        "quantity": 1,
        "name": None,
        "set": None,
        "collector_number": None,
        "foil": False,
        "error": None,
    }

    if not raw:
        result["error"] = "Empty line"
        return result

    if raw.endswith("*"):
        result["foil"] = True
        raw = raw[:-1].strip()

    result["raw"] = raw + (" *" if result["foil"] else "")

    quantity_match = QUANTITY_RE.match(raw)
    if quantity_match:
        quantity = int(quantity_match.group(1))

        if quantity < 1:
            result["error"] = "Quantity must be greater than zero"
            return result

        result["quantity"] = quantity
        raw = raw[quantity_match.end() :].strip()

    match = SET_PAREN_RE.search(raw)

    if match:
        result["name"] = raw[: match.start()].strip() or None
        result["set"] = match.group(1).strip() or None
        result["collector_number"] = match.group(2).strip() if match.group(2) else None
    else:
        match = SET_AND_NUMBER_RE.search(raw)

        if match:
            result["name"] = raw[: match.start()].strip() or None
            result["set"] = match.group(1).strip() or None
            result["collector_number"] = match.group(2).strip()
        else:
            match = SET_ONLY_RE.search(raw)

            if match:
                result["name"] = raw[: match.start()].strip() or None
                result["set"] = match.group(1).strip() or None
            else:
                result["name"] = raw.strip() or None

    if not result["name"] and not result["set"] and not result["collector_number"]:
        result["error"] = "Card name not found"

    return result
