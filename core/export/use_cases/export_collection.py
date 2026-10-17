from export.actions import (
    export_collection,
)
from users.models import User


class ExportCollectionUseCase:
    def execute(self, user: User, format: str = "csv"):

        return export_collection(user=user, format_type=format)
