# PayTR Entegrasyon Rehberi

## 🎯 PayTR Entegrasyonu İçin Gerekli Bilgiler

PayTR hesabınızdan aşağıdaki bilgileri almanız gerekiyor:

### 1. PayTR Hesap Bilgileri
- **Merchant ID**: PayTR hesabınızdan alacağınız mağaza ID'si
- **Merchant Key**: PayTR hesabınızdan alacağınız gizli anahtar
- **Merchant Salt**: PayTR hesabınızdan alacağınız salt değeri

### 2. Test/Canlı Ortam
- **Test URL**: `https://www.paytr.com/odeme/guvenli/`
- **Canlı URL**: `https://www.paytr.com/odeme/`

## 📋 Entegrasyon Adımları

### Adım 1: PayTR Hesap Bilgilerini Alın
1. PayTR hesabınıza giriş yapın
2. **Ayarlar > API Bilgileri** bölümüne gidin
3. Aşağıdaki bilgileri not edin:
   - Merchant ID
   - Merchant Key  
   - Merchant Salt

### Adım 2: Backend Konfigürasyonu
Backend'e PayTR konfigürasyonu ekleyeceğiz:

```javascript
// .env dosyasına eklenecek
PAYTR_MERCHANT_ID=your_merchant_id
PAYTR_MERCHANT_KEY=your_merchant_key
PAYTR_MERCHANT_SALT=your_merchant_salt
PAYTR_TEST_MODE=true // false for production
```

### Adım 3: PayTR API Endpoint'leri
Aşağıdaki endpoint'leri oluşturacağız:

1. **POST /api/paytr/create-payment** - Ödeme oluşturma
2. **POST /api/paytr/callback** - PayTR callback
3. **GET /api/paytr/success** - Başarılı ödeme
4. **GET /api/paytr/fail** - Başarısız ödeme

### Adım 4: Frontend Entegrasyonu
Payment bileşenini PayTR ile entegre edeceğiz:

1. PayTR ödeme formu oluşturma
2. Ödeme sonucu sayfaları
3. Ödeme durumu takibi

## 🔧 Teknik Detaylar

### PayTR Ödeme Akışı
1. Kullanıcı ödeme yapmak ister
2. Backend'de PayTR token oluşturulur
3. Kullanıcı PayTR sayfasına yönlendirilir
4. Ödeme tamamlandıktan sonra callback alınır
5. Ödeme durumu güncellenir

### Güvenlik
- Tüm PayTR istekleri HMAC ile imzalanır
- Callback'ler doğrulanır
- Hassas bilgiler environment variable'larda saklanır

## 📝 Gerekli Dosyalar

### Backend
- `backend/paytrService.js` - PayTR API servisi
- `backend/routes/paytr.js` - PayTR route'ları
- `backend/.env` - Konfigürasyon

### Frontend
- `frontend/src/components/PayTRPayment.js` - PayTR ödeme bileşeni
- `frontend/src/components/PaymentSuccess.js` - Başarı sayfası
- `frontend/src/components/PaymentFail.js` - Hata sayfası

## 🚀 Sonraki Adımlar

1. **PayTR hesap bilgilerini paylaşın**
2. Backend konfigürasyonu yapacağız
3. PayTR API servisini oluşturacağız
4. Frontend entegrasyonunu tamamlayacağız
5. Test ödemelerini yapacağız

## ❓ İhtiyaç Duyulan Bilgiler

Lütfen aşağıdaki bilgileri paylaşın:

1. **PayTR Merchant ID**
2. **PayTR Merchant Key**
3. **PayTR Merchant Salt**
4. **Test modunda mı başlayalım?** (Evet/Hayır)
5. **Hangi ödeme türlerini destekleyecek?**
   - Kredi Kartı
   - Banka Kartı
   - BKM Express
   - Diğer

Bu bilgileri aldıktan sonra entegrasyona başlayabiliriz!