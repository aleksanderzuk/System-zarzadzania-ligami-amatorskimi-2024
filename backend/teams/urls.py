from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamViewSet

router = DefaultRouter()
router.register(r'teams', TeamViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('teams/<int:pk>/assign_players/', TeamViewSet.as_view({'post': 'assign_teams'})),
    path('sorted_table/<int:pk>/', TeamViewSet.as_view({'get': 'sorted_table'}), name='sorted_table'),
]

