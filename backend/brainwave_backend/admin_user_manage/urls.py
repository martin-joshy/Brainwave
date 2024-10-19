from django.urls import path

from .views import (
    UserUpdateAdminViewSet,
    AdminUserTokenObtainPairView,
    UserListAdminView,
    block_user,
)


urlpatterns = [
    path(
        "token/",
        AdminUserTokenObtainPairView.as_view(),
        name="get-admin-token",
    ),
    path("user/", UserListAdminView.as_view(), name="list-user"),
    path(
        "user/<int:pk>/update/",
        UserUpdateAdminViewSet.as_view(),
        name="user-update",
    ),
    path("user/<int:user_id>/block/", block_user, name="block-user"),
]
