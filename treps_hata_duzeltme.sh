#!/bin/bash

# HOOWELL TREPS Hata Düzeltme Scripti
# Kullanım: ./treps_hata_duzeltme.sh

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 HOOWELL TREPS Hata Düzeltme${NC}"

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

echo -e "${GREEN}🎉 TREPS hata düzeltme tamamlandı!${NC}"
echo -e "${BLUE}📋 Düzeltilen Hatalar:${NC}"
echo -e "${YELLOW}• Object reference hatası düzeltildi${NC}"
echo -e "${YELLOW}• response.data null kontrolü eklendi${NC}"
echo -e "${YELLOW}• trepsData.url kontrolü eklendi${NC}"
echo -e "${YELLOW}• iframe_web_uri: https://panel.hoowell.net${NC}"
echo -e "${YELLOW}• Optional chaining (?.) eklendi${NC}"
