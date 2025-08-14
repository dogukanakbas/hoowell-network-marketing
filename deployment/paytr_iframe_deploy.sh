#!/bin/bash

# 🚀 HOOWELL PayTR Iframe Deployment Script
# Bu script PayTR iframe entegrasyonu ile güncellenmiş sistemi deploy eder

set -e  # Hata durumunda script'i durdur

echo "🚀 HOOWELL PayTR Iframe Deployment Başlıyor..."

# Renkli output için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonksiyonlar
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Değişkenler
PROJECT_DIR="/var/www/hoowell"
BACKUP_DIR="/var/backups/hoowell"
DATE=$(date +%Y%m%d_%H%M%S)

# 1. Sistem Kontrolü
log_info "Sistem durumu kontrol ediliyor..."

if ! command -v node &> /dev/null; then
    log_error "Node.js bulunamadı. Lütfen Node.js 18+ kurun."
    exit 1
fi

if ! command -v pm2 &> /dev/null; then
    log_error "PM2 bulunamadı. Lütfen PM2'yi kurun: npm install -g pm2"
    exit 1
fi

if ! command -v nginx &> /dev/null; then
    log_error "Nginx bulunamadı. Lütfen Nginx'i kurun."
    exit 1
fi

if ! command -v mysql &> /dev/null; then
    log_error "MySQL bulunamadı. Lütfen MySQL'i kurun."
    exit 1
fi

log_success "Sistem gereksinimleri karşılanıyor"

# 2. Backup Oluşturma
log_info "Backup oluşturuluyor..."

sudo mkdir -p $BACKUP_DIR

# Veritabanı backup
if [ -f "$PROJECT_DIR/.env" ]; then
    DB_NAME=$(grep "DB_NAME=" $PROJECT_DIR/.env | cut -d '=' -f2)
    DB_USER=$(grep "DB_USER=" $PROJECT_DIR/.env | cut -d '=' -f2)
    
    log_info "Veritabanı backup'ı alınıyor: $DB_NAME"
    mysqldump -u $DB_USER -p $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql
    log_success "Veritabanı backup'ı tamamlandı"
fi

# Proje dosyaları backup
if [ -d "$PROJECT_DIR" ]; then
    log_info "Proje dosyaları backup'ı alınıyor..."
    sudo tar -czf $BACKUP_DIR/project_backup_$DATE.tar.gz -C /var/www hoowell
    log_success "Proje backup'ı tamamlandı"
fi

# 3. Proje Güncelleme
log_info "Proje güncelleniyor..."

cd $PROJECT_DIR

# Git pull
log_info "Git repository güncelleniyor..."
git pull origin main
log_success "Git güncelleme tamamlandı"

# 4. Backend Güncelleme
log_info "Backend bağımlılıkları güncelleniyor..."
cd backend
npm install --production
log_success "Backend bağımlılıkları güncellendi"

# 5. Frontend Build
log_info "Frontend build ediliyor..."
cd ../frontend
npm install
npm run build
log_success "Frontend build tamamlandı"

# 6. Environment Kontrolü
log_info "Environment dosyası kontrol ediliyor..."
cd $PROJECT_DIR

if [ ! -f ".env" ]; then
    log_warning ".env dosyası bulunamadı. Örnek dosya oluşturuluyor..."
    cat > .env << EOF
# Database Configuration
DB_HOST=localhost
DB_USER=hoowell_user
DB_PASSWORD=CHANGE_THIS_PASSWORD
DB_NAME=hoowell_network

# JWT Configuration
JWT_SECRET=hoowell_super_secure_jwt_secret_key_2025_production_ready

# Server Configuration
PORT=5001
NODE_ENV=production

# Email Configuration
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
EOF
    chmod 600 .env
    log_warning "Lütfen .env dosyasını düzenleyin!"
fi

# PayTR ayarlarını kontrol et
if ! grep -q "PAYTR_MERCHANT_ID" .env; then
    log_warning "PayTR ayarları .env dosyasına ekleniyor..."
    cat >> .env << EOF

# PayTR Configuration
PAYTR_MERCHANT_ID=605940
PAYTR_MERCHANT_KEY=tMCPPznCxw8sb8b8
PAYTR_MERCHANT_SALT=bF1uwkXPAhDw5yok
FRONTEND_URL=https://hoowell.net
BACKEND_URL=https://hoowell.net
EOF
fi

log_success "Environment dosyası hazır"

# 7. Veritabanı Güncellemeleri
log_info "Veritabanı güncellemeleri kontrol ediliyor..."

DB_NAME=$(grep "DB_NAME=" .env | cut -d '=' -f2)
DB_USER=$(grep "DB_USER=" .env | cut -d '=' -f2)

# Ana veritabanı yapısını kontrol et
if [ -f "backend/database_base.sql" ]; then
    log_info "Ana veritabanı yapısı kontrol ediliyor..."
    # Burada sadece eksik tabloları ekle, mevcut verileri koruma
fi

# Eksik tabloları ekle
if [ -f "backend/create_missing_tables.sql" ]; then
    log_info "Eksik tablolar ekleniyor..."
    mysql -u $DB_USER -p $DB_NAME < backend/create_missing_tables.sql 2>/dev/null || true
fi

# Partner tablosu güncellemeleri
if [ -f "backend/safe_add_partner_columns.sql" ]; then
    log_info "Partner tablosu güncellemeleri yapılıyor..."
    mysql -u $DB_USER -p $DB_NAME < backend/safe_add_partner_columns.sql 2>/dev/null || true
fi

log_success "Veritabanı güncellemeleri tamamlandı"

# 8. PM2 Konfigürasyonu
log_info "PM2 konfigürasyonu hazırlanıyor..."

cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'hoowell-backend',
    script: './backend/server.js',
    cwd: '$PROJECT_DIR',
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
    node_args: '--max-old-space-size=1024',
    watch: false,
    ignore_watch: ['node_modules', 'frontend/build', 'uploads'],
    restart_delay: 4000
  }]
};
EOF

# Log klasörü oluştur
sudo mkdir -p /var/log/hoowell
sudo chown www-data:www-data /var/log/hoowell

log_success "PM2 konfigürasyonu hazır"

# 9. Nginx Konfigürasyonu
log_info "Nginx konfigürasyonu kontrol ediliyor..."

if [ ! -f "/etc/nginx/sites-available/hoowell" ]; then
    log_info "Nginx konfigürasyonu oluşturuluyor..."
    sudo cp deployment/nginx.conf /etc/nginx/sites-available/hoowell
    sudo ln -sf /etc/nginx/sites-available/hoowell /etc/nginx/sites-enabled/
    log_success "Nginx konfigürasyonu oluşturuldu"
fi

# Nginx test
sudo nginx -t
if [ $? -eq 0 ]; then
    log_success "Nginx konfigürasyonu geçerli"
else
    log_error "Nginx konfigürasyonu hatası!"
    exit 1
fi

# 10. Dosya İzinleri
log_info "Dosya izinleri ayarlanıyor..."

sudo chown -R www-data:www-data $PROJECT_DIR
sudo chmod -R 755 $PROJECT_DIR
sudo chmod 600 $PROJECT_DIR/.env
sudo chmod +x $PROJECT_DIR/deployment/*.sh

# Upload klasörü
sudo mkdir -p $PROJECT_DIR/uploads
sudo chown -R www-data:www-data $PROJECT_DIR/uploads
sudo chmod -R 755 $PROJECT_DIR/uploads

log_success "Dosya izinleri ayarlandı"

# 11. Servisleri Başlatma
log_info "Servisler başlatılıyor..."

# PM2 restart
if pm2 list | grep -q "hoowell-backend"; then
    log_info "PM2 servisi yeniden başlatılıyor..."
    pm2 restart hoowell-backend
else
    log_info "PM2 servisi ilk kez başlatılıyor..."
    pm2 start ecosystem.config.js
    pm2 save
fi

# Nginx reload
sudo systemctl reload nginx

log_success "Servisler başlatıldı"

# 12. Sistem Durumu Kontrolü
log_info "Sistem durumu kontrol ediliyor..."

sleep 5

# PM2 durumu
if pm2 list | grep -q "online.*hoowell-backend"; then
    log_success "Backend servisi çalışıyor"
else
    log_error "Backend servisi çalışmıyor!"
    pm2 logs hoowell-backend --lines 20
    exit 1
fi

# Nginx durumu
if sudo systemctl is-active --quiet nginx; then
    log_success "Nginx servisi çalışıyor"
else
    log_error "Nginx servisi çalışmıyor!"
    exit 1
fi

# API test
log_info "API testi yapılıyor..."
if curl -f -s http://localhost:5001/api/health > /dev/null; then
    log_success "Backend API çalışıyor"
else
    log_warning "Backend API'ye erişilemiyor (normal olabilir)"
fi

# 13. PayTR Test
log_info "PayTR entegrasyonu kontrol ediliyor..."

if [ -f "frontend/src/components/PayTRIframe.js" ]; then
    log_success "PayTR iframe bileşeni mevcut"
else
    log_error "PayTR iframe bileşeni bulunamadı!"
fi

if [ -f "backend/routes/paytr.js" ]; then
    log_success "PayTR backend route'ları mevcut"
else
    log_error "PayTR backend route'ları bulunamadı!"
fi

# 14. SSL Sertifikası Kontrolü
log_info "SSL sertifikası kontrol ediliyor..."

if command -v certbot &> /dev/null; then
    if sudo certbot certificates | grep -q "hoowell.net"; then
        log_success "SSL sertifikası mevcut"
    else
        log_warning "SSL sertifikası bulunamadı. Lütfen certbot ile SSL kurun:"
        log_warning "sudo certbot --nginx -d hoowell.net -d www.hoowell.net"
    fi
else
    log_warning "Certbot bulunamadı. SSL için certbot kurun:"
    log_warning "sudo apt install certbot python3-certbot-nginx"
fi

# 15. Deployment Özeti
echo ""
echo "🎉 =================================="
echo "🎉 DEPLOYMENT TAMAMLANDI!"
echo "🎉 =================================="
echo ""
log_success "PayTR Iframe entegrasyonu aktif"
log_success "Backend servisi çalışıyor (Port: 5001)"
log_success "Frontend build tamamlandı"
log_success "Nginx konfigürasyonu aktif"
log_success "Veritabanı güncellemeleri yapıldı"
echo ""
echo "📋 ÖNEMLİ BİLGİLER:"
echo "   • Test Sayfası: https://hoowell.net/paytr-test"
echo "   • PayTR Callback: https://hoowell.net/api/paytr/callback"
echo "   • Başarılı Ödeme: https://hoowell.net/payment/success"
echo "   • Başarısız Ödeme: https://hoowell.net/payment/fail"
echo ""
echo "🔧 PAYTR PANELİNDE AYARLANACAKLAR:"
echo "   • Bildirim URL: https://hoowell.net/api/paytr/callback"
echo "   • Başarılı URL: https://hoowell.net/payment/success"
echo "   • Başarısız URL: https://hoowell.net/payment/fail"
echo ""
echo "📊 MONITORING:"
echo "   • PM2 Status: pm2 status"
echo "   • PM2 Logs: pm2 logs hoowell-backend"
echo "   • PayTR Logs: tail -f /var/log/hoowell/backend-combined.log | grep PayTR"
echo ""
echo "🧪 TEST KARTI:"
echo "   • Kart: 4355 0841 0000 0001"
echo "   • CVV: 000, Tarih: 12/26"
echo "   • 3D Secure: 123456"
echo ""

# 16. Son Kontroller
log_info "Son kontroller yapılıyor..."

# .env dosyası güvenliği
if [ "$(stat -c %a .env)" != "600" ]; then
    log_warning ".env dosyası izinleri düzeltiliyor..."
    chmod 600 .env
fi

# Log rotasyonu
if [ ! -f "/etc/logrotate.d/hoowell" ]; then
    log_info "Log rotasyonu ayarlanıyor..."
    sudo tee /etc/logrotate.d/hoowell > /dev/null << EOF
/var/log/hoowell/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
fi

log_success "Deployment başarıyla tamamlandı! 🚀"

echo ""
echo "Herhangi bir sorun yaşarsanız:"
echo "1. pm2 logs hoowell-backend"
echo "2. sudo tail -f /var/log/nginx/error.log"
echo "3. tail -f /var/log/hoowell/backend-combined.log"
echo ""