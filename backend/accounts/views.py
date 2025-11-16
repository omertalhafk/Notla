from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserRegistrationSerializer

from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer, UserLoginSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

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


@api_view(['POST'])
def login(request):
    """
    Kullanıcı girişi (login) API endpoint'i.
    
    POST /api/auth/login/
    Body: {
        "email": "test@tobb.edu.tr",
        "password": "123456"
    }
    
    Response: {
        "message": "Giriş başarılı!",
        "tokens": {
            "access": "...",
            "refresh": "..."
        },
        "user": {...}
    }
    """
    serializer = UserLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # JWT token oluştur
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Giriş başarılı! 🎉',
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            },
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'is_verified': user.is_verified
            }
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    """
    Kullanıcı profilini döndürür.
    SADECE giriş yapmış kullanıcılar erişebilir!
    
    GET /api/auth/profile/
    Header: Authorization: Bearer <access_token>
    """
    user = request.user
    
    return Response({
        'id': user.id,
        'email': user.email,
        'username': user.username,
        'is_verified': user.is_verified,
        'created_at': user.created_at
    })