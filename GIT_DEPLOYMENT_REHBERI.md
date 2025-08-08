# 🚀 GIT İLE GÜVENLİ DEPLOYMENT REHBERİ

## 📋 MEVCUT VERİLERİ KAYBETMEDEN GÜNCELLEMELERİ SUNUCUYA AKTARMA

### 🎯 **AMAÇ**
- GitHub'a güncellemeleri push etmek
- Sunucuda git pull ile güncellemeleri çekmek
- **Mevcut kullanıcı verilerini korumak**
- **Sıfır downtime** ile deployment yapmak

---

## 📦 **ADIM 1: GITHUB'A PUSH HAZIRLIĞI**

### A) **Hassas Dosyaları Kontrol Et**
```bash
# .gitignore dosyasının doğru olduğunu kontrol et
cat .gitignore

# Hassas dosyaların git'e eklenmediğini kontrol et
git status
```

### B) **Production .env Template Oluştur**
```bash
# .env.example dosyası oluştur (hassas bilgiler olmadan)
cp .env .env.example

# .env.example'dan hassas bilgileri temizle
nano .env.example
```

**.env.example içeriği:**
```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=hoowell_network

# JWT Configuration
JWT_SECRET=your_jwt_secret_256_bit_key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_NAME=HOOWELL
FROM_EMAIL=your-email@gmail.com

# Application Configuration
NODE_ENV=production
PORT=5001
```

### C) **Git Commit ve Push**
```bash
# Tüm değişiklikleri ekle
git add .

# Commit mesajı ile kaydet
git commit -m "feat: Major updates - Responsive design, legal pages, company info, sidebar optimization"

# GitHub'a push et
git push origin main
```

---

## 🖥️ **ADIM 2: SUNUCUDA GÜVENLİ DEPLOYMENT**

### A) **Sunucuya Bağlan**
```bash
# SSH ile sunucuya bağlan
ssh your-user@your-server-ip

# Proje dizinine git
cd /var/www/hoowell  # veya projenizin bulunduğu dizin
```

### B) **Güvenlik Backup'ı Al (KRİTİK!)**
```bash
# Veritabanı backup'ı
mysqldump -u root -p hoowell_network > backup_before_update_$(date +%Y%m%d_%H%M%S).sql

# Dosya backup'ı
tar -czf files_backup_$(date +%Y%m%d_%H%M%S).tar.gz . --exclude=node_modules --exclude=frontend/node_modules

# Uploads klasörü ayrı backup
tar -czf uploads_backup_$(date +%Y%m%d_%H%M%S).tar.gz uploads/

echo "✅ Backup'lar alındı!"
```

### C) **Maintenance Mode Aktif Et**
```bash
# Nginx maintenance page oluştur
sudo tee /var/www/maintenance.html > /dev/null <<EOF
<!DOCTYPE html>
<html>
<head>
    <title>Bakım Modu - HOOWELL</title>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial; text-align: center; padding: 50px; background: #0e2323; color: #FFD700; }
        .container { max-width: 600px; margin: 0 auto; }
        .logo { font-size: 48px; margin-bottom: 20px; }
        h1 { color: #FFD700; }
        p { font-size: 18px; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🔧</div>
        <h1>HOOWELL Sistem Güncellemesi</h1>
        <p>Sistemimiz şu anda güncelleniyor. Lütfen birkaç dakika sonra tekrar deneyin.</p>
        <p>Güncelleme süresi: Yaklaşık 5-10 dakika</p>
        <p><strong>INNOVATE YOUR LIFE</strong></p>
    </div>
</body>
</html>
EOF

# Nginx'i maintenance mode'a al
sudo cp /etc/nginx/sites-available/hoowell /etc/nginx/sites-available/hoowell.backup
sudo tee /etc/nginx/sites-available/hoowell > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    location / {
        root /var/www;
        try_files /maintenance.html =503;
    }
}
EOF

sudo nginx -s reload
echo "🔧 Maintenance mode aktif!"
```

---

## 🔄 **ADIM 3: GÜVENLİ GÜNCELLEMELERİ ÇEK**

### A) **Git Pull ile Güncellemeleri Al**
```bash
# Mevcut branch'i kontrol et
git branch

# Uzak repository'den güncellemeleri çek
git fetch origin

# Değişiklikleri kontrol et
git log --oneline HEAD..origin/main

# Güvenli merge (mevcut değişiklikleri koru)
git pull origin main

echo "✅ Kod güncellemeleri alındı!"
```

### B) **Dependencies Güncelle**
```bash
# Backend dependencies
npm install

# Frontend dependencies
cd frontend
npm install
cd ..

echo "✅ Dependencies güncellendi!"
```

### C) **Frontend Build**
```bash
# Production build
cd frontend
npm run build
cd ..

echo "✅ Frontend build tamamlandı!"
```

---

## 🗄️ **ADIM 4: VERİTABANI GÜVENLİ MİGRASYON**

### A) **Mevcut Veri Durumunu Kontrol Et**
```bash
# Kullanıcı sayısını kontrol et
mysql -u root -p hoowell_network -e "SELECT COUNT(*) as user_count FROM users WHERE role='partner';"

# Tablo yapısını kontrol et
mysql -u root -p hoowell_network -e "DESCRIBE users;"

# Kritik verileri kontrol et
mysql -u root -p hoowell_network -e "SELECT id, username, email, sponsor_id, total_kkp FROM users WHERE role='partner' LIMIT 5;"
```

### B) **Güvenli Database Migration**
```bash
# Migration script'ini çalıştır (mevcut verileri korur)
mysql -u root -p hoowell_network < deployment/safe_migration_fixed.sql

# Yeni tabloları oluştur (sadece eksik olanları)
mysql -u root -p hoowell_network < backend/create_missing_tables_fix.sql

echo "✅ Database migration tamamlandı!"
```

### C) **Veri Tutarlılığını Kontrol Et**
```bash
# Migration sonrası kontrol
mysql -u root -p hoowell_network -e "
SELECT 
    COUNT(*) as total_users,
    SUM(CASE WHEN education_completed = 1 THEN 1 ELSE 0 END) as completed_education,
    SUM(CASE WHEN backoffice_access = 1 THEN 1 ELSE 0 END) as has_backoffice
FROM users WHERE role = 'partner';
"

# Yeni tabloları kontrol et
mysql -u root -p hoowell_network -e "SHOW TABLES LIKE '%tracking%';"
```

---

## 🔄 **ADIM 5: APPLICATION RESTART**

### A) **PM2 ile Güvenli Restart**
```bash
# PM2 durumunu kontrol et
pm2 status

# Graceful restart (zero downtime)
pm2 reload hoowell-backend

# Eğer PM2 yoksa, normal restart
pm2 restart hoowell-backend

# PM2 loglarını kontrol et
pm2 logs hoowell-backend --lines 20

echo "✅ Backend yeniden başlatıldı!"
```

### B) **Health Check**
```bash
# Backend health check
curl -f http://localhost:5001/api/health || echo "❌ Backend başlatılamadı!"

# Database bağlantı testi
curl -f http://localhost:5001/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}' || echo "ℹ️ Test login (normal)"

echo "✅ Health check tamamlandı!"
```

---

## 🌐 **ADIM 6: MAINTENANCE MODE KAPAT**

### A) **Nginx Konfigürasyonunu Geri Yükle**
```bash
# Eski nginx config'i geri yükle
sudo cp /etc/nginx/sites-available/hoowell.backup /etc/nginx/sites-available/hoowell

# Nginx test
sudo nginx -t

# Nginx reload
sudo nginx -s reload

# Maintenance dosyasını sil
sudo rm /var/www/maintenance.html

echo "✅ Site tekrar aktif!"
```

### B) **Final Test**
```bash
# Site erişim testi
curl -I http://your-domain.com

# API test
curl http://your-domain.com/api/health

echo "✅ Deployment tamamlandı!"
```

---

## 📋 **ADIM 7: DEPLOYMENT SONRASI KONTROLLER**

### A) **Sistem Testleri**
```bash
# PM2 durumu
pm2 status

# Nginx durumu
sudo systemctl status nginx

# MySQL durumu
sudo systemctl status mysql

# Disk kullanımı
df -h

# Memory kullanımı
free -h
```

### B) **Fonksiyonel Testler**
- [ ] Ana sayfa yükleniyor
- [ ] Login sistemi çalışıyor
- [ ] Dashboard açılıyor
- [ ] Admin paneli erişilebilir
- [ ] Eğitim videoları açılıyor
- [ ] File upload çalışıyor
- [ ] Yasal sayfalar güncel

### C) **Veri Kontrolü**
```bash
# Kullanıcı verilerinin korunduğunu kontrol et
mysql -u root -p hoowell_network -e "
SELECT 
    id, username, first_name, last_name, sponsor_id, career_level, total_kkp, created_at
FROM users 
WHERE role = 'partner' 
ORDER BY created_at DESC 
LIMIT 10;
"
```

---

## 🔧 **OTOMATİK DEPLOYMENT SCRİPTİ**

### Tek Komutla Deployment:
```bash
#!/bin/bash
# auto_deploy.sh

echo "🚀 HOOWELL Otomatik Deployment Başlıyor..."

# Backup al
echo "📦 Backup alınıyor..."
mysqldump -u root -p hoowell_network > backup_$(date +%Y%m%d_%H%M%S).sql
tar -czf files_backup_$(date +%Y%m%d_%H%M%S).tar.gz . --exclude=node_modules

# Maintenance mode
echo "🔧 Maintenance mode aktif..."
# (maintenance code buraya)

# Git pull
echo "📥 Güncellemeler çekiliyor..."
git pull origin main

# Dependencies
echo "📦 Dependencies güncelleniyor..."
npm install
cd frontend && npm install && npm run build && cd ..

# Database migration
echo "🗄️ Database güncelleniyor..."
mysql -u root -p hoowell_network < deployment/safe_migration_fixed.sql

# Restart
echo "🔄 Uygulama yeniden başlatılıyor..."
pm2 reload hoowell-backend

# Maintenance mode kapat
echo "🌐 Site aktif ediliyor..."
# (maintenance mode kapatma kodu)

# Test
echo "✅ Final testler..."
curl -f http://localhost:5001/api/health

echo "🎉 Deployment tamamlandı!"
echo "🌐 Site: http://your-domain.com"
echo "📊 PM2: pm2 status"
echo "📝 Logs: pm2 logs"
```

---

## 🆘 **ACİL DURUM ROLLBACK PLANI**

### Hızlı Rollback (Sorun Durumunda):
```bash
#!/bin/bash
# rollback.sh

echo "🚨 ROLLBACK BAŞLATIYOR..."

# Git rollback
git reset --hard HEAD~1

# Database rollback
mysql -u root -p hoowell_network < backup_YYYYMMDD_HHMMSS.sql

# Dependencies rollback
npm install
cd frontend && npm install && npm run build && cd ..

# Restart
pm2 restart hoowell-backend

echo "✅ Rollback tamamlandı!"
```

---

## 📊 **DEPLOYMENT CHECKLİST**

### GitHub Push Öncesi:
- [ ] .gitignore kontrol edildi
- [ ] .env dosyası git'e eklenmedi
- [ ] .env.example oluşturuldu
- [ ] Tüm değişiklikler commit edildi
- [ ] GitHub'a push edildi

### Sunucu Deployment:
- [ ] SSH bağlantısı kuruldu
- [ ] Backup alındı (database + files)
- [ ] Maintenance mode aktif edildi
- [ ] Git pull yapıldı
- [ ] Dependencies güncellendi
- [ ] Frontend build edildi
- [ ] Database migration yapıldı
- [ ] PM2 restart edildi
- [ ] Health check geçti
- [ ] Maintenance mode kapatıldı

### Deployment Sonrası:
- [ ] Site erişilebilir
- [ ] Login sistemi çalışıyor
- [ ] Mevcut kullanıcı verileri korundu
- [ ] Yeni özellikler aktif
- [ ] Performance normal
- [ ] Error logları temiz

---

## 🎯 **SONUÇ**

Bu rehberi takip ederek:
- ✅ **Mevcut verilerinizi kaybetmeden** güncelleme yapabilirsiniz
- ✅ **Sıfır downtime** ile deployment gerçekleştirebilirsiniz
- ✅ **Güvenli rollback** imkanınız olur
- ✅ **Otomatik backup** sistemi çalışır

**Önemli:** Her deployment öncesi mutlaka backup alın ve test sunucusunda deneyin!

---
**📝 Son Güncelleme:** 07.08.2025 - Git Deployment Rehberi