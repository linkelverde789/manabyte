from folder.selectors.folder import FolderSelector
from users.models import User


class ListFolderFromUserUseCase:
    def execute(self, user: User):
        return FolderSelector.list_folders_from_user(user=user)
