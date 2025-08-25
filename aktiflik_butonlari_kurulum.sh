#!/bin/bash

# HOOWELL Aktiflik Durumu Butonları Kurulum Scripti
# Kullanım: ./aktiflik_butonlari_kurulum.sh

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 HOOWELL Aktiflik Durumu Butonları Kurulumu${NC}"

# 1. Görselleri kopyala
echo -e "${YELLOW}📁 Görseller kopyalanıyor...${NC}"
if [ -f "evet.png" ]; then
    cp evet.png frontend/public/images/buttons/
    echo -e "${GREEN}✅ evet.png kopyalandı${NC}"
else
    echo -e "${RED}❌ evet.png bulunamadı!${NC}"
fi

if [ -f "hayır.png" ]; then
    cp hayır.png frontend/public/images/buttons/
    echo -e "${GREEN}✅ hayır.png kopyalandı${NC}"
else
    echo -e "${RED}❌ hayır.png bulunamadı!${NC}"
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

# 3. Backend'i yeniden başlat
echo -e "${YELLOW}📦 Backend yeniden başlatılıyor...${NC}"
pm2 restart hoowell-backend

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend başarıyla yeniden başlatıldı${NC}"
else
    echo -e "${RED}❌ Backend yeniden başlatılamadı!${NC}"
    exit 1
fi

# 4. Nginx'i yeniden başlat
echo -e "${YELLOW}🌐 Nginx yeniden başlatılıyor...${NC}"
sudo systemctl reload nginx

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Nginx başarıyla yeniden başlatıldı${NC}"
else
    echo -e "${RED}❌ Nginx yeniden başlatılamadı!${NC}"
fi

echo -e "${GREEN}🎉 Aktiflik Durumu Butonları kurulumu tamamlandı!${NC}"
echo -e "${BLUE}📋 Değişiklikler:${NC}"
echo -e "${YELLOW}• FranchiseNetwork.js - Aktiflik durumu butonları eklendi${NC}"
echo -e "${YELLOW}• SalesTracker.js - EVET/HAYIR butonları güncellendi${NC}"
echo -e "${YELLOW}• Görseller /images/buttons/ klasörüne kopyalandı${NC}"
echo -e "${YELLOW}• Hover efektleri ve animasyonlar eklendi${NC}"
