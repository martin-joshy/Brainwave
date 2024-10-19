from dj_rest_auth.serializers import PasswordResetSerializer
from rest_framework import serializers

from django.contrib.auth.models import User
from django.conf import settings

from notebook_management.models import SharedNotebook

from .models import Profile

RESET_PASSWORD_REDIRECT_URL = settings.RESET_PASSWORD_REDIRECT_URL


def custom_url_generator(request, user, temp_key):
    return f"{RESET_PASSWORD_REDIRECT_URL}?uid={user.id}&token={temp_key}"


class CustomPasswordResetSerializer(PasswordResetSerializer):
    def get_email_options(self):
        return {"url_generator": custom_url_generator}


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["avatar", "color"]


class UserProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(many=False)
    permission_type = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "profile",
            "permission_type",
        ]
        read_only_fields = ["username", "email"]

    def get_permission_type(self, obj):
        notebook = self.context.get("notebook_instance")
        shared_notebook = SharedNotebook.objects.filter(
            shared_with=obj, notebook=notebook
        ).first()
        return shared_notebook.permission_type if shared_notebook else None
