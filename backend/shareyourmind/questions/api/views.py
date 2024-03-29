from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, SAFE_METHODS, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from permissions import IsQuestionOrAnswerAuthor
from shareyourmind.questions.api.serializers import (
    QuestionDetailSerializer,
    QuestionListSerializer,
    QuestionCreateSerializer,
    AnswerDetailSerializer,
    AnswerListSerializer,
    AnswerCreateSerializer,
)
from shareyourmind.questions.models import (
    Question,
    Answer,
    UserLikedQuestion,
    UserLikedAnswer,
)


class QuestionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsQuestionOrAnswerAuthor]
    serializer_class = QuestionDetailSerializer
    queryset = Question.objects.order_by("-created_at")

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [AllowAny()]
        elif self.action in ["create", "like", "dislike"]:
            return [IsAuthenticated()]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action == "list":
            return QuestionListSerializer
        elif self.action in ["create", "partial_update"]:
            return QuestionCreateSerializer
        else:
            return self.serializer_class

    @action(methods=["POST"], detail=True)
    def like(self, request, *args, **kwargs):
        question = self.get_object()
        user = request.user
        liked_question = UserLikedQuestion.objects.filter(
            user=user, question=question
        ).first()
        if liked_question is not None:
            return Response(
                data={"Error": "Cannot like the question second time!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        UserLikedQuestion.objects.create(user=user, question=question)
        question.likes = question.likes + 1
        question.save(update_fields=["likes"])
        data = self.get_serializer_class()(instance=question).data
        return Response(data=data, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=True)
    def dislike(self, request, *args, **kwargs):
        question = self.get_object()
        user = request.user
        liked_question = UserLikedQuestion.objects.filter(
            user=user, question=question
        ).first()
        if liked_question is None:
            return Response(
                data={"Error": "Cannot dislike the question that has not been liked!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        liked_question.delete()
        question.likes = question.likes - 1
        question.save(update_fields=["likes"])
        data = self.get_serializer_class()(instance=question).data
        return Response(data=data, status=status.HTTP_200_OK)


class AnswerViewSet(viewsets.ModelViewSet):
    permission_classes = [IsQuestionOrAnswerAuthor]
    serializer_class = AnswerDetailSerializer
    queryset = Answer.objects.order_by("-created_at")

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [AllowAny()]
        elif self.action in ["create", "like", "dislike"]:
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

    @action(methods=["POST"], detail=True)
    def like(self, request, *args, **kwargs):
        answer = self.get_object()
        user = request.user
        liked_answer = UserLikedAnswer.objects.filter(user=user, answer=answer).first()
        if liked_answer is not None:
            return Response(
                data={"Error": "Cannot like the answer second time!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        UserLikedAnswer.objects.create(user=user, answer=answer)
        answer.likes = answer.likes + 1
        answer.save(update_fields=["likes"])
        data = self.get_serializer_class()(instance=answer).data
        return Response(data=data, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=True)
    def dislike(self, request, *args, **kwargs):
        answer = self.get_object()
        user = request.user
        liked_answer = UserLikedAnswer.objects.filter(user=user, answer=answer).first()
        if liked_answer is None:
            return Response(
                data={"Error": "Cannot dislike the answer that has not been liked!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        liked_answer.delete()
        answer.likes = answer.likes - 1
        answer.save(update_fields=["likes"])
        data = self.get_serializer_class()(instance=answer).data
        return Response(data=data, status=status.HTTP_200_OK)


class UserLikedQuestionAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        liked_questions = UserLikedQuestion.objects.filter(user=user)
        liked_questions_ids = list(
            liked_questions.values_list("question_id", flat=True)
        )
        return Response(
            data={"liked_questions_ids": liked_questions_ids}, status=status.HTTP_200_OK
        )


class UserLikedAnswerAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        liked_answers = UserLikedAnswer.objects.filter(user=user)
        liked_answers_ids = list(liked_answers.values_list("answer_id", flat=True))
        return Response(
            data={"liked_answers_ids": liked_answers_ids}, status=status.HTTP_200_OK
        )
