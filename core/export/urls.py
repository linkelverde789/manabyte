from django.urls import path

from export.views import ExportCollection, ExportDeck, ExportFolder

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
    path(
        "collection/<str:format_type>/",
        ExportCollection.as_view(),
        name="export_folder",
    ),
]
