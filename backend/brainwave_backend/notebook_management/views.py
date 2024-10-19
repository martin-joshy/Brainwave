import json
import uuid

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics

from langchain_google_vertexai import ChatVertexAI
from langchain_core.prompts import ChatPromptTemplate

from dotenv import load_dotenv

from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from django.contrib.auth.models import User
from django.db import transaction

from .prompts import system_message, required_format, example_response
from .serializers import (
    NotebookSerializer,
    SwapSubtopicOrderSerializer,
    SwapTopicOrderSerializer,
    NotebookSubtopicSerializer,
    FavoriteNotebookSerializer,
    NotebookListSerializer,
    SharedNotebookSerializer,
)
from .models import Notebook, NotebookTopic, NotebookSubtopic, SharedNotebook


load_dotenv()


class GenerateTopicsView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        try:
            topic = request.data.get("topic")
            expertise = request.data.get("expertise")

            if not topic or not expertise:
                return Response(
                    {"error": "Topic and expertise are required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            llm = ChatVertexAI(model_name="gemini-1.5-flash", temperature=0.4)

            system_prompt = system_message.format(
                required_format=required_format, example_response=example_response
            )

            prompt = ChatPromptTemplate.from_messages(
                [
                    ("system", system_prompt),
                    ("human", "Topic: {topic}Level of expertise: {expertise}"),
                ]
            )

            chain = prompt | llm
            response = chain.invoke(
                {
                    "topic": {topic},
                    "expertise": {expertise},
                }
            )

            json_data = json.loads(response.content)

            transformed_response = []
            for title, subtopics in json_data.items():
                transformed_response.append(
                    {
                        "topic_id": str(uuid.uuid4()),
                        "title": title,
                        "subtopics": [
                            {"subtopic_id": str(uuid.uuid4()), "title": subtopic}
                            for subtopic in subtopics
                        ],
                    }
                )
            return Response(transformed_response, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class NotebookCreateView(APIView):

    def post(self, request):
        serializer = NotebookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Assuming the user is authenticated
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotebookDetailView(generics.RetrieveAPIView):

    permission_classes = [AllowAny]
    queryset = Notebook.objects.all()
    serializer_class = NotebookSerializer
    lookup_field = "notebook_id"

    def get_queryset(self):
        return Notebook.objects.prefetch_related(
            Prefetch(
                "topics",
                queryset=NotebookTopic.objects.all()
                .prefetch_related(
                    Prefetch(
                        "subtopics", queryset=NotebookSubtopic.objects.order_by("order")
                    )
                )
                .order_by("order"),
            )
        )

    def get(self, request, *args, **kwargs):
        notebook_id = kwargs.get("notebook_id")
        try:
            notebook = self.get_queryset().get(notebook_id=notebook_id)
            serializer = self.get_serializer(notebook)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Notebook.DoesNotExist:
            return Response(
                {"error": "Notebook not found"}, status=status.HTTP_404_NOT_FOUND
            )


class AddSubtopicView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, notebook_id, topic_id):
        notebook = get_object_or_404(
            Notebook, notebook_id=notebook_id, user=request.user
        )
        topic = get_object_or_404(NotebookTopic, topic_id=topic_id, notebook=notebook)

        title = request.data.get("title")
        if not title:
            return Response(
                {"error": "Title is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        subtopic = NotebookSubtopic.objects.create(
            topic=topic,
            title=title,
        )
        serializer = NotebookSubtopicSerializer(subtopic)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SwapTopicOrderView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SwapTopicOrderSerializer(data=request.data)
        if serializer.is_valid():
            topic_1 = NotebookTopic.objects.get(
                topic_id=serializer.validated_data["topic_id_1"]
            )
            topic_2 = NotebookTopic.objects.get(
                topic_id=serializer.validated_data["topic_id_2"]
            )

            with transaction.atomic():
                topic_1.order, topic_2.order = topic_2.order, topic_1.order
                topic_1.save()
                topic_2.save()

            return Response(
                {
                    "message": "Topic orders swapped successfully",
                    "topic_1": {
                        "topic_id": str(topic_1.topic_id),
                        "order": topic_1.order,
                    },
                    "topic_2": {
                        "topic_id": str(topic_2.topic_id),
                        "order": topic_2.order,
                    },
                },
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SwapSubtopicOrderView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SwapSubtopicOrderSerializer(data=request.data)
        if serializer.is_valid():
            subtopic_1 = NotebookSubtopic.objects.get(
                subtopic_id=serializer.validated_data["subtopic_id_1"]
            )
            subtopic_2 = NotebookSubtopic.objects.get(
                subtopic_id=serializer.validated_data["subtopic_id_2"]
            )

            with transaction.atomic():
                subtopic_1.order, subtopic_2.order = subtopic_2.order, subtopic_1.order
                subtopic_1.save()
                subtopic_2.save()

            return Response(
                {
                    "message": "Subtopic orders swapped successfully",
                    "subtopic_1": {
                        "subtopic_id": str(subtopic_1.subtopic_id),
                        "order": subtopic_1.order,
                    },
                    "subtopic_2": {
                        "subtopic_id": str(subtopic_2.subtopic_id),
                        "order": subtopic_2.order,
                    },
                },
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FavoriteNotebooksView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FavoriteNotebookSerializer

    def get_queryset(self):
        return Notebook.objects.filter(user=self.request.user, favorite=True)


class UpdateFavoriteStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, notebook_id):
        notebook = get_object_or_404(
            Notebook, notebook_id=notebook_id, user=request.user
        )
        favorite_status = request.data.get("favorite")

        if favorite_status is None:
            return Response(
                {"error": "Favorite status is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        notebook.favorite = favorite_status
        notebook.save()
        serializer = FavoriteNotebookSerializer(notebook)
        return Response(serializer.data, status=status.HTTP_200_OK)


class NotebookListView(generics.ListAPIView):
    serializer_class = NotebookListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return self.request.user.notebooks.all()


class NotebookDeleteView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, notebook_id):
        notebook = get_object_or_404(
            Notebook, notebook_id=notebook_id, user=request.user
        )
        notebook.delete()

        return Response(
            {"message": "Notebook deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )


class SharedNotebookDetailView(NotebookDetailView):
    def get(self, request, *args, **kwargs):
        user = request.user
        notebook_id = kwargs.get("notebook_id")
        notebook_obj = Notebook.objects.get(notebook_id=notebook_id)
        has_permission = SharedNotebook.objects.filter(
            notebook=notebook_obj, shared_with=user
        ).exists()
        if not has_permission:
            return Response(
                {"error": "You do not have permission to access this notebook."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().get(request, *args, **kwargs)


class SharedUsersListView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = SharedNotebookSerializer

    def get(self, request, *args, **kwargs):
        notebook_id = kwargs.get("notebook_id")
        try:
            shared_users = (
                SharedNotebook.objects.filter(notebook_id=notebook_id)
                .exclude(permission_type="admin")
                .select_related("shared_with")
            )
            serializer = self.get_serializer(shared_users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except SharedNotebook.DoesNotExist:
            return Response(
                {"detail": "Shared users not found."}, status=status.HTTP_404_NOT_FOUND
            )
