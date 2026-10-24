from django.urls import path

from imports.views import ImportViewSet

urlpatterns = [
    path("", ImportViewSet.as_view(), name="imports"),
]
