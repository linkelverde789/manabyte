from rest_framework.response import Response
from rest_framework.views import APIView

from imports.serializers import ImportSerializer
from imports.utils import parse_card, resolve_card


class ImportViewSet(APIView):
    def post(self, request):
        content = request.data.get("content")

        if not isinstance(content, str):
            return Response(
                {"content": ["This field must be a string."]},
                status=400,
            )

        response = []

        for line in content.splitlines():
            if not line.strip():
                continue

            parsed = parse_card(line)
            response.append(resolve_card(parsed))

        serializer = ImportSerializer(
            response,
            many=True,
            context={"request": request},
        )
        return Response(serializer.data)
