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
            league = League.objects.get(id=pk)  # Pobieramy ligę po ID
        except League.DoesNotExist:
            return Response({"detail": "League not found."}, status=status.HTTP_404_NOT_FOUND)

        # Pobieramy wszystkie mecze przypisane do tej ligi
        matches = Match.objects.filter(league=league).order_by('match_date')  # Sortowanie po dacie meczu

        # Serializujemy mecze
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def team_schedule(self, request, pk=None):
        try:
            team = Team.objects.get(id=pk)
        except Team.DoesNotExist:
            return Response({"detail": "Team not found."}, status=status.HTTP_404_NOT_FOUND)

        # Pobieramy mecze, w których drużyna jest gospodarzem (home_team) lub gościem (away_team)
        matches = Match.objects.filter(Q(home_team=team) | Q(away_team=team)).order_by('match_date')

        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def generate_schedule(self, request, pk=None):
        try:
            # Retrieve the league object based on the provided pk (league ID)
            league = League.objects.get(id=pk)
        except League.DoesNotExist:
            return Response({"detail": "League not found."}, status=status.HTTP_404_NOT_FOUND)

        teams = list(league.teams.all())  # Convert QuerySet to list

        if not teams:
            return Response({"detail": "No teams found in this league."}, status=status.HTTP_400_BAD_REQUEST)

        # Round Robin algorithm for scheduling (each team plays others twice: home and away)
        if len(teams) % 2:
            teams.append(None)  # Add a bye week if number of teams is odd

        num_teams = len(teams)
        num_rounds = num_teams - 1
        half = num_teams // 2

        match_date = timezone.now() + timedelta(weeks=1)
        schedule = []

        # Now, we create the schedule for home and away, ensuring that teams alternate
        home_away_toggle = True  # Start with home match

        for round_num in range(num_rounds):
            matches_in_round = []
            for i in range(half):
                # If home_away_toggle is True, home team plays at home, otherwise away
                if home_away_toggle:
                    home = teams[i]
                    away = teams[num_teams - i - 1]
                else:
                    home = teams[num_teams - i - 1]
                    away = teams[i]

                if home is not None and away is not None:
                    matches_in_round.append({
                        'home_team': home,
                        'away_team': away,
                        'league': league,
                        'match_date': match_date
                    })

            schedule.extend(matches_in_round)
            # Rotate teams (keeping the first one in place and rotating the rest)
            teams = [teams[0]] + [teams[-1]] + teams[1:-1]
            match_date += timedelta(weeks=1)

            # Toggle the home_away_switch
            home_away_toggle = not home_away_toggle  # Switch between home and away for the next round

        # Second half of the season (reverse fixtures)
        for round_num in range(num_rounds):
            matches_in_round = []
            for i in range(half):
                # Reverse the home and away roles
                if home_away_toggle:
                    home = teams[num_teams - i - 1]
                    away = teams[i]
                else:
                    home = teams[i]
                    away = teams[num_teams - i - 1]

                if home is not None and away is not None:
                    matches_in_round.append({
                        'home_team': home,
                        'away_team': away,
                        'league': league,
                        'match_date': match_date
                    })

            schedule.extend(matches_in_round)
            # Rotate teams (keeping the first one in place and rotating the rest)
            teams = [teams[0]] + [teams[-1]] + teams[1:-1]
            match_date += timedelta(weeks=1)

            # Toggle the home_away_switch
            home_away_toggle = not home_away_toggle  # Switch between home and away for the next round

        # Create matches in the database
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

        if match.home_score is not None and match.away_score is not None:
            # Cofamy punkty przyznane wcześniej
            if match.home_score > match.away_score:
                home_team.points -= 3
            elif match.home_score < match.away_score:
                away_team.points -= 3
            else:
                home_team.points -= 1
                away_team.points -= 1

        try:
            home_score = int(home_score) if home_score is not None else 0
            away_score = int(away_score) if away_score is not None else 0
        except ValueError:
            return Response({"detail": "Invalid score values."}, status=status.HTTP_400_BAD_REQUEST)

        if home_score is not None:
            match.home_score = home_score
        if away_score is not None:
            match.away_score = away_score







        if match.home_score > match.away_score:
            home_team.points += 3
        elif match.home_score < match.away_score:
            away_team.points += 3
        else:  # Remis
            home_team.points += 1
            away_team.points += 1


        home_team.save()
        away_team.save()

        # Zatwierdzenie meczu
        match.save()

        # Serializowanie danych meczu
        return Response(MatchSerializer(match).data, status=status.HTTP_200_OK)


