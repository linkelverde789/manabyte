from django.urls import path

from events.api.views import EventsFromUserViewSet, ProfileEventsViewSet

urlpatterns = [
    path("type/<str:event_type>", EventsFromUserViewSet.as_view(), name="user-events"),
    path("profile", ProfileEventsViewSet.as_view(), name="profile-events"),
]
