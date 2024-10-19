from django.urls import path
from .views import (
    GenerateTopicsView,
    NotebookCreateView,
    NotebookDetailView,
    AddSubtopicView,
    SwapSubtopicOrderView,
    SwapTopicOrderView,
    UpdateFavoriteStatusView,
    FavoriteNotebooksView,
    NotebookListView,
    NotebookDeleteView,
    SharedNotebookDetailView,
    SharedUsersListView,
)

urlpatterns = [
    path("generate-topics/", GenerateTopicsView.as_view(), name="generate-topics"),
    path("notebook/", NotebookCreateView.as_view(), name="notebook-create"),
    path(
        "notebook/<str:notebook_id>/",
        NotebookDetailView.as_view(),
        name="notebook-detail",
    ),
    path(
        "notebook/<str:notebook_id>/topic/<str:topic_id>/subtopic/",
        AddSubtopicView.as_view(),
        name="add-subtopic",
    ),
    path("swap-topic-order/", SwapTopicOrderView.as_view(), name="swap-topic-order"),
    path(
        "swap-subtopic-order/",
        SwapSubtopicOrderView.as_view(),
        name="swap-subtopic-order",
    ),
    path(
        "notebooks/favorites/",
        FavoriteNotebooksView.as_view(),
        name="favorite-notebooks",
    ),
    path(
        "notebooks/<uuid:notebook_id>/favorite/",
        UpdateFavoriteStatusView.as_view(),
        name="update-favorite-status",
    ),
    path("notebooks/list/", NotebookListView.as_view(), name="notebooks-list"),
    path(
        "notebooks/<uuid:notebook_id>/delete/",
        NotebookDeleteView.as_view(),
        name="notebook-delete",
    ),
    path(
        "shared-notebook/<str:notebook_id>/",
        SharedNotebookDetailView.as_view(),
        name="shared-notebook-detail",
    ),
    path(
        "shared-users/",
        SharedUsersListView.as_view(),
        name="shared-users-list",
    ),
]
