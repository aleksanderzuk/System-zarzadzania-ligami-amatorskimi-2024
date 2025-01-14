# Generated by Django 5.1.3 on 2024-12-18 18:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('teams', '0008_alter_team_league'),
    ]

    operations = [
        migrations.AddField(
            model_name='team',
            name='goals_conceded',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='team',
            name='goals_scored',
            field=models.IntegerField(default=0),
        ),
    ]
