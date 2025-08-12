# 🗄️ Yeni Tablo Ekleme Rehberi - Muhasebe Sistemi

## 📋 Yeni Eklenen Dosya
- **Dosya**: `backend/create_accounting_info_table.sql`
- **İçerik**: Muhasebe bilgileri ve belge yükleme tabloları
- **Durum**: İlk defa sunucuya eklenecek

## 🚀 Sunucuya Ekleme Adımları

### 1. 📦 Yerel Hazırlık (Bilgisayarında)
```bash
# Yeni SQL dosyasının git'e eklendiğini kontrol et
git status

# Eğer eklenmemişse ekle
git add backend/create_accounting_info_table.sql

# Commit yap
git commit -m "feat: Add accounting info tables for financial management system"

# GitHub'a push et
git push origin main
```

### 2. 🔐 Sunucuya Bağlan
```bash
# SSH ile sunucuya bağlan
ssh root@your-server-ip
# veya
ssh username@your-server-ip
```

### 3. 📂 Proje Dizinine Git
```bash
# Proje dizinine git
cd /var/www/hoowell-network
# veya projenin bulunduğu dizin
```

### 4. 💾 Veritabanı Yedeği Al (ÖNEMLİ!)
```bash
# Mevcut veritabanını yedekle
mysqldump -u root -p hoowell_network > backup_before_accounting_tables_$(date +%Y%m%d_%H%M%S).sql

# Yedek dosyasının oluştuğunu kontrol et
ls -la backup_before_accounting_tables_*
```

### 5. 📥 Yeni Kodu Çek
```bash
# Yeni değişiklikleri çek
git pull origin main

# Yeni SQL dosyasının geldiğini kontrol et
ls -la backend/create_accounting_info_table.sql
```

### 6. 🗄️ Yeni Tabloları Oluştur

#### Yöntem 1: SQL Dosyasını Direkt Çalıştır (Önerilen)
```bash
# SQL dosyasını MySQL'de çalıştır
mysql -u root -p hoowell_network < backend/create_accounting_info_table.sql

# Başarılı olup olmadığını kontrol et
echo "Tablo oluşturma işlemi tamamlandı"
```

#### Yöntem 2: Manuel MySQL Komutu (Alternatif)
```bash
# MySQL'e bağlan
mysql -u root -p

# Veritabanını seç
USE hoowell_network;

# SQL dosyasını çalıştır
SOURCE backend/create_accounting_info_table.sql;

# Çıkış yap
EXIT;
```

### 7. ✅ Tabloların Oluştuğunu Doğrula
```bash
# MySQL'e bağlan
mysql -u root -p

# Veritabanını seç
USE hoowell_network;

# Yeni tabloları kontrol et
SHOW TABLES LIKE 'accounting%';

# Tablo yapısını kontrol et
DESCRIBE accounting_info;
DESCRIBE accounting_documents;

# Çıkış yap
EXIT;
```

### 8. 📁 Upload Klasörlerini Oluştur
```bash
# Muhasebe belgeleri için klasör oluştur
mkdir -p uploads/accounting

# Klasör izinlerini ayarla
chmod 755 uploads/accounting
chown www-data:www-data uploads/accounting

# Klasörün oluştuğunu kontrol et
ls -la uploads/
```

### 9. 🔄 Backend Servisini Yeniden Başlat
```bash
# PM2 ile backend'i yeniden başlat
pm2 restart hoowell-backend

# Logları kontrol et
pm2 logs hoowell-backend --lines 20

# Servisin çalıştığını kontrol et
pm2 status
```

## 🧪 Test ve Doğrulama

### 10. 🔍 API Endpoint Testleri
```bash
# Backend'in çalıştığını test et
curl http://localhost:5001/api/health

# Yeni muhasebe endpoint'lerini test et (eğer varsa)
curl -X GET http://localhost:5001/api/accounting/info \
  -H "Authorization: Bearer YOUR_TEST_TOKEN"
```

### 11. 🌐 Web Arayüzü Testi
Tarayıcıda şunları test et:
- ✅ Ana sayfa açılıyor mu?
- ✅ Login yapabiliyorsun mu?
- ✅ Muhasebe Takip Paneli'ne tıklayabiliyorsun mu?
- ✅ Kayıt formu açılıyor mu?

## 🔍 Sorun Giderme

### Tablo Oluşturma Hatası Durumunda:
```bash
# MySQL error loglarını kontrol et
tail -f /var/log/mysql/error.log

# Manuel olarak tabloları kontrol et
mysql -u root -p
USE hoowell_network;
SHOW CREATE TABLE users; -- users tablosunun var olduğunu kontrol et
```

### Foreign Key Hatası Durumunda:
```bash
# users tablosunun var olduğunu kontrol et
mysql -u root -p
USE hoowell_network;
DESCRIBE users;
SELECT COUNT(*) FROM users; -- En az bir kullanıcı olmalı
```

### Upload Klasörü Sorunu Durumunda:
```bash
# Klasör izinlerini tekrar ayarla
sudo mkdir -p uploads/accounting
sudo chmod 755 uploads/accounting
sudo chown -R www-data:www-data uploads/

# Nginx kullanıcısı farklıysa
sudo chown -R nginx:nginx uploads/
```

## 📊 Başarı Kontrol Listesi

### ✅ Kontrol Edilecekler:
- [ ] SQL dosyası sunucuya geldi
- [ ] Veritabanı yedeği alındı
- [ ] `accounting_info` tablosu oluştu
- [ ] `accounting_documents` tablosu oluştu
- [ ] `uploads/accounting` klasörü oluştu
- [ ] Klasör izinleri doğru ayarlandı
- [ ] Backend servisi yeniden başladı
- [ ] API endpoint'ler çalışıyor
- [ ] Web arayüzü açılıyor
- [ ] Muhasebe paneli erişilebilir

## 🚨 Acil Durum - Geri Alma

### Eğer Bir Şeyler Ters Giderse:
```bash
# Veritabanını geri yükle
mysql -u root -p hoowell_network < backup_before_accounting_tables_YYYYMMDD_HHMMSS.sql

# Önceki commit'e geri dön
git log --oneline -5
git checkout PREVIOUS_COMMIT_HASH

# Backend'i yeniden başlat
pm2 restart hoowell-backend
```

## 📝 Önemli Notlar

### 🔒 Güvenlik:
- Veritabanı yedeği mutlaka alındı
- Upload klasörü izinleri güvenli ayarlandı
- Foreign key constraints doğru çalışıyor

### 📈 Performans:
- Yeni tablolar index'li oluşturuldu
- UNIQUE constraint'ler performansı artırıyor
- CASCADE delete'ler veri tutarlılığını sağlıyor

### 🔄 Bakım:
- Tablo yapısı gelecekte genişletilebilir
- Document tablosu dosya meta verilerini tutuyor
- Approval sistemi admin kontrolü sağlıyor

## 🎯 Sonraki Adımlar

Tablolar başarıyla oluşturulduktan sonra:
1. Web arayüzünde muhasebe panelini test et
2. Dosya yükleme işlevini test et
3. Admin onay sistemini test et
4. Kullanıcı deneyimini kontrol et

**Başarılar! 🚀**

---

## 📞 Yardım Gerekirse

Sorun yaşarsan:
1. PM2 loglarını kontrol et: `pm2 logs`
2. MySQL loglarını kontrol et: `tail -f /var/log/mysql/error.log`
3. Nginx loglarını kontrol et: `tail -f /var/log/nginx/error.log`
4. Gerekirse geri alma işlemini yap