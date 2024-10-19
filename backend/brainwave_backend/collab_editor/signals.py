import os
import requests
from dotenv import load_dotenv

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from notebook_management.models import Notebook

from notebook_management.models import SharedNotebook

load_dotenv()

# perforing various actions on notebook creation on the liveblocks server


@receiver(post_save, sender=Notebook)
def create_room(instance, created, **kwargs):
    if created:
        auth_token = os.getenv("LIVEBLOCKS_SECRET")

        url = "https://api.liveblocks.io/v2/rooms"

        headers = {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json",
        }

        data = {
            "id": instance.room_id,
            "defaultAccesses": ["room:write"],
            "usersAccesses": {instance.user.username: ["room:write"]},
        }

        response = requests.post(url, headers=headers, json=data, timeout=10)

        if response.status_code == 201 or response.status_code == 200:
            try:
                shared_notebook = SharedNotebook.objects.create(
                    shared_with=instance.user,
                    notebook=instance,
                    permission_type="admin",
                )
            except Exception as e:
                print(f"Failed to create shared notebook: {e}")
            print("Room created successfully!")
        else:
            print(f"Failed to create room. Status code: {response.status_code}")


@receiver(post_delete, sender=Notebook)
def delete_room(instance, **kwargs):
    auth_token = os.getenv("LIVEBLOCKS_SECRET")

    url = f"https://api.liveblocks.io/v2/rooms/{instance.room_id}"

    headers = {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json",
    }

    response = requests.delete(url, headers=headers, timeout=10)

    if response.status_code == 204:
        print("Room deleted successfully!")
    else:
        print(f"Failed to delete room. Status code: {response.status_code}")
