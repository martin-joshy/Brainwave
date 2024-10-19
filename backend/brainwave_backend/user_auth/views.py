from io import BytesIO

from PIL import Image

from rest_framework.permissions import AllowAny
from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework_simplejwt.tokens import RefreshToken

from allauth.account.utils import has_verified_email
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter

from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.views import LoginView

import requests

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.contrib.auth.password_validation import validate_password
from django.conf import settings
from django.urls import reverse

import json

from .models import Profile
from .serializers import UserProfileSerializer


class GoogleLogin(SocialLoginView):  # for Implicit Grant
    adapter_class = GoogleOAuth2Adapter


class CustomLoginView(LoginView):
    def get_response(self):
        original_response = super().get_response()
        user = self.user

        refresh = RefreshToken.for_user(user)
        custom_token = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        user_data = {
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_admin": user.is_staff,
        }

        original_response.data.update(custom_token)
        original_response.data["user"] = user_data

        return original_response

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        user = self.request.user
        if user and not user.is_staff and not has_verified_email(user):
            user_obj = User.objects.get(username=user)
            user_email = user_obj.email
            self.call_rest_resend_email_view(user_email)
            raise serializers.ValidationError(
                {
                    "detail": "Email address must be verified before you can log in. An Verification email has been send to you email, please verfiy.",
                    "is_verified": False,
                },
                code=status.HTTP_400_BAD_REQUEST,
            )
        return response

    def call_rest_resend_email_view(self, email):
        url = reverse("rest_resend_email")
        domain = settings.BACKEND_DOMAIN
        payload = {"email": email}
        full_url = domain + url
        response = requests.post(
            full_url,
            data=json.dumps(payload),
            headers={"Content-Type": "application/json"},
            timeout=10,
        )
        return response


class ValidatePasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        password = request.data.get("password")
        try:
            validate_password(password)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ValidationError as e:
            return Response({"detail": e.messages}, status=status.HTTP_200_OK)


class ValidateUsernameView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        if username:
            if User.objects.filter(username=username).exists():
                return Response(
                    {"is_available": False},
                    status=status.HTTP_200_OK,
                )
            return Response({"is_available": True}, status=status.HTTP_200_OK)
        elif username == "":
            return Response()  # fix this later


class UploadCroppedImageView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        image_file = request.FILES.get("image")
        cropping_rect = json.loads(request.data.get("croppingRect"))

        user = request.user
        profile, created = Profile.objects.get_or_create(user=user)

        image = Image.open(image_file)

        x = int(cropping_rect["x"] * image.width)
        y = int(cropping_rect["y"] * image.height)
        width = int(cropping_rect["width"] * image.width)
        height = int(cropping_rect["height"] * image.height)

        cropped_image = image.crop((x, y, x + width, y + height))

        cropped_image_io = BytesIO()
        cropped_image.save(cropped_image_io, format="PNG")
        cropped_image_io.seek(0)

        filename = f"{user.username}_avatar.png"
        content_file = ContentFile(cropped_image_io.read(), filename)

        if profile.avatar:
            profile.avatar.delete()

        profile.avatar.save(filename, content_file, save=True)

        return Response(
            {"message": "Image saved successfully", "fileUrl": profile.avatar.url},
            status=status.HTTP_200_OK,
        )


class UserProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):

        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        user = request.user
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
