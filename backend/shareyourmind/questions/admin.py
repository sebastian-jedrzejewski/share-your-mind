from django.contrib import admin

from shareyourmind.questions.models import Question, Answer


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("author", "short_heading")


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ("author", "short_body")
