from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import serializers

from django.contrib.auth.models import User


class AdminUserTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        if not self.user.is_staff:
            raise AuthenticationFailed("User does not have staff privileges.")

        return data


class UserAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "date_joined",
            "is_active",
        ]
        read_only_fields = ["date_joined", "username", "id", "email"]
