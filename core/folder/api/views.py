from collection.models import CollectionItem
from deck.models import Deck
from folder.api.serializers import FolderResponseSerializer
from folder.models import Folder
from folder.use_cases.create_folder import CreateFolderUseCase
from folder.use_cases.get_folder_from_user import GetFolderFromUserUseCase
from folder.use_cases.list_folders_from_user import ListFolderFromUserUseCase
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT
from rest_framework.viewsets import ViewSet


class UserFolderView(ViewSet):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def list(self, request):
        user = request.user

        folders = ListFolderFromUserUseCase().execute(user=user)

        return Response(
            FolderResponseSerializer(
                folders, many=True, context={"request": request}
            ).data
        )

    def retrieve(self, request, pk):
        user = request.user

        folder = GetFolderFromUserUseCase().execute(user=user, folder_id=pk)

        return Response(
            FolderResponseSerializer(folder, context={"request": request}).data
        )

    def create(self, request):
        user = request.user
        data = request.data

        folder = CreateFolderUseCase().execute(
            user=user, name=data["name"], type=data["type"]
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
