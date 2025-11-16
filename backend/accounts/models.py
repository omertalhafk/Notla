from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """
    Özel kullanıcı modeli.
    Email ile giriş yapılacak, username opsiyonel.
    """
    email = models.EmailField(unique=True, verbose_name='E-posta')
    is_verified = models.BooleanField(default=False, verbose_name='Doğrulandı mı?')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Kayıt Tarihi')
    
    # Email ile giriş yapalım (username yerine)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # createsuperuser için gerekli
    
    def __str__(self):
        return self.email
    
    class Meta:
        verbose_name = 'Kullanıcı'
        verbose_name_plural = 'Kullanıcılar'
        