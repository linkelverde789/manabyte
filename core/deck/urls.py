from rest_framework.routers import DefaultRouter

from deck.views import UserDeckView

router = DefaultRouter()
router.register("", UserDeckView, basename="deck")

urlpatterns = router.urls
