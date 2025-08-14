# 🐘 PayTR PHP Callback Deployment Rehberi

## 📋 Sunucuda Yapılacak İşlemler

### 1. Git Pull
```bash
cd ~/hoowell
git pull origin main
```

### 2. PHP Kurulumu
```bash
# PHP kurulum script'ini çalıştır
chmod +x deployment/install_php.sh
./deployment/install_php.sh
```

### 3. Nginx Konfigürasyonu
```bash
# PHP destekli nginx config'i uygula
sudo cp deployment/nginx_with_php.conf /etc/nginx/sites-available/hoowell

# Nginx test et
sudo nginx -t

# Nginx reload et
sudo systemctl reload nginx
```

### 4. PayTR Callback Test
```bash
# Test script'ini çalıştır
chmod +x deployment/test_paytr_callback.sh
./deployment/test_paytr_callback.sh
```

### 5. Backend Restart
```bash
# PM2 restart
pm2 restart hoowell-backend

# PM2 durumu
pm2 status
```

## 🎯 PayTR Panel Ayarları

PayTR mağaza panelinde şu URL'leri ayarlayın:

```
✅ Bildirim URL'i: https://hoowell.net/paytr_callback.php
✅ Başarılı Ödeme URL'i: https://hoowell.net/payment/success
✅ Başarısız Ödeme URL'i: https://hoowell.net/payment/fail
```

## 🔍 Debug ve Monitoring

### Log Dosyaları
```bash
# PayTR callback logları
sudo tail -f /var/log/hoowell/paytr_callback.log

# PHP-FPM logları
sudo tail -f /var/log/php8.1-fpm.log

# Nginx error logları
sudo tail -f /var/log/nginx/error.log
```

### Test Komutları
```bash
# Callback test
curl -X POST https://hoowell.net/paytr_callback.php -d "test=1"

# PHP durumu
systemctl status php8.1-fpm

# Nginx durumu
systemctl status nginx
```

## ✅ Başarı Kriterleri

- [ ] PHP-FPM çalışıyor
- [ ] Nginx PHP desteği aktif
- [ ] PayTR callback dosyası erişilebilir
- [ ] Log dosyası oluşuyor
- [ ] PayTR panel test'i başarılı

## 🚨 Sorun Giderme

### PHP-FPM Çalışmıyorsa
```bash
sudo systemctl restart php8.1-fpm
sudo systemctl status php8.1-fpm
```

### Nginx PHP Desteği Çalışmıyorsa
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Log Dosyası Oluşmuyorsa
```bash
sudo mkdir -p /var/log/hoowell
sudo chown www-data:www-data /var/log/hoowell
sudo chmod 755 /var/log/hoowell
```

Bu rehberi takip ederek PayTR PHP callback sistemi %100 çalışacak! 🚀