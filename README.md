# NOTLA

Üniversite öğrencilerinin ders notlarını paylaşabildiği ve dersleri değerlendirebildiği platform.

## Proje Yapısı
```
Notla/
├── backend/         # Django REST API
├── frontend/        # React (yakında)
└── docs/            # Proje dökümanları
```

## Kurulum

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install django djangorestframework django-cors-headers psycopg2-binary python-dotenv pillow
python manage.py migrate
python manage.py runserver
```

## Ekip

- Abdullah Arda Gündoğdu
- Ömer Talha Akbulut
- Yunus Emre Özçelik
- İsmail Emre Yıldız

## Teknolojiler

- **Backend:** Django, PostgreSQL
- **Frontend:** React (yakında)