from django.urls import path

from sets.views import ListCardFromSetViewSet, ListSetsViewSet

urlpatterns = [
    path("", ListSetsViewSet.as_view(), name="set"),
    path("<str:set_code>", ListCardFromSetViewSet.as_view(), name="cardset"),
]
