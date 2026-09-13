from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from users.api.cookies import (
    clear_auth_cookies,
    get_refresh_token,
    set_auth_cookies,
    tokens_for_user,
)
from users.api.serializers import (
    AuthResponseSerializer,
    LoginSerializer,
    RegisterSerializer,
)
from users.models import User


def _auth_response(user, *, status_code, remember_me: bool = False):
    response = Response(
        AuthResponseSerializer(
            {
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "username": user.username,
                    "profile_picture": None,
                }
            }
        ).data,
        status=status_code,
    )
    return set_auth_cookies(
        response,
        tokens_for_user(user, remember_me=remember_me),
        remember_me=remember_me,
    )


class LoginView(APIView):
    permission_classes = [AllowAny]  # noqa: RUF012

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]
        remember_me = serializer.validated_data.get("remember_me", False)

        user = User.objects.filter(email__iexact=email).first()
        if user is None or not authenticate(
            request, username=user.username, password=password
        ):
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        return _auth_response(
            user, status_code=status.HTTP_200_OK, remember_me=remember_me
        )


class RegisterView(APIView):
    permission_classes = [AllowAny]  # noqa: RUF012

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.create_user(
            username=serializer.validated_data["username"],
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )
        return _auth_response(user, status_code=status.HTTP_201_CREATED)


class LogoutView(APIView):
    permission_classes = [AllowAny]  # noqa: RUF012

    def post(self, request):
        return clear_auth_cookies(Response(status=status.HTTP_200_OK))


class MeView(APIView):
    permission_classes = [AllowAny]  # noqa: RUF012

    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"user": None})

        return Response(
            AuthResponseSerializer(
                {
                    "user": {
                        "id": request.user.id,
                        "email": request.user.email,
                        "username": request.user.username,
                        "profile_picture": None,
                    }
                },
                context={"request": request},
            ).data,
        )


class CookieTokenRefreshView(APIView):
    permission_classes = [AllowAny]  # noqa: RUF012

    def post(self, request):
        refresh_value = get_refresh_token(request)

        if not refresh_value:
            return clear_auth_cookies(Response(status=status.HTTP_204_NO_CONTENT))

        try:
            refresh = RefreshToken(refresh_value)
            remember_me = bool(refresh.get("remember_me", False))
            tokens = {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        except TokenError:
            return clear_auth_cookies(Response(status=status.HTTP_401_UNAUTHORIZED))

        response = Response(status=status.HTTP_200_OK)
        return set_auth_cookies(response, tokens, remember_me=remember_me)
