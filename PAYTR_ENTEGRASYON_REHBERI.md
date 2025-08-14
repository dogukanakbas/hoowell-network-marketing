# 🔧 PayTR Entegrasyon Rehberi

## 📅 Tarih: 08.01.2025
## 🎯 Amaç: PayTR Ödeme Sistemi Entegrasyonu

---

## 📋 SORUN ANALİZİ

### **Mevcut Sorunlar:**
1. **Callback URL Sorunu:** PayTR'nin geri bildirim yapamaması
2. **Hash Doğrulama Hatası:** Güvenlik doğrulaması başarısız
3. **Test/Production Karışıklığı:** URL'lerin yanlış yapılandırılması
4. **Log Eksikliği:** Hata takibi yapılamaması

---

## 🛠️ ÇÖZÜM ADIMLARI

### **ADIM 1: PHP Callback Kullanımı**

#### **Neden PHP Callback?**
- PayTR dokümantasyonunda PHP örnekleri var
- Daha güvenilir ve stabil
- Web server ile doğrudan entegrasyon
- Daha iyi hata yönetimi

#### **Kurulum:**
```bash
# 1. Callback dosyasını web root'a kopyala
sudo cp paytr_callback.php /var/www/html/

# 2. İzinleri ayarla
sudo chown www-data:www-data /var/www/html/paytr_callback.php
sudo chmod 644 /var/www/html/paytr_callback.php

# 3. Log dizini oluştur
sudo mkdir -p /var/log/hoowell
sudo chown www-data:www-data /var/log/hoowell
sudo chmod 755 /var/log/hoowell
```

### **ADIM 2: PayTR Panel Ayarları**

#### **PayTR Mağaza Paneli:**
1. **Bildirim URL:** `https://hoowell.net/paytr_callback.php`
2. **Başarılı Ödeme URL:** `https://hoowell.net/payment/success`
3. **Başarısız Ödeme URL:** `https://hoowell.net/payment/fail`
4. **Test Modu:** Geliştirme sırasında aktif

#### **Merchant Bilgileri:**
```env
PAYTR_MERCHANT_ID=605940
PAYTR_MERCHANT_KEY=tMCPPznCxw8sb8b8
PAYTR_MERCHANT_SALT=bF1uwkXPAhDw5yok
```

### **ADIM 3: Backend Güncellemeleri**

#### **paytrService.js Güncellemeleri:**
- PHP callback URL'i kullanımı
- Hash hesaplama algoritması düzeltmesi
- Test/Production modu ayrımı

#### **Değişiklikler:**
```javascript
// PHP callback URL'i kullan
const bildirim_url = `${baseUrl}/paytr_callback.php`;

// Hash string sırası (PayTR dokümantasyonuna uygun)
const hashStr = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}`;
```

### **ADIM 4: Test ve Doğrulama**

#### **Test Script'i Çalıştırma:**
```bash
# PayTR entegrasyon testi
node test_paytr_integration.js
```

#### **Beklenen Çıktı:**
```
🚀 PayTR Entegrasyon Test Başlıyor...

Test Konfigürasyonu:
- Merchant ID: 605940
- Test Mode: Aktif
- Debug Mode: Aktif
==================================================
🔍 PayTR Token Test Başlıyor...

Hash String: 60594085.34.78.112TEST1704729600000test@hoowell.com100...
PayTR Token: ABC123...
📤 PayTR API'ye gönderilecek veri:
{
  "merchant_id": "605940",
  "user_ip": "85.34.78.112",
  ...
}
📥 PayTR API Yanıtı:
{
  "status": "success",
  "token": "ABC123..."
}
✅ PayTR Token başarıyla oluşturuldu!
```

### **ADIM 5: Log Takibi**

#### **Callback Log Dosyası:**
```bash
# Log dosyasını takip et
tail -f /var/log/hoowell/paytr_callback.log
```

#### **Beklenen Log Formatı:**
```json
{
  "timestamp": "2025-01-08 15:30:00",
  "method": "POST",
  "remote_addr": "185.27.74.123",
  "post_data": {
    "merchant_oid": "TEST1704729600000",
    "status": "success",
    "total_amount": "100",
    "hash": "ABC123..."
  }
}
```

---

## 🔍 HATA GİDERME

### **1. Callback URL Erişim Sorunu**

#### **Semptom:** PayTR callback yapamıyor
#### **Çözüm:**
```bash
# URL erişimini test et
curl -X POST https://hoowell.net/paytr_callback.php

# Apache/Nginx loglarını kontrol et
sudo tail -f /var/log/apache2/error.log
sudo tail -f /var/log/nginx/error.log
```

### **2. Hash Doğrulama Hatası**

#### **Semptom:** "Hash doğrulama hatası" log'u
#### **Çözüm:**
```javascript
// Hash string sırasını kontrol et
const hashStr = `${merchant_oid}${merchant_salt}${status}${total_amount}`;
```

### **3. Database Bağlantı Hatası**

#### **Semptom:** "Ödeme kaydı bulunamadı" hatası
#### **Çözüm:**
```sql
-- Ödeme kaydını kontrol et
SELECT * FROM payments WHERE merchant_oid = 'TEST1704729600000';

-- Database bağlantısını test et
mysql -u hoowell_user -p hoowell_network
```

### **4. PHP Hata Ayıklama**

#### **Semptom:** PHP hataları
#### **Çözüm:**
```php
// Geçici olarak hata gösterimini aç
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log dosyasını kontrol et
tail -f /var/log/hoowell/paytr_callback.log
```

---

## 📊 MONİTORİNG VE ALERT

### **1. Otomatik Monitoring**

#### **Monitoring Script'i:**
```bash
# Monitoring script'ini çalıştır
./monitor_paytr_callback.sh

# Cron'a ekle (5 dakikada bir kontrol)
*/5 * * * * /path/to/monitor_paytr_callback.sh
```

### **2. Log Analizi**

#### **Başarılı Ödemeler:**
```bash
grep "SUCCESS" /var/log/hoowell/paytr_callback.log
```

#### **Hatalı Ödemeler:**
```bash
grep "ERROR" /var/log/hoowell/paytr_callback.log
```

#### **Hash Hataları:**
```bash
grep "Hash doğrulama hatası" /var/log/hoowell/paytr_callback.log
```

---

## 🔒 GÜVENLİK ÖNLEMLERİ

### **1. IP Kısıtlaması**

#### **PayTR IP Aralıkları:**
- `185.27.74.0/24`
- `185.27.75.0/24`

#### **Apache .htaccess:**
```apache
<Files "paytr_callback.php">
    Order Allow,Deny
    Allow from 185.27.74.0/24
    Allow from 185.27.75.0/24
</Files>
```

### **2. Hash Doğrulama**

#### **Zorunlu Kontroller:**
- Merchant ID doğrulama
- Hash hesaplama
- Timestamp kontrolü
- Amount doğrulama

### **3. Log Güvenliği**

#### **Log Dosyası Koruması:**
```bash
# Log dosyasını koru
sudo chmod 600 /var/log/hoowell/paytr_callback.log
sudo chown www-data:www-data /var/log/hoowell/paytr_callback.log
```

---

## 🚀 PRODUCTION DEPLOYMENT

### **1. Test Modunu Kapat**

#### **Environment Variables:**
```env
NODE_ENV=production
PAYTR_TEST_MODE=0
PAYTR_DEBUG_ON=0
```

### **2. SSL Sertifikası**

#### **HTTPS Zorunluluğu:**
```javascript
// Production'da HTTPS zorunlu
const callbackUrl = 'https://hoowell.net/paytr_callback.php';
```

### **3. Backup ve Recovery**

#### **Callback Dosyası Backup:**
```bash
# Backup al
cp /var/www/html/paytr_callback.php /backup/paytr_callback.php.$(date +%Y%m%d)

# Log dosyası backup
cp /var/log/hoowell/paytr_callback.log /backup/paytr_callback.log.$(date +%Y%m%d)
```

---

## 📋 CHECKLİST

### **Kurulum Öncesi:**
- [ ] PHP kurulu ve çalışıyor
- [ ] Apache/Nginx aktif
- [ ] Database bağlantısı çalışıyor
- [ ] PayTR merchant bilgileri doğru

### **Kurulum Sırasında:**
- [ ] Callback dosyası kopyalandı
- [ ] İzinler ayarlandı
- [ ] Log dizini oluşturuldu
- [ ] Test script'i çalıştırıldı

### **Kurulum Sonrası:**
- [ ] PayTR panel ayarları yapıldı
- [ ] Test ödemesi başarılı
- [ ] Callback log'ları kontrol edildi
- [ ] Monitoring aktif

### **Production Öncesi:**
- [ ] Test modu kapatıldı
- [ ] SSL sertifikası aktif
- [ ] Güvenlik önlemleri alındı
- [ ] Backup sistemi kuruldu

---

## 🆘 ACİL DURUM PLANI

### **1. Callback Çalışmıyorsa:**
1. Log dosyasını kontrol et
2. PHP hata ayıklama aç
3. URL erişimini test et
4. Database bağlantısını kontrol et

### **2. Hash Hatası Alıyorsa:**
1. Merchant bilgilerini kontrol et
2. Hash string sırasını doğrula
3. Test script'ini çalıştır
4. PayTR dokümantasyonunu kontrol et

### **3. Ödeme Onaylanmıyorsa:**
1. Database'de ödeme kaydını kontrol et
2. Callback log'larını incele
3. Kullanıcı durumunu kontrol et
4. Manuel onay gerekebilir

---

## 📞 DESTEK

### **PayTR Destek:**
- **Email:** destek@paytr.com
- **Telefon:** 0850 222 0 444
- **Dokümantasyon:** https://www.paytr.com/odeme/api

### **HOOWELL Teknik Destek:**
- **Email:** admin@hoowell.net
- **Log Dosyası:** `/var/log/hoowell/paytr_callback.log`

---

Bu rehberi takip ederek PayTR entegrasyonunuzu başarıyla tamamlayabilirsiniz. Her adımı dikkatli takip edin ve test etmeyi unutmayın!