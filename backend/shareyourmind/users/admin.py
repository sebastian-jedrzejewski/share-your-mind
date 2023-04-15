from django.contrib import admin
from django.contrib.auth.forms import UserCreationForm

from shareyourmind.users.models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    form = UserCreationForm
    readonly_fields = ("password", "date_joined")
    search_fields = ("email", "username")
    list_display = ("username", "email", "date_joined")
    list_display_links = (
        "username",
        "email",
    )

    def get_fieldsets(self, request, obj=None):
        if obj is None:
            return (
                (
                    "Register data",
                    {"fields": ("username", "email", "password1", "password2")},
                ),
                (
                    "Permissions",
                    {
                        "fields": (
                            "is_active",
                            "is_staff",
                            "is_superuser",
                            "groups",
                            "user_permissions",
                        )
                    },
                ),
                (
                    "Dates",
                    {"fields": ("last_login", "date_joined")},
                ),
            )
        return (
            (
                "Register data",
                {"fields": ("username", "email", "password")},
            ),
            (
                "Permissions",
                {
                    "fields": (
                        "is_active",
                        "is_staff",
                        "is_superuser",
                        "groups",
                        "user_permissions",
                    )
                },
            ),
            (
                "Dates",
                {"fields": ("last_login", "date_joined")},
            ),
            ("Categories", {"fields": ("favourite_categories",)}),
        )
