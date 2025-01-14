from django.db.models.signals import post_delete
from django.dispatch import receiver
from leagues.models import League
from .models import Team

@receiver(post_delete, sender=League)
def reset_team_stats_after_league_delete(sender, instance, **kwargs):
    Team.objects.filter(league_id=instance.id).update(
        points=0,
        goals_scored=0,
        goals_conceded=0,
        played=0,
        league=None
    )
