from django.urls import path

from stats.views import FolderStatsView, UserStatsView

urlpatterns = [
    path("user/", UserStatsView.as_view(), name="user-stats"),
    path("folder/<int:folder_id>", FolderStatsView.as_view(), name="folder-stats"),
]
