from rest_framework import serializers
from .models import Team
from leagues.serializers import LeagueSerializer
from leagues.models import League
from users.serializers import UserSerializer

class TeamSerializer(serializers.ModelSerializer):
    league = LeagueSerializer(read_only=True)  # Serializowanie ligi (odczyt)
    league_id = serializers.PrimaryKeyRelatedField(queryset=League.objects.all(), source='league', write_only=True, required=False)  # Pole do zapisu ligi
    players = UserSerializer(many=True, read_only=True)  # Zawodnicy drużyny (odczyt)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'league', 'league_id', 'created_at', 'players', 'created_by', 'points']  # Dodajemy 'players' do fields

    def validate_name(self, value):
        if Team.objects.filter(name=value).exists():
            raise serializers.ValidationError("Liga o podanej nazwie już istnieje")
        return value