from ckeditor.fields import RichTextField
from django.db import models
from django.template.defaultfilters import striptags
from django.utils.safestring import mark_safe

from shareyourmind.common.models import (
    PublishedContentMixin,
    ObjectContentTypeMixin,
    CommentMixin,
)


class BlogPost(PublishedContentMixin, ObjectContentTypeMixin):
    OBJECT_CONTENT_TYPE = "blog_post"

    image = models.ImageField(upload_to="images")
    title = models.TextField(max_length=120)
    content = RichTextField()

    categories = models.ManyToManyField("common.Category", related_name="blog_posts")

    @property
    def short_content(self):
        if len(self.content.__str__()) > 100:
            return striptags(mark_safe(self.content[:100] + "..."))
        return striptags(mark_safe(self.content))

    @property
    def number_of_comments(self):
        return self.comments.count()

    def __str__(self):
        return f"{self.author}: {self.title}"


class BlogPostComment(CommentMixin):
    blog_post = models.ForeignKey(
        "blog_posts.BlogPost", on_delete=models.CASCADE, related_name="comments"
    )

    def __str__(self):
        return f"{self.author}: {self.short_body}"
