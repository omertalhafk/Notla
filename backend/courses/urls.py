from django.urls import path
from . import views

urlpatterns = [
    # Ders listeleri
    path('', views.course_list, name='course-list'),
    path('<int:pk>/', views.course_detail, name='course-detail'),
    
    # Not işlemleri
    path('<int:pk>/notes/', views.upload_note, name='upload-note'),
    path('notes/', views.note_list, name='note-list'),
    
    # Değerlendirme
    path('<int:pk>/reviews/', views.create_review, name='create-review'),
]