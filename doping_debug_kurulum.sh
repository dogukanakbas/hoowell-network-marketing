#!/bin/bash

# HOOWELL Doping Promosyonu Debug Kurulum Scripti
# Kullanım: ./doping_debug_kurulum.sh

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 HOOWELL Doping Promosyonu Debug Kurulumu${NC}"

# 1. Frontend'i build et
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

# 2. Backend'i yeniden başlat
echo -e "${YELLOW}📦 Backend yeniden başlatılıyor...${NC}"
pm2 restart hoowell-backend

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend başarıyla yeniden başlatıldı${NC}"
else
    echo -e "${RED}❌ Backend yeniden başlatılamadı!${NC}"
    exit 1
fi

# 3. Nginx'i yeniden başlat
echo -e "${YELLOW}🌐 Nginx yeniden başlatılıyor...${NC}"
sudo systemctl reload nginx

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Nginx başarıyla yeniden başlatıldı${NC}"
else
    echo -e "${RED}❌ Nginx yeniden başlatılamadı!${NC}"
fi

echo -e "${GREEN}🎉 Doping Promosyonu Debug kurulumu tamamlandı!${NC}"
echo -e "${BLUE}📋 Debug Özellikleri:${NC}"
echo -e "${YELLOW}• Backend'de doping debug logları eklendi${NC}"
echo -e "${YELLOW}• Frontend'de console.log debug eklendi${NC}"
echo -e "${YELLOW}• Browser console'da doping verilerini görebilirsiniz${NC}"
echo -e "${YELLOW}• Backend loglarında doping debug bilgileri görünecek${NC}"
