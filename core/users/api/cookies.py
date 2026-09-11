from datetime import timedelta

from django.conf import settings
from django.http import HttpResponse
from rest_framework_simplejwt.settings import api_settings as jwt_settings
from rest_framework_simplejwt.tokens import RefreshToken

ACCESS_COOKIE = "manabyte_access"
REFRESH_COOKIE = "manabyte_refresh"

REFRESH_SHORT = timedelta(days=1)
REFRESH_LONG = timedelta(days=30)


def get_refresh_token(request) -> str | None:
    return request.COOKIES.get(REFRESH_COOKIE)


def tokens_for_user(user, *, remember_me: bool = False) -> dict[str, str]:
    refresh = RefreshToken.for_user(user)
    refresh["remember_me"] = remember_me
    return {"access": str(refresh.access_token), "refresh": str(refresh)}


def set_auth_cookies(
    response: HttpResponse,
    tokens: dict[str, str],
    *,
    remember_me: bool = False,
) -> HttpResponse:
    common = {
        "httponly": True,
        "secure": not settings.DEBUG,
        "samesite": "Lax",
        "path": "/",
    }
    refresh_lifetime = REFRESH_LONG if remember_me else REFRESH_SHORT
    response.set_cookie(
        ACCESS_COOKIE,
        tokens["access"],
        max_age=int(jwt_settings.ACCESS_TOKEN_LIFETIME.total_seconds()),
        **common,
    )
    response.set_cookie(
        REFRESH_COOKIE,
        tokens["refresh"],
        max_age=int(refresh_lifetime.total_seconds()),
        **common,
    )
    return response


def clear_auth_cookies(response: HttpResponse) -> HttpResponse:
    for name in (ACCESS_COOKIE, REFRESH_COOKIE):
        response.delete_cookie(name, path="/", samesite="Lax")
    return response
