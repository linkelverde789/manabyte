from django.urls import path

from stats.api.views import CollectionStatsView, FolderStatsView, UserStatsView

urlpatterns = [
    path("user/", UserStatsView.as_view(), name="user-stats"),
    path("folder/<int:folder_id>", FolderStatsView.as_view(), name="folder-stats"),
    path("collection/", CollectionStatsView.as_view(), name="folder-stats"),
]
