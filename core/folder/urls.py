from rest_framework.routers import DefaultRouter

from folder.api.views import UserFolderView

router = DefaultRouter()
router.register("", UserFolderView, basename="folder")
urlpatterns = router.urls
