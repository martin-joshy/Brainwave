from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes

from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from .serializers import AdminUserTokenObtainPairSerializer, UserAdminSerializer


class AdminUserTokenObtainPairView(TokenObtainPairView):
    serializer_class = AdminUserTokenObtainPairSerializer


class UserListAdminView(generics.ListAPIView):
    queryset = User.objects.all().order_by("id")
    serializer_class = UserAdminSerializer
    permission_classes = [AllowAny]


class UserUpdateAdminViewSet(UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [AllowAny]


@api_view(["POST"])
@permission_classes([AllowAny])
def block_user(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    user.is_active = not user.is_active
    user.save()
    return Response(
        {"message": "User Blocked/Unblocked successfully"}, status=status.HTTP_200_OK
    )
