# Generated by Django 3.2.18 on 2023-04-20 21:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0002_alter_category_options'),
        ('users', '0003_alter_user_favourite_categories'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='favourite_categories',
            field=models.ManyToManyField(blank=True, related_name='_users_user_favourite_categories_+', to='common.Category'),
        ),
    ]