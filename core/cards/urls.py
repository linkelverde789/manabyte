from django.urls import path

from cards.views import PrintingsCardViewSet, SearchCardViewSet

urlpatterns = [
    path("search/", SearchCardViewSet.as_view(), name="search"),
    path("printings/<str:oracle_id>", PrintingsCardViewSet.as_view(), name="printings"),
]
