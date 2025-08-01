#!/bin/bash

# HOOWELL Network Marketing - Hızlı Deployment Script
# Mevcut verileri kaybetmeden sunucuya kurulum

set -e  # Hata durumunda dur

echo "🚀 HOOWELL Deployment Başlıyor..."
echo "📅 Tarih: $(date)"
echo "👤 Kullanıcı: $(whoami)"
echo "📍 Dizin: $(pwd)"

# Renkli output için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonksiyonlar
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Gereksinimler kontrolü
check_requirements() {
    log_info "Sistem gereksinimleri kontrol ediliyor..."
    
    # Node.js kontrolü
    if ! command -v node &> /dev/null; then
        log_error "Node.js bulunamadı. Lütfen Node.js 18+ kurun."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js versiyonu çok eski. En az v18 gerekli."
        exit 1
    fi
    log_success "Node.js $(node -v) ✓"
    
    # MySQL kontrolü
    if ! command -v mysql &> /dev/null; then
        log_error "MySQL bulunamadı. Lütfen MySQL 8+ kurun."
        exit 1
    fi
    log_success "MySQL $(mysql --version | awk '{print $3}') ✓"
    
    # PM2 kontrolü
    if ! command -v pm2 &> /dev/null; then
        log_warning "PM2 bulunamadı. Kuruluyor..."
        npm install -g pm2
    fi
    log_success "PM2 $(pm2 -v) ✓"
    
    # Nginx kontrolü
    if ! command -v nginx &> /dev/null; then
        log_warning "Nginx bulunamadı. Lütfen Nginx kurun."
    else
        log_success "Nginx $(nginx -v 2>&1 | awk '{print $3}') ✓"
    fi
}

# Backup alma
create_backup() {
    log_info "Backup alınıyor..."
    
    BACKUP_DIR="backups"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    
    mkdir -p $BACKUP_DIR
    
    # Database backup
    if mysql -u root -p -e "USE hoowell_network;" 2>/dev/null; then
        log_info "Mevcut database backup alınıyor..."
        mysqldump -u root -p hoowell_network > "$BACKUP_DIR/database_backup_$TIMESTAMP.sql"
        log_success "Database backup: $BACKUP_DIR/database_backup_$TIMESTAMP.sql"
    else
        log_warning "Mevcut database bulunamadı. Yeni kurulum yapılacak."
    fi
    
    # Files backup
    if [ -d "backend" ] && [ -d "frontend" ]; then
        log_info "Proje dosyaları backup alınıyor..."
        tar -czf "$BACKUP_DIR/files_backup_$TIMESTAMP.tar.gz" backend frontend uploads 2>/dev/null || true
        log_success "Files backup: $BACKUP_DIR/files_backup_$TIMESTAMP.tar.gz"
    fi
}

# Dependencies kurulumu
install_dependencies() {
    log_info "Dependencies kuruluyor..."
    
    # Root dependencies
    if [ -f "package.json" ]; then
        npm install
        log_success "Root dependencies kuruldu"
    fi
    
    # Backend dependencies
    if [ -d "backend" ]; then
        cd backend
        npm install --production
        cd ..
        log_success "Backend dependencies kuruldu"
    fi
    
    # Frontend dependencies
    if [ -d "frontend" ]; then
        cd frontend
        npm install
        cd ..
        log_success "Frontend dependencies kuruldu"
    fi
}

# Database setup
setup_database() {
    log_info "Database kuruluyor..."
    
    # Database oluştur
    mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS hoowell_network;"
    
    # Base schema yükle
    if [ -f "backend/database_base.sql" ]; then
        mysql -u root -p hoowell_network < backend/database_base.sql
        log_success "Base schema yüklendi"
    fi
    
    # Güvenli migration çalıştır
    if [ -f "deployment/safe_migration_script.sql" ]; then
        mysql -u root -p hoowell_network < deployment/safe_migration_script.sql
        log_success "Migration tamamlandı"
    fi
    
    # Eksik tabloları ekle
    if [ -f "backend/create_missing_tables.sql" ]; then
        mysql -u root -p hoowell_network < backend/create_missing_tables.sql
        log_success "Eksik tablolar eklendi"
    fi
}

# Environment setup
setup_environment() {
    log_info "Environment ayarları yapılıyor..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            log_warning ".env dosyası .env.example'dan kopyalandı. Lütfen düzenleyin!"
        else
            log_error ".env dosyası bulunamadı!"
            exit 1
        fi
    fi
    
    log_success "Environment ayarları hazır"
}

# Frontend build
build_frontend() {
    log_info "Frontend build ediliyor..."
    
    if [ -d "frontend" ]; then
        cd frontend
        npm run build
        cd ..
        log_success "Frontend build tamamlandı"
        
        # Build dosyalarını kontrol et
        if [ -d "frontend/build" ]; then
            log_success "Build dosyaları oluşturuldu: $(du -sh frontend/build | cut -f1)"
        else
            log_error "Build dosyaları oluşturulamadı!"
            exit 1
        fi
    else
        log_error "Frontend dizini bulunamadı!"
        exit 1
    fi
}

# PM2 setup
setup_pm2() {
    log_info "PM2 konfigürasyonu yapılıyor..."
    
    # PM2 ecosystem dosyası oluştur
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'hoowell-backend',
    script: 'backend/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 5001
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
    ignore_watch: ['node_modules', 'logs', 'uploads']
  }]
};
EOF
    
    # Logs dizini oluştur
    mkdir -p logs
    
    # PM2 başlat
    pm2 delete hoowell-backend 2>/dev/null || true
    pm2 start ecosystem.config.js --env production
    
    log_success "PM2 başlatıldı"
    
    # PM2 durumunu göster
    pm2 status
}

# Nginx konfigürasyonu
setup_nginx() {
    log_info "Nginx konfigürasyonu öneriliyor..."
    
    cat > nginx_hoowell.conf << 'EOF'
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
}
EOF
    
    log_success "Nginx konfigürasyonu oluşturuldu: nginx_hoowell.conf"
    log_warning "Bu dosyayı /etc/nginx/sites-available/ dizinine kopyalayın"
    log_warning "Sonra: sudo ln -s /etc/nginx/sites-available/hoowell /etc/nginx/sites-enabled/"
}

# Health check
health_check() {
    log_info "Sistem sağlık kontrolü yapılıyor..."
    
    # Backend health check
    sleep 5  # PM2'nin başlaması için bekle
    
    if curl -f http://localhost:5001/api/health 2>/dev/null; then
        log_success "Backend sağlıklı çalışıyor"
    else
        log_warning "Backend health check başarısız. PM2 loglarını kontrol edin: pm2 logs"
    fi
    
    # Database connection check
    if mysql -u root -p hoowell_network -e "SELECT 1;" 2>/dev/null; then
        log_success "Database bağlantısı başarılı"
    else
        log_warning "Database bağlantısı başarısız"
    fi
    
    # PM2 status
    log_info "PM2 Status:"
    pm2 status
}

# Deployment özeti
deployment_summary() {
    echo ""
    echo "🎉 DEPLOYMENT TAMAMLANDI!"
    echo "=========================="
    echo ""
    echo "📊 Sistem Durumu:"
    echo "  • Backend: PM2 cluster mode"
    echo "  • Frontend: Production build"
    echo "  • Database: Migration tamamlandı"
    echo "  • Backup: backups/ dizininde"
    echo ""
    echo "🌐 Erişim:"
    echo "  • Backend API: http://localhost:5001"
    echo "  • Health Check: http://localhost:5001/api/health"
    echo "  • Frontend: Nginx konfigürasyonu gerekli"
    echo ""
    echo "🔧 Yönetim Komutları:"
    echo "  • PM2 Status: pm2 status"
    echo "  • PM2 Logs: pm2 logs hoowell-backend"
    echo "  • PM2 Restart: pm2 restart hoowell-backend"
    echo "  • PM2 Stop: pm2 stop hoowell-backend"
    echo ""
    echo "📋 Sonraki Adımlar:"
    echo "  1. .env dosyasını production ayarlarıyla güncelleyin"
    echo "  2. nginx_hoowell.conf dosyasını Nginx'e ekleyin"
    echo "  3. SSL sertifikası kurun (Let's Encrypt önerilir)"
    echo "  4. Domain DNS ayarlarını yapın"
    echo "  5. Firewall ayarlarını kontrol edin"
    echo ""
    echo "🆘 Sorun Durumunda:"
    echo "  • PM2 Logs: pm2 logs"
    echo "  • Backend Test: curl http://localhost:5001/api/health"
    echo "  • Database Test: mysql -u root -p hoowell_network -e 'SELECT 1;'"
    echo ""
}

# Ana deployment fonksiyonu
main() {
    echo "🚀 HOOWELL Network Marketing Deployment"
    echo "======================================="
    echo ""
    
    # Kullanıcı onayı
    read -p "Deployment'ı başlatmak istediğinizden emin misiniz? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_warning "Deployment iptal edildi."
        exit 0
    fi
    
    # Deployment adımları
    check_requirements
    create_backup
    setup_environment
    install_dependencies
    setup_database
    build_frontend
    setup_pm2
    setup_nginx
    health_check
    deployment_summary
    
    log_success "🎉 Deployment başarıyla tamamlandı!"
}

# Script'i çalıştır
main "$@"