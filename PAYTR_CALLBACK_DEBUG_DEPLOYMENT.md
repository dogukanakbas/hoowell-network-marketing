# 🔧 PayTR Callback Debug - Sunucu Deployment Rehberi

## 📥 1. Kodları Sunucuya Yükle

```bash
# Sunucuda proje dizinine git
cd ~/hoowell

# Git pull (veya dosyaları manuel kopyala)
git pull origin main

# Veya manuel olarak güncellenmiş dosyaları kopyala:
# - backend/server.js
# - backend/routes/paytr.js
# - deployment/nginx_paytr_debug.conf
```

## 🔧 2. Nginx Konfigürasyonunu Güncelle

```bash
# Yeni nginx config'i kopyala
sudo cp deployment/nginx_paytr_debug.conf /etc/nginx/sites-available/hoowell

# Nginx test et
sudo nginx -t

# Nginx reload et
sudo systemctl reload nginx
```

## 🔄 3. Backend'i Restart Et

```bash
# PM2 restart
pm2 restart hoowell-backend

# PM2 durumunu kontrol et
pm2 status
```

## 🧪 4. Callback Test Et

### Test 1: Callback Status Kontrolü
```bash
curl https://hoowell.net/api/paytr/callback-status
```

### Test 2: Test Callback Endpoint'i
```bash
curl -X POST https://hoowell.net/api/paytr/test-callback \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "test=1&merchant_oid=TEST123"
```

### Test 3: Gerçek Callback Test
```bash
curl -X POST https://hoowell.net/api/paytr/callback \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "merchant_oid=HOOWELL123456789&status=success&total_amount=10000&hash=test_hash"
```

## 📊 5. Debug Loglarını İzle

```bash
# Terminal 1: Backend logları
pm2 logs hoowell-backend | grep -E "(PayTR|callback|DEBUG)"

# Terminal 2: Nginx access logları
sudo tail -f /var/log/nginx/access.log | grep -E "(paytr|callback)"

# Terminal 3: Nginx error logları
sudo tail -f /var/log/nginx/error.log
```

## 🎯 6. PayTR Panel Ayarları

PayTR mağaza panelinde şu URL'leri ayarlayın:

```
✅ Bildirim URL'i: https://hoowell.net/api/paytr/callback
✅ Başarılı Ödeme URL'i: https://hoowell.net/payment/success
✅ Başarısız Ödeme URL'i: https://hoowell.net/payment/fail
```

## 🧪 7. Gerçek Test

1. **https://hoowell.net/paytr-test** sayfasını aç
2. **"PayTR Test Et"** butonuna tıkla
3. PayTR iframe açılacak
4. Test kartı bilgilerini gir:
   ```
   Kart: 4355 0841 0000 0001
   CVV: 000
   Tarih: 12/26
   3D Secure: 123456
   ```

## 📋 8. Beklenen Debug Logları

Başarılı callback'te şu logları göreceksiniz:

```
=== PayTR CALLBACK DEBUG ===
Method: POST
URL: /callback
Headers: {...}
Body: {...}
Raw Body: merchant_oid=HOOWELL123...&status=success&total_amount=10000&hash=...
Final Callback Data: {
  "merchant_oid": "HOOWELL123456789",
  "status": "success",
  "total_amount": "10000",
  "hash": "abc123..."
}
Hash doğrulaması geçici olarak atlandı (test modu)
PayTR Callback: HOOWELL123456789 - Status: success - Amount: 10000
Ödeme durumu güncellendi: HOOWELL123456789 -> approved
=== PayTR CALLBACK TAMAMLANDI ===
```

## 🚨 9. Sorun Giderme

### Callback 404 Hatası
```bash
# Nginx config'i kontrol et
sudo nginx -t
sudo systemctl reload nginx

# Backend route'u kontrol et
curl https://hoowell.net/api/paytr/callback-status
```

### Callback Boş Body
```bash
# Raw body middleware'in çalıştığını kontrol et
pm2 logs hoowell-backend | grep "Raw Body"
```

### Hash Doğrulama Hatası
```bash
# Test modunda hash doğrulaması devre dışı
# Production'da hash doğrulamasını aktif et
```

## ✅ 10. Production'a Geçiş

Test başarılı olduktan sonra:

1. **Hash doğrulamasını aktif et**
2. **Debug loglarını azalt**
3. **PayTR IP kısıtlamasını aktif et**

```javascript
// Hash doğrulamasını aktif et
if (!paytrService.verifyCallback(callbackData)) {
  console.error('PayTR callback verification failed');
  return res.status(400).send('FAIL');
}
```

Bu adımları takip ederek PayTR callback debug sistemini aktif edebilirsiniz! 🚀