from rest_framework import viewsets, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import UserSerializer, RegisterSerializer
from .filters import UserFilter
from rest_framework.decorators import action

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = UserFilter

    def get_queryset(self):
        queryset = User.objects.all()
        not_assigned = self.request.query_params.get('not_assigned', None)
        if not_assigned == 'true':
            queryset = queryset.filter(team__isnull=True)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def update_goals(self, request, pk=None):
        user = self.get_object()
        goals_to_add = request.data.get('goals', 0)
        try:
            user.goals += int(goals_to_add)
            user.save()
            return Response({'message': f'Updated goals for user {user.name} {user.surname}.', 'goals': user.goals})
        except ValueError:
            return Response({'error': 'Invalid data for goals.'}, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

class UpdateGoalsView(APIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        goals_to_add = request.data.get('goals', 1)  # Domyślnie dodajemy jedną bramkę

        if not user_id:
            return Response({'error': 'user_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, id=user_id)

        try:
            goals_to_add = int(goals_to_add)
            user.goals += goals_to_add
            user.save()
            return Response({'message': f'Updated goals for {user.name} {user.surname}.', 'goals': user.goals}, status=status.HTTP_200_OK)
        except ValueError:
            return Response({'error': 'Invalid value for goals.'}, status=status.HTTP_400_BAD_REQUEST)
