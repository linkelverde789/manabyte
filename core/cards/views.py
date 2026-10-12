import re
import shlex

from django.db.models import Q
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from cards.api.serializers.card_serializer import ScryfallCardResponseSerializer
from cards.models import ScryfallCard

FIELD_LOOKUPS = {
    "name": lambda value: Q(name__icontains=value) | Q(faces__name__icontains=value),
    "type": lambda value: Q(faces__type_line__icontains=value),
    "oracle": lambda value: Q(faces__oracle_text__icontains=value),
    "set": lambda value: Q(set__code__iexact=value) | Q(set__name__iexact=value),
    "set_code": lambda value: Q(set__code__iexact=value),
    "set_name": lambda value: Q(set__name__iexact=value),
    "keywords": lambda value: Q(keywords__icontains=value),
    "colors": lambda value: Q(faces__colors__iexact=value),
}


class SearchCardViewSet(APIView):
    def get(self, request):
        q = request.query_params.get("q", "").strip()
        page = int(request.query_params.get("page", 1))
        limit = int(request.query_params.get("limit", 75))

        cards = ScryfallCard.objects.all()

        if q:
            try:
                tokens = shlex.split(q)
            except ValueError as exc:
                raise ValidationError({"q": str(exc)})

            parsed = []

            for token in tokens:
                match = re.match(
                    r"^(-?)([a-z_]+):(.*)$",
                    token,
                    flags=re.IGNORECASE,
                )

                if match:
                    negated, field, value = match.groups()
                    field = field.lower()
                    value = value.strip()

                    if field not in FIELD_LOOKUPS:
                        raise ValidationError({"q": f"Unknown field: {field}"})

                    if not value:
                        raise ValidationError({"q": f"Value is missing: {field}"})

                    parsed.append((field, value, bool(negated)))
                else:
                    parsed.append(("text", token, False))

            for field, value, negated in parsed:
                if field == "text":
                    condition = (
                        Q(name__icontains=value)
                        | Q(faces__name__icontains=value)
                        | Q(faces__type_line__icontains=value)
                        | Q(faces__oracle_text__icontains=value)
                    )
                else:
                    condition = FIELD_LOOKUPS[field](value)

                if negated:
                    cards = cards.exclude(condition)
                else:
                    cards = cards.filter(condition)

        cards = cards.order_by("oracle_id", "id").distinct("oracle_id")

        cards = cards[(page - 1) * limit : limit * page]

        return Response(
            ScryfallCardResponseSerializer(
                cards,
                many=True,
                context={"request": request},
            ).data
        )


class PrintingsCardViewSet(APIView):
    def get(self, request, oracle_id):

        prints = ScryfallCard.objects.filter(oracle_id=oracle_id).order_by("id")

        return Response(
            ScryfallCardResponseSerializer(
                prints,
                many=True,
                context={"request": request},
            ).data
        )
