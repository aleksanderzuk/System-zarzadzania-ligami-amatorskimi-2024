from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeagueViewSet

router = DefaultRouter()
router.register(r'leagues', LeagueViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('leagues/<int:pk>/assign_teams/', LeagueViewSet.as_view({'post': 'assign_teams'})),
    path('leagues/<int:pk>/delete/', LeagueViewSet.as_view({'delete': 'delete_league'}), name='delete-league'),
]

