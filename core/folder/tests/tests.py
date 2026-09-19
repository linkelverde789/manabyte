import pytest
from django.urls import reverse
from folder.models import Folder
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT


@pytest.mark.django_db
def test_create_folder(user, auth_client):
    data = {"name": "Folder 1", "type": "deck"}
    res = auth_client.post(reverse("folder-list"), data, format="json")

    assert res.status_code == HTTP_201_CREATED

    query = Folder.objects.filter(user=user)

    assert query.count() == 1

    assert query.first().id == res.data["id"]
    assert query.first().name == res.data["name"]
    assert query.first().type == res.data["type"]


@pytest.mark.django_db
def test_list_folders(user, auth_client):
    data = []

    for item in range(10):
        data.append(
            Folder(
                name=f"Folder {item}",
                type="deck" if item % 2 == 0 else "collection",
                user=user,
            )
        )

    Folder.objects.bulk_create(data)

    res = auth_client.get(reverse("folder-list"))

    assert res.status_code == HTTP_200_OK
    assert len(res.data) == 10


@pytest.mark.django_db
def test_get_folder(user, auth_client):
    folder = Folder.objects.create(
        name="Folder 1",
        type="deck",
        user=user,
    )

    res = auth_client.get(reverse("folder-detail", kwargs={"pk": folder.id}))

    assert res.status_code == HTTP_200_OK
    assert res.data["id"] == folder.id
    assert res.data["name"] == folder.name


@pytest.mark.django_db
def test_delete_folder(user, auth_client):
    folder = Folder.objects.create(
        name="Folder 1",
        type="deck",
        user=user,
    )

    res = auth_client.delete(reverse("folder-detail", kwargs={"pk": folder.id}))

    assert res.status_code == HTTP_204_NO_CONTENT

    assert not Folder.objects.filter(id=folder.id).exists()


@pytest.mark.django_db
def test_update_folder(user, auth_client):
    pass
