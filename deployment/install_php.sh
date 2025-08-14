#!/bin/bash

# 🐘 PHP Kurulum Script'i - HOOWELL PayTR Callback

set -e

echo "🐘 PHP Kurulumu Başlıyor..."

# PHP ve gerekli modülleri kur
sudo apt update
sudo apt install -y php8.1-fpm php8.1-cli php8.1-mysql php8.1-curl php8.1-mbstring

# PHP-FPM'i başlat ve aktif et
sudo systemctl start php8.1-fpm
sudo systemctl enable php8.1-fpm

# PHP-FPM durumunu kontrol et
echo "PHP-FPM Status: $(systemctl is-active php8.1-fpm)"

# PHP versiyonunu kontrol et
php --version

# Log klasörü oluştur
sudo mkdir -p /var/log/hoowell
sudo chown www-data:www-data /var/log/hoowell
sudo chmod 755 /var/log/hoowell

# PayTR callback dosyasının izinlerini ayarla
sudo chown www-data:www-data /root/hoowell/paytr_callback.php
sudo chmod 644 /root/hoowell/paytr_callback.php

echo "✅ PHP kurulumu tamamlandı!"
echo "📋 Sonraki adımlar:"
echo "   1. Nginx config'i güncelle: sudo cp deployment/nginx_with_php.conf /etc/nginx/sites-available/hoowell"
echo "   2. Nginx test et: sudo nginx -t"
echo "   3. Nginx reload et: sudo systemctl reload nginx"
echo "   4. PayTR callback test et: curl -X POST https://hoowell.net/paytr_callback.php -d 'test=1'"