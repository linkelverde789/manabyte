import pytest
from cards.models import ScryfallCard
from cards.utils.utils import check_name_in_response, collector_number_sort_key
from django.urls import reverse

from sets.models import ScryfallSet


@pytest.mark.django_db
def test_retrieve_cards_from_set(api_client):
    set_code = "ltr"

    qs = list(ScryfallCard.objects.filter(set__code=set_code).prefetch_related("faces"))

    qs.sort(key=collector_number_sort_key)

    res = api_client.get(reverse("cardset", kwargs={"set_code": set_code}))

    assert len(res.data) == len(qs)

    assert res.data[-1]["collector_number"] == qs[-1].collector_number

    check_name_in_response(res.data, qs)


@pytest.mark.django_db
def test_retrieve_sets(api_client):
    qs = ScryfallSet.objects.all().order_by("name")

    res = api_client.get(reverse("set"))

    assert len(res.data) == qs.count()

    check_name_in_response(res.data, qs)
