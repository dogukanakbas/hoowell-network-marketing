# PayTR Bildirim URL Ayarları

## 1. PayTR Mağaza Paneli Ayarları

PayTR mağaza panelinize giriş yaparak aşağıdaki ayarları yapın:

### Bildirim URL'i (Callback URL):
- **Test Ortamı:** `http://localhost:5001/api/paytr/callback`
- **Production:** `https://hoowell.net/api/paytr/callback`

### Başarılı Ödeme Yönlendirme URL'i:
- **Test Ortamı:** `http://localhost:3000/payment/success`
- **Production:** `https://hoowell.net/payment/success`

### Başarısız Ödeme Yönlendirme URL'i:
- **Test Ortamı:** `http://localhost:3000/payment/fail`
- **Production:** `https://hoowell.net/payment/fail`

## 2. Mevcut Callback Endpoint Özellikleri

✅ **Güvenlik Kontrolü:** Hash doğrulaması yapılıyor
✅ **Veritabanı Güncellemesi:** Ödeme durumu otomatik güncelleniyor
✅ **Eğitim Erişimi:** Başarılı ödemede otomatik açılıyor
✅ **İş Ortağı Aktivasyonu:** Franchise ödemelerinde partner aktif ediliyor
✅ **Hata Yönetimi:** Tüm hatalar loglanıyor

## 3. Callback Endpoint Detayları

### URL: `/api/paytr/callback`
### Method: `POST`
### Content-Type: `application/x-www-form-urlencoded`

### Gelen Parametreler:
- `merchant_oid`: Sipariş numarası
- `status`: Ödeme durumu (success/failed)
- `total_amount`: Toplam tutar
- `hash`: Güvenlik hash'i

### Dönen Yanıt:
- Başarılı: `OK`
- Başarısız: `FAIL`

## 4. Test Kartı Bilgileri

PayTR test ortamında kullanabileceğiniz kart bilgileri:

```
Kart Numarası: 4355 0841 0000 0001
Son Kullanma: 12/26
CVV: 000
3D Secure Şifre: 123456
```

## 5. Iframe Entegrasyonu

✅ PayTR iframe entegrasyonu tamamlandı
✅ Responsive tasarım desteği
✅ Otomatik yeniden boyutlandırma
✅ Güvenli ödeme sayfası
✅ Başarı/hata yönlendirmeleri

## 6. Kullanım Senaryoları

### Eğitim Paketi Ödemesi:
1. Kullanıcı ödeme sayfasında PayTR seçer
2. Bilgilerini doldurur
3. Iframe açılır
4. Ödeme tamamlanır
5. Eğitim erişimi otomatik açılır

### İş Ortağı Ödemesi:
1. İş ortağı kaydı sırasında ödeme seçilir
2. PayTR iframe açılır
3. Ödeme tamamlanır
4. Partner kaydı otomatik aktif edilir

## 7. Güvenlik Önlemleri

✅ Hash doğrulaması
✅ IP kontrolü
✅ SSL sertifikası
✅ 3D Secure desteği
✅ Timeout koruması

## 8. Monitoring ve Loglar

Tüm PayTR işlemleri console'da loglanıyor:
- Token oluşturma
- Hash hesaplama
- API yanıtları
- Callback işlemleri
- Hata durumları

## 9. Test Etme

Test sayfası: `http://localhost:3000/paytr-test`

Bu sayfada PayTR iframe entegrasyonunu test edebilirsiniz.