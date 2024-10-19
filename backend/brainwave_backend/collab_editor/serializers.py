from rest_framework import serializers
from notebook_management.models import SharedNotebook


class SharedNotebookSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedNotebook
        fields = ["id", "shared_with", "notebook", "permission_type", "shared_at"]
        read_only_fields = ["shared_at"]


class UserSharedNotebookSerializer(serializers.ModelSerializer):
    notebook_id = serializers.UUIDField(source="notebook.notebook_id")
    title = serializers.CharField(source="notebook.title")

    class Meta:
        model = SharedNotebook
        fields = ["notebook_id", "title", "permission_type", "shared_at"]
