# Generated by Django 5.1.2 on 2024-11-18 15:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('teams', '0002_alter_team_league'),
        ('users', '0002_user_age_user_name_user_position_user_surname'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='age',
        ),
        migrations.AddField(
            model_name='user',
            name='team',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='players', to='teams.team'),
        ),
        migrations.AlterField(
            model_name='user',
            name='position',
            field=models.CharField(blank=True, choices=[('nd', 'Niezdefiniowana'), ('br', 'Bramkarz'), ('ob', 'Obrońca'), ('po', 'Pomocnik'), ('na', 'Napastnik')], max_length=2, null=True),
        ),
    ]