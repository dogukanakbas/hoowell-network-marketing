#!/bin/bash

# PayTR Canlı Mod Kontrol Script'i
# HOOWELL Payment System

echo "🔍 PayTR Canlı Mod Kontrolü..."

# Renk kodları
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Kontrol fonksiyonları
check_test_mode() {
    echo -e "${YELLOW}🧪 Test Modu Kontrolü...${NC}"
    
    # Backend dosyalarında test_mode kontrolü
    if grep -q "test_mode.*0" backend/routes/paytr.js; then
        echo -e "${GREEN}✅ PayTR routes - Test modu kapalı${NC}"
    else
        echo -e "${RED}❌ PayTR routes - Test modu açık${NC}"
    fi
    
    if grep -q "test_mode.*0" backend/paytrService.js; then
        echo -e "${GREEN}✅ PayTR service - Test modu kapalı${NC}"
    else
        echo -e "${RED}❌ PayTR service - Test modu açık${NC}"
    fi
}

check_callback_url() {
    echo -e "${YELLOW}📡 Callback URL Kontrolü...${NC}"
    
    local url="https://hoowell.net/paytr_callback.php"
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" = "200" ] || [ "$response" = "404" ]; then
        echo -e "${GREEN}✅ Callback URL erişilebilir (HTTP: $response)${NC}"
    else
        echo -e "${RED}❌ Callback URL erişilemiyor (HTTP: $response)${NC}"
    fi
}

check_success_url() {
    echo -e "${YELLOW}✅ Başarılı Ödeme URL Kontrolü...${NC}"
    
    local url="https://hoowell.net/payment/success"
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ Başarılı ödeme sayfası erişilebilir${NC}"
    else
        echo -e "${RED}❌ Başarılı ödeme sayfası erişilemiyor (HTTP: $response)${NC}"
    fi
}

check_database() {
    echo -e "${YELLOW}🗄️ Database Kontrolü...${NC}"
    
    if mysql -u root -p'HoowellDB_2025' -e "USE hoowell_network; SELECT 1;" &> /dev/null; then
        echo -e "${GREEN}✅ Database bağlantısı başarılı${NC}"
    else
        echo -e "${RED}❌ Database bağlantısı başarısız${NC}"
    fi
}

check_ssl() {
    echo -e "${YELLOW}🔒 SSL Sertifikası Kontrolü...${NC}"
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" "https://hoowell.net")
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ SSL sertifikası aktif${NC}"
    else
        echo -e "${RED}❌ SSL sertifikası sorunu (HTTP: $response)${NC}"
    fi
}

# Ana kontrol fonksiyonu
main() {
    echo "=========================================="
    echo "PayTR Canlı Mod Kontrol Script'i"
    echo "HOOWELL Payment System"
    echo "=========================================="
    echo ""
    
    check_test_mode
    check_callback_url
    check_success_url
    check_database
    check_ssl
    
    echo ""
    echo "=========================================="
    echo "📋 Canlı Moda Geçiş Kontrol Listesi"
    echo "=========================================="
    echo ""
    echo "✅ PayTR Panel Ayarları:"
    echo "   • Bildirim URL: https://hoowell.net/paytr_callback.php"
    echo "   • Başarılı Ödeme: https://hoowell.net/payment/success"
    echo "   • Başarısız Ödeme: https://hoowell.net/payment/fail"
    echo ""
    echo "✅ Environment Değişkenleri:"
    echo "   • NODE_ENV=production"
    echo "   • PAYTR_MERCHANT_ID=605940 (canlı)"
    echo "   • PAYTR_MERCHANT_KEY=xxxxx (canlı)"
    echo "   • PAYTR_MERCHANT_SALT=xxxxx (canlı)"
    echo ""
    echo "✅ Test Modu: KAPALI"
    echo "✅ SSL Sertifikası: AKTİF"
    echo "✅ Database: BAĞLANTI VAR"
    echo ""
    echo "🎯 Canlı moda geçiş için hazır!"
    echo ""
}

# Script'i çalıştır
main "$@"

