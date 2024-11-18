from django.contrib import admin
from .models import League

class LeagueAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'created_at')
    search_fields = ('name', 'created_by__username')
    list_filter = ('created_at',)


admin.site.register(League, LeagueAdmin)
