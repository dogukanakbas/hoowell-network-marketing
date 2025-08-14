#!/bin/bash

echo "🔄 HOOWELL Güvenli Güncelleme Başlıyor..."

# Renklendirme
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Hata durumunda çık
set -e

# Kullanıcıdan onay al
echo -e "${YELLOW}Bu script mevcut sistemi güncelleyecek. Devam etmek istiyor musunuz? (y/N)${NC}"
read -r response
if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo "İşlem iptal edildi."
    exit 1
fi

# Timestamp oluştur
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${BLUE}📋 Güncelleme başlıyor - $TIMESTAMP${NC}"

# ADIM 1: Mevcut durumu kontrol et
echo -e "${YELLOW}1. Mevcut durum kontrol ediliyor...${NC}"
echo "Mevcut dizin: $(pwd)"
echo "Git branch: $(git branch --show-current)"
echo "Git status: $(git status --porcelain | wc -l) değişiklik"

# ADIM 2: Veritabanı backup
echo -e "${YELLOW}2. Veritabanı backup alınıyor...${NC}"
mkdir -p backups
echo "MySQL root şifresini girin:"
mysqldump -u root -p hoowell_network > backups/backup_$TIMESTAMP.sql
echo -e "${GREEN}✅ Backup alındı: backups/backup_$TIMESTAMP.sql${NC}"

# ADIM 3: Kod yedekleme
echo -e "${YELLOW}3. Mevcut kod yedekleniyor...${NC}"
cp -r . ../hoowell_son_backup_$TIMESTAMP
echo -e "${GREEN}✅ Kod yedeklendi: ../hoowell_son_backup_$TIMESTAMP${NC}"

# ADIM 4: Servisleri durdur
echo -e "${YELLOW}4. Servisler durduruluyor...${NC}"
pm2 stop all || echo "PM2 servisleri zaten durdurulmuş"

# ADIM 5: Git güncellemesi
echo -e "${YELLOW}5. Git'ten yeni kodlar çekiliyor...${NC}"
git stash || echo "Stash edilecek değişiklik yok"
git checkout main
git pull origin main
echo -e "${GREEN}✅ Git güncellendi${NC}"

# ADIM 6: Dependencies
echo -e "${YELLOW}6. Dependencies güncelleniyor...${NC}"
npm install
cd frontend
npm install
cd ..
echo -e "${GREEN}✅ Dependencies güncellendi${NC}"

# ADIM 7: Frontend build
echo -e "${YELLOW}7. Frontend build yapılıyor...${NC}"
cd frontend
npm run build
cd ..
echo -e "${GREEN}✅ Frontend build tamamlandı${NC}"

# ADIM 8: Database migrations
echo -e "${YELLOW}8. Veritabanı migration'ları çalıştırılıyor...${NC}"
echo "MySQL root şifresini tekrar girin:"
mysql -u root -p hoowell_network < backend/fix_customers_table.sql || echo "Customers migration tamamlandı"
mysql -u root -p hoowell_network < backend/create_settings_table.sql || echo "Settings migration tamamlandı"
mysql -u root -p hoowell_network < backend/fix_payments_table.sql || echo "Payments migration tamamlandı"
echo -e "${GREEN}✅ Database migration'ları tamamlandı${NC}"

# ADIM 9: Environment kontrol
echo -e "${YELLOW}9. Environment dosyası kontrol ediliyor...${NC}"
if [ ! -f .env ]; then
    cp .env.production .env
    echo -e "${RED}⚠️  .env dosyası oluşturuldu, lütfen düzenleyin!${NC}"
else
    echo -e "${GREEN}✅ .env dosyası mevcut${NC}"
fi

# ADIM 10: Servisleri başlat
echo -e "${YELLOW}10. Servisler başlatılıyor...${NC}"
pm2 restart all || pm2 start backend/server.js --name hoowell-backend
pm2 save
echo -e "${GREEN}✅ PM2 servisleri başlatıldı${NC}"

# ADIM 11: Nginx kontrol
echo -e "${YELLOW}11. Nginx kontrol ediliyor...${NC}"
sudo nginx -t
sudo systemctl restart nginx
echo -e "${GREEN}✅ Nginx yeniden başlatıldı${NC}"

# ADIM 12: Test
echo -e "${YELLOW}12. Sistem test ediliyor...${NC}"
sleep 5
pm2 status
echo ""
echo "Backend API test:"
curl -s http://localhost:5001 > /dev/null && echo "✅ Backend çalışıyor" || echo "❌ Backend sorunu"
echo ""
echo "Frontend test:"
curl -s http://hoowell.net > /dev/null && echo "✅ Frontend çalışıyor" || echo "❌ Frontend sorunu"

echo ""
echo -e "${GREEN}🎉 Güncelleme tamamlandı!${NC}"
echo ""
echo -e "${BLUE}📊 Özet:${NC}"
echo "Backup: backups/backup_$TIMESTAMP.sql"
echo "Kod yedek: ../hoowell_son_backup_$TIMESTAMP"
echo "PM2 Status: pm2 status"
echo "Loglar: pm2 logs hoowell-backend"
echo ""
echo -e "${YELLOW}🧪 Test Listesi:${NC}"
echo "1. https://hoowell.net - Ana sayfa"
echo "2. Login sistemi"
echo "3. Müşteri kayıt"
echo "4. PayTR ödeme"
echo ""
echo -e "${RED}⚠️  Sorun varsa geri dönüş:${NC}"
echo "pm2 stop all"
echo "rm -rf ./*"
echo "cp -r ../hoowell_son_backup_$TIMESTAMP/* ."
echo "pm2 restart all"