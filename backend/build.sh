#!/usr/bin/env bash
# Hata olursa işlemi durdur
set -o errexit

# Kütüphaneleri yükle
pip install -r requirements.txt

# Statik dosyaları (CSS, JS) topla
python manage.py collectstatic --no-input

# Veritabanı tablolarını oluştur/güncelle
python manage.py migrate

# Admin kullanıcısı oluşturma (Kullanıcı: admin, Şifre: 123456)
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@etu.edu.tr', '123456') if not User.objects.filter(username='admin').exists() else None" | python manage.py shell