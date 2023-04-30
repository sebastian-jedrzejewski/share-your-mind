from django.contrib import admin
from django.contrib.admin import TabularInline

from shareyourmind.polls.models import Poll, PollAnswer


class PollAnswerInline(TabularInline):
    model = PollAnswer
    extra = 1


@admin.register(Poll)
class PollAdmin(admin.ModelAdmin):
    inlines = [PollAnswerInline]
    list_display = ("author", "short_heading")
