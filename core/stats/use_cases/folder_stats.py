from folder.exceptions import FolderException
from folder.selectors.folder import FolderSelector
from stats.selectors.folder import StatsSelector
from users.models import User


class FolderStatsUseCase:
    def execute(self, folder_id: int, user: User):
        folder = FolderSelector.get_folder_from_user(user=user, folder_id=folder_id)

        if folder is None:
            raise FolderException(f"Folder: {folder_id} not found", "404")

        return StatsSelector.get_folder_stats(folder)
