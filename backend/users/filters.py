from django_filters import rest_framework as filters
from .models import User

class UserFilter(filters.FilterSet):
    name = filters.CharFilter(field_name="username", lookup_expr="icontains")

    class Meta:
        model = User
        fields = ['username']
