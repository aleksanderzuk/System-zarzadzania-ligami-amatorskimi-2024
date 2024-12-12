from django.contrib.auth.models import AbstractUser
from django.db import models
from teams.models import Team

position_choice =[
    ('nd', 'Niezdefiniowana'),
    ('br', 'Bramkarz'),
    ('ob', 'Obrońca'),
    ('po', 'Pomocnik'),
    ('na', 'Napastnik')
]

class User(AbstractUser):
    is_admin = models.BooleanField(default=False)
    name = models.CharField(max_length=25, blank=False, default='')
    surname = models.CharField(max_length=25, blank=False, default='')
    position = models.CharField(choices=position_choice, null=True, blank=True, max_length=2)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='players', blank=True, null=True)
    leagues_created = models.ForeignKey('leagues.League', on_delete=models.CASCADE, related_name='users_leagues', blank=True, null=True)
    def __str__(self):
        return f"{self.name} {self.surname}"