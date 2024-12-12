from rest_framework import viewsets, permissions, generics
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, RegisterSerializer
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .filters import UserFilter


User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [permissions.IsAuthenticated] jeżeli będzie potrzeba to dodam autentykacje do getowania userow
    filter_backends = [DjangoFilterBackend]
    filterset_class = UserFilter

    def get_queryset(self):
        queryset = User.objects.all()

        # Sprawdzamy, czy w zapytaniu jest parametr 'no_league', który ma wartość 'true'
        not_assigned = self.request.query_params.get('not_assigned', None)

        if not_assigned == 'true':
            # Zwracamy tylko drużyny, które nie mają przypisanej ligi
            queryset = queryset.filter(team__isnull=True)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer