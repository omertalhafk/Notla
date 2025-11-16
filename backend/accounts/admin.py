from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Admin panelde User modelini özelleştir
    """
    list_display = ['email', 'username', 'is_verified', 'is_staff', 'created_at']
    list_filter = ['is_verified', 'is_staff', 'is_superuser']
    search_fields = ['email', 'username']
    ordering = ['-created_at']
    
    # Detay sayfasında gösterilecekler
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Ek Bilgiler', {'fields': ('is_verified', 'created_at')}),
    )
    readonly_fields = ['created_at']