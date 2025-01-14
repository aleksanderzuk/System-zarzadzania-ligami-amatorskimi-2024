from rest_framework import serializers
from .models import Match
from leagues.serializers import LeagueSerializer
from teams.serializers import TeamSerializer
from leagues.models import League
from teams.models import Team
from users.serializers import UserSerializer

class TeamSerializerWithPlayers(serializers.ModelSerializer):
    players = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'players']
class MatchSerializer(serializers.ModelSerializer):
    league = LeagueSerializer(read_only=True)
    league_id = serializers.PrimaryKeyRelatedField(queryset=League.objects.all(), source='league', write_only=True)
    home_team = TeamSerializerWithPlayers(read_only=True)
    away_team = TeamSerializerWithPlayers(read_only=True)

    class Meta:
        model = Match
        fields = [
            'id', 'league', 'league_id',
            'home_team', 'away_team',
            'match_date', 'home_score', 'away_score'
        ]

