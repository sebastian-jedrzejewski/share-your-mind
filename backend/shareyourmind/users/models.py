from django.contrib.auth.models import AbstractUser
from django.db import models

from shareyourmind.managers import UserManager


class User(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)

    favourite_categories = models.ManyToManyField(
        "common.Category", related_name="+", blank=True
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    objects = UserManager()

    @property
    def favourite_categories_names(self):
        return [
            category.name
            for category in self.favourite_categories.all()
            if category.is_active
        ]

    def __str__(self):
        return self.email
