from rest_framework import viewsets, permissions, status
from django_filters.rest_framework import DjangoFilterBackend
from .models import Team, League
from .serializers import TeamSerializer
from .filters import TeamFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from users.models import User

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = TeamFilter

    def get_queryset(self):
        queryset = Team.objects.all()

        # Sprawdzamy, czy w zapytaniu jest parametr 'no_league', który ma wartość 'true'
        not_assigned = self.request.query_params.get('not_assigned', None)

        if not_assigned == 'true':
            # Zwracamy tylko drużyny, które nie mają przypisanej ligi
            queryset = queryset.filter(league__isnull=True)

        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['get'])
    def sorted_table(self, request, pk=None):
        try:
            # Pobieramy ligę, do której drużyny są przypisane
            league = League.objects.get(id=pk)
        except League.DoesNotExist:
            return Response({"detail": "League not found."}, status=status.HTTP_404_NOT_FOUND)

        # Pobieramy drużyny przypisane do ligi
        teams = league.teams.all().order_by('-points')  # Sortowanie po punktach malejąco

        if not teams:
            return Response({"detail": "No teams found in this league."})

        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def assign_players(self, request, pk=None):

        team = self.get_object()

        # Lista zespołów, które chcemy przypisać do ligi
        players_data = request.data.get('players', [])

        # Iterujemy przez zespoły i przypisujemy im ligę
        if not players_data:
            return Response({"detail": "No players provided"}, status=status.HTTP_400_BAD_REQUEST)

        players = User.objects.filter(id__in=players_data)

        if players.count() != len(players_data):
            return Response({"detail": "Some players do not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Przypisujemy wybraną ligę do zespołów
        for player in players:
            player.team = team
            player.save()

        # Serializacja i zwrócenie odpowiedzi
        return Response({"detail": "Players successfully assigned to league"}, status=status.HTTP_200_OK)