from folder.models import Folder
from users.models import User


class FolderSelector:
    @staticmethod
    def get_folder_by_id(folder_id: int) -> Folder | None:
        return Folder.objects.filter(id=folder_id).first()

    @staticmethod
    def get_folder_from_user(folder_id: int, user: User) -> Folder | None:
        return Folder.objects.filter(id=folder_id, user=user).first()

    @staticmethod
    def list_folders():
        return Folder.objects.all()

    @staticmethod
    def list_folders_from_user(user: User):
        return Folder.objects.filter(user=user)
