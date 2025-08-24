# 🚨 TREPS 500 HATASI ÇÖZÜMÜ

## 🔍 **HATA ANALİZİ:**

**Hata:** `POST https://panel.hoowell.net/api/treps/create-payment 500 (Internal Server Error)`

**Olası Nedenler:**
1. Backend'de TREPS route'u yüklenmemiş
2. TREPS API bağlantı hatası
3. Backend process çökmüş
4. Nginx proxy hatası

## 🛠️ **ÇÖZÜM ADIMLARI:**

### **1. BACKEND LOGLARINI KONTROL ET**
```bash
# Son logları görüntüle
pm2 logs hoowell-backend --lines 20

# Canlı log takibi
pm2 logs hoowell-backend --follow
```

### **2. BACKEND'İ YENİDEN BAŞLAT**
```bash
# Backend'i restart et
pm2 restart hoowell-backend

# Durumu kontrol et
pm2 status
```

### **3. TREPS ROUTE'UNU TEST ET**
```bash
# Direct test
curl -X POST https://panel.hoowell.net/api/treps/create-payment \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "orderId": "test123"}' \
  -v
```

### **4. TREPS TEST SCRIPTİNİ ÇALIŞTIR**
```bash
cd /root/hoowell
node test_treps_new.js
```

### **5. NGINX LOGLARINI KONTROL ET**
```bash
# Nginx error logları
tail -f /var/log/nginx/error.log

# Nginx access logları
tail -f /var/log/nginx/access.log
```

## 🔧 **DETAYLI ÇÖZÜMLER:**

### **A. Backend Process Çökmüşse:**
```bash
# Tüm PM2 process'lerini yeniden başlat
pm2 restart all

# PM2'yi yeniden başlat
pm2 kill
pm2 start ecosystem.config.js
```

### **B. TREPS API Bağlantı Hatası:**
```bash
# TREPS API'yi test et
curl -X POST https://api.treps.io/api/auth \
  -H "Content-Type: application/json" \
  -d '{"username": "apiuser", "password": "9b{J_7Yo5i/D", "merchantId": 35}'
```

### **C. Nginx Proxy Hatası:**
```bash
# Nginx konfigürasyonunu test et
nginx -t

# Nginx'i yeniden başlat
systemctl restart nginx
```

### **D. SSL Sertifika Hatası:**
```bash
# SSL sertifikalarını kontrol et
certbot certificates

# Gerekirse yenile
certbot renew
```

## 🧪 **TEST ADIMLARI:**

### **1. Backend Test**
```bash
# Backend çalışıyor mu?
curl -X GET https://panel.hoowell.net/api/auth/me
```

### **2. TREPS Route Test**
```bash
# TREPS endpoint'i çalışıyor mu?
curl -X POST https://panel.hoowell.net/api/treps/create-payment \
  -H "Content-Type: application/json" \
  -d '{"amount": 100}'
```

### **3. Frontend Test**
- https://panel.hoowell.net/customer-registration
- TREPS seçeneğini seç
- "TREPS ile Güvenli Ödeme Yap" butonuna tıkla

## ✅ **BAŞARILI ÇÖZÜM KONTROLÜ:**

1. ✅ Backend loglarında hata yok
2. ✅ TREPS route'u çalışıyor
3. ✅ Test scripti başarılı
4. ✅ Frontend'de ödeme butonu çalışıyor
5. ✅ IFRAME yükleniyor

## 📞 **DESTEK:**

Hala hata alıyorsan:
```bash
# Tüm logları topla
pm2 logs hoowell-backend > backend_logs.txt
tail -n 50 /var/log/nginx/error.log > nginx_errors.txt

# Dosyaları kontrol et
cat backend_logs.txt
cat nginx_errors.txt
```
