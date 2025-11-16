from rest_framework import serializers
from .models import User

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