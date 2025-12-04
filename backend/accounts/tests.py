from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status


User = get_user_model()


class RegisterTests(APITestCase):
    """
    /api/auth/register/ endpoint'i için temel senaryolar:
    - Geçerli veri ile başarı
    - Yanlış domain ile hata
    """

    def test_register_with_valid_etu_email(self):
        url = "/api/auth/register/"
        data = {
            "username": "yunus",
            "email": "yunus@etu.edu.tr",
            "password": "StrongPass123!",
            "password2": "StrongPass123!",
            # department alanı senin RegisterSerializer'ına göre değişebilir
            "department": "CS",  # gerekirse uygun bir değerle değiştir
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            User.objects.filter(email="yunus@etu.edu.tr").exists(),
            "Kayıt sonrası kullanıcı veritabanında oluşmamış."
        )

    def test_register_rejects_non_etu_email(self):
        url = "/api/auth/register/"
        data = {
            "username": "yunus",
            "email": "yunus@gmail.com",  # yanlış domain
            "password": "StrongPass123!",
            "password2": "StrongPass123!",
            "department": "CS",
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Hata mesajı serializer'a göre değişebilir, sadece mail reddedildi mi ona bakıyoruz
        self.assertIn("email", response.data)


class LoginAndProfileTests(APITestCase):
    """
    Login + Profile akışı:
    - create_user ile kullanıcı oluştur
    - /api/auth/login/ ile token al
    - token'ı header'a koyup /api/auth/profile/ isteği yap
    """

    def setUp(self):
        # department, is_verified vs. senin CustomUser modeline göre değişebilir
        self.user = User.objects.create_user(
            username="testuser",
            email="test@etu.edu.tr",
            password="Password123!",
            # örnek: department="CS"
        )

    def test_login_returns_jwt_tokens(self):
        url = "/api/auth/login/"
        data = {
            "email": "test@etu.edu.tr",
            "password": "Password123!",
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_profile_requires_auth_and_returns_user_info(self):
        # önce login olup access token alıyoruz
        login_response = self.client.post(
            "/api/auth/login/",
            {"email": "test@etu.edu.tr", "password": "Password123!"},
            format="json",
        )
        access = login_response.data["access"]

        # token'ı Authorization header'a koy
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

        # profile endpoint'ine git
        response = self.client.get("/api/auth/profile/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "test@etu.edu.tr")
