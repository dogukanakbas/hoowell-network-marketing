#!/bin/bash

# HOOWELL İş Ortağı Kayıt Adım Düzenleme Scripti
# Kullanım: ./is_ortagi_adim_duzenleme.sh

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 HOOWELL İş Ortağı Kayıt Adım Düzenleme${NC}"

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

echo -e "${GREEN}🎉 İş Ortağı Kayıt Adım Düzenleme tamamlandı!${NC}"
echo -e "${BLUE}📋 Yeni Adım Yapısı:${NC}"
echo -e "${YELLOW}• Adım 1: Kayıt Türü Seçimi${NC}"
echo -e "${YELLOW}• Adım 2: Bilgi Girişi${NC}"
echo -e "${YELLOW}• Adım 3: Ürün Seçimi${NC}"
echo -e "${YELLOW}• Adım 4: Sipariş Özeti${NC}"
echo -e "${YELLOW}• Adım 5: Sözleşme Onayları${NC}"
echo -e "${YELLOW}• Adım 6: Ödeme ← YENİ KONUM${NC}"
echo -e "${YELLOW}• Adım 7: Başarı${NC}"
echo -e "${YELLOW}• Müşteri kayıt paneli ile aynı yapı${NC}"
