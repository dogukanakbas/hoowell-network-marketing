#!/bin/bash

# HOOWELL Test Verilerini Silme Scripti
# Kullanım: ./test_verilerini_sil.sh

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🗑️ HOOWELL Test Verilerini Silme${NC}"

# Veritabanı bilgileri
DB_NAME="hoowell_network"
DB_USER="root"
DB_PASSWORD=""

echo -e "${YELLOW}⚠️ DİKKAT: Bu işlem test verilerini kalıcı olarak silecektir!${NC}"
read -p "Devam etmek istiyor musunuz? (y/N): " confirm

if [[ $confirm != [yY] ]]; then
    echo -e "${RED}❌ İşlem iptal edildi.${NC}"
    exit 0
fi

echo -e "${YELLOW}📊 Test verileri siliniyor...${NC}"

# Test verilerini sil
mysql -u$DB_USER -p$DB_PASSWORD $DB_NAME << EOF

-- Test kullanıcılarını listele
SELECT 'Test kullanıcıları:' as info;
SELECT sponsor_id, email, first_name, last_name, created_at 
FROM users 
WHERE email LIKE '%test%' OR email LIKE '%@example.com%' OR first_name LIKE '%test%';

-- Test kullanıcılarını sil
DELETE FROM users WHERE email LIKE '%test%' OR email LIKE '%@example.com%' OR first_name LIKE '%test%';

-- Test satışlarını listele
SELECT 'Test satışları:' as info;
SELECT * FROM sales_tracking WHERE sale_type = 'test' OR amount = 0;

-- Test satışlarını sil
DELETE FROM sales_tracking WHERE sale_type = 'test' OR amount = 0;

-- Test ödemelerini listele
SELECT 'Test ödemeleri:' as info;
SELECT * FROM payments WHERE amount = 0 OR payment_type = 'test';

-- Test ödemelerini sil
DELETE FROM payments WHERE amount = 0 OR payment_type = 'test';

-- Test müşteri kayıtlarını listele
SELECT 'Test müşteri kayıtları:' as info;
SELECT * FROM customer_satisfaction WHERE customer_name LIKE '%test%';

-- Test müşteri kayıtlarını sil
DELETE FROM customer_satisfaction WHERE customer_name LIKE '%test%';

-- Test sponsorluk kayıtlarını listele
SELECT 'Test sponsorluk kayıtları:' as info;
SELECT * FROM sponsorship_tracking WHERE partner_name LIKE '%test%';

-- Test sponsorluk kayıtlarını sil
DELETE FROM sponsorship_tracking WHERE partner_name LIKE '%test%';

-- Test takım kayıtlarını listele
SELECT 'Test takım kayıtları:' as info;
SELECT * FROM team_tracking WHERE member_name LIKE '%test%';

-- Test takım kayıtlarını sil
DELETE FROM team_tracking WHERE member_name LIKE '%test%';

-- Test kariyer kayıtlarını listele
SELECT 'Test kariyer kayıtları:' as info;
SELECT * FROM career_tracking WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%test%');

-- Test kariyer kayıtlarını sil
DELETE FROM career_tracking WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%test%');

-- Silinen kayıt sayılarını göster
SELECT 'Silme işlemi tamamlandı!' as info;

EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Test verileri başarıyla silindi!${NC}"
else
    echo -e "${RED}❌ Test verileri silinirken hata oluştu!${NC}"
fi

echo -e "${BLUE}📋 Silinen Veriler:${NC}"
echo -e "${YELLOW}• Test kullanıcıları${NC}"
echo -e "${YELLOW}• Test satışları${NC}"
echo -e "${YELLOW}• Test ödemeleri${NC}"
echo -e "${YELLOW}• Test müşteri kayıtları${NC}"
echo -e "${YELLOW}• Test sponsorluk kayıtları${NC}"
echo -e "${YELLOW}• Test takım kayıtları${NC}"
echo -e "${YELLOW}• Test kariyer kayıtları${NC}"
