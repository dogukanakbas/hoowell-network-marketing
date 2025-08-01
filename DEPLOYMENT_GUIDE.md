# 🚀 SUNUCU DEPLOYMENT REHBERİ

## 📅 Tarih: 08.01.2025
## 🎯 Mevcut Verileri Kaybetmeden Güvenli Kurulum

### ⚠️ **ÖNEMLİ UYARILAR**
- Bu işlemler sırasında **mutlaka backup alın**
- **Önce test sunucusunda** deneyin
- **Maintenance modu** açın
- **Veritabanı yedeği** alın

---

## 📋 **DEPLOYMENT ÖNCESİ HAZIRLIK**

### 1. **Mevcut Sistem Analizi**
```bash
# Sunucuda mevcut durumu kontrol edin:
mysql -u root -p -e "SHOW DATABASES;"
mysql -u root -p hoowell_network -e "SHOW TABLES;"
mysql -u root -p hoowell_network -e "SELECT COUNT(*) FROM users;"
```

### 2. **Backup Alma (KRİTİK!)**
```bash
# Tam veritabanı yedeği
mysqldump -u root -p hoowell_network > backup_$(date +%Y%m%d_%H%M%S).sql

# Sadece veri yedeği (yapı hariç)
mysqldump -u root -p --no-create-info hoowell_network > data_backup_$(date +%Y%m%d_%H%M%S).sql

# Sadece yapı yedeği (veri hariç)
mysqldump -u root -p --no-data hoowell_network > structure_backup_$(date +%Y%m%d_%H%M%S).sql
```

### 3. **Dosya Yedeği**
```bash
# Mevcut proje dosyalarını yedekle
tar -czf project_backup_$(date +%Y%m%d_%H%M%S).tar.gz /path/to/current/project
```

---

## 🔧 **DEPLOYMENT ADIMLARI**

### ADIM 1: Sunucu Hazırlığı

#### A) **Node.js ve Dependencies**
```bash
# Node.js versiyonu kontrol
node --version  # v18+ olmalı
npm --version

# PM2 kurulumu (production için)
npm install -g pm2

# MySQL kontrol
mysql --version
```

#### B) **Proje Dizini Oluşturma**
```bash
# Ana dizin oluştur
sudo mkdir -p /var/www/hoowell
sudo chown $USER:$USER /var/www/hoowell
cd /var/www/hoowell

# Git clone (eğer git kullanıyorsanız)
git clone <your-repo-url> .

# Veya dosyaları upload edin
```

### ADIM 2: Backend Kurulumu

#### A) **Dependencies Kurulumu**
```bash
cd /var/www/hoowell/backend
npm install

# Production dependencies
npm install --production
```

#### B) **Environment Ayarları**
```bash
# .env dosyasını oluştur
cp .env.example .env
nano .env
```

```env
# Production .env ayarları:
NODE_ENV=production
PORT=5001

# Database
DB_HOST=localhost
DB_USER=hoowell_user
DB_PASSWORD=GÜÇLÜ_ŞİFRE_BURAYA
DB_NAME=hoowell_network

# JWT
JWT_SECRET=PRODUCTION_JWT_SECRET_256_BIT_KEY

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_NAME=HOOWELL
FROM_EMAIL=your-email@gmail.com
```

### ADIM 3: Veritabanı Güvenli Güncelleme

#### A) **Mevcut Veritabanı Kontrolü**
```sql
-- Mevcut tabloları listele
SHOW TABLES;

-- Kullanıcı sayısını kontrol et
SELECT COUNT(*) as user_count FROM users;

-- Mevcut yapıyı kontrol et
DESCRIBE users;
```

#### B) **Güvenli Tablo Güncelleme**
```sql
-- Önce yedek al
CREATE TABLE users_backup AS SELECT * FROM users;

-- Eksik kolonları ekle (eğer yoksa)
ALTER TABLE users ADD COLUMN IF NOT EXISTS education_deadline TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS education_started_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS payment_blocked BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS payment_pending BOOLEAN DEFAULT FALSE;

-- Eksik tabloları oluştur
SOURCE /var/www/hoowell/backend/create_missing_tables.sql;
```

### ADIM 4: Frontend Build

#### A) **React Build**
```bash
cd /var/www/hoowell/frontend

# Dependencies kurulumu
npm install

# Production build
npm run build

# Build dosyalarını kontrol et
ls -la build/
```

#### B) **Static Files Ayarı**
```bash
# Nginx için static files
sudo cp -r build/* /var/www/hoowell/public/

# Veya Express static serving
# Backend'de static middleware eklenecek
```

### ADIM 5: Nginx Konfigürasyonu

#### A) **Nginx Site Konfigürasyonu**
```bash
sudo nano /etc/nginx/sites-available/hoowell
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Frontend static files
    location / {
        root /var/www/hoowell/frontend/build;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout ayarları
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # File uploads
    location /uploads {
        alias /var/www/hoowell/backend/uploads;
        expires 1y;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

#### B) **Site Aktifleştirme**
```bash
# Site'ı aktifleştir
sudo ln -s /etc/nginx/sites-available/hoowell /etc/nginx/sites-enabled/

# Nginx test
sudo nginx -t

# Nginx restart
sudo systemctl restart nginx
```

### ADIM 6: SSL Sertifikası (Let's Encrypt)

```bash
# Certbot kurulumu
sudo apt install certbot python3-certbot-nginx

# SSL sertifikası al
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Otomatik yenileme test
sudo certbot renew --dry-run
```

### ADIM 7: PM2 ile Production Başlatma

#### A) **PM2 Konfigürasyonu**
```bash
cd /var/www/hoowell/backend
```

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'hoowell-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max_old_space_size=1024'
  }]
};
```

#### B) **PM2 Başlatma**
```bash
# Logs dizini oluştur
mkdir -p logs

# PM2 ile başlat
pm2 start ecosystem.config.js --env production

# PM2 durumunu kontrol et
pm2 status

# PM2 logları
pm2 logs

# Sistem başlangıcında otomatik başlatma
pm2 startup
pm2 save
```

---

## 🔄 **VERİ MİGRASYONU (Mevcut Veriler İçin)**

### 1. **Güvenli Veri Aktarımı**

#### A) **Kullanıcı Verilerini Koru**
```sql
-- Mevcut kullanıcıları kontrol et
SELECT id, username, email, first_name, last_name, sponsor_id, career_level, total_kkp 
FROM users 
WHERE role = 'partner' 
ORDER BY created_at;

-- Eksik kolonları güvenli şekilde ekle
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS education_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS backoffice_access BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS education_deadline TIMESTAMP NULL;

-- Mevcut kullanıcılar için varsayılan değerler
UPDATE users 
SET education_completed = TRUE, 
    backoffice_access = TRUE 
WHERE role = 'partner' AND created_at < DATE_SUB(NOW(), INTERVAL 1 DAY);
```

#### B) **Yeni Tabloları Oluştur**
```sql
-- Eksik tabloları oluştur (sadece yoksa)
SOURCE /var/www/hoowell/backend/create_missing_tables.sql;

-- Mevcut kullanıcılar için profil oluştur
INSERT IGNORE INTO user_profiles (user_id, join_date, total_sales, team_size, is_active_this_month)
SELECT id, created_at, 0, 0, FALSE 
FROM users 
WHERE role = 'partner';
```

### 2. **Veri Tutarlılığı Kontrolü**
```sql
-- Kontrol sorguları
SELECT 
    COUNT(*) as total_users,
    SUM(CASE WHEN education_completed = 1 THEN 1 ELSE 0 END) as completed_education,
    SUM(CASE WHEN backoffice_access = 1 THEN 1 ELSE 0 END) as has_backoffice
FROM users 
WHERE role = 'partner';

-- Eksik profilleri kontrol et
SELECT u.id, u.username 
FROM users u 
LEFT JOIN user_profiles up ON u.id = up.user_id 
WHERE u.role = 'partner' AND up.user_id IS NULL;
```

---

## 🧪 **DEPLOYMENT SONRASI TEST**

### 1. **Sistem Testleri**
```bash
# Backend health check
curl http://your-domain.com/api/health

# Database bağlantı testi
curl http://your-domain.com/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'

# Frontend yükleme testi
curl -I http://your-domain.com
```

### 2. **Fonksiyonel Testler**
- ✅ Kullanıcı girişi
- ✅ Dashboard yüklenmesi
- ✅ Komisyon sayfaları
- ✅ Eğitim sistemi
- ✅ Admin paneli
- ✅ File upload

### 3. **Performance Testleri**
```bash
# PM2 monitoring
pm2 monit

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# MySQL process list
mysql -u root -p -e "SHOW PROCESSLIST;"
```

---

## 🔧 **DEPLOYMENT SCRIPT'İ**

### Otomatik Deployment Script'i:
```bash
#!/bin/bash
# deploy.sh

echo "🚀 HOOWELL Deployment Başlıyor..."

# Backup al
echo "📦 Backup alınıyor..."
mysqldump -u root -p hoowell_network > backup_$(date +%Y%m%d_%H%M%S).sql

# Git pull (eğer git kullanıyorsanız)
echo "📥 Kod güncelleniyor..."
git pull origin main

# Backend dependencies
echo "📦 Backend dependencies kuruluyor..."
cd backend && npm install --production

# Frontend build
echo "🏗️ Frontend build ediliyor..."
cd ../frontend && npm install && npm run build

# Database migration
echo "🗄️ Database güncelleniyor..."
cd ../backend
mysql -u root -p hoowell_network < create_missing_tables.sql

# PM2 restart
echo "🔄 Backend yeniden başlatılıyor..."
pm2 restart hoowell-backend

# Nginx reload
echo "🌐 Nginx yeniden yükleniyor..."
sudo nginx -s reload

echo "✅ Deployment tamamlandı!"
echo "🌐 Site: http://your-domain.com"
echo "📊 PM2 Status: pm2 status"
echo "📝 Logs: pm2 logs"
```

---

## 📋 **DEPLOYMENT CHECKLİST**

### Deployment Öncesi:
- [ ] Backup alındı (database + files)
- [ ] .env dosyası hazırlandı
- [ ] Domain DNS ayarları yapıldı
- [ ] SSL sertifikası hazır
- [ ] Sunucu gereksinimleri karşılandı

### Deployment Sırasında:
- [ ] Dependencies kuruldu
- [ ] Database migration yapıldı
- [ ] Frontend build edildi
- [ ] Nginx konfigüre edildi
- [ ] PM2 başlatıldı

### Deployment Sonrası:
- [ ] Health check testleri geçti
- [ ] Kullanıcı girişi test edildi
- [ ] Komisyon sayfaları çalışıyor
- [ ] File upload çalışıyor
- [ ] Email gönderimi test edildi
- [ ] Performance monitoring aktif

---

## 🆘 **SORUN GİDERME**

### Yaygın Sorunlar:

#### 1. **Database Bağlantı Hatası**
```bash
# MySQL servis kontrolü
sudo systemctl status mysql

# Kullanıcı izinleri
mysql -u root -p -e "GRANT ALL PRIVILEGES ON hoowell_network.* TO 'hoowell_user'@'localhost';"
```

#### 2. **PM2 Başlatma Sorunu**
```bash
# PM2 logları kontrol et
pm2 logs hoowell-backend

# Port kullanımı kontrol et
sudo netstat -tlnp | grep :5001
```

#### 3. **Nginx 502 Bad Gateway**
```bash
# Backend çalışıyor mu?
curl http://localhost:5001/api/health

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

#### 4. **File Upload Sorunu**
```bash
# Upload dizini izinleri
sudo chown -R www-data:www-data /var/www/hoowell/backend/uploads
sudo chmod -R 755 /var/www/hoowell/backend/uploads
```

---

## 🎯 **SONUÇ**

Bu rehberi takip ederek:
- ✅ **Mevcut verilerinizi kaybetmeden** deployment yapabilirsiniz
- ✅ **Production-ready** kurulum elde edersiniz
- ✅ **Güvenli ve performanslı** sistem çalıştırırsınız
- ✅ **Monitoring ve backup** sistemi kurarsınız

**Önemli:** Her adımı dikkatli takip edin ve mutlaka backup alın!

---
**📝 Son Güncelleme:** 08.01.2025 - Production Deployment Rehberi