from django.urls import path
from rest_framework.routers import DefaultRouter

from deck.views import DeckCardsView, UserDeckView

router = DefaultRouter()
router.register("", UserDeckView, basename="deck")

urlpatterns = router.urls + [
    path(
        "<int:deck_id>/cards/",
        DeckCardsView.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
        name="card-list",
    ),
    path(
        "<int:deck_id>/cards/<int:pk>/",
        DeckCardsView.as_view(
            {
                "put": "update",
                "delete": "destroy",
            }
        ),
        name="card-detail",
    ),
]
