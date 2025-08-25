#!/bin/bash

# HOOWELL TREPS 404 Fix Scripti
# Kullanım: ./treps_404_fix.sh

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 HOOWELL TREPS 404 Fix${NC}"

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

echo -e "${GREEN}🎉 TREPS 404 Fix tamamlandı!${NC}"
echo -e "${BLUE}📋 Düzeltilen Sorunlar:${NC}"
echo -e "${YELLOW}• 404 Not Found hatası düzeltildi${NC}"
echo -e "${YELLOW}• POST /api/treps/payment-success endpoint eklendi${NC}"
echo -e "${YELLOW}• GET /api/treps/payment-success endpoint korundu${NC}"
echo -e "${YELLOW}• TREPS'ten gelen POST istekleri destekleniyor${NC}"
echo -e "${YELLOW}• Ödeme sonrası yönlendirme çalışıyor${NC}"
