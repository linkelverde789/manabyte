from django.urls import path

from cards.views import SearchCardViewSet

urlpatterns = [
    path("search/", SearchCardViewSet.as_view(), name="search"),
]
