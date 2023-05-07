from django.utils.html import strip_tags
from django.utils.safestring import mark_safe
from rest_framework import serializers

from shareyourmind.blog_posts.models import BlogPost, BlogPostComment
from shareyourmind.common.api.serializers import CategorySerializer
from shareyourmind.common.models import Category
from shareyourmind.users.api.serializers import UserSerializer


class BlogPostCommentListSerializer(serializers.ModelSerializer):
    author = UserSerializer()

    class Meta:
        model = BlogPostComment
        fields = [
            "id",
            "author",
            "short_body",
            "blog_post_id",
        ]


class BlogPostCommentDetailSerializer(serializers.ModelSerializer):
    body = serializers.SerializerMethodField()
    author = UserSerializer()

    class Meta:
        model = BlogPostComment
        fields = [
            "id",
            "created_at",
            "updated_at",
            "likes",
            "author",
            "body",
            "blog_post_id",
        ]

    def get_body(self, obj):
        return mark_safe(obj.body)


class BlogPostCommentCreateSerializer(serializers.ModelSerializer):
    author = serializers.HiddenField(default=serializers.CurrentUserDefault())
    blog_post_id = serializers.PrimaryKeyRelatedField(
        queryset=BlogPost.objects.all(),
        source="blog_post",
        allow_empty=False,
        allow_null=False,
    )

    class Meta:
        model = BlogPostComment
        fields = (
            "id",
            "author",
            "body",
            "likes",
            "blog_post_id",
        )

    def validate_body(self, body):
        if strip_tags(body) == "":
            raise serializers.ValidationError(["This field may not be blank."])
        return body


class BlogPostListSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    categories = CategorySerializer(many=True)
    image_url = serializers.ImageField(required=False, source="image")

    class Meta:
        model = BlogPost
        fields = [
            "id",
            "created_at",
            "author",
            "image_url",
            "title",
            "short_content",
            "likes",
            "number_of_comments",
            "categories",
        ]


class BlogPostDetailSerializer(BlogPostListSerializer):
    comments = BlogPostCommentDetailSerializer(many=True)

    class Meta(BlogPostListSerializer.Meta):
        fields = BlogPostListSerializer.Meta.fields + [
            "content",
            "updated_at",
            "comments",
        ]


class BlogPostCreateSerializer(serializers.ModelSerializer):
    categories_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.filter(is_active=True),
        source="categories",
        many=True,
        allow_empty=False,
    )
    author = serializers.HiddenField(default=serializers.CurrentUserDefault())
    image_url = serializers.ImageField(required=False, source="image")

    class Meta:
        model = BlogPost
        fields = (
            "id",
            "title",
            "content",
            "image_url",
            "categories_id",
            "likes",
            "author",
        )
