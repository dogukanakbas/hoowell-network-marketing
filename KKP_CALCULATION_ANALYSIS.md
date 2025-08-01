# 🧮 KKP HESAPLAMA SİSTEMİ ANALİZİ

## 📊 **KKP NEDİR?**
KKP (Kişisel Kariyer Puanı), HOOWELL sisteminde kullanıcıların kariyer seviyelerini belirleyen ana puan sistemidir.

---

## 💰 **KKP HESAPLAMA KURALLARI**

### **1. BİREYSEL SATIŞ KKP'Sİ**

#### **A) Müşteri Satışları (Customer Sales)**
```javascript
// Backend: awardKKPForCustomerSale fonksiyonu
const kkpEarned = productPrice; // 1 KKP = 1 USD (KDV hariç net fiyat)
```

**Hesaplama Mantığı:**
- ✅ **1 USD = 1 KKP** (KDV hariç net fiyat üzerinden)
- ✅ **KDV dahil değil** (sadece net fiyat sayılır)
- ✅ **USD cinsinden** hesaplanır

**Örnek:**
- Ürün Fiyatı: $1800 (net)
- KDV (%20): $360
- Toplam: $2160
- **Kazanılan KKP: 1800 KKP** (sadece net fiyat)

#### **B) Partner Kayıt Bonusu**
```javascript
// Backend: awardKKPForPartnerRegistration fonksiyonu
const kkpEarned = 120; // Sabit 120 KKP
```

**Hesaplama Mantığı:**
- ✅ **Sabit 120 KKP** her partner kaydı için
- ✅ **Eğitim paketi** ($100) + **Bonus** (20 KKP)
- ✅ **Anında verilir** (onay beklemez)

---

## 🎯 **KKP KAYNAKLARI**

### **1. Bireysel Satışlar**
| Kaynak | KKP Hesaplama | Örnek |
|--------|---------------|-------|
| **Müşteri Satışı** | Net Fiyat (USD) = KKP | $1800 → 1800 KKP |
| **Partner Kaydı** | Sabit 120 KKP | Her kayıt → 120 KKP |
| **Eğitim Paketi** | $100 → 100 KKP | Eğitim → 100 KKP |

### **2. Ödeme Onayları**
```javascript
// Backend: calculateTotalKKP fonksiyonu
const paymentKKP = Math.floor(totalSales / usdToTryRate); // TL → USD → KKP
```

**Hesaplama:**
- TL cinsinden ödemeler USD'ye çevrilir (kur: 40 TL = 1 USD)
- USD tutarı = KKP tutarı

---

## 📈 **KKP TOPLAM HESAPLAMA**

### **Backend'de Toplam KKP Hesaplama:**
```javascript
const calculateTotalKKP = async (userId) => {
  // 1. Ödeme KKP'si (TL ödemelerden)
  const paymentKKP = Math.floor(totalSales / 40); // 40 TL = 1 USD = 1 KKP
  
  // 2. Partner KKP'si (kayıt bonusları)
  const partnerKKP = partnerCount * 120; // Her partner 120 KKP
  
  // 3. Müşteri KKP'si (net satışlar)
  const customerKKP = Math.floor(customerNetSales); // Net USD = KKP
  
  // Toplam KKP
  const totalKKP = paymentKKP + partnerKKP + customerKKP;
}
```

---

## 🏆 **KARİYER SEVİYELERİ VE KKP GEREKSİNİMLERİ**

### **Database'den Alınan Değerler:**
```sql
-- system_settings tablosundan
('bronze_kkp_required', '0'),
('silver_kkp_required', '20000'),
('gold_kkp_required', '50000'),
('star_leader_kkp_required', '100000'),
('super_star_leader_kkp_required', '175000'),
('presidents_team_kkp_required', '300000'),
('country_distributor_kkp_required', '400000')
```

### **Kariyer Seviyeleri:**
| Seviye | Gerekli KKP | Gerekli Partner |
|--------|-------------|-----------------|
| **Bronze** | 0 KKP | 0 Partner |
| **Silver** | 20,000 KKP | 1 Partner |
| **Gold** | 50,000 KKP | 3 Partner |
| **Star Leader** | 100,000 KKP | 7 Partner |
| **Super Star Leader** | 175,000 KKP | 15 Partner |
| **Presidents Team** | 300,000 KKP | 25 Partner |
| **Country Distributor** | 400,000 KKP | 30 Partner |

---

## 💡 **KKP HESAPLAMA ÖRNEKLERİ**

### **Örnek 1: Yeni Partner**
```
Aktiviteler:
- Eğitim paketi aldı: $100 → 100 KKP
- 1 partner kaydetti: 120 KKP
- 2 müşteriye $1800 ürün sattı: 2 × 1800 = 3600 KKP

Toplam KKP: 100 + 120 + 3600 = 3,820 KKP
Kariyer Seviyesi: Bronze (Silver için 20,000 KKP gerekli)
```

### **Örnek 2: Aktif Partner**
```
Aktiviteler:
- 10 partner kaydetti: 10 × 120 = 1,200 KKP
- 20 müşteriye $1800 ürün sattı: 20 × 1800 = 36,000 KKP
- Ek ödemeler: 800,000 TL = 20,000 USD = 20,000 KKP

Toplam KKP: 1,200 + 36,000 + 20,000 = 57,200 KKP
Kariyer Seviyesi: Gold (50,000 KKP geçti, 3+ partner var)
```

---

## 🔄 **KKP GÜNCELLEMESİ**

### **Otomatik Güncelleme:**
```javascript
// Her müşteri kaydında
await db.promise().execute(
  'UPDATE users SET total_kkp = total_kkp + ? WHERE id = ?',
  [kkpEarned, userId]
);
```

### **Manuel Hesaplama:**
```javascript
// Dashboard'da toplam KKP yeniden hesaplanır
const totalKKP = paymentKKP + partnerKKP + customerKKP;
```

---

## 📊 **KKP RAPORLAMA**

### **Frontend'de Gösterim:**
```javascript
// CustomerRegistration.js'de
alert(`Kazandığınız KKP: ${response.data.kkp_earned?.toFixed(2) || 0} KKP`);
```

### **Dashboard'da Gösterim:**
```javascript
// CareerTracker.js'de
total_kkp: parseFloat(user.total_kkp) || 0
```

---

## ⚠️ **ÖNEMLİ NOTLAR**

### **1. KDV Hesaplama:**
- ✅ KKP sadece **net fiyat** üzerinden hesaplanır
- ❌ KDV tutarı KKP'ye dahil edilmez
- ✅ $1800 net + $360 KDV = $2160 toplam → **1800 KKP**

### **2. Kur Hesaplama:**
- ✅ USD/TRY kuru: **40 TL = 1 USD**
- ✅ TL ödemeler USD'ye çevrilir
- ✅ 1 USD = 1 KKP

### **3. Partner Bonusu:**
- ✅ Her partner kaydı: **120 KKP**
- ✅ Eğitim paketi ($100) + bonus (20 KKP)
- ✅ Anında verilir

### **4. Müşteri Satışı:**
- ✅ Net ürün fiyatı = KKP
- ✅ $1800 ürün = 1800 KKP
- ✅ KDV hariç hesaplama

---

## 🎯 **SONUÇ**

**KKP Hesaplama Formülü:**
```
Toplam KKP = Ödeme KKP + Partner KKP + Müşteri KKP

Ödeme KKP = (TL Ödemeler ÷ 40) 
Partner KKP = (Partner Sayısı × 120)
Müşteri KKP = (Net USD Satışlar)
```

**Örnek Hesaplama:**
- 800,000 TL ödeme = 20,000 KKP
- 5 partner kaydı = 600 KKP  
- 10 × $1800 müşteri satışı = 18,000 KKP
- **Toplam: 38,600 KKP → Gold Seviye**

Bu sistem ile kullanıcılar hem bireysel satışlardan hem de network aktivitelerinden KKP kazanarak kariyer seviyelerini yükseltebilirler.