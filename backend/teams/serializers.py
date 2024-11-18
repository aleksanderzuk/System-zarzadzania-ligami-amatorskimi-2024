from rest_framework import serializers
from .models import Team
from leagues.serializers import LeagueSerializer
from leagues.models import League
from users.serializers import UserSerializer  # Zakładam, że masz UserSerializer dla zawodników

class TeamSerializer(serializers.ModelSerializer):
    league = LeagueSerializer(read_only=True)  # Serializowanie ligi (odczyt)
    league_id = serializers.PrimaryKeyRelatedField(queryset=League.objects.all(), source='league', write_only=True)  # Pole do zapisu ligi
    players = UserSerializer(many=True, read_only=True)  # Zawodnicy drużyny (odczyt)

    class Meta:
        model = Team
        fields = ['id', 'name', 'league', 'league_id', 'created_at', 'players']  # Dodajemy 'players' do fields
