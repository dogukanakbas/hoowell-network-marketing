# 🚀 HOOWELL PayTR Iframe Entegrasyonu - Sunucu Kurulum Rehberi

## 📋 Sistem Gereksinimleri

- **Ubuntu 20.04+** veya **CentOS 8+**
- **Node.js 18+**
- **MySQL 8.0+**
- **Nginx**
- **PM2** (Process Manager)
- **SSL Sertifikası** (Let's Encrypt)
- **Git**

## 🔧 1. Sunucu Hazırlığı

### Sistem Güncellemesi
```bash
sudo apt update && sudo apt upgrade -y
```

### Gerekli Paketlerin Kurulumu
```bash
sudo apt install -y curl wget git nginx mysql-server
```

### Node.js 18 Kurulumu
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### PM2 Kurulumu
```bash
sudo npm install -g pm2
```

## 🗄️ 2. MySQL Veritabanı Kurulumu

### MySQL Güvenlik Ayarları
```bash
sudo mysql_secure_installation
```

### Veritabanı ve Kullanıcı Oluşturma
```sql
sudo mysql -u root -p

CREATE DATABASE hoowell_network CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'hoowell_user'@'localhost' IDENTIFIED BY 'güçlü_şifre_buraya';
GRANT ALL PRIVILEGES ON hoowell_network.* TO 'hoowell_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 📁 3. Proje Dosyalarının Kurulumu

### Proje Klonlama
```bash
cd /var/www
sudo git clone https://github.com/kullanici/hoowell_son.git hoowell
sudo chown -R $USER:$USER /var/www/hoowell
cd /var/www/hoowell
```

### Backend Bağımlılıkları
```bash
cd backend
npm install
```

### Frontend Build
```bash
cd ../frontend
npm install
npm run build
```

## ⚙️ 4. Environment Ayarları

### Backend .env Dosyası
```bash
cd /var/www/hoowell
nano .env
```

```env
# Database Configuration
DB_HOST=localhost
DB_USER=hoowell_user
DB_PASSWORD=güçlü_şifre_buraya
DB_NAME=hoowell_network

# JWT Configuration
JWT_SECRET=hoowell_super_secure_jwt_secret_key_2025_production_ready

# Server Configuration
PORT=5001
NODE_ENV=production

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_NAME=HOOWELL
FROM_EMAIL=your-email@gmail.com

# PayTR Configuration
PAYTR_MERCHANT_ID=605940
PAYTR_MERCHANT_KEY=tMCPPznCxw8sb8b8
PAYTR_MERCHANT_SALT=bF1uwkXPAhDw5yok

# URL Configuration
FRONTEND_URL=https://hoowell.net
BACKEND_URL=https://hoowell.net
```

### Dosya İzinleri
```bash
chmod 600 .env
sudo chown www-data:www-data .env
```

## 🗃️ 5. Veritabanı Tabloları

### Ana Veritabanı Yapısı
```bash
cd /var/www/hoowell/backend
mysql -u hoowell_user -p hoowell_network < database_base.sql
```

### Eksik Tabloları Ekleme
```bash
mysql -u hoowell_user -p hoowell_network < create_missing_tables.sql
```

### Partner Tablosu Güncellemeleri
```bash
mysql -u hoowell_user -p hoowell_network < safe_add_partner_columns.sql
```

## 🔄 6. PM2 ile Servis Kurulumu

### PM2 Ecosystem Dosyası
```bash
nano /var/www/hoowell/ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'hoowell-backend',
    script: './backend/server.js',
    cwd: '/var/www/hoowell',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5001
    },
    error_file: '/var/log/hoowell/backend-error.log',
    out_file: '/var/log/hoowell/backend-out.log',
    log_file: '/var/log/hoowell/backend-combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

### Log Klasörü Oluşturma
```bash
sudo mkdir -p /var/log/hoowell
sudo chown www-data:www-data /var/log/hoowell
```

### PM2 Servisini Başlatma
```bash
cd /var/www/hoowell
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🌐 7. Nginx Konfigürasyonu

### Nginx Konfigürasyon Dosyası
```bash
sudo nano /etc/nginx/sites-available/hoowell
```

```nginx
server {
    listen 80;
    server_name hoowell.net www.hoowell.net;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name hoowell.net www.hoowell.net;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/hoowell.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hoowell.net/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'; frame-src 'self' https://www.paytr.com;" always;

    # Frontend (React Build)
    location / {
        root /var/www/hoowell/frontend/build;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        
        # PayTR Callback için özel ayarlar
        location /api/paytr/callback {
            proxy_pass http://localhost:5001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 60s;
            proxy_connect_timeout 30s;
            
            # PayTR IP'lerinden gelen istekleri kabul et
            allow 185.233.134.0/24;
            allow 185.233.135.0/24;
            allow all; # Test için, production'da sadece PayTR IP'leri
        }
    }

    # File uploads
    location /uploads/ {
        root /var/www/hoowell;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    location /api/ {
        limit_req zone=api burst=20 nodelay;
    }
}
```

### Site Aktifleştirme
```bash
sudo ln -s /etc/nginx/sites-available/hoowell /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 8. SSL Sertifikası (Let's Encrypt)

### Certbot Kurulumu
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### SSL Sertifikası Alma
```bash
sudo certbot --nginx -d hoowell.net -d www.hoowell.net
```

### Otomatik Yenileme
```bash
sudo crontab -e
# Aşağıdaki satırı ekleyin:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔥 9. Firewall Ayarları

### UFW Kurulumu ve Ayarları
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 3306 # MySQL (sadece localhost için)
sudo ufw status
```

## 📊 10. Monitoring ve Loglar

### PM2 Monitoring
```bash
pm2 monit
pm2 logs hoowell-backend
```

### Nginx Logları
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### PayTR Callback Logları
```bash
tail -f /var/log/hoowell/backend-combined.log | grep "PayTR"
```

## 🧪 11. PayTR Test Ayarları

### PayTR Panel Ayarları
1. **Mağaza Paneli:** https://www.paytr.com/magaza
2. **Bildirim URL'i:** `https://hoowell.net/api/paytr/callback`
3. **Başarılı Ödeme URL'i:** `https://hoowell.net/payment/success`
4. **Başarısız Ödeme URL'i:** `https://hoowell.net/payment/fail`

### Test Kartı Bilgileri
```
Kart Numarası: 4355 0841 0000 0001
Son Kullanma: 12/26
CVV: 000
3D Secure Şifre: 123456
```

### Test Sayfası
```
https://hoowell.net/paytr-test
```

## 🔄 12. Güncelleme Prosedürü

### Güvenli Güncelleme
```bash
cd /var/www/hoowell

# Backup
sudo mysqldump -u hoowell_user -p hoowell_network > backup_$(date +%Y%m%d_%H%M%S).sql

# Git pull
git pull origin main

# Backend güncelleme
cd backend && npm install

# Frontend build
cd ../frontend && npm install && npm run build

# PM2 restart
pm2 restart hoowell-backend

# Nginx reload
sudo systemctl reload nginx
```

## 🚨 13. Sorun Giderme

### Backend Çalışmıyor
```bash
pm2 logs hoowell-backend
pm2 restart hoowell-backend
```

### PayTR Callback Çalışmıyor
```bash
# Callback loglarını kontrol et
tail -f /var/log/hoowell/backend-combined.log | grep "PayTR"

# Nginx access loglarını kontrol et
sudo tail -f /var/log/nginx/access.log | grep "paytr"
```

### Veritabanı Bağlantı Sorunu
```bash
mysql -u hoowell_user -p hoowell_network
# Bağlantı testini yap
```

## ✅ 14. Kurulum Kontrolü

### Sistem Durumu Kontrolü
```bash
# PM2 durumu
pm2 status

# Nginx durumu
sudo systemctl status nginx

# MySQL durumu
sudo systemctl status mysql

# SSL sertifikası kontrolü
sudo certbot certificates
```

### API Test
```bash
curl -X GET https://hoowell.net/api/health
curl -X POST https://hoowell.net/api/paytr/callback -d "test=1"
```

## 🎯 15. PayTR Iframe Özellikleri

✅ **Iframe Entegrasyonu:** PayTR ödeme sayfası iframe içinde açılıyor
✅ **Responsive Tasarım:** Mobil ve desktop uyumlu
✅ **Güvenli Callback:** Hash doğrulaması ile güvenli bildirim
✅ **Otomatik Yeniden Boyutlandırma:** Iframe otomatik boyutlanıyor
✅ **Hata Yönetimi:** Tüm hatalar yakalanıyor ve loglanıyor
✅ **Test Desteği:** Test kartı ile kolay test imkanı

## 🔐 16. Güvenlik Kontrol Listesi

- [ ] SSL sertifikası aktif
- [ ] Firewall kuralları ayarlandı
- [ ] PayTR callback IP kısıtlaması
- [ ] Database şifreleri güçlü
- [ ] .env dosyası korunuyor
- [ ] Nginx güvenlik başlıkları
- [ ] Rate limiting aktif
- [ ] Log dosyaları korunuyor

---

## 🎉 Kurulum Tamamlandı!

PayTR iframe entegrasyonu ile HOOWELL sistemi başarıyla kuruldu. Artık kullanıcılar güvenli iframe içinde ödeme yapabilir ve sistem otomatik olarak ödemeleri işleyecektir.

**Test URL:** https://hoowell.net/paytr-test
**Ana Site:** https://hoowell.net

Herhangi bir sorun yaşarsanız logları kontrol edin ve gerekirse PM2 servisini yeniden başlatın.