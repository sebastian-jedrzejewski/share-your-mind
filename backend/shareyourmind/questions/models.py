from ckeditor.fields import RichTextField
from django.db import models
from django.template.defaultfilters import striptags
from django.utils.safestring import mark_safe

from shareyourmind.common.models import PublishedContentMixin, ObjectContentTypeMixin


class Question(PublishedContentMixin, ObjectContentTypeMixin):
    OBJECT_CONTENT_TYPE = "question"

    heading = models.TextField(max_length=200)
    description = RichTextField(blank=True, null=True)

    categories = models.ManyToManyField("common.Category", related_name="questions")

    @property
    def short_heading(self):
        if len(self.heading.__str__()) > 100:
            return self.heading[:100] + "..."
        return self.heading

    @property
    def short_description(self):
        if len(self.description.__str__()) > 100:
            return striptags(mark_safe(self.description[:100] + "..."))
        return striptags(mark_safe(self.description))

    @property
    def number_of_answers(self):
        return self.answers.count()

    def __str__(self):
        return f"{self.author}: {self.short_heading}"


class Answer(PublishedContentMixin):
    body = RichTextField()
    question = models.ForeignKey(
        "questions.Question", on_delete=models.CASCADE, related_name="answers"
    )
    parent_answer = models.ForeignKey(
        "questions.Answer",
        on_delete=models.CASCADE,
        related_name="nested_answers",
        blank=True,
        null=True,
    )

    @property
    def short_body(self):
        if (len(self.body.__str__())) > 100:
            return self.body.__str__()[:100] + "..."
        return mark_safe(self.body.__str__())

    def __str__(self):
        return f"{self.author}: {self.short_body}"


class UserLikedQuestion(models.Model):
    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="liked_questions",
    )
    question = models.ForeignKey(
        "questions.Question",
        on_delete=models.CASCADE,
        related_name="liked_by_users",
    )

    class Meta:
        unique_together = [["user", "question"]]

    def __str__(self):
        return f"ID: {self.id}, user: {self.user}, question: {self.question}"


class UserLikedAnswer(models.Model):
    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="liked_answers",
    )
    answer = models.ForeignKey(
        "questions.Answer",
        on_delete=models.CASCADE,
        related_name="answers_liked_by_users",
    )

    class Meta:
        unique_together = [["user", "answer"]]

    def __str__(self):
        return f"ID: {self.id}, user: {self.user}, answer: {self.answer}"
