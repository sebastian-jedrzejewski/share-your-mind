from django.contrib import admin

from shareyourmind.blog_posts.models import BlogPost, BlogPostComment


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("author", "title")


@admin.register(BlogPostComment)
class BlogPostCommentAdmin(admin.ModelAdmin):
    list_display = ("author", "short_body")
