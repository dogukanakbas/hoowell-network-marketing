# HOOWELL Sunucu Güncelleme Rehberi

## 🔄 Güvenli Güncelleme Adımları (Sunucuda Yapılacak)

### 1. Sunucuya Bağlan ve Backup Al (ÖNEMLİ!)
```bash
# SSH ile sunucuya bağlan
ssh user@your-server-ip

# Proje dizinine git
cd /var/www/hoowell  # veya projenin bulunduğu dizin

# Tam veritabanı backup'ı (mevcut kullanıcıları korumak için)
mysqldump -u root -p hoowell_network > backups/hoowell_backup_$(date +%Y%m%d_%H%M%S).sql

# Sadece kullanıcı verilerini ayrı backup'la (ekstra güvenlik)
mysqldump -u root -p hoowell_network users payments user_video_progress > backups/users_backup_$(date +%Y%m%d_%H%M%S).sql

# Proje dosyalarını backup'la
tar -czf backups/project_backup_$(date +%Y%m%d_%H%M%S).tar.gz --exclude=node_modules --exclude=frontend/node_modules .

# Backup'ların oluştuğunu kontrol et
ls -la backups/
```

### 2. Git Pull ile Güncellemeleri Al
```bash
# Mevcut değişiklikleri stash'le (varsa)
git stash

# Son güncellemeleri çek
git pull origin main

# Eğer conflict varsa çöz
git stash pop  # (sadece gerekirse)
```

### 3. Database Migration Çalıştır
```bash
# Migration script'i çalıştır
mysql -u root -p hoowell_network < deployment/migration_script.sql
```

### 4. Node.js Bağımlılıklarını Güncelle
```bash
# Backend bağımlılıkları
npm install

# Frontend bağımlılıkları
cd frontend
npm install
cd ..
```

### 5. Frontend Build Al
```bash
cd frontend
npm run build
cd ..
```

### 6. Environment Variables Kontrol Et
```bash
# .env dosyasını kontrol et
cat .env

# Gerekirse güncelle (production değerleri)
nano .env
```

### 7. Servisleri Yeniden Başlat
```bash
# PM2 kullanıyorsan
pm2 restart hoowell-backend
pm2 restart hoowell-frontend

# Veya systemd kullanıyorsan
sudo systemctl restart hoowell-backend
sudo systemctl restart hoowell-frontend

# Veya manuel olarak
pkill -f "node.*server.js"
nohup node backend/server.js > server.log 2>&1 &
```

### 8. Kontrol Testleri
```bash
# Backend çalışıyor mu?
curl http://localhost:5001/api/auth/me

# Frontend çalışıyor mu?
curl http://localhost:3000

# Database bağlantısı çalışıyor mu?
mysql -u root -p -e "USE hoowell_network; SELECT COUNT(*) FROM users;"
```

## 🔧 Yeni Özellikler

### Eklenen Tablolar:
- `customers` - Müşteri kayıtları
- `customer_references` - Müşteri referansları

### Eklenen API Endpoints:
- `POST /api/customer/register` - Müşteri kayıt
- `GET /api/admin/customers` - Müşteri listesi
- `GET /api/admin/customers/:id/references` - Müşteri referansları

### Yeni Özellikler:
- 6 adımlı müşteri kayıt sistemi
- C2025XXXXXX formatında müşteri ID'si
- Türkiye il/ilçe veritabanı
- IBAN ödeme bilgileri
- Referans listesi yönetimi

## ⚠️ Önemli Notlar

1. **Backup almadan güncelleme yapmayın!**
2. **Production'da önce test edin**
3. **Database migration'ı dikkatli çalıştırın**
4. **Mevcut kullanıcı verileri korunacak**
5. **Yeni tablolar otomatik oluşturulacak**

## 🆘 Sorun Durumunda

Eğer bir sorun olursa:
```bash
# Database'i geri yükle
mysql -u root -p hoowell_network < backup_YYYYMMDD_HHMMSS.sql

# Proje dosyalarını geri yükle
tar -xzf hoowell_backup_YYYYMMDD_HHMMSS.tar.gz
```