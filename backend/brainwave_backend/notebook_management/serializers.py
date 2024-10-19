import uuid
from rest_framework import serializers
from .models import Notebook, NotebookTopic, NotebookSubtopic, SharedNotebook
from django.contrib.auth.models import User


class NotebookSubtopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotebookSubtopic
        fields = ["subtopic_id", "title", "order", "created_at"]
        extra_kwargs = {"order": {"required": False}}

    def create(self, validated_data):
        subtopic_id = validated_data.get("subtopic_id")
        if not subtopic_id:
            subtopic_id = uuid.uuid4()
        return NotebookSubtopic.objects.create(
            **validated_data, subtopic_id=subtopic_id
        )


class NotebookTopicSerializer(serializers.ModelSerializer):
    subtopics = NotebookSubtopicSerializer(many=True)

    class Meta:
        model = NotebookTopic
        fields = ["topic_id", "title", "order", "subtopics", "created_at"]
        extra_kwargs = {"order": {"required": False}}

    def create(self, validated_data):
        subtopics_data = validated_data.pop("subtopics")
        topic_id = validated_data.get("topic_id")
        if not topic_id:
            topic_id = uuid.uuid4()
        topic = NotebookTopic.objects.create(**validated_data, topic_id=topic_id)
        for subtopic_data in subtopics_data:
            subtopic_id = subtopic_data.get("subtopic_id")
            if not subtopic_id:
                subtopic_id = uuid.uuid4()
            NotebookSubtopic.objects.create(
                topic=topic, subtopic_id=subtopic_id, **subtopic_data
            )
        return topic


class NotebookSerializer(serializers.ModelSerializer):
    topics = NotebookTopicSerializer(many=True)

    class Meta:
        model = Notebook
        fields = ["notebook_id", "title", "topics", "created_at", "room_id"]

    def create(self, validated_data):
        topics_data = validated_data.pop("topics")
        notebook_id = validated_data.get("notebook_id")
        if not notebook_id:
            notebook_id = uuid.uuid4()
        notebook = Notebook.objects.create(**validated_data, notebook_id=notebook_id)

        for topic_data in topics_data:
            subtopics_data = topic_data.pop("subtopics")
            topic_id = topic_data.get("topic_id")
            if not topic_id:
                topic_id = uuid.uuid4()
            topic = NotebookTopic.objects.create(
                notebook=notebook, topic_id=topic_id, **topic_data
            )
            for subtopic_data in subtopics_data:
                subtopic_id = subtopic_data.get("subtopic_id")
                if not subtopic_id:
                    subtopic_id = uuid.uuid4()
                NotebookSubtopic.objects.create(
                    topic=topic, subtopic_id=subtopic_id, **subtopic_data
                )

        return notebook


class FavoriteNotebookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notebook
        fields = ["notebook_id", "title", "favorite"]


class NotebookListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notebook
        fields = ["notebook_id", "title", "created_at"]


class SwapSubtopicOrderSerializer(serializers.Serializer):
    subtopic_id_1 = serializers.UUIDField()
    subtopic_id_2 = serializers.UUIDField()

    def validate(self, data):
        if not NotebookSubtopic.objects.filter(
            subtopic_id=data["subtopic_id_1"]
        ).exists():
            raise serializers.ValidationError(
                "Subtopic with subtopic_id_1 does not exist."
            )
        if not NotebookSubtopic.objects.filter(
            subtopic_id=data["subtopic_id_2"]
        ).exists():
            raise serializers.ValidationError(
                "Subtopic with subtopic_id_2 does not exist."
            )
        return data


class SwapTopicOrderSerializer(serializers.Serializer):
    topic_id_1 = serializers.UUIDField()
    topic_id_2 = serializers.UUIDField()

    def validate(self, data):
        if not NotebookTopic.objects.filter(topic_id=data["topic_id_1"]).exists():
            raise serializers.ValidationError("Topic with topic_id_1 does not exist.")
        if not NotebookTopic.objects.filter(topic_id=data["topic_id_2"]).exists():
            raise serializers.ValidationError("Topic with topic_id_2 does not exist.")
        return data


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["username", "full_name"]

    def get_full_name(self, obj):
        return obj.get_full_name()


class SharedNotebookSerializer(serializers.ModelSerializer):
    shared_with = UserSerializer()

    class Meta:
        model = SharedNotebook
        fields = ["shared_with", "permission_type"]
