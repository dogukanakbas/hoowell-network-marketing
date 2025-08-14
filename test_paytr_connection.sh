#!/bin/bash

# PayTR Bağlantı Test Script'i
# HOOWELL Payment System

echo "🔍 PayTR Bağlantı Testi Başlıyor..."

# Renk kodları
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test fonksiyonları
test_callback_url() {
    echo -e "${YELLOW}📡 Callback URL Testi...${NC}"
    
    local url="https://hoowell.net/paytr_callback.php"
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" = "200" ] || [ "$response" = "404" ]; then
        echo -e "${GREEN}✅ Callback URL erişilebilir (HTTP: $response)${NC}"
    else
        echo -e "${RED}❌ Callback URL erişilemiyor (HTTP: $response)${NC}"
    fi
}

test_debug_url() {
    echo -e "${YELLOW}🔧 Debug URL Testi...${NC}"
    
    local url="https://hoowell.net/debug_paytr_callback.php"
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ Debug URL erişilebilir${NC}"
    else
        echo -e "${RED}❌ Debug URL erişilemiyor (HTTP: $response)${NC}"
    fi
}

test_database_connection() {
    echo -e "${YELLOW}🗄️ Database Bağlantı Testi...${NC}"
    
    if mysql -u hoowell_user -p'HoowellDB_2025' -e "USE hoowell_network; SELECT 1;" &> /dev/null; then
        echo -e "${GREEN}✅ Database bağlantısı başarılı${NC}"
    else
        echo -e "${RED}❌ Database bağlantısı başarısız${NC}"
    fi
}

test_log_directory() {
    echo -e "${YELLOW}📝 Log Dizini Testi...${NC}"
    
    if [ -d "/var/log/hoowell" ]; then
        echo -e "${GREEN}✅ Log dizini mevcut${NC}"
        
        if [ -w "/var/log/hoowell" ]; then
            echo -e "${GREEN}✅ Log dizini yazılabilir${NC}"
        else
            echo -e "${RED}❌ Log dizini yazılamıyor${NC}"
        fi
    else
        echo -e "${RED}❌ Log dizini yok${NC}"
    fi
}

test_paytr_api() {
    echo -e "${YELLOW}🌐 PayTR API Testi...${NC}"
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" "https://www.paytr.com/odeme/api/get-token")
    
    if [ "$response" = "200" ] || [ "$response" = "400" ]; then
        echo -e "${GREEN}✅ PayTR API erişilebilir (HTTP: $response)${NC}"
    else
        echo -e "${RED}❌ PayTR API erişilemiyor (HTTP: $response)${NC}"
    fi
}

# Ana test fonksiyonu
main() {
    echo "=========================================="
    echo "PayTR Bağlantı Test Script'i"
    echo "HOOWELL Payment System"
    echo "=========================================="
    echo ""
    
    test_callback_url
    test_debug_url
    test_database_connection
    test_log_directory
    test_paytr_api
    
    echo ""
    echo "=========================================="
    echo "🏁 Test Tamamlandı!"
    echo "=========================================="
    echo ""
    echo "📋 Sonraki Adımlar:"
    echo "1. Debug sayfasını ziyaret edin:"
    echo "   https://hoowell.net/debug_paytr_callback.php"
    echo ""
    echo "2. PayTR panelinden bildirim URL'ini kontrol edin:"
    echo "   https://hoowell.net/paytr_callback.php"
    echo ""
    echo "3. Test ödemesi yapın ve log'ları kontrol edin:"
    echo "   tail -f /var/log/hoowell/paytr_callback.log"
    echo ""
}

# Script'i çalıştır
main "$@"
