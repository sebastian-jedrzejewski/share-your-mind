from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from shareyourmind.common.api.views import CategoryView
from shareyourmind.common.search_content import SearchAPIView
from shareyourmind.polls.api.views import (
    PollViewSet,
    PollAnswerViewSet,
    PollCommentViewSet,
)
from shareyourmind.questions.api.views import (
    QuestionViewSet,
    AnswerViewSet,
    UserLikedQuestionAPIView,
    UserLikedAnswerAPIView,
)
from shareyourmind.users.api.views import LogoutAPIView

api_router = DefaultRouter()

api_router.register("questions", QuestionViewSet, basename="question")
api_router.register("answers", AnswerViewSet, basename="answer")
api_router.register("polls", PollViewSet, basename="poll")
api_router.register("poll_answers", PollAnswerViewSet, basename="poll_answer")
api_router.register("poll_comments", PollCommentViewSet, basename="poll_comment")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.jwt")),
    path("auth/logout/", LogoutAPIView.as_view(), name="logout"),
    path("api/v1/", include(api_router.urls)),
    path("api/v1/categories/", CategoryView.as_view(), name="category-list"),
    path("api/v1/categories/<int:pk>/", CategoryView.as_view(), name="category-detail"),
    path(
        "api/v1/liked_questions/",
        UserLikedQuestionAPIView.as_view(),
        name="user_liked_questions",
    ),
    path(
        "api/v1/liked_answers/",
        UserLikedAnswerAPIView.as_view(),
        name="user_liked_answers",
    ),
    path("api/v1/search/", SearchAPIView.as_view(), name="search"),
]
