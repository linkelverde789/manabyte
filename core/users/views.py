from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User


class LoginView(APIView):
    permission_classes = [AllowAny]  # noqa: RUF012

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class RegisterView(APIView):
    permission_classes = [AllowAny]  # noqa: RUF012

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = User.objects.create_user(username=username, password=password)
        login(request, user)
        return Response(status=status.HTTP_201_CREATED)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  # noqa: RUF012

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
