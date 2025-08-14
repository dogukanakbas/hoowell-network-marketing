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
        location ~* \.(js|css|png|jpg|jpeg|gif|