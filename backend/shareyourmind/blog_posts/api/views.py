from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated

from permissions import IsBlogPostAuthor, IsBlogPostCommentAuthor
from shareyourmind.blog_posts.api.serializers import (
    BlogPostDetailSerializer,
    BlogPostListSerializer,
    BlogPostCreateSerializer,
    BlogPostCommentDetailSerializer,
    BlogPostCommentListSerializer,
    BlogPostCommentCreateSerializer,
)
from shareyourmind.blog_posts.models import BlogPost, BlogPostComment


class BlogPostViewSet(viewsets.ModelViewSet):
    permission_classes = [IsBlogPostAuthor]
    serializer_class = BlogPostDetailSerializer
    parser_classes = [MultiPartParser, FormParser]
    queryset = BlogPost.objects.all()

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            return super().get_permissions()
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == "list":
            return BlogPostListSerializer
        elif self.action in ["partial_update", "update", "create"]:
            return BlogPostCreateSerializer
        return super().get_serializer_class()


class BlogPostCommentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsBlogPostCommentAuthor]
    serializer_class = BlogPostCommentDetailSerializer
    queryset = BlogPostComment.objects.all()

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            return super().get_permissions()
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == "list":
            return BlogPostCommentListSerializer
        elif self.action in ["partial_update", "update", "create"]:
            return BlogPostCommentCreateSerializer
        return super().get_serializer_class()
