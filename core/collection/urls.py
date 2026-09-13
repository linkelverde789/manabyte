from rest_framework.routers import DefaultRouter

from collection.views import CollectionItemView

router = DefaultRouter()
router.register("", CollectionItemView, basename="collection")

urlpatterns = router.urls
