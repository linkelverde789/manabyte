from folder.exceptions import FolderException
from folder.selectors.folder import FolderSelector
from users.models import User


class GetFolderFromUserUseCase:
    def execute(self, user: User, folder_id: int):
        folder = FolderSelector.get_folder_from_user(user=user, folder_id=folder_id)

        if folder is None:
            raise FolderException(f"Folder {folder_id} not found", "404")

        return folder
