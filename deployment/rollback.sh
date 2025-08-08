#!/bin/bash

# 🚨 HOOWELL - Acil Rollback Script
# Deployment sorunlarında hızlı geri alma

set -e

# Renkli output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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
echo -e "${RED}"
echo "🚨 HOOWELL ACİL ROLLBACK"
echo "========================"
echo -e "${NC}"

# Parametreler
BACKUP_FILE=$1
DB_NAME="hoowell_network"

if [ -z "$BACKUP_FILE" ]; then
    echo "Kullanım: ./rollback.sh <backup_file.sql>"
    echo ""
    echo "Mevcut backup dosyaları:"
    ls -la backups/*.sql 2>/dev/null | tail -5 || echo "Backup dosyası bulunamadı!"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    error "Backup dosyası bulunamadı: $BACKUP_FILE"
fi

# Kullanıcıdan onay al
echo -e "${RED}⚠️  DİKKAT: Bu işlem mevcut veritabanını geri alacak!${NC}"
echo "Backup dosyası: $BACKUP_FILE"
echo "Backup tarihi: $(stat -c %y "$BACKUP_FILE")"
read -p "Rollback yapmak istediğinizden emin misiniz? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    error "Rollback iptal edildi."
fi

log "🚨 Rollback başlatılıyor..."

# ADIM 1: BACKEND DURDUR
log "🛑 Backend durduruluyor..."
if pm2 list | grep -q "hoowell-backend"; then
    pm2 stop hoowell-backend
    success "Backend durduruldu"
fi

# ADIM 2: GIT ROLLBACK
log "📥 Git rollback yapılıyor..."

# Son commit'i göster
echo "Son commit:"
git log --oneline -1

# Bir önceki commit'e dön
if git reset --hard HEAD~1; then
    success "Git rollback tamamlandı"
else
    warning "Git rollback başarısız, devam ediliyor..."
fi

# ADIM 3: DATABASE ROLLBACK
log "🗄️ Database rollback yapılıyor..."

# Mevcut database'i backup al (güvenlik için)
CURRENT_BACKUP="backups/before_rollback_$(date +%Y%m%d_%H%M%S).sql"
mkdir -p backups
if mysqldump -u root -p$DB_PASSWORD $DB_NAME > $CURRENT_BACKUP 2>/dev/null; then
    success "Mevcut database backup alındı: $CURRENT_BACKUP"
else
    log "Database backup için şifre gerekli:"
    mysqldump -u root -p $DB_NAME > $CURRENT_BACKUP
    success "Mevcut database backup alındı: $CURRENT_BACKUP"
fi

# Backup'ı geri yükle
log "Database geri yükleniyor: $BACKUP_FILE"
if mysql -u root -p$DB_PASSWORD $DB_NAME < $BACKUP_FILE 2>/dev/null; then
    success "Database rollback tamamlandı"
else
    log "Database rollback için şifre gerekli:"
    mysql -u root -p $DB_NAME < $BACKUP_FILE
    success "Database rollback tamamlandı"
fi

# ADIM 4: DEPENDENCIES ROLLBACK
log "📦 Dependencies rollback yapılıyor..."

# Backend dependencies
if npm install; then
    success "Backend dependencies rollback tamamlandı"
else
    warning "Backend dependencies rollback başarısız"
fi

# Frontend dependencies ve build
cd frontend
if npm install && npm run build; then
    success "Frontend rollback tamamlandı"
else
    warning "Frontend rollback başarısız"
fi
cd ..

# ADIM 5: BACKEND BAŞLAT
log "🔄 Backend yeniden başlatılıyor..."

if pm2 list | grep -q "hoowell-backend"; then
    pm2 restart hoowell-backend
else
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js --env production
    else
        pm2 start backend/server.js --name hoowell-backend
    fi
fi

success "Backend başlatıldı"

# ADIM 6: HEALTH CHECK
log "🏥 Health check yapılıyor..."

sleep 5

for i in {1..10}; do
    if curl -f http://localhost:5001/api/health &>/dev/null; then
        success "Health check başarılı"
        break
    else
        if [ $i -eq 10 ]; then
            error "Health check başarısız!"
        fi
        log "Health check deneniyor... ($i/10)"
        sleep 2
    fi
done

# ADIM 7: KONTROLLER
log "🔍 Final kontroller..."

# PM2 durumu
pm2 status

# Database kontrol
USER_COUNT=$(mysql -u root -p$DB_PASSWORD $DB_NAME -se "SELECT COUNT(*) FROM users WHERE role='partner';" 2>/dev/null || echo "?")
success "Kullanıcı sayısı: $USER_COUNT"

# BAŞARILI TAMAMLAMA
echo -e "${GREEN}"
echo "✅ ROLLBACK BAŞARIYLA TAMAMLANDI!"
echo "================================="
echo -e "${NC}"

echo "📊 Özet:"
echo "  • Geri yüklenen backup: $BACKUP_FILE"
echo "  • Mevcut backup: $CURRENT_BACKUP"
echo "  • Kullanıcı sayısı: $USER_COUNT"
echo "  • Backend durumu: $(pm2 list | grep hoowell-backend | awk '{print $10}' || echo 'Bilinmiyor')"

echo ""
echo "🔗 Yararlı komutlar:"
echo "  • PM2 durumu: pm2 status"
echo "  • PM2 logları: pm2 logs hoowell-backend"
echo "  • Site kontrol: curl http://localhost:5001/api/health"

echo ""
echo "🌐 Site kontrol edin: http://your-domain.com"

success "Rollback tamamlandı! 🚨"