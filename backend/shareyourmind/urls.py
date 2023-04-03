from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from shareyourmind.common.api.views import CategoryView
from shareyourmind.questions.api.views import QuestionViewSet, AnswerViewSet
from shareyourmind.users.api.views import LogoutAPIView

api_router = DefaultRouter()

api_router.register("questions", QuestionViewSet, basename="question")
api_router.register("answers", AnswerViewSet, basename="answer")

# TODO Create api router and order urls
urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.jwt")),
    path("auth/logout/", LogoutAPIView.as_view(), name="logout"),
    path("api/v1/", include(api_router.urls)),
    path("api/v1/categories/", CategoryView.as_view(), name="category-list"),
    path("api/v1/categories/<int:pk>/", CategoryView.as_view(), name="category-detail"),
]
