# 🚀 HOOWELL TREPS ENTEGRASYONU - MANUEL KURULUM

## 📋 **SUNUCUDA ÇALIŞTIRILACAK KOMUTLAR:**

### **1. BACKEND RESTART**
```bash
# Backend'i yeniden başlat
pm2 restart hoowell-backend

# Durumu kontrol et
pm2 status

# Logları kontrol et
pm2 logs hoowell-backend --lines 10
```

### **2. FRONTEND BUILD**
```bash
# Frontend klasörüne git
cd /root/hoowell/frontend

# Build et
npm run build

# Build durumunu kontrol et
ls -la build/
```

### **3. TREPS TEST**
```bash
# Ana klasöre git
cd /root/hoowell

# TREPS test scriptini çalıştır
node test_treps_new.js
```

### **4. NGINX RESTART**
```bash
# Nginx konfigürasyonunu test et
nginx -t

# Nginx'i yeniden başlat
systemctl restart nginx

# Durumu kontrol et
systemctl status nginx
```

### **5. SSL SERTİFİKALARI KONTROL**
```bash
# SSL sertifikalarını kontrol et
certbot certificates

# Gerekirse yenile
certbot renew --dry-run
```

## 🧪 **TEST ADIMLARI:**

### **1. Backend Test**
```bash
# Backend çalışıyor mu?
curl -X GET https://panel.hoowell.net/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **2. TREPS API Test**
```bash
# Test scriptini çalıştır
node test_treps_new.js

# Beklenen çıktı:
# ✅ Authentication başarılı
# ✅ IFRAME ödeme oluşturuldu
# ✅ URL: https://hp.treps.io/iframe/...
```

### **3. Frontend Test**
- https://panel.hoowell.net adresine git
- Müşteri kayıt sayfasına git: `/customer-registration`
- TREPS ödeme seçeneğini seç
- "TREPS ile Güvenli Ödeme Yap" butonuna tıkla

### **4. Ödeme Test**
- TREPS IFRAME açılmalı
- Test kartı ile ödeme yap
- Başarılı ödeme sonrası callback çalışmalı

## 🔧 **HATA DURUMUNDA:**

### **Backend Hatası:**
```bash
# Logları kontrol et
pm2 logs hoowell-backend

# Backend'i yeniden başlat
pm2 restart hoowell-backend

# Tüm PM2 process'lerini yeniden başlat
pm2 restart all
```

### **Frontend Hatası:**
```bash
# Build'i temizle ve yeniden yap
cd /root/hoowell/frontend
rm -rf build/
npm run build

# Node modules'ü yeniden yükle
npm install
```

### **Nginx Hatası:**
```bash
# Konfigürasyonu test et
nginx -t

# Nginx'i yeniden başlat
systemctl restart nginx

# Nginx loglarını kontrol et
tail -f /var/log/nginx/error.log
```

### **SSL Hatası:**
```bash
# Sertifikaları yenile
certbot renew

# Nginx'i yeniden başlat
systemctl restart nginx
```

## ✅ **BAŞARILI KURULUM KONTROLÜ:**

1. ✅ Backend çalışıyor (`pm2 status`)
2. ✅ Frontend build başarılı (`ls -la build/`)
3. ✅ TREPS API bağlantısı var (`node test_treps_new.js`)
4. ✅ Nginx çalışıyor (`systemctl status nginx`)
5. ✅ SSL sertifikaları geçerli (`certbot certificates`)
6. ✅ Panel sayfası açılıyor (`https://panel.hoowell.net`)
7. ✅ Müşteri kayıt sayfası açılıyor
8. ✅ TREPS ödeme seçeneği görünüyor
9. ✅ IFRAME yükleniyor

## 🎯 **SONUÇ:**

Kurulum tamamlandığında:
- Müşteri kayıt sayfasında TREPS seçeneği görünecek
- TREPS ile güvenli ödeme yapılabilecek
- Ödeme sonrası callback çalışacak
- Müşteri bilgileri sisteme kaydedilecek

## 📞 **DESTEK:**

Hata durumunda logları kontrol et:
```bash
# Backend logları
pm2 logs hoowell-backend --follow

# Nginx logları
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```
