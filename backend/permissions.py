from rest_framework import permissions

from shareyourmind.questions.models import Question, Answer


class IsQuestionOrAnswerAuthor(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        elif isinstance(obj, Question) or isinstance(obj, Answer):
            return obj.author.id == user.id
        return False
