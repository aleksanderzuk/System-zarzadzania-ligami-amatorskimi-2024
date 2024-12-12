from django.db import models
from leagues.models import League
from django.conf import settings
# Create your models here.

class Team(models.Model):
    name = models.CharField(max_length=25)
    league = models.ForeignKey(League, on_delete=models.CASCADE, related_name='teams', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='teams',blank=True, null=True)
    points = models.IntegerField(default=0)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Jeśli liga jest ustawiona na None, to resetuj punkty
        if self.league is None:
            self.points = 0
        super(Team, self).save(*args, **kwargs)