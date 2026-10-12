from django.urls import path

from sets.views import ListAlbumViewSet, ListCardFromSetViewSet, ListSetsViewSet

urlpatterns = [
    path("", ListSetsViewSet.as_view(), name="set"),
    path("<str:set_code>", ListCardFromSetViewSet.as_view(), name="cardset"),
    path("album/<str:set_code>", ListAlbumViewSet.as_view(), name="album"),
]
