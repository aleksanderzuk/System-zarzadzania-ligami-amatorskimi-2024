from rest_framework import serializers
from django.contrib.auth import get_user_model
from teams.models import Team
User = get_user_model()
class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name']  # Przykład pola, które chcesz wysłać
class UserSerializer(serializers.ModelSerializer):
    team = TeamSerializer()
    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'surname', 'is_admin', 'position', 'team']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    name = serializers.CharField(required=True)
    surname = serializers.CharField(required=True)

    position = serializers.CharField(required=True)
    class Meta:
        model = User
        fields = ['username', 'password', 'name', 'surname', 'position']  # Wybierz potrzebne pola

    def validate_position(self, value):
        full_to_short = {
            'Niezdefiniowana': 'nd',
            'Bramkarz': 'br',
            'Obrońca': 'ob',
            'Pomocnik': 'po',
            'Napastnik': 'na'
        }
        # Zamiana pełnej nazwy na skrót, lub zwrócenie wartości bez zmian
        return full_to_short.get(value, value)
    def create(self, validated_data):
        # Tworzenie użytkownika z zaszyfrowanym hasłem
        user = User(
            username=validated_data['username'],
            name=validated_data.get('name'),
            surname=validated_data.get('surname'),
            position=validated_data.get('position')
        )
        user.set_password(validated_data['password'])  # Ustawienie zaszyfrowanego hasła
        user.save()
        return user