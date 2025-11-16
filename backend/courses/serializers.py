from rest_framework import serializers
from .models import Course, Note, Review

class CourseSerializer(serializers.ModelSerializer):
    """
    Ders listesi için serializer.
    İstatistik bilgileri de içerir.
    """
    notes_count = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = [
            'id', 'code', 'name', 'description', 'instructor',
            'notes_count', 'reviews_count', 'average_rating',
            'created_at', 'updated_at'
        ]
    
    def get_notes_count(self, obj):
        """Kaç not var?"""
        return obj.notes.count()
    
    def get_reviews_count(self, obj):
        """Kaç değerlendirme var?"""
        return obj.reviews.count()
    
    def get_average_rating(self, obj):
        """Ortalama puan kaç?"""
        reviews = obj.reviews.all()
        if reviews.exists():
            total = sum([r.rating for r in reviews])
            return round(total / reviews.count(), 2)
        return 0.0


class NoteSerializer(serializers.ModelSerializer):
    """
    Not yükleme ve listeleme için serializer.
    """
    user_email = serializers.EmailField(source='user.email', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Note
        fields = [
            'id', 'course', 'course_code', 'user', 'user_email',
            'title', 'description', 'file', 'file_url', 'file_type', 'file_size',
            'download_count', 'view_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'file_size', 'download_count', 'view_count']
    
    def get_file_url(self, obj):
        """Dosyanın tam URL'ini döndür"""
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None
    
    def create(self, validated_data):
        """Not oluştururken dosya boyutunu hesapla"""
        note = Note.objects.create(**validated_data)
        if note.file:
            note.file_size = note.file.size
            note.save()
        return note


class ReviewSerializer(serializers.ModelSerializer):
    """
    Değerlendirme yapmak için serializer.
    """
    user_email = serializers.EmailField(source='user.email', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'course', 'course_code', 'user', 'user_email',
            'rating', 'comment', 'is_anonymous',
            'difficulty', 'workload',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user']
    
    def validate_rating(self, value):
        """Puan 1-5 arasında mı?"""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Puan 1 ile 5 arasında olmalıdır.")
        return value
    
    def validate(self, data):
        """Kullanıcı daha önce bu derse yorum yapmış mı?"""
        request = self.context.get('request')
        course = data.get('course')
        
        if request and course:
            # Güncelleme işlemiyse (id varsa) kontrol etme
            if self.instance:
                return data
            
            # Yeni kayıt ise, daha önce yorum yapılmış mı kontrol et
            if Review.objects.filter(user=request.user, course=course).exists():
                raise serializers.ValidationError(
                    "Bu derse daha önce değerlendirme yaptınız!"
                )
        
        return data


class CourseDetailSerializer(serializers.ModelSerializer):
    """
    Ders detayı için serializer.
    İlişkili notlar ve yorumlar da gelir.
    """
    notes = NoteSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    notes_count = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = [
            'id', 'code', 'name', 'description', 'instructor',
            'notes', 'notes_count',
            'reviews', 'reviews_count', 'average_rating',
            'created_at', 'updated_at'
        ]
    
    def get_notes_count(self, obj):
        return obj.notes.count()
    
    def get_reviews_count(self, obj):
        return obj.reviews.count()
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews.exists():
            total = sum([r.rating for r in reviews])
            return round(total / reviews.count(), 2)
        return 0.0