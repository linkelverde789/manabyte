import pytest
from django.urls import reverse
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED
from rest_framework.test import APIClient

from users.models import User


@pytest.mark.django_db
def test_login():
    client = APIClient()
    email = "test@test.com"
    password = "testpassword"
    username = "testuser"

    User.objects.create_user(email=email, password=password, username=username)

    res = client.post(
        reverse("login"), {"username": username, "password": password, "email": email}
    )
    user = User.objects.get(username=username)

    assert res.status_code == HTTP_200_OK
    assert user.is_authenticated


@pytest.mark.django_db
def test_register():

    client = APIClient()
    username = "testuser"
    password = "testpassword"

    res = client.post(
        reverse("register"),
        {"password": password, "username": username},
    )

    assert res.status_code == HTTP_201_CREATED
    assert User.objects.filter(username=username).exists()


@pytest.mark.django_db
def test_logout():
    client = APIClient()
    username = "testuser"
    password = "testpassword"

    User.objects.create_user(username=username, password=password)

    res = client.post(reverse("login"), {"username": username, "password": password})

    assert res.status_code == HTTP_200_OK

    res = client.post(reverse("logout"))
    assert res.status_code == HTTP_200_OK
