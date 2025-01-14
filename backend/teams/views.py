from rest_framework import viewsets, permissions, status, serializers
from django_filters.rest_framework import DjangoFilterBackend
from .models import Team, League
from .serializers import TeamSerializer
from .filters import TeamFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from users.models import User
from django.db.models import F
class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = TeamFilter

    def get_queryset(self):
        queryset = Team.objects.all()


        not_assigned = self.request.query_params.get('not_assigned', None)

        if not_assigned == 'true':

            queryset = queryset.filter(league__isnull=True)

        return queryset

    def perform_create(self, serializer):
        user = self.request.user

        if user.team is not None:
            raise serializers.ValidationError("Masz już przypisany zespół.")

        team = serializer.save(created_by=user)
        user.team = team
        user.save()

    @action(detail=True, methods=['get'])
    def sorted_table(self, request, pk=None):
        try:

            league = League.objects.get(id=pk)
        except League.DoesNotExist:
            return Response({"detail": "League not found."}, status=status.HTTP_404_NOT_FOUND)

        teams = league.teams.all().annotate(
            goal_difference=F('goals_scored') - F('goals_conceded')
        ).order_by('-points', '-goal_difference',
                   '-goals_scored')

        if not teams:
            return Response({"detail": "No teams found in this league."})

        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def assign_players(self, request, pk=None):

        team = self.get_object()

        players_data = request.data.get('players', [])

        if not players_data:
            return Response({"detail": "No players provided"}, status=status.HTTP_400_BAD_REQUEST)

        players = User.objects.filter(id__in=players_data)

        if players.count() != len(players_data):
            return Response({"detail": "Some players do not exist"}, status=status.HTTP_404_NOT_FOUND)

        for player in players:
            player.team = team
            player.save()

        return Response({"detail": "Players successfully assigned to league"}, status=status.HTTP_200_OK)