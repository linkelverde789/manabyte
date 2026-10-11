from django.db.models import Q
from django.urls import reverse
from rest_framework.status import HTTP_200_OK

from cards.models import ScryfallCard, ScryfallSet


def _check_name_in_response(data: list, qs):
    for index, card in enumerate(qs):
        assert card.name == data[index]["name"]


def test_limit_and_page_search(cards_db, api_client):
    res = api_client.get(reverse("search"))

    # Should return the first 75 cards on the database
    qs = (
        ScryfallCard.objects.all()
        .order_by("oracle_id", "id")
        .distinct("oracle_id")[0:75]
    )

    data = res.data

    assert len(data) == qs.count()

    _check_name_in_response(data, qs)

    # Send limit and page from query_params
    page = 3
    limit = 30

    res = api_client.get(
        reverse("search"), {"page": page, "limit": limit}, format="json"
    )
    data = res.data
    assert len(data) == limit


def test_simple_search(cards_db, api_client):

    name = ScryfallCard.objects.first().name

    qs = (
        ScryfallCard.objects.filter(
            Q(name__icontains=name)
            | Q(faces__name__icontains=name)
            | Q(faces__type_line__icontains=name)
            | Q(faces__oracle_text__icontains=name)
        )
        .order_by("oracle_id", "id")
        .distinct("oracle_id")
    )

    res = api_client.get(reverse("search"), {"q": f'"{name}"'}, format="json")

    assert res.status_code == HTTP_200_OK

    data = res.data

    assert len(data) == qs.count()

    _check_name_in_response(data, qs)


def test_type_search(cards_db, api_client):
    type = "human"
    limit = 12
    page = 1
    res = api_client.get(
        reverse("search"),
        {"q": f"type:{type}", "page": page, "limit": limit},
        format="json",
    )

    qs = (
        ScryfallCard.objects.filter(faces__type_line__icontains=type)
        .order_by("oracle_id", "id")
        .distinct("oracle_id")[page - 1 : limit]
    )

    assert len(res.data) == qs.count()
    _check_name_in_response(res.data, qs)


def test_name_search(cards_db, api_client):
    name = "creature"
    limit = 50
    page = 1

    # When using name:XXX will search only on name field
    strict_result = api_client.get(
        reverse("search"),
        {"q": f"name:{name}", "page": page, "limit": limit},
        format="json",
    )

    qs = (
        ScryfallCard.objects.filter(faces__name__icontains=name)
        .order_by("oracle_id", "id")
        .distinct("oracle_id")[page - 1 : limit]
    )

    assert len(strict_result.data) == qs.count()

    _check_name_in_response(strict_result.data, qs)

    # When searching withot name:XXX search will use type_line, oracle_text and name
    relaxed_result = api_client.get(
        reverse("search"),
        {"q": f"{name}", "page": page, "limit": limit},
        format="json",
    )

    assert len(relaxed_result.data) > len(strict_result.data)


def test_set_search(cards_db, api_client):

    set = ScryfallSet.objects.first()
    set_code = set.code
    set_name = set.name

    qs = (
        ScryfallCard.objects.filter(set__code__iexact=set_code)
        .order_by("oracle_id", "id")
        .distinct("oracle_id")
    )[0:75]

    res = api_client.get(
        reverse("search"), {"q": f"set_code:{set_code}"}, format="json"
    )

    assert res.status_code == HTTP_200_OK

    assert len(res.data) == qs.count()
    _check_name_in_response(res.data, qs)

    qs = (
        ScryfallCard.objects.filter(set__name__iexact=set_name)
        .order_by("oracle_id", "id")
        .distinct("oracle_id")
    )[0:75]

    res = api_client.get(
        reverse("search"), {"q": f'set_name:"{set_name}"'}, format="json"
    )

    assert res.status_code == HTTP_200_OK

    assert len(res.data) == qs.count()
    _check_name_in_response(res.data, qs)

    # There are some sets with Final in the name
    set_name = "Final"

    qs = (
        ScryfallCard.objects.filter(
            Q(set__name__iexact=set_name) | Q(set__code__iexact=set_name)
        )
        .order_by("oracle_id", "id")
        .distinct("oracle_id")
    )[0:75]

    res = api_client.get(reverse("search"), {"q": f"set:{set_name}"}, format="json")

    assert res.status_code == HTTP_200_OK

    assert len(res.data) == qs.count()
    _check_name_in_response(res.data, qs)


def test_keyword_search(cards_db, api_client):
    keyword = "Trample"
    set_code = ScryfallSet.objects.first().code

    # Get all cards with trample keyword from LOTR Set
    res = api_client.get(
        reverse("search"),
        {"q": f"keywords:{keyword} set_code:{set_code}"},
        format="json",
    )

    assert res.status_code == HTTP_200_OK

    qs = (
        ScryfallCard.objects.filter(
            keywords__icontains=keyword, set__code__iexact=set_code
        )
        .order_by("oracle_id", "id")
        .distinct("oracle_id")
    )

    assert len(res.data) == qs.count()

    _check_name_in_response(res.data, qs)


def text_color_search(cards_db, api_client):
    color = "G"

    qs = (
        ScryfallCard.objects.filter(faces__colors__icontains=color)
        .order_by("oracle_id", "id")
        .distinct("oracle_id")
    )[0:75]

    res = api_client(reverse("search"), {"q": f"color:{color}"}, format="json")

    assert res.data == qs.count()

    _check_name_in_response(res.data, qs)


def test_exclude_field_filters(cards_db, api_client):
    name = "cactuar"
    excluded_name = "jumbo cactuar"

    # Should contain 1 result
    strict_qs = (
        ScryfallCard.objects.filter(
            Q(name__icontains=name) | Q(faces__name__icontains=name)
        )
        .exclude(
            Q(name__icontains=excluded_name) | Q(faces__name__icontains=excluded_name)
        )
        .order_by("oracle_id", "id")
        .distinct("oracle_id")
    )

    strict_result = api_client.get(
        reverse("search"), {"q": f'name:{name} -name:"{excluded_name}"'}, format="json"
    )

    assert strict_result.status_code == HTTP_200_OK
    assert len(strict_result.data) == strict_qs.count()

    _check_name_in_response(strict_result.data, strict_qs)

    # Should contain 2 results
    relaxed_qs = (
        ScryfallCard.objects.filter(
            Q(name__icontains=name)
            | Q(faces__name__icontains=name)
            | Q(faces__type_line__icontains=name)
            | Q(faces__oracle_text__icontains=name)
        )
        .order_by("oracle_id", "id")
        .distinct("oracle_id")
    )

    relaxed_result = api_client.get(
        reverse("search"), {"q": f"name:{name}"}, format="json"
    )

    assert relaxed_result.status_code == HTTP_200_OK

    assert len(relaxed_result.data) == relaxed_qs.count()

    _check_name_in_response(relaxed_result.data, relaxed_qs)

    assert len(relaxed_result.data) > len(strict_result.data)
