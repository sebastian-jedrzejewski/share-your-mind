from rest_framework import viewsets
from rest_framework.permissions import AllowAny, SAFE_METHODS, IsAuthenticated

from permissions import IsQuestionOrAnswerAuthor
from shareyourmind.questions.api.serializers import (
    QuestionDetailSerializer,
    QuestionListSerializer,
    QuestionCreateSerializer,
    AnswerDetailSerializer,
    AnswerListSerializer,
    AnswerCreateSerializer,
)
from shareyourmind.questions.models import Question, Answer


class QuestionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsQuestionOrAnswerAuthor]
    serializer_class = QuestionDetailSerializer
    queryset = Question.objects.filter(categories__is_active=True)

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [AllowAny()]
        elif self.action == "create":
            return [IsAuthenticated()]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action == "list":
            return QuestionListSerializer
        elif self.action in ["create", "partial_update"]:
            return QuestionCreateSerializer
        else:
            return self.serializer_class


class AnswerViewSet(viewsets.ModelViewSet):
    permission_classes = [IsQuestionOrAnswerAuthor]
    serializer_class = AnswerDetailSerializer
    queryset = Answer.objects.filter(question__categories__is_active=True)

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [AllowAny()]
        elif self.action == "create":
            return [IsAuthenticated()]
        else:
            return super().get_permissions()

    def get_serializer_class(self):
        if self.action == "list":
            return AnswerListSerializer
        elif self.action in ["create", "partial_update"]:
            return AnswerCreateSerializer
        else:
            return self.serializer_class
