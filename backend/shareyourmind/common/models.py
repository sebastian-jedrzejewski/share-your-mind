from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class PublishedContentMixin(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    likes = models.PositiveIntegerField(default=0)

    author = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="+")

    class Meta:
        abstract = True
