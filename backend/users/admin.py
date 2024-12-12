from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'name', 'surname', 'position', 'is_admin')
    search_fields = ('username', 'name', 'surname', 'email', 'position', 'is_admin', 'team__name')
    list_filter = ('is_admin', 'position')
    ordering = ('username',)

    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {'fields': ('team',)}),
    )

admin.site.register(User, UserAdmin)
