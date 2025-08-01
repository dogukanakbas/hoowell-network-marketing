# HOOWELL Network Marketing - Backend Güncelleme Rehberi

## 🎯 Genel Bakış

Bu güncelleme, frontend'de yapılan yeni özellikler için backend ve veritabanı desteği ekler:

- ✅ Doping Promosyonu sistemi
- ✅ Memnun Müşteri Takip sistemi  
- ✅ Sponsorluk Takip sistemi
- ✅ Satış Takip sistemi
- ✅ Takım Takip sistemi
- ✅ Kariyer Takip sistemi güncellemeleri

## 📋 Güncelleme Adımları

### 1. Veritabanı Güncellemeleri

```bash
# Otomatik güncelleme (Önerilen)
cd backend
node run_database_updates.js

# Manuel güncelleme (Alternatif)
mysql -u root -p hoowell_network < update_database_for_new_features.sql
```

### 2. Backend API Endpoint'leri

```bash
# API endpoint'lerini server.js'ye ekle
cd backend
node add_new_endpoints_to_server.js
```

### 3. Server'ı Yeniden Başlat

```bash
# Backend server'ı yeniden başlat
npm start
# veya
node server.js
```

## 🗄️ Yeni Veritabanı Tabloları

### 1. `doping_promotion`
Doping promosyonu takibi için:
- Etap 1 ve Etap 2 hedefleri
- Satış ve partner sayıları
- Extra puan hesaplamaları

### 2. `team_tracking`
Takım takip sistemi için:
- Takım lideri ve üye ilişkileri
- Franchise yüzdeleri
- Aylık satış hacimleri

### 3. `monthly_activity`
Aylık aktiflik takibi için:
- Kişisel satış sayıları
- Partner aktivasyonları
- Aktiflik durumu

## 📊 Güncellenen Tablolar

### `customers`
Yeni alanlar:
- `referral_count` - Referans sayısı
- `gift1_earned`, `gift2_earned`, `gift3_earned` - Hediye durumları
- `gift1_recipient`, `gift2_recipient`, `gift3_recipient` - Hediye alanlar
- `loyalty_protection_until` - Sadakat koruması bitiş tarihi

### `sponsorship_earnings`
Yeni alanlar:
- `partner_start_date` - Partner başlangıç tarihi
- `partner_phone` - Partner telefonu
- `partner_education_status` - Eğitim durumu
- `bronze_limit`, `silver_limit`, etc. - Kazanç limitleri
- `total_earnings` - Toplam kazanç

### `sales_tracking`
Yeni alanlar:
- `customer_name` - Müşteri adı
- `payment_status` - Ödeme durumu
- `is_active_for_monthly` - Aylık aktiflik için sayılıp sayılmadığı

## 🔗 Yeni API Endpoint'leri

### Doping Promosyonu
- `GET /api/doping-promotion/progress` - Kullanıcının doping promosyonu durumu

### Memnun Müşteri Takip
- `GET /api/customer-satisfaction/my-customers` - Kullanıcının müşterileri

### Sponsorluk Takip
- `GET /api/sponsorship/my-partners` - Sponsor olunan partnerler

### Satış Takip
- `GET /api/sales/tracker` - Satış takip verileri

### Takım Takip
- `GET /api/team/tracker` - Takım üyesi verileri

### Kariyer Takip
- `GET /api/career/progress` - Kariyer ilerleme durumu
- `GET /api/career/bonuses` - Kariyer bonusları

## ⚙️ Sistem Ayarları

Yeni sistem ayarları eklendi:
- `doping_promotion_active` - Doping promosyonu aktif mi
- `doping_etap1_duration_days` - 1. etap süresi (60 gün)
- `doping_etap2_duration_days` - 2. etap süresi (60 gün)
- `customer_loyalty_protection_days` - Müşteri sadakat koruması (60 gün)
- `franchise_*_percentage` - Franchise yüzdeleri
- `sales_activation_days` - Satış aktivasyon süresi (15 gün)
- `monthly_bonus_payment_day` - Aylık bonus ödeme günü (9)

## 🔄 Otomatik İşlemler

### Trigger'lar
- Yeni kullanıcı oluşturulduğunda otomatik profil ve doping promosyonu oluşturma
- Satış yapıldığında aylık aktiflik ve doping promosyonu güncelleme

### Stored Procedure'lar
- `CalculateMonthlyFranchiseEarnings()` - Aylık franchise gelirlerini hesaplama
- `UpdateUserStatistics()` - Kullanıcı istatistiklerini güncelleme

## 📈 İş Kuralları

### Doping Promosyonu
- **1. Etap**: İlk 60 gün, 40 satış + 7 partner hedefi
- **2. Etap**: 61-120. günler, 80 satış + 15 partner hedefi
- Her etap bağımsız, KKP puanları 2 ile çarpılır

### Sponsorluk Sistemi
- **Bronze**: %5 komisyon, max 750$
- **Silver**: %4 komisyon, max 1.200$
- **Gold**: %3 komisyon, max 1.350$
- **Star Leader**: %2 komisyon, max 1.200$
- **Super Star Leader**: %1 komisyon, max 750$

### Franchise Sistemi
- **Silver**: %2 franchise geliri
- **Gold**: %4 franchise geliri
- **Star Leader**: %6 franchise geliri
- **Super Star Leader**: %8 franchise geliri
- **Başkanlık Takımı**: %10 franchise geliri

### Aktiflik Kuralları
- Aylık aktiflik için: 1 kişisel satış VEYA 1 partner aktivasyonu
- Satışlar 15 gün sonra aktifleşir
- Franchise geliri için Silver+ seviye ve aylık aktiflik gerekli

## 🚨 Önemli Notlar

1. **Veri Güvenliği**: Tüm güncellemeler mevcut verileri korur
2. **Geriye Uyumluluk**: Eski API endpoint'leri çalışmaya devam eder
3. **Performans**: Yeni indeksler eklendi
4. **Test**: Güncellemelerden sonra tüm fonksiyonları test edin

## 🔍 Sorun Giderme

### Veritabanı Bağlantı Hatası
```bash
# .env dosyasını kontrol edin
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hoowell_network
```

### API Endpoint Çalışmıyor
```bash
# Server.js'de endpoint'lerin eklendiğini kontrol edin
# Server'ı yeniden başlatın
```

### Trigger Hatası
```bash
# MySQL kullanıcısının trigger oluşturma yetkisi olduğunu kontrol edin
GRANT TRIGGER ON hoowell_network.* TO 'your_user'@'localhost';
```

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Log dosyalarını kontrol edin
2. Veritabanı bağlantısını test edin
3. API endpoint'lerini Postman ile test edin

## ✅ Kontrol Listesi

- [ ] Veritabanı güncellemeleri çalıştırıldı
- [ ] API endpoint'leri eklendi
- [ ] Server yeniden başlatıldı
- [ ] Frontend bağlantıları test edildi
- [ ] Tüm yeni özellikler çalışıyor

---

**Son Güncelleme**: 30 Ocak 2025
**Versiyon**: 2.0.0