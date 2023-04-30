# Generated by Django 3.2.18 on 2023-04-30 15:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('polls', '0004_auto_20230430_1011'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserVotedPollAnswer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('poll_answer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='voted_by_users', to='polls.pollanswer')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='voted_answers', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'poll_answer')},
            },
        ),
    ]
