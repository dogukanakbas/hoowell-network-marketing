# 📋 PAYTR BAŞVURU HAZIRLIK REHBERİ

## 📅 Tarih: 08.01.2025
## 🎯 Amaç: PayTR Başvurusu İçin Sistem Hazırlığı

---

## 🚨 **KRİTİK UYARILAR - MUTLAKA DİKKAT EDİN!**

### **⚠️ En Önemli Noktalar:**
1. **SSL Sertifikası ZORUNLU** - HTTPS olmadan başvuru kabul edilmez
2. **Gerçek Domain Gerekli** - localhost veya IP adresi kabul edilmez
3. **Profesyonel Web Sitesi** - Tam fonksiyonel e-ticaret sitesi olmalı
4. **Yasal Belgeler Tam** - Eksik belge başvuru reddine neden olur
5. **Banka Hesabı Uyumlu** - Şirket adına açılmış ticari hesap gerekli

---

## 🌐 **WEB SİTESİ GEREKSİNİMLERİ**

### **1. Domain ve Hosting**
```
✅ DOĞRU ÖRNEKLER:
- https://hoowell.com.tr
- https://www.hoowell.com
- https://hoowellglobal.com

❌ YANLIŞ ÖRNEKLER:
- http://localhost:3000
- http://192.168.1.100
- https://hoowell.herokuapp.com (ücretsiz subdomain)
- https://hoowell.github.io (ücretsiz hosting)
```

### **2. SSL Sertifikası Kontrolü**
```bash
# SSL kontrolü için:
curl -I https://yourdomain.com
# Sonuçta "200 OK" ve "SSL" bilgileri görünmeli

# Alternatif kontrol:
openssl s_client -connect yourdomain.com:443
```

### **3. Zorunlu Sayfalar**
```
✅ Olması Gereken Sayfalar:
├── Ana Sayfa (/)
├── Ürünler/Hizmetler (/products)
├── Hakkımızda (/about)
├── İletişim (/contact)
├── Gizlilik Politikası (/privacy)
├── Kullanım Şartları (/terms)
├── İade ve Değişim (/refund)
├── Teslimat Bilgileri (/shipping)
├── Ödeme Güvenliği (/payment-security)
└── KVKK Aydınlatma Metni (/kvkk)
```

### **4. İletişim Bilgileri**
```html
<!-- Footer'da mutlaka bulunmalı -->
<footer>
  <div class="contact-info">
    <p><strong>HOOWELL GLOBAL SU ARITMA SİSTEMLERİ A.Ş.</strong></p>
    <p>📍 Adres: [Tam şirket adresi]</p>
    <p>📞 Telefon: +90 XXX XXX XX XX</p>
    <p>📧 E-posta: info@hoowell.com.tr</p>
    <p>🏢 Vergi Dairesi: [Vergi dairesi adı]</p>
    <p>🆔 Vergi No: [Vergi numarası]</p>
    <p>🏛️ Ticaret Sicil No: [Ticaret sicil numarası]</p>
    <p>🏪 Mersis No: [Mersis numarası]</p>
  </div>
</footer>
```

---

## 📄 **YASAL BELGELER VE DÖKÜMANLAR**

### **1. Şirket Belgeleri**
```
📋 Gerekli Belgeler Listesi:

✅ Ticaret Sicil Gazetesi (Son 3 ay içinde alınmış)
✅ Vergi Levhası (Güncel)
✅ İmza Sirküleri (Banka onaylı)
✅ Faaliyet Belgesi / İş Yeri Açma Ruhsatı
✅ Şirket Ana Sözleşmesi
✅ Yönetim Kurulu Kararı (Ödeme alma yetkisi)
✅ Vekalet (Eğer başvuruyu vekil yapıyorsa)
```

### **2. Banka Hesap Bilgileri**
```
🏦 Banka Hesabı Gereksinimleri:

✅ Şirket adına açılmış TİCARİ hesap
✅ IBAN: TR77 0011 1000 0000 0153 1671 66
✅ Hesap Sahibi: HOOWELL GLOBAL SU ARITMA SİSTEMLERİ ANONİM ŞİRKETİ
✅ Banka: Türkiye İş Bankası
✅ Şube: [Şube adı ve kodu]
✅ Hesap türü: Ticari Cari Hesap

❌ Kabul Edilmeyenler:
- Bireysel hesaplar
- Tasarruf hesapları
- Farklı şirket adına hesaplar
```

### **3. Yetkili Kişi Bilgileri**
```
👤 Yetkili Kişi Gereksinimleri:

✅ Şirket ortağı veya yöneticisi olmalı
✅ İmza yetkisi bulunmalı
✅ TC Kimlik fotokopisi
✅ İkametgah belgesi
✅ Telefon numarası (cep telefonu)
✅ E-posta adresi (@hoowell.com.tr uzantılı tercih edilir)
```

---

## 💻 **TEKNİK SİSTEM GEREKSİNİMLERİ**

### **1. Sunucu Gereksinimleri**
```
🖥️ Sunucu Spesifikasyonları:

✅ HTTPS (SSL) zorunlu
✅ PHP 7.4+ veya Node.js 16+ (sizin durumunuzda Node.js)
✅ MySQL 8.0+ veritabanı
✅ Minimum 2GB RAM
✅ Minimum 20GB disk alanı
✅ 99.9% uptime garantisi
✅ DDoS koruması
✅ Günlük backup sistemi
```

### **2. Güvenlik Gereksinimleri**
```
🔐 Güvenlik Kontrol Listesi:

✅ SSL Sertifikası (Let's Encrypt veya ticari)
✅ Firewall koruması
✅ SQL Injection koruması
✅ XSS koruması
✅ CSRF koruması
✅ Rate limiting
✅ IP whitelist/blacklist
✅ Güvenli şifre politikası
✅ Session yönetimi
✅ Log kayıt sistemi
```

### **3. Callback URL Hazırlığı**
```javascript
// PayTR callback endpoint'i hazır olmalı
// backend/server.js içinde:

app.post('/api/paytr/callback', (req, res) => {
  // PayTR'den gelen callback'leri işleyecek endpoint
  // Şu an için basit bir response döndürün:
  res.status(200).send('OK');
});

// Test için erişilebilir olmalı:
// https://yourdomain.com/api/paytr/callback
```

---

## 🛒 **E-TİCARET SİTESİ GEREKSİNİMLERİ**

### **1. Ürün Katalogu**
```
📦 Ürün Sayfası Gereksinimleri:

✅ Ürün fotoğrafları (yüksek kalite)
✅ Detaylı ürün açıklamaları
✅ Fiyat bilgileri (KDV dahil/hariç)
✅ Stok durumu
✅ Teknik özellikler
✅ Garanti bilgileri
✅ Teslimat süresi
✅ İade koşulları

Mevcut Ürünleriniz:
├── Eğitim Paketi - 4.800 TL (KDV Dahil)
└── HOOWELL Cihaz Paketi - 86.400 TL (KDV Dahil)
```

### **2. Sepet ve Ödeme Süreci**
```
🛒 Sepet Sistemi:

✅ Ürün ekleme/çıkarma
✅ Miktar güncelleme
✅ Toplam tutar hesaplama
✅ KDV hesaplama
✅ Kargo ücreti (varsa)
✅ İndirim kodu sistemi (varsa)
✅ Misafir alışveriş seçeneği
✅ Üye girişi seçeneği
```

### **3. Müşteri Kayıt Sistemi**
```
👥 Kullanıcı Yönetimi:

✅ Müşteri kayıt formu
✅ Giriş/çıkış sistemi
✅ Profil yönetimi
✅ Sipariş geçmişi
✅ Adres defteri
✅ Şifre sıfırlama
✅ E-posta doğrulama
✅ KVKK onayı
```

---

## 📊 **RAPORLAMA VE ANALİTİK**

### **1. Satış Raporları**
```
📈 Gerekli Raporlar:

✅ Günlük satış raporu
✅ Aylık ciro raporu
✅ Ürün bazlı satış analizi
✅ Müşteri analizi
✅ İade/iptaller raporu
✅ Ödeme yöntemi dağılımı
```

### **2. Google Analytics**
```html
<!-- Google Analytics kodu eklenmeli -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🔍 **PAYTR İNCELEME KRİTERLERİ**

### **1. Web Sitesi İncelemesi**
```
🔎 PayTR'nin Kontrol Ettiği Noktalar:

✅ Site tamamen çalışıyor mu?
✅ Ürünler gerçek mi, sahte değil mi?
✅ Fiyatlar makul seviyede mi?
✅ İletişim bilgileri doğru mu?
✅ Yasal sayfalar mevcut mu?
✅ SSL sertifikası geçerli mi?
✅ Mobil uyumlu mu?
✅ Hızlı yükleniyor mu?
```

### **2. Şirket Doğrulaması**
```
🏢 Şirket Kontrolü:

✅ Ticaret sicil kaydı doğru mu?
✅ Vergi dairesi kayıtları uyumlu mu?
✅ Banka hesabı şirket adına mı?
✅ Yetkili kişi gerçekten yetkili mi?
✅ Adres bilgileri doğru mu?
✅ Telefon numarası aktif mi?
```

### **3. Risk Değerlendirmesi**
```
⚖️ Risk Faktörleri:

✅ Düşük Risk:
- Kurumsal şirket
- Uzun süreli faaliyet
- Düzenli satışlar
- Düşük iade oranı

❌ Yüksek Risk:
- Yeni kurulan şirket
- Çok yüksek tutarlar
- Şüpheli ürünler
- Eksik belgeler
```

---

## 📝 **BAŞVURU ÖNCESİ KONTROL LİSTESİ**

### **✅ Teknik Kontroller**
```bash
# 1. SSL Kontrolü
curl -I https://yourdomain.com
# Sonuç: HTTP/2 200 OK

# 2. Domain Erişimi
ping yourdomain.com
# Sonuç: Başarılı ping

# 3. Callback URL Testi
curl -X POST https://yourdomain.com/api/paytr/callback
# Sonuç: 200 OK

# 4. Sayfa Hızı Testi
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com
# Sonuç: < 3 saniye
```

### **✅ İçerik Kontrolleri**
```
📋 Sayfa İçerik Kontrolü:

✅ Ana sayfa yükleniyor
✅ Ürün sayfaları çalışıyor
✅ İletişim formu aktif
✅ Hakkımızda sayfası dolu
✅ Gizlilik politikası mevcut
✅ Kullanım şartları mevcut
✅ İade koşulları açık
✅ KVKK metni mevcut
✅ Footer bilgileri tam
✅ Mobil görünüm düzgün
```

### **✅ Belge Kontrolleri**
```
📄 Belge Hazırlık Kontrolü:

✅ Ticaret sicil gazetesi (PDF)
✅ Vergi levhası (PDF)
✅ İmza sirküleri (PDF)
✅ Faaliyet belgesi (PDF)
✅ Banka hesap bilgileri (PDF)
✅ Yetkili kimlik (PDF)
✅ İkametgah belgesi (PDF)
✅ Vekalet (varsa) (PDF)

Dosya Formatı: PDF, maksimum 5MB
Çözünürlük: En az 300 DPI
Renk: Renkli tarama tercih edilir
```

---

## 🚨 **SÜRPRIZ DURUMLAR VE ÇÖZÜMLERİ**

### **1. Başvuru Reddedilirse**
```
❌ Red Sebepleri ve Çözümleri:

1. "Web sitesi eksik"
   → Tüm sayfaları tamamlayın
   → SSL sertifikası ekleyin
   → İletişim bilgilerini güncelleyin

2. "Belgeler eksik/hatalı"
   → Tüm belgeleri yeniden kontrol edin
   → Güncel tarihlerde alın
   → Doğru formatta yükleyin

3. "Şirket bilgileri uyumsuz"
   → Ticaret sicil ile site bilgilerini eşleştirin
   → Banka hesabı adını kontrol edin
   → Yetkili kişi bilgilerini doğrulayın

4. "Risk değerlendirmesi"
   → Daha düşük limitlerle başlayın
   → Referans müşteriler gösterin
   → Geçmiş satış belgelerini sunun
```

### **2. Ek Belge İstenmesi**
```
📋 Ek İstenebilecek Belgeler:

✅ Son 3 aylık banka hesap özeti
✅ Vergi dairesi yazışmaları
✅ Ticaret odası üyelik belgesi
✅ ISO sertifikaları (varsa)
✅ Ürün sertifikaları
✅ Distribütörlük belgeleri
✅ Referans müşteri listesi
✅ Geçmiş satış faturaları
```

---

## 📞 **BAŞVURU SONRASI SÜREÇ**

### **1. Onay Süreci**
```
⏰ Zaman Çizelgesi:

Gün 1: Başvuru gönderimi
Gün 2-3: Otomatik sistem kontrolü
Gün 4-5: Manuel inceleme
Gün 6-7: Belge doğrulama
Gün 8-10: Risk değerlendirmesi
Gün 11-15: Final karar

Toplam Süre: 10-15 iş günü
```

### **2. Onay Sonrası**
```
✅ Onay Aldıktan Sonra:

1. API bilgilerini alın:
   - Merchant ID
   - Merchant Key  
   - Merchant Salt

2. Test ortamı bilgilerini alın
3. Entegrasyon dokümantasyonunu indirin
4. Test işlemlerini yapın
5. Canlı ortama geçiş onayı alın
```

---

## 🎯 **ÖNERİLER VE İPUÇLARI**

### **1. Başvuru Öncesi**
```
💡 Başarı İpuçları:

✅ Tüm belgeleri önceden hazırlayın
✅ Web sitesini tamamen bitirin
✅ SSL sertifikasını kurun
✅ Test işlemlerini yapın
✅ İletişim bilgilerini güncelleyin
✅ Mobil uyumluluğu kontrol edin
✅ Sayfa hızını optimize edin
✅ SEO ayarlarını yapın
```

### **2. Başvuru Sırasında**
```
📝 Başvuru İpuçları:

✅ Tüm alanları eksiksiz doldurun
✅ Gerçek bilgiler kullanın
✅ Profesyonel e-posta adresi kullanın
✅ Açık ve net açıklamalar yazın
✅ Ürün kategorisini doğru seçin
✅ Tahmini ciroyu gerçekçi belirtin
✅ İletişim bilgilerini doğru girin
```

### **3. Başvuru Sonrası**
```
📞 Takip İpuçları:

✅ Başvuru numaranızı kaydedin
✅ E-postalarınızı düzenli kontrol edin
✅ Telefon görüşmelerine hazır olun
✅ Ek belge taleplerini hızlı karşılayın
✅ Sabırlı olun (süreç 10-15 gün)
✅ Destek ekibi ile iletişimde kalın
```

---

## 📋 **SONUÇ VE EYLEM PLANI**

### **🎯 Öncelikli Yapılacaklar:**

1. **SSL Sertifikası** (1 gün)
   - Let's Encrypt veya ticari SSL
   - HTTPS yönlendirmesi

2. **Yasal Sayfalar** (2-3 gün)
   - Gizlilik politikası
   - Kullanım şartları
   - İade koşulları
   - KVKK aydınlatma metni

3. **İletişim Bilgileri** (1 gün)
   - Footer'da tam şirket bilgileri
   - İletişim sayfası güncelleme
   - Harita entegrasyonu

4. **Belge Hazırlığı** (3-5 gün)
   - Tüm şirket belgelerini toplama
   - PDF formatına çevirme
   - Kalite kontrolü

5. **Teknik Testler** (1-2 gün)
   - SSL kontrolü
   - Sayfa hızı testi
   - Mobil uyumluluk
   - Callback URL hazırlığı

### **📊 Başarı Oranını Artırma:**
- ✅ Profesyonel görünüm
- ✅ Eksiksiz belgeler
- ✅ Gerçekçi bilgiler
- ✅ Hızlı iletişim
- ✅ Sabırlı yaklaşım

**🚀 Tahmini Hazırlık Süresi:** 1-2 hafta
**💯 Başarı Oranı:** %90+ (tüm şartlar sağlandığında)

---

**📞 Önemli Not:** PayTR başvurusu yapmadan önce bu listedeki tüm maddeleri kontrol edin. Eksik olan herhangi bir unsur başvurunuzun reddedilmesine neden olabilir.