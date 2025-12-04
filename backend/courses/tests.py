from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from rest_framework import status

from .models import Course, Note  # model isimleri sende böyleydi diye varsayıyorum


User = get_user_model()


class CourseBaseTestCase(APITestCase):
    """
    Diğer test sınıflarının ortak setup'ı:
    - 1 kullanıcı
    - 1 ders
    - login olup access token'ı header'a koyma
    """

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@etu.edu.tr",
            password="Password123!",
            # department vb. alanları kendi modeline göre ekle
        )

        # Basit bir Course oluştur
        self.course = Course.objects.create(
            code="BIL481",
            name="Yazılım Mühendisliği",
            department="CS",  # senin choices'ına göre değişebilir
            description="Test için oluşturulmuş ders",
        )

        # Login olup token al
        login_resp = self.client.post(
            "/api/auth/login/",
            {"email": "test@etu.edu.tr", "password": "Password123!"},
            format="json",
        )
        self.access = login_resp.data["access"]

        # Tüm isteklerde Authorization header'ı otomatik gitsin
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")


class CourseListTests(CourseBaseTestCase):
    """
    /api/courses/ endpoint'i:
    - 200 dönüyor mu?
    - En az bir ders geliyor mu?
    """

    def test_course_list_returns_courses(self):
        response = self.client.get("/api/courses/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(
            len(response.data), 1, "En az bir ders dönmesini beklerdik."
        )


class CourseDetailTests(CourseBaseTestCase):
    """
    /api/courses/<id>/ endpoint'i:
    - Var olan ders için 200 dönmeli
    """

    def test_course_detail_returns_200(self):
        url = f"/api/courses/{self.course.id}/"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.course.id)


class NoteUploadTests(CourseBaseTestCase):
    """
    /api/courses/<id>/notes/ endpoint'i:
    - Auth zorunlu
    - FormData ile dosya yüklenebiliyor mu?
    """

    def test_upload_note_creates_note_object(self):
        url = f"/api/courses/{self.course.id}/notes/"

        test_file = SimpleUploadedFile(
            "test_notes.pdf",
            b"Dummy content of the file",
            content_type="application/pdf",
        )

        data = {
            "title": "Vize notları",
            "description": "Test için oluşturulmuş not",
            "file": test_file,
            "file_type": "pdf",  # sende field varsa
        }

        response = self.client.post(url, data, format="multipart")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            Note.objects.filter(course=self.course, title="Vize notları").exists()
        )

    def test_upload_note_requires_authentication(self):
        # Önce header'ı sıfırla → token olmasın
        self.client.credentials()

        url = f"/api/courses/{self.course.id}/notes/"

        test_file = SimpleUploadedFile(
            "test_notes.pdf",
            b"Dummy content",
            content_type="application/pdf",
        )

        data = {
            "title": "Anonim not",
            "description": "Bu istek anonim",
            "file": test_file,
            "file_type": "pdf",
        }

        response = self.client.post(url, data, format="multipart")

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
            "Login olmadan not yüklenmesine izin verilmemeli.",
        )
