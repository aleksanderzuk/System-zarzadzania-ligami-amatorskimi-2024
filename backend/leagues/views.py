from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import League
from .serializers import LeagueSerializer
from .filters import LeagueFilter

class LeagueViewSet(viewsets.ModelViewSet):
    queryset = League.objects.all()
    serializer_class = LeagueSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = LeagueFilter
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
