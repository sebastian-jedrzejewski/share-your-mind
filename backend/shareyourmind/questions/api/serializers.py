from django.utils.safestring import mark_safe
from rest_framework import serializers

from shareyourmind.common.api.serializers import CategorySerializer
from shareyourmind.common.models import Category
from shareyourmind.questions.models import Question, Answer
from shareyourmind.users.api.serializers import UserSerializer


class AnswerListSerializer(serializers.ModelSerializer):
    author = UserSerializer()

    class Meta:
        model = Answer
        fields = ("id", "author", "short_body")


class AnswerDetailSerializer(serializers.ModelSerializer):
    body = serializers.SerializerMethodField()
    author = UserSerializer()

    class Meta:
        model = Answer
        fields = (
            "id",
            "created_at",
            "updated_at",
            "likes",
            "author",
            "body",
        )

    def get_body(self, obj):
        return mark_safe(obj.body)


class AnswerCreateSerializer(serializers.ModelSerializer):
    author = serializers.HiddenField(default=serializers.CurrentUserDefault())
    question_id = serializers.PrimaryKeyRelatedField(
        queryset=Question.objects.filter(categories__is_active=True), source="question"
    )

    class Meta:
        model = Answer
        fields = (
            "id",
            "author",
            "body",
            "likes",
            "question_id",
        )


class QuestionListSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    categories = CategorySerializer(many=True)

    class Meta:
        model = Question
        fields = ("id", "author", "heading", "categories")


class QuestionDetailSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    description = serializers.SerializerMethodField()
    categories = CategorySerializer(many=True)
    answers = AnswerListSerializer(many=True)

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


class QuestionCreateSerializer(serializers.ModelSerializer):
    categories_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.filter(is_active=True), source="categories", many=True
    )
    author = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Question
        fields = ("id", "heading", "description", "categories_id", "likes", "author")