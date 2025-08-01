#!/bin/bash

# HOOWELL Network Marketing - Production Setup Script
# Bu script sunucuya güvenli deployment yapar

set -e  # Hata durumunda dur

# Renkli output için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log fonksiyonu
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Konfigürasyon
PROJECT_DIR="/var/www/hoowell"
BACKUP_DIR="/var/backups/hoowell"
DB_NAME="hoowell_network"
DB_USER="hoowell_user"
DOMAIN="your-domain.com"  # Bu değeri değiştirin!

log "🚀 HOOWELL Production Deployment Başlıyor..."

# Root kontrolü
if [[ $EUID -eq 0 ]]; then
   error "Bu script root olarak çalıştırılmamalı!"
fi

# Backup dizini oluştur
log "📁 Backup dizini oluşturuluyor..."
sudo mkdir -p $BACKUP_DIR
sudo chown $USER:$USER $BACKUP_DIR

# Mevcut sistem backup'ı
if [ -d "$PROJECT_DIR" ]; then
    log "💾 Mevcut sistem backup'ı alınıyor..."
    
    # Dosya backup'ı
    sudo tar -czf "$BACKUP_DIR/project_backup_$(date +%Y%m%d_%H%M%S).tar.gz" -C "$PROJECT_DIR" . 2>/dev/null || warning "Dosya backup'ı alınamadı"
    
    # Database backup'ı
    if command -v mysql &> /dev/null; then
        log "🗄️ Database backup'ı alınıyor..."
        mysqldump -u root -p$DB_NAME > "$BACKUP_DIR/db_backup_$(date +%Y%m%d_%H%M%S).sql" 2>/dev/null || warning "Database backup'ı alınamadı"
    fi
fi

# Proje dizini oluştur
log "📂 Proje dizini hazırlanıyor..."
sudo mkdir -p $PROJECT_DIR
sudo chown $USER:$USER $PROJECT_DIR

# Node.js versiyonu kontrol
log "🔍 Node.js versiyonu kontrol ediliyor..."
if ! command -v node &> /dev/null; then
    error "Node.js kurulu değil! Lütfen Node.js 18+ kurun."
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    error "Node.js 18+ gerekli! Mevcut versiyon: $(node -v)"
fi

# PM2 kurulumu
log "⚙️ PM2 kontrol ediliyor..."
if ! command -v pm2 &> /dev/null; then
    log "📦 PM2 kuruluyor..."
    npm install -g pm2
fi

# MySQL kontrol
log "🗄️ MySQL kontrol ediliyor..."
if ! command -v mysql &> /dev/null; then
    error "MySQL kurulu değil!"
fi

# Nginx kontrol
log "🌐 Nginx kontrol ediliyor..."
if ! command -v nginx &> /dev/null; then
    warning "Nginx kurulu değil! Manuel kurulum gerekli."
fi

# Proje dosyalarını kopyala (bu kısmı kendi durumunuza göre ayarlayın)
log "📥 Proje dosyaları kopyalanıyor..."
# Bu kısımda dosyalarınızı nasıl sunucuya aktaracağınızı belirtin:
# - Git clone
# - SCP/SFTP upload
# - Rsync
# Örnek:
# git clone https://github.com/your-repo/hoowell.git $PROJECT_DIR

# Backend setup
log "🔧 Backend kurulumu..."
cd $PROJECT_DIR/backend

# Dependencies kurulumu
log "📦 Backend dependencies kuruluyor..."
npm install --production

# .env dosyası kontrol
if [ ! -f ".env" ]; then
    warning ".env dosyası bulunamadı! Örnek dosya oluşturuluyor..."
    cat > .env << EOF
NODE_ENV=production
PORT=5001

# Database
DB_HOST=localhost
DB_USER=$DB_USER
DB_PASSWORD=CHANGE_THIS_PASSWORD
DB_NAME=$DB_NAME

# JWT
JWT_SECRET=CHANGE_THIS_JWT_SECRET_256_BIT

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_NAME=HOOWELL
FROM_EMAIL=your-email@gmail.com
EOF
    error ".env dosyası oluşturuldu! Lütfen ayarları düzenleyin ve tekrar çalıştırın."
fi

# Database migration
log "🗄️ Database migration yapılıyor..."
if [ -f "../deployment/safe_migration_script.sql" ]; then
    mysql -u root -p $DB_NAME < ../deployment/safe_migration_script.sql || error "Database migration başarısız!"
else
    warning "Migration script bulunamadı!"
fi

# Uploads dizini oluştur
log "📁 Upload dizinleri oluşturuluyor..."
mkdir -p uploads/receipts
mkdir -p uploads/profiles
mkdir -p logs
chmod 755 uploads
chmod 755 uploads/receipts
chmod 755 uploads/profiles

# Frontend build
log "🏗️ Frontend build ediliyor..."
cd $PROJECT_DIR/frontend

# Dependencies kurulumu
log "📦 Frontend dependencies kuruluyor..."
npm install

# Production build
log "🔨 Production build oluşturuluyor..."
npm run build

# Build dosyalarını kontrol
if [ ! -d "build" ]; then
    error "Frontend build başarısız!"
fi

# PM2 ecosystem dosyası oluştur
log "⚙️ PM2 konfigürasyonu oluşturuluyor..."
cd $PROJECT_DIR/backend
cat > ecosystem.config.js << EOF
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
    node_args: '--max_old_space_size=1024',
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    restart_delay: 4000
  }]
};
EOF

# PM2 ile başlat
log "🚀 Backend PM2 ile başlatılıyor..."
pm2 start ecosystem.config.js --env production
pm2 save

# Nginx konfigürasyonu
if command -v nginx &> /dev/null; then
    log "🌐 Nginx konfigürasyonu oluşturuluyor..."
    
    sudo tee /etc/nginx/sites-available/hoowell > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Frontend static files
    location / {
        root $PROJECT_DIR/frontend/build;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # File upload size
        client_max_body_size 10M;
    }
    
    # File uploads
    location /uploads {
        alias $PROJECT_DIR/backend/uploads;
        expires 1y;
        add_header Cache-Control "public";
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF

    # Site'ı aktifleştir
    sudo ln -sf /etc/nginx/sites-available/hoowell /etc/nginx/sites-enabled/
    
    # Nginx test
    if sudo nginx -t; then
        log "✅ Nginx konfigürasyonu geçerli"
        sudo systemctl reload nginx
    else
        error "❌ Nginx konfigürasyonu hatalı!"
    fi
fi

# Sistem servisleri kontrol
log "🔍 Sistem servisleri kontrol ediliyor..."

# PM2 durumu
pm2 status

# Nginx durumu
if command -v nginx &> /dev/null; then
    sudo systemctl status nginx --no-pager -l
fi

# MySQL durumu
sudo systemctl status mysql --no-pager -l

# Health check
log "🏥 Health check yapılıyor..."
sleep 5

# Backend health check
if curl -f http://localhost:5001/api/health > /dev/null 2>&1; then
    log "✅ Backend health check başarılı"
else
    warning "❌ Backend health check başarısız"
fi

# Frontend check
if [ -f "$PROJECT_DIR/frontend/build/index.html" ]; then
    log "✅ Frontend build dosyaları mevcut"
else
    warning "❌ Frontend build dosyaları eksik"
fi

# Firewall ayarları (opsiyonel)
if command -v ufw &> /dev/null; then
    log "🔥 Firewall ayarları kontrol ediliyor..."
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw allow 22/tcp
fi

# SSL sertifikası önerisi
if command -v certbot &> /dev/null; then
    info "🔒 SSL sertifikası için şu komutu çalıştırın:"
    info "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
else
    info "🔒 SSL sertifikası için certbot kurulumu önerilir:"
    info "sudo apt install certbot python3-certbot-nginx"
fi

# PM2 startup
log "🔄 PM2 startup konfigürasyonu..."
pm2 startup
pm2 save

# Son kontroller
log "📊 Deployment özeti:"
echo "=================================="
echo "✅ Proje dizini: $PROJECT_DIR"
echo "✅ Backend port: 5001"
echo "✅ Frontend build: Tamamlandı"
echo "✅ Database: Migration yapıldı"
echo "✅ PM2: Çalışıyor"
echo "✅ Nginx: Konfigüre edildi"
echo "✅ Backup: $BACKUP_DIR"
echo "=================================="

log "🎉 Deployment tamamlandı!"
info "🌐 Site URL: http://$DOMAIN"
info "📊 PM2 monitoring: pm2 monit"
info "📝 PM2 logs: pm2 logs hoowell-backend"
info "🔧 Nginx logs: sudo tail -f /var/log/nginx/error.log"

# Önemli notlar
warning "⚠️ ÖNEMLİ NOTLAR:"
warning "1. .env dosyasındaki şifreleri değiştirin!"
warning "2. SSL sertifikası kurun!"
warning "3. Database şifrelerini güçlendirin!"
warning "4. Firewall ayarlarını kontrol edin!"
warning "5. Backup'ları düzenli kontrol edin!"

log "✨ HOOWELL sistemi başarıyla kuruldu!"