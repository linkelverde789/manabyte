from collection.dto.collection import (
    CreateCollectionItemInput,
    UpdateCollectionItemInput,
)
from collection.models import CollectionItem
from django.db import transaction


class CollectionItemService:
    @staticmethod
    @transaction.atomic
    def create_collection_item(data: CreateCollectionItemInput) -> CollectionItem:
        return CollectionItem.objects.create(
            user=data.user,
            card=data.card,
            quantity=data.quantity,
            foil=data.foil,
            language=data.language,
            condition=data.condition,
            folder=data.folder,
        )

    @staticmethod
    @transaction.atomic
    def bulk_create_collection_item(data: [CreateCollectionItemInput]):
        return CollectionItem.objects.bulk_create(
            [
                CollectionItem(
                    user=item.user,
                    card=item.card,
                    quantity=item.quantity,
                    foil=item.foil,
                    language=item.language,
                    condition=item.condition,
                    folder=item.folder,
                )
                for item in data
            ]
        )

    @staticmethod
    @transaction.atomic
    def update_collection_item(
        item: CollectionItem, data: UpdateCollectionItemInput
    ) -> CollectionItem:
        if data.card is not None:
            item.card = data.card

        if data.quantity is not None:
            item.quantity = data.quantity

        if data.folder is not None:
            item.folder = data.folder

        if data.foil is not None:
            item.foil = data.foil

        if data.language is not None:
            item.language = data.language

        if data.condition is not None:
            item.condition = data.condition

        item.save()
        return item

    @staticmethod
    @transaction.atomic
    def delete_collection_item(item: CollectionItem) -> None:
        item.delete()
