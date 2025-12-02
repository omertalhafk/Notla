# NOTLA

Üniversite öğrencilerinin ders notlarını paylaşabildiği ve dersleri değerlendirbildiği platform.

## Proje Yapısı

```
Notla/
├── backend/                # Django REST API
├── frontend/               # React
├── UML_Diagram/            # UML diyagramları
└── docs/                   # Proje dokümanları
```

## Kurulum

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Özellikler

### 🔐 Güvenli Kimlik Doğrulama
- @etu.edu.tr e-posta uzantısı ile kayıt
- JWT tabanlı oturum yönetimi

### 📂 Not Paylaşımı
- PDF, resim ve ofis dosyalarını yükleme
- Önizleme ve indirme özellikleri

### ⭐ Ders Değerlendirme Sistemi
- Zorluk, iş yükü ve memnuniyet puanlaması
- Yorum yapma imkanı

### 🔍 Gelişmiş Arama
- Ders adı veya koduna göre filtreleme

### 🏆 Rozet Sistemi
- Not paylaşan kullanıcıları ödüllendirme

## Teknolojiler

**Backend**
- Python, Django, Django REST Framework
- PostgreSQL
- SimpleJWT
- CORS Headers

**Frontend**
- React.js
- React Bootstrap, Bootstrap 5
- Framer Motion
- React Router v6
- Axios

## Ortam Değişkenleri

Backend klasöründe `.env` dosyası oluşturun:

```env
# Django Secret Key
SECRET_KEY=BURAYA_SECRET_KEY_GELECEK

# Geliştirme ortamı
DEBUG=True

# PostgreSQL Ayarları
DB_NAME=notla_db
DB_USER=postgres
DB_PASSWORD=veritabani_sifreniz
DB_HOST=localhost
DB_PORT=5432
```

Secret Key oluşturmak için:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## Proje Klasör Yapısı

```
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
```

## Geliştirici Ekibi

- Abdullah Arda Gündoğdu
- Ömer Talha Akbulut
- Yunus Emre Özçelik
- İsmail Emre Yıldız

## Lisans

Bu proje eğitim ve geliştirme amaçlıdır. Kaynak kodları açık kaynak olup, ticari kullanım izne tabidir.

---

**Backend:** http://localhost:8000  
**Frontend:** http://localhost:3000
