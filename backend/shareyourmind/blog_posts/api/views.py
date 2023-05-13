from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from permissions import IsBlogPostAuthor, IsBlogPostCommentAuthor
from shareyourmind.blog_posts.api.serializers import (
    BlogPostDetailSerializer,
    BlogPostListSerializer,
    BlogPostCreateSerializer,
    BlogPostCommentDetailSerializer,
    BlogPostCommentListSerializer,
    BlogPostCommentCreateSerializer,
)
from shareyourmind.blog_posts.models import (
    BlogPost,
    BlogPostComment,
    UserLikedBlogPostComment,
    UserLikedBlogPost,
)


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

    @action(methods=["POST"], detail=True)
    def like(self, request, *args, **kwargs):
        blog_post = self.get_object()
        user = request.user
        liked_blog_post = UserLikedBlogPost.objects.filter(
            user=user, blog_post=blog_post
        ).first()
        if liked_blog_post is not None:
            return Response(
                data={"Error": "Cannot like the blog post second time!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        UserLikedBlogPost.objects.create(user=user, blog_post=blog_post)
        blog_post.likes = blog_post.likes + 1
        blog_post.save(update_fields=["likes"])
        data = self.get_serializer_class()(instance=blog_post).data
        return Response(data=data, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=True)
    def dislike(self, request, *args, **kwargs):
        blog_post = self.get_object()
        user = request.user
        liked_blog_post = UserLikedBlogPost.objects.filter(
            user=user, blog_post=blog_post
        ).first()
        if liked_blog_post is None:
            return Response(
                data={"Error": "Cannot dislike the blog post that has not been liked!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        liked_blog_post.delete()
        blog_post.likes = blog_post.likes - 1
        blog_post.save(update_fields=["likes"])
        data = self.get_serializer_class()(instance=blog_post).data
        return Response(data=data, status=status.HTTP_200_OK)


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

    @action(methods=["POST"], detail=True)
    def like(self, request, *args, **kwargs):
        blog_post_comment = self.get_object()
        user = request.user
        liked_blog_post_comment = UserLikedBlogPostComment.objects.filter(
            user=user, blog_post_comment=blog_post_comment
        ).first()
        if liked_blog_post_comment is not None:
            return Response(
                data={"Error": "Cannot like the blog post comment second time!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        UserLikedBlogPostComment.objects.create(
            user=user, blog_post_comment=blog_post_comment
        )
        blog_post_comment.likes = blog_post_comment.likes + 1
        blog_post_comment.save(update_fields=["likes"])
        data = self.get_serializer_class()(instance=blog_post_comment).data
        return Response(data=data, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=True)
    def dislike(self, request, *args, **kwargs):
        blog_post_comment = self.get_object()
        user = request.user
        liked_blog_post_comment = UserLikedBlogPostComment.objects.filter(
            user=user, blog_post_comment=blog_post_comment
        ).first()
        if liked_blog_post_comment is None:
            return Response(
                data={
                    "Error": "Cannot dislike the blog post comment that has not been liked!"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        liked_blog_post_comment.delete()
        blog_post_comment.likes = blog_post_comment.likes - 1
        blog_post_comment.save(update_fields=["likes"])
        data = self.get_serializer_class()(instance=blog_post_comment).data
        return Response(data=data, status=status.HTTP_200_OK)


class UserLikedBlogPostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        liked_blog_posts = UserLikedBlogPost.objects.filter(user=user)
        liked_blog_posts_ids = list(
            liked_blog_posts.values_list("blog_post_id", flat=True)
        )
        return Response(
            data={"liked_blog_posts_ids": liked_blog_posts_ids},
            status=status.HTTP_200_OK,
        )


class UserLikedBlogPostCommentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        liked_blog_posts_comments = UserLikedBlogPostComment.objects.filter(user=user)
        liked_blog_posts_comments_ids = list(
            liked_blog_posts_comments.values_list("blog_post_comment_id", flat=True)
        )
        return Response(
            data={"liked_blog_post_comments_ids": liked_blog_posts_comments_ids},
            status=status.HTTP_200_OK,
        )
