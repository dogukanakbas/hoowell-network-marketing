#!/bin/bash

# HOOWELL TREPS Temizlik Scripti
# Kullanım: ./treps_temizlik.sh

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 HOOWELL TREPS Temizlik${NC}"

# 1. Backend'i yeniden başlat
echo -e "${YELLOW}📦 Backend yeniden başlatılıyor...${NC}"
pm2 restart hoowell-backend

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend başarıyla yeniden başlatıldı${NC}"
else
    echo -e "${RED}❌ Backend yeniden başlatılamadı!${NC}"
    exit 1
fi

# 2. Frontend'i build et
echo -e "${YELLOW}🏗️ Frontend build ediliyor...${NC}"
cd frontend
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend başarıyla build edildi${NC}"
else
    echo -e "${RED}❌ Frontend build edilemedi!${NC}"
    exit 1
fi

cd ..

# 3. Nginx'i yeniden başlat
echo -e "${YELLOW}🌐 Nginx yeniden başlatılıyor...${NC}"
sudo systemctl reload nginx

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Nginx başarıyla yeniden başlatıldı${NC}"
else
    echo -e "${RED}❌ Nginx yeniden başlatılamadı!${NC}"
fi

echo -e "${GREEN}🎉 TREPS temizlik tamamlandı!${NC}"
echo -e "${BLUE}📋 Temizlenen Test Bilgileri:${NC}"
echo -e "${YELLOW}• Sabit email adresleri kaldırıldı${NC}"
echo -e "${YELLOW}• Sabit telefon numaraları kaldırıldı${NC}"
echo -e "${YELLOW}• Sabit adres bilgileri kaldırıldı${NC}"
echo -e "${YELLOW}• Sabit IP adresleri kaldırıldı${NC}"
echo -e "${YELLOW}• Sabit ürün kategorileri kaldırıldı${NC}"
echo -e "${YELLOW}• Sistemden gelen gerçek veriler kullanılıyor${NC}"
