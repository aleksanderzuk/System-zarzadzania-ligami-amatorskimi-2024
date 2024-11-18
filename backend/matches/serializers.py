from rest_framework import serializers
from .models import Match
from leagues.serializers import LeagueSerializer
from teams.serializers import TeamSerializer
from leagues.models import League
from teams.models import Team

class MatchSerializer(serializers.ModelSerializer):
    league = LeagueSerializer(read_only=True)
    league_id = serializers.PrimaryKeyRelatedField(queryset=League.objects.all(), source='league', write_only=True)
    home_team = TeamSerializer(read_only=True)
    home_team_id = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), source='home_team', write_only=True)
    away_team = TeamSerializer(read_only=True)
    away_team_id = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), source='away_team', write_only=True)

    class Meta:
        model = Match
        fields = [
            'id', 'league', 'league_id',
            'home_team', 'home_team_id',
            'away_team', 'away_team_id',
            'match_date', 'home_score', 'away_score', 'status'
        ]
