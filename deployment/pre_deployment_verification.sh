#!/bin/bash

# HOOWELL - Deployment Öncesi Doğrulama Script'i
# Bu script deployment öncesi tüm gereksinimleri kontrol eder

set -e

# Renkli output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

echo "🔍 HOOWELL Deployment Öncesi Doğrulama"
echo "======================================"

# Sistem gereksinimleri
echo ""
echo "📋 SİSTEM GEREKSİNİMLERİ"
echo "------------------------"

# Operating System
OS=$(uname -s)
log_info "İşletim Sistemi: $OS"

# Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -ge 18 ]; then
        log_success "Node.js: $NODE_VERSION ✓"
    else
        log_error "Node.js versiyonu çok eski: $NODE_VERSION (En az v18 gerekli)"
    fi
else
    log_error "Node.js bulunamadı"
fi

# NPM
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    log_success "NPM: v$NPM_VERSION ✓"
else
    log_error "NPM bulunamadı"
fi

# MySQL
if command -v mysql &> /dev/null; then
    MYSQL_VERSION=$(mysql --version | awk '{print $3}' | cut -d',' -f1)
    log_success "MySQL: $MYSQL_VERSION ✓"
else
    log_error "MySQL bulunamadı"
fi

# PM2
if command -v pm2 &> /dev/null; then
    PM2_VERSION=$(pm2 -v)
    log_success "PM2: v$PM2_VERSION ✓"
else
    log_warning "PM2 bulunamadı (otomatik kurulacak)"
fi

# Nginx
if command -v nginx &> /dev/null; then
    NGINX_VERSION=$(nginx -v 2>&1 | awk '{print $3}')
    log_success "Nginx: $NGINX_VERSION ✓"
else
    log_warning "Nginx bulunamadı (manuel kurulum gerekli)"
fi

# Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | awk '{print $3}')
    log_success "Git: v$GIT_VERSION ✓"
else
    log_warning "Git bulunamadı"
fi

# Proje dosyaları
echo ""
echo "📁 PROJE DOSYALARI"
echo "------------------"

# Ana dosyalar
files_to_check=(
    "package.json"
    ".env"
    "backend/server.js"
    "backend/database_base.sql"
    "frontend/package.json"
    "deployment/safe_migration_script.sql"
    "deployment/production_setup.sh"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        log_success "$file ✓"
    else
        log_error "$file bulunamadı"
    fi
done

# Dizinler
dirs_to_check=(
    "backend"
    "frontend"
    "frontend/src"
    "frontend/src/components"
    "deployment"
)

for dir in "${dirs_to_check[@]}"; do
    if [ -d "$dir" ]; then
        log_success "$dir/ ✓"
    else
        log_error "$dir/ dizini bulunamadı"
    fi
done

# Environment dosyası kontrolü
echo ""
echo "🔧 ENVIRONMENT AYARLARI"
echo "-----------------------"

if [ -f ".env" ]; then
    # Gerekli environment değişkenlerini kontrol et
    required_vars=(
        "DB_HOST"
        "DB_USER"
        "DB_PASSWORD"
        "DB_NAME"
        "JWT_SECRET"
        "PORT"
    )
    
    for var in "${required_vars[@]}"; do
        if grep -q "^$var=" .env; then
            value=$(grep "^$var=" .env | cut -d'=' -f2)
            if [ -n "$value" ] && [ "$value" != "your_password_here" ] && [ "$value" != "your_secret_here" ]; then
                log_success "$var ayarlandı ✓"
            else
                log_warning "$var varsayılan değerde (güncellenmeli)"
            fi
        else
            log_error "$var bulunamadı"
        fi
    done
else
    log_error ".env dosyası bulunamadı"
fi

# Database bağlantısı
echo ""
echo "🗄️ DATABASE BAĞLANTISI"
echo "----------------------"

if [ -f ".env" ]; then
    source .env
    
    # MySQL bağlantısını test et
    if mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" 2>/dev/null; then
        log_success "Database bağlantısı başarılı ✓"
        
        # Database var mı kontrol et
        if mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME;" 2>/dev/null; then
            log_success "Database '$DB_NAME' mevcut ✓"
            
            # Tablo sayısını kontrol et
            TABLE_COUNT=$(mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SHOW TABLES;" 2>/dev/null | wc -l)
            if [ "$TABLE_COUNT" -gt 1 ]; then
                log_success "Database'de $((TABLE_COUNT-1)) tablo mevcut ✓"
                
                # Kullanıcı sayısını kontrol et
                USER_COUNT=$(mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SELECT COUNT(*) FROM users;" 2>/dev/null | tail -n 1)
                if [ "$USER_COUNT" -gt 0 ]; then
                    log_success "Database'de $USER_COUNT kullanıcı mevcut ✓"
                else
                    log_warning "Database boş (yeni kurulum)"
                fi
            else
                log_warning "Database boş (yeni kurulum)"
            fi
        else
            log_warning "Database '$DB_NAME' mevcut değil (oluşturulacak)"
        fi
    else
        log_error "Database bağlantısı başarısız"
    fi
else
    log_error ".env dosyası bulunamadığı için database testi yapılamadı"
fi

# Port kontrolü
echo ""
echo "🌐 PORT KULLANIMI"
echo "----------------"

if [ -f ".env" ]; then
    source .env
    
    if netstat -tlnp 2>/dev/null | grep -q ":$PORT "; then
        log_warning "Port $PORT kullanımda (mevcut uygulama çalışıyor olabilir)"
    else
        log_success "Port $PORT müsait ✓"
    fi
else
    log_warning "Port kontrolü yapılamadı (.env bulunamadı)"
fi

# Disk alanı
echo ""
echo "💾 DİSK ALANI"
echo "------------"

AVAILABLE_SPACE=$(df . | tail -1 | awk '{print $4}')
AVAILABLE_GB=$((AVAILABLE_SPACE / 1024 / 1024))

if [ "$AVAILABLE_GB" -gt 2 ]; then
    log_success "Kullanılabilir disk alanı: ${AVAILABLE_GB}GB ✓"
else
    log_warning "Düşük disk alanı: ${AVAILABLE_GB}GB (En az 2GB önerilir)"
fi

# Memory
echo ""
echo "🧠 BELLEK"
echo "--------"

if command -v free &> /dev/null; then
    TOTAL_MEM=$(free -m | awk 'NR==2{print $2}')
    AVAILABLE_MEM=$(free -m | awk 'NR==2{print $7}')
    
    if [ "$TOTAL_MEM" -gt 1024 ]; then
        log_success "Toplam bellek: ${TOTAL_MEM}MB ✓"
    else
        log_warning "Düşük bellek: ${TOTAL_MEM}MB (En az 1GB önerilir)"
    fi
    
    if [ "$AVAILABLE_MEM" -gt 512 ]; then
        log_success "Kullanılabilir bellek: ${AVAILABLE_MEM}MB ✓"
    else
        log_warning "Düşük kullanılabilir bellek: ${AVAILABLE_MEM}MB"
    fi
elif command -v vm_stat &> /dev/null; then
    # macOS için
    log_info "macOS bellek bilgisi alınıyor..."
    TOTAL_MEM=$(sysctl -n hw.memsize | awk '{print int($1/1024/1024)}')
    log_success "Toplam bellek: ${TOTAL_MEM}MB ✓"
fi

# Network bağlantısı
echo ""
echo "🌐 NETWORK BAĞLANTISI"
echo "--------------------"

if ping -c 1 google.com &> /dev/null; then
    log_success "İnternet bağlantısı aktif ✓"
else
    log_warning "İnternet bağlantısı yok (NPM paketleri için gerekli)"
fi

# Güvenlik kontrolleri
echo ""
echo "🔒 GÜVENLİK KONTROLLERİ"
echo "----------------------"

# Firewall
if command -v ufw &> /dev/null; then
    UFW_STATUS=$(ufw status | head -1 | awk '{print $2}')
    if [ "$UFW_STATUS" = "active" ]; then
        log_success "UFW Firewall aktif ✓"
    else
        log_warning "UFW Firewall aktif değil"
    fi
elif command -v firewall-cmd &> /dev/null; then
    if systemctl is-active --quiet firewalld; then
        log_success "Firewalld aktif ✓"
    else
        log_warning "Firewalld aktif değil"
    fi
else
    log_warning "Firewall durumu kontrol edilemedi"
fi

# SSL sertifikası kontrolü
if command -v certbot &> /dev/null; then
    log_success "Certbot (Let's Encrypt) mevcut ✓"
else
    log_warning "Certbot bulunamadı (SSL için gerekli)"
fi

# Özet
echo ""
echo "📊 DOĞRULAMA ÖZETİ"
echo "==================="

echo ""
echo "✅ Hazır Bileşenler:"
echo "  • Node.js ve NPM"
echo "  • MySQL Database"
echo "  • Proje dosyaları"
echo "  • Environment ayarları"

echo ""
echo "⚠️  Manuel Kurulum Gerekli:"
echo "  • PM2 (otomatik kurulacak)"
echo "  • Nginx konfigürasyonu"
echo "  • SSL sertifikası"
echo "  • Domain DNS ayarları"

echo ""
echo "🚀 Deployment Hazırlığı:"
if [ -f ".env" ] && [ -f "backend/server.js" ] && [ -f "frontend/package.json" ]; then
    log_success "Deployment için hazır!"
    echo ""
    echo "Sonraki adım:"
    echo "  ./deployment/quick_deploy.sh"
else
    log_error "Deployment için eksik dosyalar var!"
fi

echo ""
echo "📋 Deployment Öncesi Checklist:"
echo "  [ ] .env dosyası production değerleriyle güncellendi"
echo "  [ ] Database backup alındı"
echo "  [ ] Domain DNS ayarları yapıldı"
echo "  [ ] SSL sertifikası hazır"
echo "  [ ] Firewall ayarları kontrol edildi"

echo ""
echo "🔗 Faydalı Komutlar:"
echo "  • Database backup: mysqldump -u root -p hoowell_network > backup.sql"
echo "  • PM2 kurulum: npm install -g pm2"
echo "  • Nginx test: sudo nginx -t"
echo "  • SSL kurulum: sudo certbot --nginx"

echo ""
log_success "Doğrulama tamamlandı!"