from django.urls import path
from .views import (
    IdentifyUserView,
    AddUserToCollaborativeEditor,
    SharedNotebookListView,
    ResolveUserInfoView,
    ResolveRoomUsersView,
    UpdateEditorAccess,
    RemoveSelfFromCollaborativeEditor,
    UsersWithAccessView,
)


urlpatterns = [
    path("identify-user/", IdentifyUserView.as_view(), name="identify_user"),
    path(
        "add-user/", AddUserToCollaborativeEditor.as_view(), name="add_user_to_editor"
    ),
    path(
        "shared-notebooks/", SharedNotebookListView.as_view(), name="shared-notebooks"
    ),
    path("resolve-user/", ResolveUserInfoView.as_view(), name="resolve_user_info"),
    path(
        "resolve-room-users/", ResolveRoomUsersView.as_view(), name="resolve_room_users"
    ),
    path(
        "update-editor-access/",
        UpdateEditorAccess.as_view(),
        name="update_editor_access",
    ),
    path(
        "remove-self-from-editor/",
        RemoveSelfFromCollaborativeEditor.as_view(),
        name="remove_self_from_editor",
    ),
    path("users-with-access/", UsersWithAccessView.as_view(), name="users_with_access"),
]
