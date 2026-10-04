from collection.exceptions import CollectionItemException
from deck.exceptions import DeckException
from folder.exceptions import FolderException
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        return response

    if isinstance(
        exc,
        (
            FolderException,
            CollectionItemException,
            DeckException,
        ),
    ):
        return Response(
            {"error": exc.message},
            status=exc.code,
        )

    return None
