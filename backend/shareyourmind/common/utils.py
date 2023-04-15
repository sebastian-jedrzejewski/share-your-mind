from shareyourmind.common.models import Category


def get_category_choices():
    category_names = [
        category.name.lower()
        for category in Category.objects.all()
        if category.is_active
    ]
    return tuple(zip(category_names, category_names))
