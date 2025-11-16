from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Kullanıcı kaydı için serializer.
    Şifreyi güvenli şekilde hashler.
    """
    password = serializers.CharField(
        write_only=True,  # Sadece yazılır, okunmaz (güvenlik)
        min_length=6,     # En az 6 karakter
        style={'input_type': 'password'}  # HTML'de şifre kutusu
    )
    password_confirm = serializers.CharField(
        write_only=True,
        min_length=6,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'password_confirm']
        read_only_fields = ['id']  # id otomatik, değiştirilemez
    
    def validate(self, data):
        """
        Özel doğrulama: Şifreler eşleşiyor mu?
        """
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Şifreler eşleşmiyor!'
            })
        return data
    
    def create(self, validated_data):
        """
        Kullanıcıyı oluştur. Şifreyi hashle!
        """
        # password_confirm'i kaldır (veritabanına kaydetmeyeceğiz)
        validated_data.pop('password_confirm')
        
        # Kullanıcıyı oluştur (şifre otomatik hashlenir)
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user
    
class UserLoginSerializer(serializers.Serializer):
    """
    Login (giriş) için serializer.
    Email ve şifre alır, token döner.
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    def validate(self, data):
        """
        Email ve şifreyi kontrol et.
        """
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            # Kullanıcıyı doğrula
            user = authenticate(username=email, password=password)
            
            if not user:
                raise serializers.ValidationError(
                    'Email veya şifre hatalı!'
                )
            
            if not user.is_active:
                raise serializers.ValidationError(
                    'Bu hesap devre dışı bırakılmış!'
                )
            
            data['user'] = user
            return data
        else:
            raise serializers.ValidationError(
                'Email ve şifre gerekli!'
            )