from django.contrib import admin
from .models import Match

class MatchAdmin(admin.ModelAdmin):
    list_display = ('league', 'home_team', 'away_team', 'match_date', 'home_score', 'away_score')
    search_fields = ('home_team__name', 'away_team__name', 'league__name')
    date_hierarchy = 'match_date'


admin.site.register(Match, MatchAdmin)
