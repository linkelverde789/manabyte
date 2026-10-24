from collection.dto.collection import (
    CreateCollectionItemInput,
    UpdateCollectionItemInput,
)
from collection.models import CollectionItem
from django.db import transaction
from django.db.models import F


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
    def bulk_merge_collection_item(data):
        result = []

        for item in data:
            collection_item = (
                CollectionItem.objects.select_for_update()
                .filter(
                    user=item.user,
                    card=item.card,
                    foil=item.foil,
                    language=item.language,
                    condition=item.condition,
                    folder=item.folder,
                )
                .first()
            )

            if collection_item is not None:
                CollectionItem.objects.filter(pk=collection_item.pk).update(
                    quantity=F("quantity") + item.quantity
                )

                collection_item.refresh_from_db()
                result.append(collection_item)

            else:
                collection_item = CollectionItem.objects.create(
                    user=item.user,
                    card=item.card,
                    quantity=item.quantity,
                    foil=item.foil,
                    language=item.language,
                    condition=item.condition,
                    folder=item.folder,
                )

                result.append(collection_item)

        return result

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
