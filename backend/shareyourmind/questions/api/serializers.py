from django.utils.html import strip_tags
from django.utils.safestring import mark_safe
from rest_framework import serializers

from shareyourmind.common.api.serializers import CategorySerializer
from shareyourmind.common.models import Category
from shareyourmind.questions.models import Question, Answer, UserLikedQuestion
from shareyourmind.users.api.serializers import UserSerializer


class AnswerListSerializer(serializers.ModelSerializer):
    author = UserSerializer()

    class Meta:
        model = Answer
        fields = ("id", "author", "short_body")


class AnswerDetailSerializer(serializers.ModelSerializer):
    body = serializers.SerializerMethodField()
    author = UserSerializer()
    nested_answers = serializers.SerializerMethodField()

    def get_nested_answers(self, obj):
        serializer = AnswerDetailSerializer(obj.nested_answers, many=True)
        return serializer.data

    class Meta:
        model = Answer
        fields = (
            "id",
            "created_at",
            "updated_at",
            "likes",
            "author",
            "body",
            "parent_answer_id",
            "nested_answers",
        )
        depth = 1

    def get_body(self, obj):
        return mark_safe(obj.body)


class AnswerCreateSerializer(serializers.ModelSerializer):
    author = serializers.HiddenField(default=serializers.CurrentUserDefault())
    question_id = serializers.PrimaryKeyRelatedField(
        queryset=Question.objects.all(),
        source="question",
        allow_empty=False,
        allow_null=False,
    )
    answer_id = serializers.PrimaryKeyRelatedField(
        queryset=Answer.objects.all(),
        source="parent_answer",
        allow_empty=False,
        allow_null=False,
        required=False,
    )

    class Meta:
        model = Answer
        fields = (
            "id",
            "author",
            "body",
            "likes",
            "question_id",
            "answer_id",
        )

    def validate_body(self, body):
        if strip_tags(body) == "":
            raise serializers.ValidationError(["This field may not be blank."])
        return body


class QuestionListSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    categories = CategorySerializer(many=True)

    class Meta:
        model = Question
        fields = (
            "id",
            "created_at",
            "author",
            "heading",
            "short_description",
            "likes",
            "number_of_answers",
            "categories",
        )


class QuestionDetailSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    description = serializers.SerializerMethodField()
    categories = CategorySerializer(many=True)
    answers = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = (
            "id",
            "created_at",
            "updated_at",
            "likes",
            "author",
            "heading",
            "description",
            "categories",
            "answers",
        )

    def get_description(self, obj):
        return mark_safe(obj.description)

    def get_answers(self, obj):
        answers = obj.answers.all().order_by(
            "-likes", "created_at__date", "-updated_at"
        )
        return AnswerDetailSerializer(answers, many=True).data


class QuestionCreateSerializer(serializers.ModelSerializer):
    categories_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.filter(is_active=True),
        source="categories",
        many=True,
        allow_empty=False,
    )
    author = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Question
        fields = ("id", "heading", "description", "categories_id", "likes", "author")
