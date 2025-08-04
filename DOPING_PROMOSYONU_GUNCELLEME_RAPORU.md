# 🚀 DOPİNG PROMOSYONU SİSTEMİ GÜNCELLEMESİ

## 📊 **SİSTEM MANTIGI**

### **Doping Promosyonu Nedir?**
Hızlı başlangıç yapan iş ortaklarını ödüllendiren sistem. Belirli hedefleri tutturan kullanıcıların KKP'leri **2 ile çarpılır**.

### **İki Etap Sistemi:**
- **1. Etap (İlk 60 gün):** 40 cihaz satışı + 7 iş ortağı → KKP'ler 2x
- **2. Etap (61-120 gün):** 80 cihaz satışı + 15 iş ortağı → KKP'ler 2x

---

## 🔧 **YAPILAN GÜNCELLEMELER**

### **1. Backend API Eklendi**
```javascript
// Yeni endpoint: GET /api/doping-promotion/progress
- Kullanıcının kayıt tarihini hesaplar
- Şahsi ve takım satışlarını ayrı tutar
- Etap durumlarını kontrol eder
- KKP çarpanını hesaplar
```

### **2. Şahsi vs Takım Satış Ayrımı**
```javascript
// Şahsi Satışlar (Kullanıcının kendi yaptığı)
const [personalSales] = await db.promise().execute(`
  SELECT COUNT(*) as count
  FROM customers c
  WHERE c.created_by = ? AND c.selected_product = 'device'
`, [userId]);

// Takım Satışları (Alt seviye partnerların yaptığı)
const [teamSales] = await db.promise().execute(`
  SELECT COUNT(*) as count
  FROM customers c
  INNER JOIN users u ON c.created_by = u.id
  WHERE u.created_by = ? AND c.selected_product = 'device'
`, [userId]);
```

### **3. KKP Çarpan Sistemi**
```javascript
// Otomatik KKP çarpanı kontrolü
const checkDopingPromotionMultiplier = async (userId) => {
  // 1. Etap: İlk 60 gün + 40 satış + 7 ortak = 2x
  if (daysSinceRegistration <= 60 && totalSales >= 40 && totalPartners >= 7) {
    return 2;
  }
  
  // 2. Etap: 61-120 gün + 80 satış + 15 ortak = 2x
  if (daysSinceRegistration > 60 && daysSinceRegistration <= 120 && totalSales >= 80 && totalPartners >= 15) {
    return 2;
  }
  
  return 1; // Normal çarpan
};
```

### **4. Frontend Görsel Güncellemeleri**

#### **A) Şahsi vs Takım Satış Gösterimi**
- 🟢 **Yeşil:** Şahsi satışlar (kullanıcının kendi yaptığı)
- 🔵 **Mavi:** Takım satışları (alt seviye partnerların yaptığı)
- 🟡 **Sarı:** Toplam satış (şahsi + takım)

#### **B) Etap Durum Göstergesi**
- ✅ **Yeşil:** Etap tamamlandı (2x çarpan aktif)
- ⏳ **Kırmızı:** Etap devam ediyor
- 📊 **Gün sayacı:** Kayıt sonrası geçen gün

#### **C) Gerçek Zamanlı Veri**
- API'den gelen gerçek veriler
- Otomatik hesaplama
- Canlı güncelleme

---

## 📈 **SİSTEM AKIŞI**

### **Kullanıcı Kaydı Sonrası:**
1. **Gün 0:** Doping promosyonu başlar
2. **Gün 1-60:** 1. Etap aktif (40 satış + 7 ortak hedefi)
3. **Gün 61-120:** 2. Etap aktif (80 satış + 15 ortak hedefi)
4. **Gün 120+:** Promosyon süresi biter

### **KKP Hesaplama:**
```javascript
// Normal KKP
let kkpEarned = productPrice; // 1800 USD = 1800 KKP

// Doping çarpanı kontrolü
const multiplier = await checkDopingPromotionMultiplier(userId);
if (multiplier > 1) {
  kkpEarned = kkpEarned * multiplier; // 1800 * 2 = 3600 KKP
}
```

### **Satış Türleri:**
- **Cihaz Satışı:** 1800 KKP (normal) → 3600 KKP (2x çarpan)
- **Eğitim Paketi:** 100 KKP (normal) → 200 KKP (2x çarpan)
- **Partner Kaydı:** 120 KKP (normal) → 240 KKP (2x çarpan)

---

## 🎯 **ÖRNEK SENARYOLAR**

### **Senaryo 1: Başarılı 1. Etap**
```
Kullanıcı: Ali
Kayıt Tarihi: 1 Ocak 2025
Gün 45: 
- Şahsi Satış: 25 cihaz
- Takım Satış: 20 cihaz (alt seviye partnerlar)
- Toplam: 45 cihaz (✅ 40 hedef aşıldı)
- İş Ortağı: 8 kişi (✅ 7 hedef aşıldı)

Sonuç: 1. Etap tamamlandı → Tüm KKP'ler 2x çarpılıyor
```

### **Senaryo 2: 1. Etap Kaçırıldı, 2. Etap Başarılı**
```
Kullanıcı: Ayşe
Kayıt Tarihi: 1 Ocak 2025
Gün 90:
- Toplam Satış: 85 cihaz (✅ 80 hedef aşıldı)
- İş Ortağı: 18 kişi (✅ 15 hedef aşıldı)
- 1. Etap: Kaçırıldı (60 gün içinde hedef tutturulamadı)

Sonuç: 2. Etap tamamlandı → 61-120 gün arası KKP'ler 2x çarpılıyor
```

### **Senaryo 3: Her İki Etap Başarılı**
```
Kullanıcı: Mehmet
Kayıt Tarihi: 1 Ocak 2025

Gün 50: 1. Etap tamamlandı (45 satış + 8 ortak)
Gün 100: 2. Etap tamamlandı (90 satış + 20 ortak)

Sonuç: 
- 1-60 gün arası KKP'ler: 2x çarpıldı
- 61-120 gün arası KKP'ler: 2x çarpıldı
- Toplam çarpan avantajı maksimum
```

---

## 📊 **VERİ YAPISI**

### **API Response Örneği:**
```json
{
  "etap1": {
    "baslangic_tarihi": "01.01.2025",
    "bitis_tarihi": "02.03.2025",
    "hedef_satis": 40,
    "yapilan_satis": 25,
    "kalan_satis": 15,
    "hedef_ortak": 7,
    "yapilan_ortak": 5,
    "kalan_ortak": 2,
    "kazanilacak_puan": 1800.000,
    "tamamlandi": false,
    "personal_sales": 15,
    "team_sales": 10
  },
  "etap2": {
    "baslangic_tarihi": "03.03.2025",
    "bitis_tarihi": "02.05.2025",
    "hedef_satis": 80,
    "yapilan_satis": 25,
    "kalan_satis": 55,
    "hedef_ortak": 15,
    "yapilan_ortak": 5,
    "kalan_ortak": 10,
    "kazanilacak_puan": 0.000,
    "tamamlandi": false,
    "personal_sales": 15,
    "team_sales": 10
  },
  "days_since_registration": 45,
  "current_stage": 1
}
```

---

## 🔄 **OTOMATIK SİSTEMLER**

### **1. KKP Çarpanı Kontrolü**
- Her müşteri kaydında otomatik kontrol
- Her partner kaydında otomatik kontrol
- Gerçek zamanlı çarpan hesaplama

### **2. Etap Durumu Takibi**
- Günlük otomatik kontrol
- Etap geçişleri otomatik
- Süre dolumu kontrolü

### **3. Veri Senkronizasyonu**
- Frontend'de gerçek zamanlı veri
- Backend'de otomatik hesaplama
- Database'de tutarlı kayıt

---

## 🎉 **SONUÇ**

### **Eklenen Özellikler:**
- ✅ **Şahsi vs Takım Satış Ayrımı**
- ✅ **Otomatik KKP Çarpanı (2x)**
- ✅ **Gerçek Zamanlı Etap Takibi**
- ✅ **Görsel Durum Göstergeleri**
- ✅ **API Entegrasyonu**

### **Sistem Avantajları:**
- 🚀 **Hızlı Başlangıç Teşviki**
- 💰 **Çifte KKP Kazancı**
- 📊 **Şeffaf Takip Sistemi**
- ⚡ **Otomatik Hesaplama**
- 🎯 **Hedef Odaklı Motivasyon**

### **Kullanıcı Deneyimi:**
- 📱 **Kolay Takip:** Hangi etapta olduğunu görür
- 🎯 **Net Hedefler:** Ne yapması gerektiğini bilir
- 💎 **Ödül Sistemi:** Başarı durumunu görür
- 📈 **İlerleme Takibi:** Gerçek zamanlı veri

Bu sistem ile kullanıcılar hızlı başlangıç yaparak KKP'lerini ikiye katlayabilir ve kariyer seviyelerini çok daha hızlı yükseltebilirler! 🎯

---
**📝 Son Güncelleme:** 08.01.2025 - Doping Promosyonu Sistemi Aktif