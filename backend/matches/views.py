from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Match, League, Team
from rest_framework import viewsets
from django.utils import timezone
from datetime import timedelta
from .serializers import MatchSerializer
from django.db.models import Q

class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer

    @action(detail=True, methods=['get'])
    def league_schedule(self, request, pk=None):
        try:
            league = League.objects.get(id=pk)
        except League.DoesNotExist:
            return Response({"detail": "League not found."}, status=status.HTTP_404_NOT_FOUND)


        matches = Match.objects.filter(league=league).order_by('match_date')


        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def team_schedule(self, request, pk=None):
        try:
            team = Team.objects.get(id=pk)
        except Team.DoesNotExist:
            return Response({"detail": "Team not found."}, status=status.HTTP_404_NOT_FOUND)


        matches = Match.objects.filter(Q(home_team=team) | Q(away_team=team)).order_by('match_date')

        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def generate_schedule(self, request, pk=None):
        from datetime import timedelta
        from django.utils import timezone
        import datetime

        try:
            league = League.objects.get(id=pk)
        except League.DoesNotExist:
            return Response({"detail": "League not found."}, status=status.HTTP_404_NOT_FOUND)

        teams = list(league.teams.all())

        if not teams:
            return Response({"detail": "No teams found in this league."}, status=status.HTTP_400_BAD_REQUEST)

        if len(teams) % 2 != 0:
            teams.append(None)

        num_teams = len(teams)
        num_rounds = num_teams - 1
        half = num_teams // 2

        if None in teams:
            none_index = teams.index(None)
            if none_index != 0:
                teams[0], teams[none_index] = teams[none_index], teams[0]

        def next_sunday(date):
            """Find the next Sunday from the given date."""
            days_until_sunday = ((6 - date.weekday()) % 7)
            return date + timedelta(days=days_until_sunday)

        match_date = next_sunday(timezone.now())
        schedule = []

        def generate_rounds(teams, reverse_role=False):
            nonlocal match_date
            local_schedule = []
            rotation_teams = teams[:]

            for r in range(num_rounds):
                matches_in_round = []
                for i in range(half):
                    home = rotation_teams[i]
                    away = rotation_teams[num_teams - 1 - i]

                    if home is not None and away is not None:
                        if reverse_role:
                            home, away = away, home

                        matches_in_round.append({
                            'home_team': home,
                            'away_team': away,
                            'league': league,
                            'match_date': match_date
                        })

                local_schedule.extend(matches_in_round)


                first = rotation_teams[0]
                rest = rotation_teams[1:]
                rest = [rest[-1]] + rest[:-1]
                rotation_teams = [first] + rest


                match_date += timedelta(weeks=1)
                match_date = next_sunday(match_date)

            return local_schedule

        first_half = generate_rounds(teams, reverse_role=False)
        second_half = generate_rounds(teams, reverse_role=True)
        schedule = first_half + second_half

        for match_data in schedule:
            Match.objects.create(**match_data)

        return Response({"detail": "Schedule generated successfully."}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'])
    def update_score(self, request, pk=None):
        try:
            match = Match.objects.get(id=pk)
        except Match.DoesNotExist:
            return Response({"detail": "Match not found."}, status=status.HTTP_404_NOT_FOUND)

        home_score = request.data.get('home_score')
        away_score = request.data.get('away_score')

        home_team = match.home_team
        away_team = match.away_team

        # Cofnięcie poprzednich wyników, jeśli istnieją
        if match.home_score is not None and match.away_score is not None:
            if match.home_score > match.away_score:
                home_team.points -= 3
            elif match.home_score < match.away_score:
                away_team.points -= 3
            else:
                home_team.points -= 1
                away_team.points -= 1

            home_team.goals_scored -= match.home_score
            away_team.goals_scored -= match.away_score
            home_team.goals_conceded -= match.away_score
            away_team.goals_conceded -= match.home_score
            home_team.played -= 1
            away_team.played -= 1

        # Aktualizacja wyniku meczu
        try:
            home_score = int(home_score) if home_score is not None else 0
            away_score = int(away_score) if away_score is not None else 0
        except ValueError:
            return Response({"detail": "Invalid score values."}, status=status.HTTP_400_BAD_REQUEST)

        if home_score is not None:
            match.home_score = home_score
        if away_score is not None:
            match.away_score = away_score

        # Aktualizacja punktów i statystyk drużyn
        if home_score > away_score:
            home_team.points += 3
        elif home_score < away_score:
            away_team.points += 3
        else:
            home_team.points += 1
            away_team.points += 1

        home_team.goals_scored += home_score
        away_team.goals_scored += away_score
        home_team.goals_conceded += away_score
        away_team.goals_conceded += home_score
        home_team.played += 1
        away_team.played += 1

        # Zapis danych
        home_team.save()
        away_team.save()
        match.save()

        # Serializacja meczu z danymi o zawodnikach
        serializer = MatchSerializer(match, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'])
    def delete_league_matches(self, request, pk=None):
        try:
            league = League.objects.get(id=pk)
        except League.DoesNotExist:
            return Response({"detail": "League not found."}, status=status.HTTP_404_NOT_FOUND)

        teams = league.teams.all()
        for team in teams:
            team.points = 0
            team.goals_scored = 0
            team.goals_conceded = 0
            team.played = 0
            team.save()

        deleted_count, _ = Match.objects.filter(league=league).delete()

        return Response(
            {"detail": f"Deleted {deleted_count} matches from league {league.name} and reset all team stats."},
            status=status.HTTP_200_OK
        )


