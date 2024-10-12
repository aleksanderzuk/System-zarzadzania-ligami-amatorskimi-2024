from django.db import models
from leagues.models import League
# Create your models here.

class Team(models.Model):
    name = models.CharField(max_length=25)
    league = models.ForeignKey(League, on_delete=models.CASCADE, related_name='teams')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name