from datetime import timedelta

import pytest
from django.urls import reverse
from django.utils import timezone
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken

from users.api.cookies import ACCESS_COOKIE, REFRESH_COOKIE
from users.models import User


@pytest.mark.django_db
def test_login():
    client = APIClient()
    email = "test@test.com"
    password = "testpassword"
    username = "testuser"

    User.objects.create_user(email=email, password=password, username=username)

    res = client.post(
        reverse("login"),
        {"password": password, "email": email},
        format="json",
    )

    assert res.status_code == HTTP_200_OK
    assert ACCESS_COOKIE in res.cookies
    assert REFRESH_COOKIE in res.cookies
    assert res.data["user"]["email"] == email


@pytest.mark.django_db
def test_register():
    client = APIClient()
    username = "testuser"
    password = "testpassword"
    email = "test@test.com"

    res = client.post(
        reverse("register"),
        {
            "password": password,
            "password_confirm": password,
            "username": username,
            "email": email,
        },
        format="json",
    )

    assert res.status_code == HTTP_201_CREATED
    assert User.objects.filter(username=username).exists()
    assert ACCESS_COOKIE in res.cookies
    assert REFRESH_COOKIE in res.cookies


@pytest.mark.django_db
def test_logout():
    client = APIClient()
    username = "testuser"
    password = "testpassword"
    email = "test@test.com"

    User.objects.create_user(username=username, password=password, email=email)

    res = client.post(
        reverse("login"), {"email": email, "password": password}, format="json"
    )

    assert res.status_code == HTTP_200_OK

    res = client.post(reverse("logout"))
    assert res.status_code == HTTP_200_OK
    assert res.cookies[ACCESS_COOKIE].value == ""
    assert res.cookies[REFRESH_COOKIE].value == ""


@pytest.mark.django_db
def test_me_and_refresh():
    client = APIClient()
    email = "test@test.com"
    password = "testpassword"
    username = "testuser"
    User.objects.create_user(username=username, password=password, email=email)

    client.post(reverse("login"), {"email": email, "password": password}, format="json")

    me = client.get(reverse("me"))
    assert me.status_code == HTTP_200_OK
    assert me.data["user"]["username"] == username

    client.cookies.pop(ACCESS_COOKIE, None)
    refresh = client.post(reverse("token_refresh"))
    assert refresh.status_code == HTTP_200_OK
    assert ACCESS_COOKIE in refresh.cookies

    empty = APIClient()
    none_me = empty.get(reverse("me"))
    assert none_me.status_code == HTTP_200_OK
    assert none_me.data["user"] is None

    no_refresh = APIClient()
    missing = no_refresh.post(reverse("token_refresh"))
    assert missing.status_code == HTTP_204_NO_CONTENT


@pytest.mark.django_db
def test_me_with_expired_access_token():
    client = APIClient()
    user = User.objects.create_user(
        username="testuser",
        password="testpassword",
        email="test@test.com",
    )
    token = AccessToken.for_user(user)
    token.set_exp(from_time=timezone.now() - timedelta(hours=1))
    client.cookies[ACCESS_COOKIE] = str(token)

    me = client.get(reverse("me"))
    assert me.status_code == HTTP_200_OK
    assert me.data["user"] is None
