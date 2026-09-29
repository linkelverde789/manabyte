from folder.dto.folder import CreateFolderInput
from folder.models import Folder
from folder.services.folder import FolderService
from users.models import User


class CreateFolderUseCase:
    def execute(self, name: str, type: str, user: User) -> Folder:
        input_dto = CreateFolderInput(user=user, name=name, type=type).validate()

        return FolderService.create_folder(data=input_dto)
