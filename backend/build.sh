#!/usr/bin/env bash
# Hata olursa işlemi durdur
set -o errexit

# Kütüphaneleri yükle
pip install -r requirements.txt

# Statik dosyaları (CSS, JS) topla
python manage.py collectstatic --no-input

# Veritabanı tablolarını oluştur/güncelle
python manage.py migrate