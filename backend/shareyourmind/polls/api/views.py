from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

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
from shareyourmind.polls.models import (
    Poll,
    PollAnswer,
    PollComment,
    UserVotedPollAnswer,
    UserLikedPollComment,
)


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

    @action(methods=["POST"], detail=True)
    def vote(self, request, *args, **kwargs):
        poll_answer = self.get_object()
        user = request.user
        voted_poll_answer = UserVotedPollAnswer.objects.filter(
            user=user, poll_answer=poll_answer
        ).first()
        if voted_poll_answer is not None:
            return Response(
                data={"Error": "Cannot vote the answer second time!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        UserVotedPollAnswer.objects.create(user=user, poll_answer=poll_answer)
        poll_answer.votes = poll_answer.votes + 1
        poll_answer.save(update_fields=["votes"])
        data = self.get_serializer_class()(instance=poll_answer).data
        return Response(data=data, status=status.HTTP_200_OK)


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

    @action(methods=["POST"], detail=True)
    def like(self, request, *args, **kwargs):
        poll_comment = self.get_object()
        user = request.user
        liked_poll_comment = UserLikedPollComment.objects.filter(
            user=user, poll_comment=poll_comment
        ).first()
        if liked_poll_comment is not None:
            return Response(
                data={"Error": "Cannot like the poll comment second time!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        UserLikedPollComment.objects.create(user=user, poll_comment=poll_comment)
        poll_comment.likes = poll_comment.likes + 1
        poll_comment.save(update_fields=["likes"])
        data = self.get_serializer_class()(instance=poll_comment).data
        return Response(data=data, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=True)
    def dislike(self, request, *args, **kwargs):
        poll_comment = self.get_object()
        user = request.user
        liked_poll_comment = UserLikedPollComment.objects.filter(
            user=user, poll_comment=poll_comment
        ).first()
        if liked_poll_comment is None:
            return Response(
                data={
                    "Error": "Cannot dislike the poll comment that has not been liked!"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        liked_poll_comment.delete()
        poll_comment.likes = poll_comment.likes - 1
        poll_comment.save(update_fields=["likes"])
        data = self.get_serializer_class()(instance=poll_comment).data
        return Response(data=data, status=status.HTTP_200_OK)


class UserVotedPollAnswerAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        voted_poll_answers = UserVotedPollAnswer.objects.filter(user=user)
        voted_poll_answers_ids = list(
            voted_poll_answers.values_list("poll_answer_id", flat=True)
        )
        return Response(
            data={"voted_poll_answers_ids": voted_poll_answers_ids},
            status=status.HTTP_200_OK,
        )


class UserLikedPollCommentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        liked_poll_comments = UserLikedPollComment.objects.filter(user=user)
        liked_poll_comments_ids = list(
            liked_poll_comments.values_list("poll_comment_id", flat=True)
        )
        return Response(
            data={"liked_poll_comments_ids": liked_poll_comments_ids},
            status=status.HTTP_200_OK,
        )
