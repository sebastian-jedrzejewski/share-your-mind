from django.core.management import BaseCommand

from shareyourmind.common.models import Category


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        Category.objects.all().delete()

        with open(
            "shareyourmind/common/management/commands/categories.txt", mode="r"
        ) as categories:
            for category in categories.readlines():
                Category.objects.create(name=category.strip())

        print("Categories were successfully created!")
