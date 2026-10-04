from export.actions import export_folder
from folder.exceptions import FolderException
from folder.selectors.folder import FolderSelector
from users.models import User


class ExportFolderUseCase:
    def execute(self, user: User, folder_id: int | None, format: str = "csv"):

        if folder_id is None:
            raise FolderException("Folder id can't be None", "400")

        folder = FolderSelector.get_folder_from_user(folder_id=folder_id, user=user)

        if folder is None:
            raise FolderException(f"Folder {folder_id} not found", "404")

        return export_folder(folder=folder, format_type=format)
