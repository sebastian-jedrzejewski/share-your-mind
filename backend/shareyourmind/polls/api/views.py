from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from permissions import IsPollOrPollAnswerAuthor, IsPollCommentAuthor
from shareyourmind.polls.api.serializers import (
    PollDetailSerializer,
    PollListSerializer,
    PollCreateSerializer,
    PollWithAnswersCreateSerializer,
    PollAnswerSerializer,
    PollAnswerCreateSerializer,
    PollCommentDetailSerializer,
    PollCommentListSerializer,
    PollCommentCreateSerializer,
)
from shareyourmind.polls.models import Poll, PollAnswer, PollComment


class PollViewSet(viewsets.ModelViewSet):
    permission_classes = [IsPollOrPollAnswerAuthor]
    serializer_class = PollDetailSerializer
    queryset = Poll.objects.all()

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            return super().get_permissions()
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == "list":
            return PollListSerializer
        elif self.action in ["partial_update", "update", "create"]:
            return PollCreateSerializer
        elif self.action == "create_with_answers":
            return PollWithAnswersCreateSerializer
        return super().get_serializer_class()

    @action(methods=["POST"], detail=False)
    def create_with_answers(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class PollAnswerViewSet(viewsets.ModelViewSet):
    permission_classes = [IsPollOrPollAnswerAuthor]
    serializer_class = PollAnswerSerializer
    queryset = PollAnswer.objects.all()

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            return super().get_permissions()
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action in ["partial_update", "update", "create"]:
            return PollAnswerCreateSerializer
        return super().get_serializer_class()


class PollCommentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsPollCommentAuthor]
    serializer_class = PollCommentDetailSerializer
    queryset = PollComment.objects.all()

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            return super().get_permissions()
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == "list":
            return PollCommentListSerializer
        elif self.action in ["partial_update", "update", "create"]:
            return PollCommentCreateSerializer
        return super().get_serializer_class()
