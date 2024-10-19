from typing import Iterable
import uuid


from django.db import models
from django.contrib.auth.models import User

from .utils import notebook_subtopic_order_next_val, notebook_topic_order_next_val


class Notebook(models.Model):
    notebook_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notebooks")
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    favorite = models.BooleanField(default=False)
    room_id = models.CharField(max_length=300, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.room_id:
            self.room_id = f"{self.title}-{self.notebook_id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class SharedNotebook(models.Model):
    PERMISSION_CHOICES = [
        ("admin", "Admin"),
        ("write", "Write"),
    ]

    shared_with = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="shared_users"
    )
    notebook = models.ForeignKey(
        Notebook, on_delete=models.CASCADE, related_name="shared_notebooks"
    )
    permission_type = models.CharField(max_length=10, choices=PERMISSION_CHOICES)
    shared_at = models.DateTimeField(auto_now_add=True)


class NotebookTopic(models.Model):
    topic_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    notebook = models.ForeignKey(
        Notebook, on_delete=models.CASCADE, related_name="topics"
    )
    title = models.CharField(max_length=255)
    order = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.order is None:
            self.order = notebook_topic_order_next_val()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class NotebookSubtopic(models.Model):
    subtopic_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    topic = models.ForeignKey(
        NotebookTopic, on_delete=models.CASCADE, related_name="subtopics"
    )
    title = models.CharField(max_length=255)
    order = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.order is None:
            self.order = notebook_subtopic_order_next_val()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
