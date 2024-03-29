# Generated by Django 3.2.18 on 2023-03-12 21:52

import ckeditor.fields
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("questions", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="question",
            name="description",
            field=ckeditor.fields.RichTextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="question",
            name="heading",
            field=models.TextField(max_length=200),
        ),
    ]
