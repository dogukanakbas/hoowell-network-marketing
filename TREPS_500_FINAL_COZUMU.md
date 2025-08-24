# 🚨 TREPS 500 HATASI - FINAL ÇÖZÜM

## 🔍 **HATA DURUMU:**

```
POST https://panel.hoowell.net/api/treps/create-payment 500 (Internal Server Error)
```

**Mock mode aktif olmasına rağmen hala 500 hatası alınıyor.**

## 🛠️ **FINAL ÇÖZÜM ADIMLARI:**

### **1. BACKEND'İ TAMAMEN YENİDEN BAŞLAT**
```bash
# Backend'i durdur
pm2 stop hoowell-backend

# Backend'i başlat
pm2 start hoowell-backend

# Durumu kontrol et
pm2 status
```

### **2. BACKEND LOGLARINI KONTROL ET**
```bash
# Son logları görüntüle
pm2 logs hoowell-backend --lines 30

# Canlı log takibi
pm2 logs hoowell-backend --follow
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

### **5. FRONTEND BUILD**
```bash
cd /root/hoowell/frontend
npm run build
```

## 🔧 **ALTERNATİF ÇÖZÜMLER:**

### **A. PM2'yi Tamamen Yeniden Başlat**
```bash
# PM2'yi durdur
pm2 kill

# PM2'yi yeniden başlat
pm2 start ecosystem.config.js
```

### **B. Node Modules'ü Yeniden Yükle**
```bash
cd /root/hoowell/backend
rm -rf node_modules
npm install
```

### **C. Backend'i Manuel Başlat**
```bash
cd /root/hoowell/backend
node server.js
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

1. ✅ Backend loglarında "TREPS create-payment endpoint çağrıldı" mesajı
2. ✅ TREPS test scripti başarılı
3. ✅ Frontend'de ödeme butonu çalışıyor
4. ✅ IFRAME yükleniyor

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
