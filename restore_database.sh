#!/bin/bash

# HOOWELL Veritabanı Geri Yükleme Scripti
# Kullanım: ./restore_database.sh [backup_file.sql]

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DB_NAME="hoowell_network"
DB_USER="root"

# Yedek dosyası kontrolü
if [ -z "$1" ]; then
    echo -e "${RED}❌ Hata: Yedek dosyası belirtilmedi!${NC}"
    echo -e "${YELLOW}Kullanım: ./restore_database.sh [backup_file.sql]${NC}"
    echo -e "${BLUE}Mevcut yedekler:${NC}"
    ls -la backups/*.sql 2>/dev/null || echo "Yedek bulunamadı!"
    exit 1
fi

BACKUP_FILE="$1"

# Dosya var mı kontrol et
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Hata: $BACKUP_FILE dosyası bulunamadı!${NC}"
    exit 1
fi

echo -e "${BLUE}🔄 HOOWELL Veritabanı Geri Yükleme${NC}"
echo -e "${YELLOW}📁 Yedek dosyası: $BACKUP_FILE${NC}"
echo -e "${RED}⚠️ DİKKAT: Bu işlem mevcut verileri silecek!${NC}"

# Onay al
read -p "Devam etmek istiyor musunuz? (y/N): " confirm
if [[ $confirm != [yY] ]]; then
    echo -e "${YELLOW}❌ İşlem iptal edildi.${NC}"
    exit 0
fi

# Mevcut veritabanının yedeğini al
echo -e "${YELLOW}🛡️ Mevcut veritabanının yedeği alınıyor...${NC}"
SAFETY_BACKUP="safety_backup_$(date +%Y%m%d_%H%M%S).sql"
mysqldump -u $DB_USER -p $DB_NAME > $SAFETY_BACKUP

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Güvenlik yedeği alındı: $SAFETY_BACKUP${NC}"
else
    echo -e "${RED}❌ Güvenlik yedeği alınamadı!${NC}"
    exit 1
fi

# Veritabanını geri yükle
echo -e "${YELLOW}📦 Veritabanı geri yükleniyor...${NC}"
mysql -u $DB_USER -p $DB_NAME < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Veritabanı başarıyla geri yüklendi!${NC}"
else
    echo -e "${RED}❌ Geri yükleme başarısız!${NC}"
    echo -e "${YELLOW}🔄 Güvenlik yedeğinden geri yükleniyor...${NC}"
    mysql -u $DB_USER -p $DB_NAME < $SAFETY_BACKUP
    echo -e "${GREEN}✅ Güvenlik yedeğinden geri yüklendi.${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Geri yükleme tamamlandı!${NC}"
echo -e "${BLUE}📁 Güvenlik yedeği: $SAFETY_BACKUP${NC}"
