import re


def collector_number_sort_key(card):
    value = card.collector_number.strip()
    match = re.match(r"^(\d+)(.*)$", value)

    if match:
        number = int(match.group(1))
        suffix = match.group(2).lower()
        return (0, number, suffix)

    return (1, 0, value.lower())


def check_name_in_response(data: list, qs):
    for index, card in enumerate(qs):
        print(f"card: {card.set.code}, data: {data[index]['set']['code']}")
        assert card.name == data[index]["name"]
