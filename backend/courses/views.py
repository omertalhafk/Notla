from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Course, Note, Review
from .serializers import (
    CourseSerializer, 
    CourseDetailSerializer,
    NoteSerializer, 
    ReviewSerializer
)


@api_view(['GET'])
@permission_classes([AllowAny])
def course_list(request):
    """
    Tüm dersleri listele.
    
    GET /api/courses/
    Query params:
        - search: Ders kodu veya adında ara
        - ordering: Sıralama (code, name, -created_at)
    """
    courses = Course.objects.all()
    
    # Arama
    search = request.query_params.get('search', None)
    if search:
        courses = courses.filter(
            code__icontains=search
        ) | courses.filter(
            name__icontains=search
        )
    
    # Sıralama
    ordering = request.query_params.get('ordering', 'code')
    courses = courses.order_by(ordering)
    
    serializer = CourseSerializer(courses, many=True)
    return Response({
        'count': courses.count(),
        'results': serializer.data
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def course_detail(request, pk):
    """
    Ders detayı (notlar ve yorumlar dahil).
    
    GET /api/courses/{id}/
    """
    course = get_object_or_404(Course, pk=pk)
    serializer = CourseDetailSerializer(course)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_note(request, pk):
    """
    Derse not yükle.
    
    POST /api/courses/{id}/notes/
    Body (multipart/form-data):
        - title: Not başlığı
        - description: Açıklama (opsiyonel)
        - file: Dosya
        - file_type: pdf, docx, pptx, jpg, png, txt, other
    """
    course = get_object_or_404(Course, pk=pk)
    
    # Dosya var mı kontrol
    if 'file' not in request.FILES:
        return Response(
            {'error': 'Dosya yüklenmedi!'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Serializer'a veriyi gönder
    data = {
        'course': course.id,
        'title': request.data.get('title'),
        'description': request.data.get('description', ''),
        'file': request.FILES.get('file'),
        'file_type': request.data.get('file_type'),
    }
    
    serializer = NoteSerializer(data=data, context={'request': request})
    
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(
            {
                'message': 'Not başarıyla yüklendi! 📄',
                'note': serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request, pk):
    """
    Derse değerlendirme yap.
    
    POST /api/courses/{id}/reviews/
    Body:
        - rating: 1-5 arası puan
        - comment: Yorum metni
        - is_anonymous: true/false (default: true)
        - difficulty: 1-5 (opsiyonel)
        - workload: 1-5 (opsiyonel)
    """
    course = get_object_or_404(Course, pk=pk)
    
    # Veriyi hazırla
    data = request.data.copy()
    data['course'] = course.id
    
    serializer = ReviewSerializer(data=data, context={'request': request})
    
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(
            {
                'message': 'Değerlendirme başarıyla eklendi! ⭐',
                'review': serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def note_list(request):
    """
    Tüm notları listele.
    
    GET /api/courses/notes/   (şu an URL’lerin böyle ayarlı)
    Query params:
        - course: Ders ID'si (ör: ?course=1)
        - file_type: Dosya türü (ör: ?file_type=pdf)
    """
    # İlişkili user ve course'u tek sorguda çekmek için
    notes = Note.objects.select_related('course', 'user').all()

    # Filtre: course
    course_id = request.query_params.get('course')
    if course_id:
        notes = notes.filter(course_id=course_id)

    # Filtre: file_type
    file_type = request.query_params.get('file_type')
    if file_type:
        notes = notes.filter(file_type=file_type)

    # Tarihe göre sırala (modelde created_at varsa)
    if hasattr(Note, 'created_at'):
        notes = notes.order_by('-created_at')

    serializer = NoteSerializer(notes, many=True, context={'request': request})
    return Response({
        'count': notes.count(),
        'results': serializer.data
    })