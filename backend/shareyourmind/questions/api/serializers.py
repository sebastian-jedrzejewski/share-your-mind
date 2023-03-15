from django.utils.safestring import mark_safe
from rest_framework import serializers

from shareyourmind.common.api.serializers import CategorySerializer
from shareyourmind.questions.models import Question, Answer
from shareyourmind.users.api.serializers import UserSerializer


class AnswerListSerializer(serializers.ModelSerializer):
    author = UserSerializer()

    class Meta:
        model = Answer
        fields = ("id", "author", "short_body")


class AnswerDetailSerializer(serializers.ModelSerializer):
    body = serializers.SerializerMethodField()

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


class QuestionListSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    category = CategorySerializer()

    class Meta:
        model = Question
        fields = ("id", "author", "heading", "category")


class QuestionDetailSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    description = serializers.SerializerMethodField()
    category = CategorySerializer()
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
            "category",
            "answers",
        )

    def get_description(self, obj):
        return mark_safe(obj.description)
