from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        self.name = self.name.__str__().lower()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class PublishedContentMixin(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.PositiveIntegerField(default=0)

    author = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="+")

    class Meta:
        abstract = True


class ObjectContentTypeMixin(models.Model):
    OBJECT_CONTENT_TYPE = "_"

    @property
    def object_content_type(self):
        return self.OBJECT_CONTENT_TYPE

    class Meta:
        abstract = True
