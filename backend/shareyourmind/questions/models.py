from ckeditor.fields import RichTextField
from django.db import models
from django.template.defaultfilters import striptags
from django.utils.safestring import mark_safe

from shareyourmind.common.models import PublishedContentMixin


class Question(PublishedContentMixin):
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

    def __str__(self):
        return f"{self.author}: {self.short_heading}"


class Answer(PublishedContentMixin):
    body = RichTextField()
    question = models.ForeignKey(
        "questions.Question", on_delete=models.CASCADE, related_name="answers"
    )

    @property
    def short_body(self):
        if (len(self.body.__str__())) > 100:
            return self.body.__str__()[:100] + "..."
        return mark_safe(self.body.__str__())

    def __str__(self):
        return f"{self.author}: {self.short_body}"
