# Generated by Django 3.2.18 on 2023-03-16 21:46

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("questions", "0003_auto_20230316_2118"),
    ]

    operations = [
        migrations.RenameField(
            model_name="question",
            old_name="category",
            new_name="categories",
        ),
    ]
