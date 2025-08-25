#!/bin/bash

# HOOWELL İş Ortağı Kayıt TREPS Ekleme Scripti
# Kullanım: ./is_ortagi_treps_ekleme.sh

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 HOOWELL İş Ortağı Kayıt TREPS Ekleme${NC}"

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
fi

# 3. Nginx'i yeniden başlat
echo -e "${YELLOW}🌐 Nginx yeniden başlatılıyor...${NC}"
sudo systemctl reload nginx

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Nginx başarıyla yeniden başlatıldı${NC}"
else
    echo -e "${RED}❌ Nginx yeniden başlatılamadı!${NC}"
fi

echo -e "${GREEN}🎉 İş Ortağı Kayıt TREPS Ekleme tamamlandı!${NC}"
echo -e "${BLUE}📋 Eklenen Özellikler:${NC}"
echo -e "${YELLOW}• TREPS ödeme seçeneği eklendi${NC}"
echo -e "${YELLOW}• TREPS bilgi kutusu eklendi${NC}"
echo -e "${YELLOW}• TREPS ödeme butonu eklendi${NC}"
echo -e "${YELLOW}• İş ortağı kayıt formunda 3 ödeme seçeneği${NC}"
echo -e "${YELLOW}• IBAN, PayTR ve TREPS seçenekleri${NC}"
echo -e "${YELLOW}• 4800 TL iş ortağı paketi ödemesi${NC}"
