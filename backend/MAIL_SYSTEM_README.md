# 📧 HOOWELL MAİL SİSTEMİ

## 🎯 Genel Bakış

Hoowell sistemi için kapsamlı mail otomasyonu. 4 farklı mail türü ile kullanıcı deneyimini artırır.

## 📋 Mail Türleri

### 1. **Müşteri Hoş Geldin Maili** (Cihaz Satışı)
- **Gönderilen**: Cihaz satın alan müşteriye
- **İçerik**: Satış bilgileri, satıcı bilgileri, müşteri hizmetleri
- **Tetikleyici**: Müşteri kayıt işlemi

### 2. **Satıcı Bildirim Maili** (Cihaz Satışı)
- **Gönderilen**: Cihaz satan iş ortağına
- **İçerik**: Yeni müşteri bilgileri, satış detayları, KKP kazancı
- **Tetikleyici**: Müşteri kayıt işlemi

### 3. **İş Ortağı Hoş Geldin Maili**
- **Gönderilen**: Yeni kayıt olan iş ortağına
- **İçerik**: Sponsor bilgileri, hesap bilgileri, eğitim linki
- **Tetikleyici**: İş ortağı kayıt işlemi

### 4. **Sponsor Bildirim Maili**
- **Gönderilen**: Yeni iş ortağının sponsoruna
- **İçerik**: Yeni ortak bilgileri, takip linki
- **Tetikleyici**: İş ortağı kayıt işlemi

### 5. **Muhasebe Raporu Maili**
- **Gönderilen**: muhasebe@hoowell.net
- **İçerik**: Satış detayları, müşteri bilgileri, ödeme bilgileri
- **Tetikleyici**: Satış işlemi

## 🚀 Kurulum

### 1. Gerekli Paketler
```bash
npm install @sendgrid/mail
```

### 2. Environment Variables
`.env` dosyasına ekle:
```env
SENDGRID_API_KEY=SG.your-api-key-here
```

### 3. SendGrid Kurulumu
1. SendGrid hesabı aç
2. API Key oluştur
3. Sender verification yap
4. Domain authentication (opsiyonel)

## 📁 Dosya Yapısı

```
backend/
├── services/
│   └── mailService.js          # Ana mail servisi
├── test-mail-endpoints.js      # Test endpoint'leri
└── server.js                   # Ana server (mail entegrasyonu)
```

## 🔧 Kullanım

### Otomatik Mail Gönderimi

Mail'ler otomatik olarak şu durumlarda gönderilir:

#### İş Ortağı Kaydı
```javascript
// /api/partner/register-new endpoint'inde
await sendPartnerWelcomeEmail(partnerData, sponsorData);
await sendSponsorNotificationEmail(sponsorData, newPartnerData);
```

#### Müşteri Kaydı
```javascript
// /api/customer/register endpoint'inde
await sendCustomerWelcomeEmail(customerData, sellerData);
await sendSellerNotificationEmail(sellerData, customerData);
```

### Manuel Mail Gönderimi

```javascript
const { sendCustomerWelcomeEmail } = require('./services/mailService');

await sendCustomerWelcomeEmail({
  email: 'customer@example.com',
  product_name: 'HİBRİT ALKALİ İYONİZER CİHAZI',
  sale_date: '08.01.2025',
  total_amount: 86400
}, {
  first_name: 'Murat',
  last_name: 'Soylu',
  sponsor_id: 'P 2025 000 999',
  phone: '0545 678 93 45'
});
```

## 🧪 Test

### Test Server Çalıştırma
```bash
node test-mail-endpoints.js
```

### Test Endpoint'leri
- `GET /test/customer-welcome` - Müşteri hoş geldin maili
- `GET /test/seller-notification` - Satıcı bildirim maili
- `GET /test/partner-welcome` - İş ortağı hoş geldin maili
- `GET /test/sponsor-notification` - Sponsor bildirim maili
- `GET /test/accounting-report` - Muhasebe raporu maili

## 📊 Mail İçerikleri

### Müşteri Hoş Geldin Maili
- ✅ Satış bilgileri (cihaz, tarih, bedel)
- ✅ Satıcı bilgileri (ad, sponsor ID, telefon)
- ✅ Müşteri hizmetleri bilgileri
- ✅ Profesyonel tasarım

### İş Ortağı Hoş Geldin Maili
- ✅ Sponsor bilgileri
- ✅ Hesap bilgileri (ID, şifre)
- ✅ Eğitim linki
- ✅ Müşteri hizmetleri

### Muhasebe Raporu
- ✅ Satış detayları
- ✅ Müşteri bilgileri
- ✅ Ürün ve fiyat bilgileri
- ✅ Ödeme bilgileri
- ✅ Satıcı bilgileri

## 🔒 Güvenlik

- ✅ SendGrid API key güvenliği
- ✅ Email validation
- ✅ Error handling
- ✅ Rate limiting (SendGrid tarafından)

## 📈 Performans

- ✅ Async/await kullanımı
- ✅ Non-blocking mail gönderimi
- ✅ Error handling ile sistem kararlılığı
- ✅ Logging ile takip

## 🛠️ Bakım

### Log Takibi
```javascript
console.log('✅ Customer welcome email sent to:', customerData.email);
console.error('❌ Email send error:', error);
```

### Hata Yönetimi
Mail gönderimi başarısız olsa bile ana işlem devam eder:
```javascript
try {
  await sendEmail();
} catch (error) {
  console.error('Email error:', error);
  // Don't fail the main process
}
```

## 📞 Destek

- **Email**: mhizmetleri@hoowell.net
- **Telefon**: *** *** ** **
- **Dokümantasyon**: Bu dosya

## 🔄 Güncellemeler

### v1.0.0 (08.01.2025)
- ✅ 4 mail türü eklendi
- ✅ SendGrid entegrasyonu
- ✅ Otomatik mail gönderimi
- ✅ Test endpoint'leri
- ✅ Responsive mail tasarımı

---

**Not**: Bu sistem production'da kullanıma hazırdır. Test endpoint'leri sadece geliştirme amaçlıdır.
