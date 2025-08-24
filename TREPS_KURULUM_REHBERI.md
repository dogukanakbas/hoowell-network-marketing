# 🏦 TREPS ENTEGRASYONU KURULUM REHBERİ

## 📋 **SUNUCUDA YAPILACAKLAR:**

### **1. BACKEND RESTART**
```bash
# Backend'i yeniden başlat
pm2 restart hoowell-backend

# Durumu kontrol et
pm2 status
```

### **2. LOGLARI KONTROL ET**
```bash
# Son logları görüntüle
pm2 logs hoowell-backend --lines 20

# Canlı log takibi
pm2 logs hoowell-backend --follow
```

### **3. TREPS TEST ET**
```bash
# Test scriptini çalıştır
cd /root/hoowell
node test_treps_new.js
```

### **4. FRONTEND BUILD**
```bash
# Frontend'i yeniden build et
cd /root/hoowell/frontend
npm run build

# Build durumunu kontrol et
ls -la build/
```

### **5. NGINX RESTART**
```bash
# Nginx konfigürasyonunu test et
nginx -t

# Nginx'i yeniden başlat
systemctl restart nginx

# Durumu kontrol et
systemctl status nginx
```

## 🧪 **TEST ADIMLARI:**

### **1. TREPS API Test**
```bash
# Test scriptini çalıştır
node test_treps_new.js

# Beklenen çıktı:
# ✅ Authentication başarılı
# ✅ IFRAME ödeme oluşturuldu
# ✅ URL: https://hp.treps.io/iframe/...
```

### **2. Frontend Test**
- https://panel.hoowell.net adresine git
- Müşteri kayıt sayfasına git
- TREPS ödeme seçeneğini seç
- Ödeme butonuna tıkla

### **3. Ödeme Test**
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
```

### **Frontend Hatası:**
```bash
# Build'i temizle ve yeniden yap
cd /root/hoowell/frontend
rm -rf build/
npm run build
```

### **Nginx Hatası:**
```bash
# Konfigürasyonu test et
nginx -t

# Nginx'i yeniden başlat
systemctl restart nginx
```

## ✅ **BAŞARILI KURULUM KONTROLÜ:**

1. ✅ Backend çalışıyor
2. ✅ TREPS API bağlantısı var
3. ✅ Frontend build başarılı
4. ✅ Nginx çalışıyor
5. ✅ Ödeme sayfası açılıyor
6. ✅ IFRAME yükleniyor

## 🎯 **SONUÇ:**

TREPS entegrasyonu tamamlandığında:
- Müşteri kayıt sayfasında TREPS seçeneği görünecek
- TREPS ile güvenli ödeme yapılabilecek
- Ödeme sonrası callback çalışacak
- Müşteri bilgileri sisteme kaydedilecek
