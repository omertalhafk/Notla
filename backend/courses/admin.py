from django.contrib import admin
from .models import Course, Note, Review

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'instructor', 'created_at']
    search_fields = ['code', 'name', 'instructor']
    list_filter = ['created_at']
    ordering = ['code']


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'user', 'file_type', 'download_count', 'created_at']
    search_fields = ['title', 'course__code', 'user__email']
    list_filter = ['file_type', 'created_at', 'course']
    readonly_fields = ['download_count', 'view_count', 'file_size', 'created_at', 'updated_at']
    ordering = ['-created_at']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['course', 'user', 'rating', 'is_anonymous', 'created_at']
    search_fields = ['course__code', 'user__email', 'comment']
    list_filter = ['rating', 'is_anonymous', 'created_at', 'course']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']