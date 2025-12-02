# 📚 NOTLA – Üniversite Ders Notu Paylaşım Platformu

Notla, TOBB ETÜ öğrencileri için geliştirilmiş; ders notu paylaşımı, ders değerlendirmeleri ve akademik yardımlaşmayı dijital ortama taşıyan modern bir web platformudur.

# 🚀 Özellikler

🔐 Güvenli Kimlik Doğrulama
@etu.edu.tr e-posta uzantısı ile kayıt olma ve JWT tabanlı oturum yönetimi

📂 Not Paylaşımı
PDF, resim ve ofis dosyalarını yükleme, önizleme ve indirme

⭐ Ders Değerlendirme Sistemi
Dersleri zorluk, iş yükü ve memnuniyet kriterlerine göre puanlama ve yorum yapma

🔍 Gelişmiş Arama Motoru
Ders adı veya koduna göre anlık filtreleme

🏆 Rozet Sistemi
Not paylaşan kullanıcıları ödüllendiren topluluk rozetleri

# 🛠 Kullanılan Teknolojiler

Backend
-Python, Django, Django REST Framework
-PostgreSQL
-SimpleJWT
-Django Media Files
-python-dotenv, CORS Headers

Frontend
-React.js
-React Bootstrap, Bootstrap 5, Framer Motion
-React Router v6
-Axios (Interceptor yapısı kullanılarak)

# ⚙️ Kurulum Rehberi

Aşağıdaki adımları takip ederek projeyi yerel ortamda çalıştırabilirsiniz.

🧩 1. Backend Kurulumu (Django)
📌 Backend klasörüne gidin
-cd backend

📌 Sanal ortam oluşturun ve aktif edin

Windows:
-python -m venv venv
-venv\Scripts\activate

MacOS / Linux:
-python3 -m venv venv
-source venv/bin/activate

📌 Bağımlılıkları yükleyin
-pip install -r requirements.txt

🔐 .env Dosyasını Oluşturun

backend klasörü içinde .env adlı bir dosya oluşturun:

/Django Secret Key (aşağıdaki komutla üretin)
SECRET_KEY=BURAYA_SECRET_KEY_GELECEK

/Geliştirme ortamı
DEBUG=True

/PostgreSQL Ayarları
DB_NAME=notla_db
DB_USER=postgres
DB_PASSWORD=veritabani_sifreniz
DB_HOST=localhost
DB_PORT=5432

Secret Key oluşturmak için:
-python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

📌 Veritabanını hazırlayın
-python manage.py makemigrations
-python manage.py migrate

📌 Backend sunucusunu başlatın
-python manage.py runserver


➡️ Backend çalışıyor: http://localhost:8000

🎨 2. Frontend Kurulumu (React)
📌 Frontend klasörüne gidin
-cd frontend

📌 Bağımlılıkları yükleyin
-npm install
/Hata alırsanız:
-npm install --legacy-peer-deps

📌 Uygulamayı başlatın
-npm start


➡️ Frontend çalışıyor: http://localhost:3000

# 📁 Proje Klasör Yapısı
Notla/
├── backend/
│   ├── accounts/           # Kullanıcı işlemleri
│   ├── courses/            # Ders/not modelleri
│   ├── notla_backend/      # Django ayar dosyaları
│   ├── media/              # Yüklenen dosyalar
│   └── manage.py
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Ortak UI bileşenleri
│   │   ├── pages/          # Uygulama sayfaları
│   │   ├── services/       # Axios API servisleri
│   │   └── App.js
│   └── public/
│
└── README.md

# 👥 Geliştirici Ekibi

Abdullah Arda Gündoğdu

Ömer Talha Akbulut

Yunus Emre Özçelik

İsmail Emre Yıldız

# 📄 Lisans

Bu proje eğitim ve geliştirme amaçlıdır.
Kaynak kodları açık kaynak olup, ticari kullanım izne tabidir.
