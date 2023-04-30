from django.db import models

from shareyourmind.common.models import (
    PublishedContentMixin,
    ObjectContentTypeMixin,
    CommentMixin,
)


class Poll(PublishedContentMixin, ObjectContentTypeMixin):
    OBJECT_CONTENT_TYPE = "poll"

    heading = models.TextField(max_length=400)

    likes = None

    categories = models.ManyToManyField("common.Category", related_name="polls")

    @property
    def short_heading(self):
        if len(self.heading.__str__()) > 100:
            return self.heading[:100] + "..."
        return self.heading

    @property
    def number_of_comments(self):
        return self.comments.count()

    @property
    def votes(self):
        result = 0
        for answer in self.answers.all():
            result = result + answer.votes
        return result

    def __str__(self):
        return f"{self.author}: {self.short_heading}"


class PollAnswer(PublishedContentMixin):
    heading = models.CharField(max_length=100)
    poll = models.ForeignKey(
        "polls.Poll", on_delete=models.CASCADE, related_name="answers"
    )

    author = None
    likes = None
    votes = models.PositiveIntegerField(default=0)

    @property
    def short_heading(self):
        if len(self.heading.__str__()) > 100:
            return self.heading[:100] + "..."
        return self.heading

    @property
    def author(self):
        return self.poll.author

    def __str__(self):
        return f"{self.author}: {self.short_heading}"


class PollComment(CommentMixin):
    poll = models.ForeignKey(
        "polls.Poll", on_delete=models.CASCADE, related_name="comments"
    )

    def __str__(self):
        return f"{self.author}: {self.short_body}"