#!/bin/bash

# PayTR Dosyalarını Güncelleme Script'i
# HOOWELL Payment System
# Tarih: 08.01.2025

echo "🔄 PayTR Dosyaları Güncelleniyor..."

# Renk kodları
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Proje dizini
PROJECT_DIR="/root/hoowell"
WEB_ROOT="/var/www/html"

# Dosyaları güncelle
echo -e "${YELLOW}📁 Dosyalar güncelleniyor...${NC}"

# Callback dosyasını güncelle
if [ -f "$PROJECT_DIR/paytr_callback.php" ]; then
    sudo cp "$PROJECT_DIR/paytr_callback.php" "$WEB_ROOT/"
    sudo chown www-data:www-data "$WEB_ROOT/paytr_callback.php"
    sudo chmod 644 "$WEB_ROOT/paytr_callback.php"
    echo -e "${GREEN}✅ paytr_callback.php güncellendi${NC}"
else
    echo -e "${RED}❌ paytr_callback.php bulunamadı${NC}"
fi

# Debug dosyasını güncelle
if [ -f "$PROJECT_DIR/debug_paytr_callback.php" ]; then
    sudo cp "$PROJECT_DIR/debug_paytr_callback.php" "$WEB_ROOT/"
    sudo chown www-data:www-data "$WEB_ROOT/debug_paytr_callback.php"
    sudo chmod 644 "$WEB_ROOT/debug_paytr_callback.php"
    echo -e "${GREEN}✅ debug_paytr_callback.php güncellendi${NC}"
else
    echo -e "${RED}❌ debug_paytr_callback.php bulunamadı${NC}"
fi

# Database bağlantısını test et
echo -e "${YELLOW}🗄️ Database bağlantısı test ediliyor...${NC}"
if mysql -u root -p'HoowellDB_2025' -e "USE hoowell_network; SELECT 1;" &> /dev/null; then
    echo -e "${GREEN}✅ Database bağlantısı başarılı${NC}"
else
    echo -e "${RED}❌ Database bağlantısı başarısız${NC}"
fi

# Log dizinini kontrol et
echo -e "${YELLOW}📝 Log dizini kontrol ediliyor...${NC}"
if [ -d "/var/log/hoowell" ] && [ -w "/var/log/hoowell" ]; then
    echo -e "${GREEN}✅ Log dizini yazılabilir${NC}"
else
    echo -e "${YELLOW}⚠️ Log dizini oluşturuluyor...${NC}"
    sudo mkdir -p /var/log/hoowell
    sudo chown www-data:www-data /var/log/hoowell
    sudo chmod 755 /var/log/hoowell
    echo -e "${GREEN}✅ Log dizini oluşturuldu${NC}"
fi

echo ""
echo "=========================================="
echo "🎉 Güncelleme Tamamlandı!"
echo "=========================================="
echo ""
echo "📋 Test Adımları:"
echo "1. Debug sayfasını ziyaret edin:"
echo "   https://hoowell.net/debug_paytr_callback.php"
echo ""
echo "2. Callback URL'ini test edin:"
echo "   https://hoowell.net/paytr_callback.php"
echo ""
echo "3. Log dosyasını kontrol edin:"
echo "   tail -f /var/log/hoowell/paytr_callback.log"
echo ""
echo "4. Test ödemesi yapın ve sonuçları kontrol edin"
echo ""
