from collection.models import CollectionItem
from deck.models import Deck
from django.db import transaction
from folder.dto.folder import CreateFolderInput
from folder.models import Folder


class FolderService:
    @staticmethod
    @transaction.atomic
    def create_folder(data: CreateFolderInput):
        return Folder.objects.create(user=data.user, name=data.name, type=data.type)

    @staticmethod
    @transaction.atomic
    def delete_folder(folder: Folder):
        FolderService._delete_folder_relation(folder)

        folder.delete()

    @staticmethod
    @transaction.atomic
    def _delete_folder_relation(folder: Folder):
        if folder.type == "deck":
            return FolderService._delete_deck_relations(folder)

        if folder.type == "collection":
            return FolderService._delete_collection_relations(folder)

    @staticmethod
    @transaction.atomic
    def _delete_collection_relations(folder: Folder):
        CollectionItem.objects.filter(folder=folder).update(folder=None)

    @staticmethod
    @transaction.atomic
    def _delete_deck_relations(folder: Folder):
        Deck.objects.filter(folder=folder).update(folder=None)
