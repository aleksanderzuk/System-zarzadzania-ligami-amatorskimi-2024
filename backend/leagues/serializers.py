from rest_framework import serializers
from .models import League
from users.serializers import UserSerializer

class LeagueSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    teams = serializers.SerializerMethodField()

    class Meta:
        model = League
        fields = ['id', 'name', 'created_by', 'created_at', 'teams']

    def get_teams(self, obj):
        return [{'id': team.id, 'name': team.name} for team in obj.teams.all()]