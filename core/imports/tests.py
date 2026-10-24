import pytest
from cards.models import ScryfallCard
from cards.utils.utils import check_name_in_response
from django.urls import reverse
from rest_framework.status import HTTP_200_OK


@pytest.mark.django_db
def test_import_with_complete_data(api_client):
    text = {
        "content": """
    4 Aegis Turtle (fdn) 150
    4 Alesha, Who Laughs at Fate (fdn) 115
    4 Apothecary Stomper (fdn) 99
    """
    }

    res = api_client.post(reverse("imports"), text, forman="json")

    assert res.status_code == HTTP_200_OK

    cards = res.data

    assert len(cards) == 3

    for card in cards:
        extra = card["extra"]
        warning = card.get("warning", None)

        assert len(card["cards"]) == 1
        assert warning == None
        assert extra["foil"] == False
        assert extra["quantity"] == 4


@pytest.mark.django_db
def test_import_with_foil_data(api_client):
    text = {
        "content": """
    4 Aegis Turtle (fdn) 150 *
    4 Alesha, Who Laughs at Fate (fdn) 115 *
    4 Apothecary Stomper (fdn) 99 *
    """
    }

    res = api_client.post(reverse("imports"), text, forman="json")

    assert res.status_code == HTTP_200_OK

    cards = res.data

    assert len(cards) == 3

    for card in cards:
        extra = card["extra"]
        warning = card.get("warning", None)

        assert len(card["cards"]) == 1
        assert warning == None
        assert extra["foil"] == True
        assert extra["quantity"] == 4


@pytest.mark.django_db
def test_import_with_only_set_and_number(api_client):
    text = {
        "content": """
    4 (fdn) 150 *
    4 (fdn) 115 *
    4 (fdn) 99 *
    """
    }

    collector_numbers = ["150", "115", "99"]
    names = ["Aegis Turtle", "Alesha, Who Laughs at Fate", "Apothecary Stomper"]

    res = api_client.post(reverse("imports"), text, forman="json")

    assert res.status_code == HTTP_200_OK

    cards = res.data

    assert len(cards) == 3

    for card in cards:
        extra = card["extra"]
        warning = card.get("warning", None)

        assert len(card["cards"]) == 1
        assert warning == None
        assert extra["foil"] == True
        assert extra["quantity"] == 4

        for item in card["cards"]:
            assert item["collector_number"] in collector_numbers
            assert item["name"] in names


@pytest.mark.django_db
def test_import_with_only_name(api_client):
    text = {
        "content": """
        999 vampire
        """
    }

    res = api_client.post(reverse("imports"), text, forman="json")

    qs = ScryfallCard.objects.filter(
        set__code="fdn", name__icontains="vampire"
    ).order_by("name", "set__code", "pk")

    assert len(res.data) == 1
    cards = res.data[0]

    assert len(cards["cards"]) == qs.count()

    check_name_in_response(data=cards["cards"], qs=qs)
