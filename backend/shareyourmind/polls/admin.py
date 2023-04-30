from django.contrib import admin
from django.contrib.admin import TabularInline

from shareyourmind.polls.models import Poll, PollAnswer, PollComment


class PollAnswerInline(TabularInline):
    model = PollAnswer
    extra = 1


@admin.register(Poll)
class PollAdmin(admin.ModelAdmin):
    inlines = [PollAnswerInline]
    list_display = ("author", "short_heading")


@admin.register(PollComment)
class PollCommentAdmin(admin.ModelAdmin):
    list_display = ("author", "short_body")
