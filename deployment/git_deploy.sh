#!/bin/bash

# 🚀 HOOWELL - Git ile Güvenli Deployment Script
# Mevcut verileri kaybetmeden güncelleme yapar

set -e  # Hata durumunda script'i durdur

# Renkli output için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log fonksiyonu
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Başlık
echo -e "${BLUE}"
echo "🚀 HOOWELL GÜVENLİ DEPLOYMENT"
echo "================================"
echo -e "${NC}"

# Kullanıcıdan onay al
read -p "Bu işlem mevcut sistemi güncelleyecek. Devam etmek istiyor musunuz? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    error "Deployment iptal edildi."
fi

# Gerekli değişkenler
DB_NAME="hoowell_network"
BACKUP_DIR="./backups"
PROJECT_DIR=$(pwd)

# Backup dizini oluştur
mkdir -p $BACKUP_DIR

log "🔍 Sistem durumu kontrol ediliyor..."

# PM2 durumu kontrol et
if ! command -v pm2 &> /dev/null; then
    warning "PM2 bulunamadı. Kurulum gerekebilir."
fi

# MySQL durumu kontrol et
if ! command -v mysql &> /dev/null; then
    error "MySQL bulunamadı. Lütfen MySQL'i kurun."
fi

# Git durumu kontrol et
if ! git status &> /dev/null; then
    error "Bu dizin bir Git repository değil."
fi

success "Sistem kontrolleri tamamlandı"

# ADIM 1: BACKUP AL
log "📦 Kritik backup alınıyor..."

# Database backup
BACKUP_FILE="$BACKUP_DIR/db_backup_$(date +%Y%m%d_%H%M%S).sql"
if mysqldump -u root -p$DB_PASSWORD $DB_NAME > $BACKUP_FILE 2>/dev/null; then
    success "Database backup alındı: $BACKUP_FILE"
else
    # Şifre sorarak tekrar dene
    log "Database backup için MySQL şifresi gerekli:"
    if mysqldump -u root -p $DB_NAME > $BACKUP_FILE; then
        success "Database backup alındı: $BACKUP_FILE"
    else
        error "Database backup alınamadı!"
    fi
fi

# Files backup
FILES_BACKUP="$BACKUP_DIR/files_backup_$(date +%Y%m%d_%H%M%S).tar.gz"
tar -czf $FILES_BACKUP . --exclude=node_modules --exclude=frontend/node_modules --exclude=backups --exclude=.git
success "Dosya backup alındı: $FILES_BACKUP"

# Uploads backup (eğer varsa)
if [ -d "uploads" ]; then
    UPLOADS_BACKUP="$BACKUP_DIR/uploads_backup_$(date +%Y%m%d_%H%M%S).tar.gz"
    tar -czf $UPLOADS_BACKUP uploads/
    success "Uploads backup alındı: $UPLOADS_BACKUP"
fi

# ADIM 2: MAINTENANCE MODE
log "🔧 Maintenance mode aktif ediliyor..."

# PM2 uygulamasını durdur (graceful)
if pm2 list | grep -q "hoowell-backend"; then
    pm2 stop hoowell-backend
    success "Backend durduruldu"
fi

# ADIM 3: GIT PULL
log "📥 Güncellemeler GitHub'dan çekiliyor..."

# Mevcut değişiklikleri stash'le (güvenlik için)
if ! git diff-index --quiet HEAD --; then
    git stash push -m "Auto-stash before deployment $(date)"
    warning "Mevcut değişiklikler stash'lendi"
fi

# Remote'dan güncellemeleri çek
git fetch origin

# Değişiklikleri göster
echo -e "${YELLOW}Çekilecek değişiklikler:${NC}"
git log --oneline HEAD..origin/main | head -10

# Pull yap
if git pull origin main; then
    success "Git güncellemeleri alındı"
else
    error "Git pull başarısız!"
fi

# ADIM 4: DEPENDENCIES GÜNCELLE
log "📦 Dependencies güncelleniyor..."

# Backend dependencies
if npm install; then
    success "Backend dependencies güncellendi"
else
    error "Backend dependencies güncellenemedi!"
fi

# Frontend dependencies ve build
log "🏗️ Frontend build ediliyor..."
cd frontend

if npm install; then
    success "Frontend dependencies güncellendi"
else
    error "Frontend dependencies güncellenemedi!"
fi

if npm run build; then
    success "Frontend build tamamlandı"
else
    error "Frontend build başarısız!"
fi

cd ..

# ADIM 5: DATABASE MIGRATION
log "🗄️ Database güvenli migration yapılıyor..."

# Mevcut kullanıcı sayısını kaydet
USER_COUNT_BEFORE=$(mysql -u root -p$DB_PASSWORD $DB_NAME -se "SELECT COUNT(*) FROM users WHERE role='partner';" 2>/dev/null || echo "0")

# Migration script'ini çalıştır
if [ -f "deployment/safe_migration_fixed.sql" ]; then
    if mysql -u root -p$DB_PASSWORD $DB_NAME < deployment/safe_migration_fixed.sql 2>/dev/null; then
        success "Safe migration tamamlandı"
    else
        log "Şifre ile migration deneniyor..."
        mysql -u root -p $DB_NAME < deployment/safe_migration_fixed.sql
        success "Safe migration tamamlandı"
    fi
fi

# Eksik tabloları oluştur
if [ -f "backend/create_missing_tables_fix.sql" ]; then
    if mysql -u root -p$DB_PASSWORD $DB_NAME < backend/create_missing_tables_fix.sql 2>/dev/null; then
        success "Eksik tablolar oluşturuldu"
    else
        mysql -u root -p $DB_NAME < backend/create_missing_tables_fix.sql
        success "Eksik tablolar oluşturuldu"
    fi
fi

# Migration sonrası kontrol
USER_COUNT_AFTER=$(mysql -u root -p$DB_PASSWORD $DB_NAME -se "SELECT COUNT(*) FROM users WHERE role='partner';" 2>/dev/null || echo "0")

if [ "$USER_COUNT_BEFORE" = "$USER_COUNT_AFTER" ]; then
    success "Kullanıcı verileri korundu ($USER_COUNT_AFTER kullanıcı)"
else
    warning "Kullanıcı sayısı değişti: $USER_COUNT_BEFORE -> $USER_COUNT_AFTER"
fi

# ADIM 6: APPLICATION START
log "🔄 Uygulama başlatılıyor..."

# PM2 ile başlat
if pm2 list | grep -q "hoowell-backend"; then
    pm2 restart hoowell-backend
    success "Backend yeniden başlatıldı"
else
    # İlk kez başlatılıyor
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js --env production
    else
        pm2 start backend/server.js --name hoowell-backend
    fi
    success "Backend başlatıldı"
fi

# ADIM 7: HEALTH CHECK
log "🏥 Health check yapılıyor..."

# Backend'in başlamasını bekle
sleep 5

# Health check
for i in {1..10}; do
    if curl -f http://localhost:5001/api/health &>/dev/null; then
        success "Health check başarılı"
        break
    else
        if [ $i -eq 10 ]; then
            error "Health check başarısız! Backend başlatılamadı."
        fi
        log "Health check deneniyor... ($i/10)"
        sleep 2
    fi
done

# ADIM 8: FINAL KONTROLLER
log "🔍 Final kontroller yapılıyor..."

# PM2 durumu
pm2 status

# Database bağlantı testi
if mysql -u root -p$DB_PASSWORD $DB_NAME -e "SELECT 1;" &>/dev/null; then
    success "Database bağlantısı OK"
else
    warning "Database bağlantısı kontrol edilemedi"
fi

# Disk kullanımı
DISK_USAGE=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    warning "Disk kullanımı yüksek: %$DISK_USAGE"
else
    success "Disk kullanımı normal: %$DISK_USAGE"
fi

# BAŞARILI TAMAMLAMA
echo -e "${GREEN}"
echo "🎉 DEPLOYMENT BAŞARIYLA TAMAMLANDI!"
echo "=================================="
echo -e "${NC}"

echo "📊 Özet:"
echo "  • Backup alındı: $BACKUP_FILE"
echo "  • Kullanıcı sayısı: $USER_COUNT_AFTER"
echo "  • Backend durumu: $(pm2 list | grep hoowell-backend | awk '{print $10}')"
echo "  • Disk kullanımı: %$DISK_USAGE"

echo ""
echo "🔗 Yararlı komutlar:"
echo "  • PM2 durumu: pm2 status"
echo "  • PM2 logları: pm2 logs hoowell-backend"
echo "  • Backend restart: pm2 restart hoowell-backend"
echo "  • Rollback: ./deployment/rollback.sh $BACKUP_FILE"

echo ""
echo "🌐 Site kontrol edin: http://your-domain.com"

# Cleanup eski backup'ları (30 günden eski)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete 2>/dev/null || true
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete 2>/dev/null || true

success "Deployment tamamlandı! 🚀"