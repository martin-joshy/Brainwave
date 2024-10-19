import os
import requests
from dotenv import load_dotenv

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser

from django.contrib.auth.models import User
from collab_editor.serializers import (
    SharedNotebookSerializer,
    UserSharedNotebookSerializer,
)
from notebook_management.models import Notebook, SharedNotebook
from user_auth.serializers import UserProfileSerializer

load_dotenv()


class IdentifyUserView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        try:
            user = request.user
            user_obj = User.objects.get(username=user)
            if not user_obj:
                return Response(
                    {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
                )

            payload = {
                "userId": user_obj.username,
                "userInfo": {
                    "name": user_obj.get_full_name(),
                    "color": user_obj.profile.color,
                    "avatar": (
                        user_obj.profile.avatar.url if user_obj.profile.avatar else None
                    ),
                    "username": user_obj.username,
                },
            }

            url = "https://api.liveblocks.io/v2/identify-user"

            auth_token = os.getenv("LIVEBLOCKS_SECRET")

            headers = {
                "Authorization": f"Bearer {auth_token}",
                "Content-Type": "application/json",
            }

            response = requests.post(url, headers=headers, json=payload, timeout=10)

            if response.status_code == 200:
                return Response(
                    {"token": response.json().get("token")}, status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"error": "Failed to obtain token"}, status=response.status_code
                )

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CollaborativeEditorUserBase(APIView):
    permission_classes = [AllowAny]

    username: str
    permission_level: str
    notebook_id: int
    user: User
    main_notebook: Notebook

    def post(self, request):
        validation_error = self.perform_validation(request)
        if validation_error:
            return validation_error

        auth_token = os.getenv("LIVEBLOCKS_SECRET")
        liveblocks_url = "https://api.liveblocks.io/v2/rooms/"
        headers = {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json",
        }
        if self.permission_level == "null":
            permission = None
        else:
            permission = [f"room:{self.permission_level}"]

        data = {"usersAccesses": {self.username: permission}}
        print(data)

        try:
            response = requests.post(
                f"{liveblocks_url}{self.main_notebook.room_id}",
                json=data,
                headers=headers,
                timeout=10,
            )

            if response.status_code != 200:
                return Response(
                    {"error": "Failed to set permission on Liveblocks."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return self.sync_db_with_liveblocks()

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def perform_validation(self, request):
        """
        This method should be overridden by subclasses to perform
        specific validations related to the request.
        """
        pass

    def sync_db_with_liveblocks(self):
        """
        This method should be overridden by subclasses to handle
        database synchronization after the Liveblocks API call.
        """
        pass


class UpdateEditorAccess(CollaborativeEditorUserBase):
    def post(self, request):
        self.username = request.data.get("username")
        self.permission_level = request.data.get("permission_level")
        self.notebook_id = request.data.get("notebook_id")
        self.main_notebook = Notebook.objects.get(notebook_id=self.notebook_id)

        if not all([self.username, self.permission_level, self.notebook_id]):
            return Response(
                {"error": "Username, permission level, and notebook ID are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return super().post(request)

    def perform_validation(self, request):

        has_admin_access = SharedNotebook.objects.filter(
            shared_with=request.user,
            notebook=self.main_notebook,
            permission_type="admin",
        ).exists()

        if not has_admin_access:
            return Response(
                {"error": "User does not have admin access to this notebook."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            self.user = User.objects.get(username=self.username)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        notebook_shared_with_user = SharedNotebook.objects.filter(
            shared_with=self.user, notebook=self.main_notebook
        )

        if (
            notebook_shared_with_user.exists()
            and notebook_shared_with_user[0].permission_type == self.permission_level
        ):
            return Response(
                {"error": "User already has access to this notebook."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return None

    def sync_db_with_liveblocks(self):

        if self.permission_level != "null":
            shared_notebook, created = SharedNotebook.objects.update_or_create(
                shared_with=self.user,
                notebook=self.main_notebook,
                permission_type=self.permission_level,
            )
            serializer = UserProfileSerializer(
                self.user, context={"notebook_instance": self.main_notebook}
            )

            return Response(serializer.data, status=status.HTTP_200_OK)

        elif self.permission_level == "null":
            SharedNotebook.objects.filter(
                shared_with=self.user, notebook=self.main_notebook
            ).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)


class RemoveSelfFromCollaborativeEditor(CollaborativeEditorUserBase):
    def post(self, request):
        self.notebook_id = request.data.get("notebook_id")
        self.permission_level = "null"
        self.user = request.user
        self.username = request.user.username

        if not self.notebook_id:
            return Response(
                {"error": "Notebook ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return super().post(request)

    def perform_validation(self, request):
        try:
            self.main_notebook = Notebook.objects.get(notebook_id=self.notebook_id)
        except Notebook.DoesNotExist:
            return Response(
                {"error": "Notebook not found."}, status=status.HTTP_404_NOT_FOUND
            )

        has_access = SharedNotebook.objects.filter(
            shared_with=self.user, notebook=self.main_notebook
        ).exists()

        if not has_access:
            return Response(
                {"error": "User does not have access to this notebook."},
                status=status.HTTP_403_FORBIDDEN,
            )

        return None

    def sync_db_with_liveblocks(self):

        shared_notebook = SharedNotebook.objects.get(
            shared_with=self.user, notebook=self.main_notebook
        )

        shared_notebook.delete()


class AddUserToCollaborativeEditor(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        permission_level = request.data.get("permission_level")
        notebook_id = request.data.get("notebook_id")

        if not username or not permission_level or not notebook_id:
            return Response(
                {"error": "Username, permission level, and notebook ID are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            main_notebook = Notebook.objects.get(notebook_id=notebook_id)
        except Notebook.DoesNotExist:
            return Response(
                {"error": "Notebook not found."}, status=status.HTTP_404_NOT_FOUND
            )

        if SharedNotebook.objects.filter(
            shared_with=user, notebook=main_notebook
        ).exists():
            return Response(
                {"error": "User already has access to this notebook."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        auth_token = os.getenv("LIVEBLOCKS_SECRET")
        liveblocks_url = "https://api.liveblocks.io/v2/rooms/"
        headers = {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json",
        }
        data = {"usersAccesses": {username: [f"room:{permission_level}"]}}

        try:
            response = requests.post(
                f"{liveblocks_url}{main_notebook.room_id}",
                json=data,
                headers=headers,
                timeout=10,
            )

            if response.status_code != 200:
                return Response(
                    {"error": "Failed to set permission on Liveblocks."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            shared_notebook = SharedNotebook.objects.create(
                shared_with=user,
                notebook=main_notebook,
                permission_type=permission_level,
            )

            serializer = SharedNotebookSerializer(shared_notebook)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SharedNotebookListView(generics.ListAPIView):
    serializer_class = UserSharedNotebookSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = self.request.user
        return SharedNotebook.objects.filter(shared_with=user, permission_type="write")


class UsersWithAccessView(APIView):

    def post(self, request, *args, **kwargs):
        notebook_id = request.data.get("notebook_id")
        notebook_instance = Notebook.objects.get(notebook_id=notebook_id)
        if not notebook_id:
            return Response(
                {"error": "Notebook ID is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        users = User.objects.filter(shared_users__notebook=notebook_instance).distinct()
        serializer = UserProfileSerializer(
            users, many=True, context={"notebook_instance": notebook_instance}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)


class ResolveUserInfoView(APIView):

    def post(self, request, *args, **kwargs):
        usernames = request.data.get("userIds", [])
        result = []

        for username in usernames:
            try:
                user = User.objects.get(username=username)
                avatar_url = user.profile.avatar.url if user.profile.avatar else ""
                result.append(
                    {
                        "name": user.username,
                        "avatar": request.build_absolute_uri(avatar_url),
                    }
                )
            except User.DoesNotExist:
                result.append(
                    {
                        "name": "Unknown User",
                        "avatar": "",
                    }
                )

            except Exception as e:
                return Response(
                    {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        return Response(result, status=status.HTTP_200_OK)


class ResolveRoomUsersView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        room_id = request.data.get("roomId")
        if not room_id:
            return Response(
                {"error": "roomId is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        auth_token = os.getenv("LIVEBLOCKS_SECRET")
        url = f"https://api.liveblocks.io/v2/rooms/{room_id}"
        headers = {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json",
        }

        try:

            response = requests.get(url, headers=headers, timeout=10)

            if response.status_code == 200:

                users_accesses = response.json().get("usersAccesses", [])
                users = list(users_accesses.keys())

                return Response(users, status=status.HTTP_200_OK)
            else:
                print(response)
                return Response(
                    {"error": "Failed to fetch rooms"}, status=response.status_code
                )

        except requests.exceptions.RequestException as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
