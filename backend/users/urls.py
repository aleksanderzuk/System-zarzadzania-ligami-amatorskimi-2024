from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, RegisterView, UpdateGoalsView

router = DefaultRouter()
router.register(r'players', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('update_goals/', UpdateGoalsView.as_view(), name='update-goals'),

]