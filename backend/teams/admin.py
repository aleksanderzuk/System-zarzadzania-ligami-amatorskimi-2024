from django.contrib import admin
from .models import Team

class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'league', 'created_at')
    search_fields = ('name', 'league__name')
    list_filter = ('league',)


admin.site.register(Team, TeamAdmin)
