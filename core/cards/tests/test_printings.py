from django.db.models import Count
from django.urls import reverse
from rest_framework.status import HTTP_200_OK


def test_retrieve_printings(cards_db, api_client):
    oracle_id = (
        cards_db.values("oracle_id")
        .annotate(count=Count("oracle_id"))
        .order_by("-count")
        .first()
    )

    res = api_client.get(
        reverse("printings", kwargs={"oracle_id": str(oracle_id["oracle_id"])})
    )

    assert res.status_code == HTTP_200_OK

    assert len(res.data) == oracle_id["count"]
