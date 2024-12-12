from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MatchViewSet

router = DefaultRouter()
router.register(r'matches', MatchViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('generate_schedule/<int:pk>/', MatchViewSet.as_view({'post': 'generate_schedule'}), name='generate_schedule'),
    path('league_schedule/<int:pk>/', MatchViewSet.as_view({'get': 'league_schedule'}), name='league-schedule'),
    path('team_schedule/<int:pk>/', MatchViewSet.as_view({'get': 'team_schedule'}), name='team-schedule'),
    path('update_score/<int:pk>/', MatchViewSet.as_view({'patch': 'update_score'}), name='update_score'),
]
