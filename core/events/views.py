from datetime import datetime, timedelta

from django.utils import timezone
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from users.models import User

from events.consts import ALLOWED_EVENT_TYPES, EVENT_LIMIT
from events.models import Event
from events.serializers import EventResponseSerializer, ProfileEventsResponseSerializer


class EventsFromUserViewSet(APIView):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def get(self, request, event_type: str):
        user = request.user

        if event_type not in ALLOWED_EVENT_TYPES:
            raise ValidationError({"event_type": "Type not allowed."})

        date_param = request.query_params.get("date")

        try:
            event_date = datetime.strptime(date_param, "%Y-%m-%d").date()  # noqa: DTZ007
        except (ValueError, TypeError):
            event_date = timezone.localdate()

        events = Event.objects.filter(
            user=user,
            created_at__date=event_date,
        ).order_by("-created_at")

        limit = EVENT_LIMIT
        page = 1

        events = events[limit * (page - 1) : limit * page]

        return Response(
            EventResponseSerializer(
                events,
                many=True,
                context={"request": request},
            ).data
        )


class ProfileEventsViewSet(APIView):
    def get(self, request):
        user = User.objects.filter(id=1).first()

        today = timezone.localdate()

        yesterday = today - timedelta(days=1)

        data = {
            "today": Event.objects.filter(user=user, created_at__date=today).order_by(
                "created_at"
            )[:3],
            "yesterday": Event.objects.filter(
                user=user, created_at__date=yesterday
            ).order_by("-created_at")[:3],
        }

        return Response(
            ProfileEventsResponseSerializer(
                data,
                context={"request": request},
            ).data
        )
