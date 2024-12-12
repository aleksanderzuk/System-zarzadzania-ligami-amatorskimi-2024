from rest_framework import viewsets, permissions, status
from django_filters.rest_framework import DjangoFilterBackend
from .models import League
from .serializers import LeagueSerializer
from .filters import LeagueFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from teams.models import Team

class LeagueViewSet(viewsets.ModelViewSet):
    queryset = League.objects.all()
    serializer_class = LeagueSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = LeagueFilter
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def assign_teams(self, request, pk=None):

        league = self.get_object()

        # Lista zespołów, które chcemy przypisać do ligi
        teams_data = request.data.get('teams', [])

        # Iterujemy przez zespoły i przypisujemy im ligę
        if not teams_data:
            return Response({"detail": "No teams provided"}, status=status.HTTP_400_BAD_REQUEST)

        teams = Team.objects.filter(id__in=teams_data)

        if teams.count() != len(teams_data):
            return Response({"detail": "Some teams do not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Przypisujemy wybraną ligę do zespołów
        for team in teams:
            team.league = league
            team.save()

        # Serializacja i zwrócenie odpowiedzi
        return Response({"detail": "Teams successfully assigned to league"}, status=status.HTTP_200_OK)