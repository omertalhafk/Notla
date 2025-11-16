from django.db import models
from accounts.models import User

class Course(models.Model):
    """
    Ders modeli (BIL481, MAT101 vs.)
    """
    code = models.CharField(max_length=20, unique=True, verbose_name='Ders Kodu')
    name = models.CharField(max_length=255, verbose_name='Ders Adı')
    description = models.TextField(blank=True, verbose_name='Açıklama')
    instructor = models.CharField(max_length=255, blank=True, verbose_name='Eğitmen')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Oluşturulma Tarihi')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Güncellenme Tarihi')
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    class Meta:
        verbose_name = 'Ders'
        verbose_name_plural = 'Dersler'
        ordering = ['code']


class Note(models.Model):
    """
    Ders notu modeli (PDF, DOCX, resim vs.)
    """
    FILE_TYPES = (
        ('pdf', 'PDF'),
        ('docx', 'Word Belgesi'),
        ('pptx', 'PowerPoint'),
        ('jpg', 'Resim (JPG)'),
        ('png', 'Resim (PNG)'),
        ('txt', 'Metin Dosyası'),
        ('other', 'Diğer'),
    )
    
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE, 
        related_name='notes',
        verbose_name='Ders'
    )
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        verbose_name='Yükleyen Kullanıcı'
    )
    title = models.CharField(max_length=255, verbose_name='Not Başlığı')
    description = models.TextField(blank=True, verbose_name='Açıklama')
    file = models.FileField(upload_to='notes/%Y/%m/%d/', verbose_name='Dosya')
    file_type = models.CharField(max_length=10, choices=FILE_TYPES, verbose_name='Dosya Türü')
    file_size = models.IntegerField(default=0, verbose_name='Dosya Boyutu (bytes)')
    
    # İstatistikler
    download_count = models.IntegerField(default=0, verbose_name='İndirilme Sayısı')
    view_count = models.IntegerField(default=0, verbose_name='Görüntülenme Sayısı')
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Yüklenme Tarihi')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Güncellenme Tarihi')
    
    def __str__(self):
        return f"{self.title} ({self.course.code})"
    
    class Meta:
        verbose_name = 'Not'
        verbose_name_plural = 'Notlar'
        ordering = ['-created_at']


class Review(models.Model):
    """
    Ders değerlendirmesi (yıldız + yorum)
    """
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE, 
        related_name='reviews',
        verbose_name='Ders'
    )
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        verbose_name='Değerlendiren Kullanıcı'
    )
    rating = models.IntegerField(
        choices=[(i, f'{i} Yıldız') for i in range(1, 6)],
        verbose_name='Puan'
    )
    comment = models.TextField(verbose_name='Yorum')
    is_anonymous = models.BooleanField(default=True, verbose_name='Anonim mi?')
    
    # Ek kriterler (opsiyonel)
    difficulty = models.IntegerField(
        choices=[(i, str(i)) for i in range(1, 6)],
        null=True, 
        blank=True,
        verbose_name='Zorluk (1-5)'
    )
    workload = models.IntegerField(
        choices=[(i, str(i)) for i in range(1, 6)],
        null=True, 
        blank=True,
        verbose_name='İş Yükü (1-5)'
    )
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Oluşturulma Tarihi')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Güncellenme Tarihi')
    
    def __str__(self):
        return f"{self.course.code} - {self.rating} yıldız"
    
    class Meta:
        verbose_name = 'Değerlendirme'
        verbose_name_plural = 'Değerlendirmeler'
        ordering = ['-created_at']
        # Bir kullanıcı bir derse sadece bir kez değerlendirme yapabilir
        unique_together = ['course', 'user']