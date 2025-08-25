#!/bin/bash

# HOOWELL Veritabanı Yedekleme Scripti
# Kullanım: ./backup_database.sh

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Tarih formatı
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
DB_NAME="hoowell_network"
DB_USER="root"

echo -e "${BLUE}🔄 HOOWELL Veritabanı Yedekleme Başlatılıyor...${NC}"

# Backup klasörü oluştur
mkdir -p $BACKUP_DIR

# Tam yedek
echo -e "${YELLOW}📦 Tam veritabanı yedeği alınıyor...${NC}"
mysqldump -u $DB_USER -p $DB_NAME > $BACKUP_DIR/hoowell_full_backup_$TIMESTAMP.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Tam yedek başarılı: hoowell_full_backup_$TIMESTAMP.sql${NC}"
else
    echo -e "${RED}❌ Tam yedek başarısız!${NC}"
    exit 1
fi

# Sadece yapı yedeği
echo -e "${YELLOW}🏗️ Veritabanı yapısı yedeği alınıyor...${NC}"
mysqldump -u $DB_USER -p --no-data $DB_NAME > $BACKUP_DIR/hoowell_structure_$TIMESTAMP.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Yapı yedeği başarılı: hoowell_structure_$TIMESTAMP.sql${NC}"
else
    echo -e "${RED}❌ Yapı yedeği başarısız!${NC}"
fi

# Sadece veri yedeği
echo -e "${YELLOW}📊 Veri yedeği alınıyor...${NC}"
mysqldump -u $DB_USER -p --no-create-info $DB_NAME > $BACKUP_DIR/hoowell_data_$TIMESTAMP.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Veri yedeği başarılı: hoowell_data_$TIMESTAMP.sql${NC}"
else
    echo -e "${RED}❌ Veri yedeği başarısız!${NC}"
fi

# Yedek boyutunu göster
echo -e "${BLUE}📏 Yedek dosya boyutları:${NC}"
ls -lh $BACKUP_DIR/*$TIMESTAMP.sql

echo -e "${GREEN}🎉 Yedekleme tamamlandı!${NC}"
echo -e "${YELLOW}📁 Yedekler: $BACKUP_DIR/ klasöründe${NC}"
