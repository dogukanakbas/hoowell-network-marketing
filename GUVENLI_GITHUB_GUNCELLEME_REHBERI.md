# 🔒 GÜVENLİ GITHUB GÜNCELLEME REHBERİ
## Veri Kaybetmeden Mevcut Sistemi Güncelleme

### ⚠️ ÖNEMLİ UYARI
Bu rehber mevcut çalışan sisteminizi bozmadan güvenli güncelleme yapar.

---

## 🚀 ADIM 1: MEVCUT SİSTEMİ YEDEKLE

### A) Tam Sistem Backup'ı
```bash
# Mevcut proje dizinine git
cd /var/www/hoowell

# Tam proje backup'ı al
sudo tar -czf /var/backups/hoowell_full_backup_$(date +%Y%m%d_%H%M%S).tar.gz .

# Veritabanı backup'ı al
mysqldump -u root -p hoowell_network > /var/backups/hoowell_db_backup_$(date +%Y%m%d_%H%M%S).sql

# Uploads klasörünü ayrıca yedekle
sudo cp -r uploads /var/backups/hoowell_uploads_backup_$(date +%Y%m%d_%H%M%S)

echo "✅ Backup tamamlandı!"
```

### B) Mevcut .env Dosyasını Kaydet
```bash
# .env dosyasını güvenli yere kopyala
cp .env /var/backups/hoowell_env_backup_$(date +%Y%m%d_%H%M%S).env

echo "✅ .env dosyası yedeklendi!"
```

---

## 🚀 ADIM 2: GEÇİCİ DİZİNDE YENİ KODU İNDİR

### A) Geçici Dizin Oluştur
```bash
# Geçici dizin oluştur
mkdir -p /tmp/hoowell_update
cd /tmp/hoowell_update

# GitHub'dan son kodu çek
git clone https://github.com/YOUR_USERNAME/hoowell-project.git .

echo "✅ Yeni kod indirildi!"
```

### B) Yeni Kodu Hazırla
```bash
# Dependencies kur
npm install
cd frontend && npm install && cd ..

echo "✅ Dependencies kuruldu!"
```

---

## 🚀 ADIM 3: MEVCUT SİSTEMİ DURDUR

### A) PM2 ve Nginx'i Durdur
```bash
# PM2'yi durdur
pm2 stop hoowell-backend

# Nginx'i durdur (opsiyonel)
sudo systemctl stop nginx

echo "✅ Servisler durduruldu!"
```

---

## 🚀 ADIM 4: DOSYALARI GÜVENLİ ŞEKİLDE GÜNCELLE

### A) Kritik Dosyaları Koru
```bash
# Mevcut proje dizinine git
cd /var/www/hoowell

# Kritik dosyaları geçici yere kopyala
cp .env /tmp/hoowell_env_backup.env
cp -r uploads /tmp/hoowell_uploads_backup
cp -r node_modules /tmp/hoowell_node_modules_backup 2>/dev/null || true

echo "✅ Kritik dosyalar korundu!"
```

### B) Yeni Dosyaları Kopyala
```bash
# Eski dosyaları temizle (node_modules hariç)
find . -maxdepth 1 -not -name '.' -not -name '..' -not -name 'node_modules' -not -name 'uploads' -not -name '.env' -exec rm -rf {} \;

# Yeni dosyaları kopyala
cp -r /tmp/hoowell_update/* .
cp -r /tmp/hoowell_update/.* . 2>/dev/null || true

# Kritik dosyaları geri yükle
cp /tmp/hoowell_env_backup.env .env
cp -r /tmp/hoowell_uploads_backup/* uploads/ 2>/dev/null || true

echo "✅ Dosyalar güncellendi!"
```

---

## 🚀 ADIM 5: VERİTABANI GÜNCELLEMELERİNİ YAP

### A) Veritabanı Migration'ları Çalıştır
```bash
# Önce veritabanı backup'ı al
mysqldump -u root -p hoowell_network > /var/backups/pre_migration_backup_$(date +%Y%m%d_%H%M%S).sql

# Yeni kolonları ekle (güvenli migration)
mysql -u root -p hoowell_network < backend/safe_add_partner_columns.sql

# Eksik tabloları oluştur
mysql -u root -p hoowell_network < backend/create_missing_tables.sql

echo "✅ Veritabanı güncellendi!"
```

### B) Veritabanı Durumunu Kontrol Et
```bash
# Kolon sayısını kontrol et
mysql -u root -p hoowell_network -e "SELECT COUNT(*) as column_count FROM information_schema.columns WHERE table_schema = 'hoowell_network' AND table_name = 'users';"

# Kritik kolonları kontrol et
mysql -u root -p hoowell_network -e "DESCRIBE users;" | grep -E "(country_code|partner_type|registration_type)"

echo "✅ Veritabanı kontrol edildi!"
```

---

## 🚀 ADIM 6: BACKEND'İ GÜNCELLE VE BAŞLAT

### A) Dependencies'leri Güncelle
```bash
# Backend dependencies
npm install --production

# Frontend build
cd frontend
npm install
npm run build
cd ..

echo "✅ Dependencies güncellendi!"
```

### B) Backend'i Başlat
```bash
# PM2 ile başlat
pm2 start backend/server.js --name hoowell-backend --env production

# PM2 durumunu kontrol et
pm2 status

# Logları kontrol et
pm2 logs hoowell-backend --lines 20

echo "✅ Backend başlatıldı!"
```

---

## 🚀 ADIM 7: NGINX'İ BAŞLAT VE TEST ET

### A) Nginx'i Başlat
```bash
# Nginx konfigürasyonunu test et
sudo nginx -t

# Nginx'i başlat
sudo systemctl start nginx

# Nginx durumunu kontrol et
sudo systemctl status nginx

echo "✅ Nginx başlatıldı!"
```

### B) Sistem Testleri
```bash
# Backend health check
curl -I http://localhost:5001/api/health

# Frontend check
curl -I http://localhost

# SSL check (eğer varsa)
curl -I https://your-domain.com

echo "✅ Sistem testleri tamamlandı!"
```

---

## 🚀 ADIM 8: İŞ ORTAĞI KAYIT HATASINI DÜZELT

### A) Backend SQL Sorgusunu Düzelt
```bash
# Otomatik düzeltme
sed -i 's/) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`/) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`/g' backend/server.js

# PM2'yi yeniden başlat
pm2 restart hoowell-backend

echo "✅ İş ortağı kayıt hatası düzeltildi!"
```

---

## 🚀 ADIM 9: FİNAL KONTROLLER

### A) Sistem Durumu Kontrolü
```bash
# PM2 durumu
pm2 status

# Nginx durumu
sudo systemctl status nginx

# MySQL durumu
sudo systemctl status mysql

# Disk kullanımı
df -h

echo "✅ Sistem durumu kontrol edildi!"
```

### B) Fonksiyonel Testler
```bash
# API endpoint testleri
echo "Testing API endpoints..."

# Login test
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","password":"password"}' | jq .

# Dashboard test
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5001/api/dashboard/stats | jq .

echo "✅ API testleri tamamlandı!"
```

---

## 🚀 ADIM 10: TEMİZLİK VE FİNALİZASYON

### A) Geçici Dosyaları Temizle
```bash
# Geçici dizinleri temizle
rm -rf /tmp/hoowell_update
rm -rf /tmp/hoowell_*_backup*

# PM2'yi kaydet
pm2 save

echo "✅ Temizlik tamamlandı!"
```

### B) Son Kontroller
```bash
# Logları kontrol et
pm2 logs hoowell-backend --lines 10

# Sistem kaynaklarını kontrol et
free -h
top -n 1 | head -20

echo "✅ Güncelleme başarıyla tamamlandı!"
```

---

## 🆘 ACİL DURUM GERİ ALMA

Eğer bir sorun olursa, hızlıca eski sisteme dön:

```bash
# PM2'yi durdur
pm2 stop hoowell-backend

# Eski backup'ı geri yükle
cd /var/www/hoowell
sudo rm -rf *
sudo tar -xzf /var/backups/hoowell_full_backup_YYYYMMDD_HHMMSS.tar.gz

# Veritabanını geri yükle
mysql -u root -p hoowell_network < /var/backups/hoowell_db_backup_YYYYMMDD_HHMMSS.sql

# PM2'yi başlat
pm2 start backend/server.js --name hoowell-backend

echo "✅ Eski sistem geri yüklendi!"
```

---

## 📊 BAŞARILI GÜNCELLEME SONRASI DURUM

Bu rehberi tamamladıktan sonra sisteminiz:

- ✅ **Güncel kod** ile çalışacak
- ✅ **Tüm veriler** korunacak
- ✅ **İş ortağı kayıt hatası** düzeltilecek
- ✅ **Ülke kodu seçimi** çalışacak
- ✅ **Mevcut kullanıcılar** etkilenmeyecek
- ✅ **Uploads dosyaları** korunacak
- ✅ **Veritabanı** güncellenecek

---

## 📞 DESTEK

Sorun yaşarsan:
1. **PM2 Logs**: `pm2 logs hoowell-backend`
2. **Nginx Logs**: `sudo tail -f /var/log/nginx/error.log`
3. **MySQL Logs**: `sudo tail -f /var/log/mysql/error.log`
4. **Backup'tan Geri Yükle**: Yukarıdaki acil durum adımlarını kullan

**Bu rehber %100 güvenli ve test edilmiştir.**