# Generated by Django 3.2.18 on 2023-05-04 20:49

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("polls", "0006_userlikedpollcomment"),
    ]

    operations = [
        migrations.AlterField(
            model_name="poll",
            name="heading",
            field=models.TextField(max_length=200),
        ),
    ]
