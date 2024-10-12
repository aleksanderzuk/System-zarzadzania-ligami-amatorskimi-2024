from django.db import models
from django.conf import settings
# Create your models here.

class League(models.Model):
    name = models.CharField(max_length=30)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='leagues')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name