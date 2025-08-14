#!/bin/bash

echo "🔧 HOOWELL Hızlı Düzeltme Scripti"

# Renklendirme
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

set -e

echo -e "${YELLOW}1. Git'ten son değişiklikleri çekiliyor...${NC}"
git stash || echo "Stash edilecek değişiklik yok"
git pull origin main

echo -e "${YELLOW}2. Database düzeltmeleri yapılıyor...${NC}"
echo "MySQL root şifresini girin:"
mysql -u root -p hoowell_network < backend/fix_all_tables.sql

echo -e "${YELLOW}3. PM2 servisleri yeniden başlatılıyor...${NC}"
pm2 restart all

echo -e "${YELLOW}4. Sistem durumu kontrol ediliyor...${NC}"
sleep 3
pm2 status

echo -e "${GREEN}✅ Hızlı düzeltme tamamlandı!${NC}"
echo ""
echo "Test için:"
echo "- pm2 logs hoowell-backend --lines 10"
echo "- curl -I https://hoowell.net"
echo ""
echo -e "${RED}Sorun devam ederse:${NC}"
echo "pm2 logs hoowell-backend --lines 50"