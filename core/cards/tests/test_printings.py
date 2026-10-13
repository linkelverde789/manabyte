import pytest
from django.db.models import Count
from django.urls import reverse
from rest_framework.status import HTTP_200_OK

from cards.models import ScryfallCard


@pytest.mark.django_db
def test_retrieve_printings(api_client):
    oracle_id = (
        ScryfallCard.objects.values("oracle_id")
        .annotate(count=Count("oracle_id"))
        .order_by("-count")
        .first()
    )

    res = api_client.get(
        reverse("printings", kwargs={"oracle_id": str(oracle_id["oracle_id"])})
    )

    assert res.status_code == HTTP_200_OK

    assert len(res.data) == oracle_id["count"]
