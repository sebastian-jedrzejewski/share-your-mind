from rest_framework import permissions

from shareyourmind.blog_posts.models import BlogPost, BlogPostComment
from shareyourmind.polls.models import Poll, PollAnswer, PollComment
from shareyourmind.questions.models import Question, Answer


class IsQuestionOrAnswerAuthor(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        elif isinstance(obj, Question) or isinstance(obj, Answer):
            return obj.author.id == user.id
        return False


class IsPollOrPollAnswerAuthor(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        elif isinstance(obj, Poll):
            return obj.author.id == user.id
        elif isinstance(obj, PollAnswer):
            return obj.poll.author.id == user.id
        return False


class IsBlogPostAuthor(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        elif isinstance(obj, BlogPost):
            return obj.author.id == user.id
        return False


class IsBlogPostCommentAuthor(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        elif isinstance(obj, BlogPostComment):
            return obj.author.id == user.id
        return False


class IsPollCommentAuthor(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        elif isinstance(obj, PollComment):
            return obj.author.id == user.id
        return False
