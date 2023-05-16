from django.utils.html import strip_tags
from django.utils.safestring import mark_safe
from rest_framework import serializers

from shareyourmind.common.api.serializers import CategorySerializer
from shareyourmind.common.models import Category
from shareyourmind.polls.models import Poll, PollAnswer, PollComment
from shareyourmind.users.api.serializers import UserSerializer


class PollCommentListSerializer(serializers.ModelSerializer):
    author = UserSerializer()

    class Meta:
        model = PollComment
        fields = [
            "id",
            "author",
            "short_body",
            "poll_id",
        ]


class PollCommentDetailSerializer(serializers.ModelSerializer):
    body = serializers.SerializerMethodField()
    author = UserSerializer()
    nested_comments = serializers.SerializerMethodField()

    def get_nested_comments(self, obj):
        serializer = PollCommentDetailSerializer(obj.nested_comments, many=True)
        return serializer.data

    class Meta:
        model = PollComment
        fields = [
            "id",
            "created_at",
            "updated_at",
            "likes",
            "author",
            "body",
            "poll_id",
            "parent_comment_id",
            "nested_comments",
        ]

    def get_body(self, obj):
        return mark_safe(obj.body)


class PollCommentCreateSerializer(serializers.ModelSerializer):
    author = serializers.HiddenField(default=serializers.CurrentUserDefault())
    poll_id = serializers.PrimaryKeyRelatedField(
        queryset=Poll.objects.all(),
        source="poll",
        allow_empty=False,
        allow_null=False,
    )
    poll_comment_id = serializers.PrimaryKeyRelatedField(
        queryset=PollComment.objects.all(),
        source="parent_comment",
        allow_empty=False,
        allow_null=False,
        required=False,
    )

    class Meta:
        model = PollComment
        fields = (
            "id",
            "author",
            "body",
            "likes",
            "poll_id",
            "poll_comment_id",
        )

    def validate_body(self, body):
        if strip_tags(body) == "":
            raise serializers.ValidationError(["This field may not be blank."])
        return body


class PollAnswerSerializer(serializers.ModelSerializer):
    author = UserSerializer()

    class Meta:
        model = PollAnswer
        fields = [
            "id",
            "poll_id",
            "created_at",
            "updated_at",
            "author",
            "heading",
            "votes",
        ]


class PollAnswerCreateSerializer(serializers.ModelSerializer):
    poll_id = serializers.PrimaryKeyRelatedField(
        queryset=Poll.objects.all(),
        source="poll",
        required=False,
    )

    class Meta:
        model = PollAnswer
        fields = [
            "id",
            "heading",
            "poll_id",
        ]


class PollListSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    categories = CategorySerializer(many=True)

    class Meta:
        model = Poll
        fields = [
            "id",
            "created_at",
            "author",
            "heading",
            "votes",
            "number_of_comments",
            "categories",
        ]


class PollDetailSerializer(PollListSerializer):
    answers = PollAnswerSerializer(many=True)
    comments = PollCommentDetailSerializer(many=True)

    class Meta(PollListSerializer.Meta):
        fields = PollListSerializer.Meta.fields + ["answers", "comments", "updated_at"]

    def to_representation(self, instance):
        result = super().to_representation(instance)
        for answer in result["answers"]:
            answer.pop("author")
        return result


class PollCreateSerializer(serializers.ModelSerializer):
    categories_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.filter(is_active=True),
        source="categories",
        many=True,
        allow_empty=False,
    )
    author = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Poll
        fields = ["id", "heading", "categories_id", "author"]


class PollWithAnswersCreateSerializer(PollCreateSerializer):
    answers = PollAnswerCreateSerializer(many=True)

    class Meta(PollCreateSerializer.Meta):
        model = Poll
        fields = PollCreateSerializer.Meta.fields + ["answers"]

    def create(self, validated_data):
        answers = validated_data.pop("answers", None)
        PollAnswerCreateSerializer(data=answers, many=True).is_valid(
            raise_exception=True
        )
        poll = super().create(validated_data)

        for answer_data in answers:
            PollAnswer.objects.create(heading=answer_data["heading"], poll_id=poll.id)
        return poll
