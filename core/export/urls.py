from django.urls import path

from export.views import ExportDeck, ExportFolder

urlpatterns = [
    path(
        "deck/<int:deck_id>/<str:format_type>/",
        ExportDeck.as_view(),
        name="export_deck",
    ),
    path(
        "folder/<int:folder_id>/<str:format_type>/",
        ExportFolder.as_view(),
        name="export_folder",
    ),
]
