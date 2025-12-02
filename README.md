# NOTLA

Üniversite öğrencilerinin ders notlarını paylaşabildiği ve dersleri değerlendirebildiği platform.

## Proje Yapısı
```
Notla/
├── backend/         # Django REST API
├── frontend/        # React
├── docs/            # Dökümanlar
├── UML_Diagram/     # UML diyagramları
└── README.md        # README dosyası
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

## Ekip

- Abdullah Arda Gündoğdu
- Ömer Talha Akbulut
- Yunus Emre Özçelik
- İsmail Emre Yıldız

## Teknolojiler

- **Backend:** Django,PostgreSQL
- **Frontend:** React