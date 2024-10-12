from django.contrib.auth.models import AbstractUser
from django.db import models

position_choice =[
    ('br', 'Bramkarz'),
    ('ob', 'Obrońca'),
    ('po', 'Pomocnik'),
    ('na', 'Napastnik')
]

class User(AbstractUser):
    is_admin = models.BooleanField(default=False)
    name = models.CharField(max_length=25, blank=False, default='')
    surname = models.CharField(max_length=25, blank=False, default='')
    age = models.PositiveIntegerField(null=True, blank=True)
    position = models.CharField(choices=position_choice, null=True, blank=True, max_length=2)


    def __str__(self):
        return self.username