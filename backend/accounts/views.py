from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserRegistrationSerializer

@api_view(['POST'])
def register(request):
    """
    Yeni kullanıcı kaydı API endpoint'i.
    
    POST /api/auth/register/
    Body: {
        "email": "test@tobb.edu.tr",
        "username": "testuser",
        "password": "123456",
        "password_confirm": "123456"
    }
    """
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        # Veri geçerliyse kullanıcıyı oluştur
        user = serializer.save()
        
        return Response({
            'message': 'Kayıt başarılı! 🎉',
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'is_verified': user.is_verified
            }
        }, status=status.HTTP_201_CREATED)
    
    # Veri geçersizse hataları döndür
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)