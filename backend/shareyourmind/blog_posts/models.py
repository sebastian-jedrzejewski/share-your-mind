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


class UserLikedBlogPostComment(models.Model):
    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="liked_blog_post_comments",
    )
    blog_post_comment = models.ForeignKey(
        "blog_posts.BlogPostComment",
        on_delete=models.CASCADE,
        related_name="liked_by_users",
    )

    class Meta:
        unique_together = [["user", "blog_post_comment"]]

    def __str__(self):
        return f"ID: {self.id}, user: {self.user}, blog_post_comment: {self.blog_post_comment}"
