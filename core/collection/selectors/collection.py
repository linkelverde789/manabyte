from collection.models import CollectionItem
from folder.models import Folder
from users.models import User


class CollectionSelector:
    @staticmethod
    def get_collection_item_from_id(item_id: int) -> CollectionItem | None:
        return CollectionItem.objects.filter(id=item_id).first()

    @staticmethod
    def get_collection_item_from_user(
        item_id: int, user: User
    ) -> CollectionItem | None:
        return CollectionItem.objects.filter(user=user, id=item_id).first()

    @staticmethod
    def list_collection_item_from_user(user: User):
        return CollectionItem.objects.filter(user=user).order_by("-id")

    @staticmethod
    def list_collection_item():
        return CollectionItem.objects.all().order_by("-id")

    @staticmethod
    def list_collection_item_from_folder(folder: Folder):
        return CollectionItem.objects.filter(folder=folder).order_by("-id")

    @staticmethod
    def list_collection_item_from_scryfall_ids(user: User, scryfall_ids: list[str]):
        return CollectionItem.objects.filter(
            user=user, scryfall_id__in=scryfall_ids
        ).distinct("scryfall_id")
