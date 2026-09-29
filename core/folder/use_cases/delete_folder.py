from folder.exceptions import FolderException
from folder.selectors.folder import FolderSelector
from folder.services.folder import FolderService
from users.models import User


class DeleteFolderUseCase:
    def execute(self, folder_id: int, user: User):
        folder = FolderSelector.get_folder_from_user(folder_id=folder_id, user=user)

        if folder is None:
            raise FolderException(f"Folder: {folder_id} not found", "404")

        FolderService.delete_folder(folder=folder)
