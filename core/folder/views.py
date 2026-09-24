from collection.models import CollectionItem
from deck.models import Deck
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT
from rest_framework.viewsets import ViewSet

from folder.models import Folder
from folder.serializers import FolderResponseSerializer


class UserFolderView(ViewSet):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def list(self, request):
        user = request.user

        folders = Folder.objects.filter(user=user)

        return Response(
            FolderResponseSerializer(
                folders, many=True, context={"request": request}
            ).data
        )

    def retrieve(self, request, pk):
        user = request.user

        folder = Folder.objects.filter(user=user, id=pk).first()

        return Response(
            FolderResponseSerializer(folder, context={"request": request}).data
        )

    def create(self, request):
        user = request.user
        data = request.data

        folder = Folder.objects.create(
            user=user,
            name=data["name"],
            type=data["type"],
        )

        return Response(
            FolderResponseSerializer(folder, context={"request": request}).data,
            status=HTTP_201_CREATED,
        )

    def destroy(self, request, pk):
        user = request.user

        folder = Folder.objects.filter(user=user, id=pk).first()

        if folder.type == "deck":
            Deck.objects.filter(folder=folder, user=user).update(folder=None)
        elif folder.type == "collection":
            CollectionItem.objects.filter(folder=folder, user=user).update(folder=None)

        folder.delete()
        return Response(status=HTTP_204_NO_CONTENT)
