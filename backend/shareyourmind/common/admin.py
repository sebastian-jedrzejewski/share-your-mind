from django.contrib import admin

from shareyourmind.common.models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_filter = ("is_active",)
