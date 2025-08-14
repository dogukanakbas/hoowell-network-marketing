#!/bin/bash

# PayTR Sorunlarını Düzeltme Script'i
# HOOWELL Payment System
# Tarih: 08.01.2025

echo "🔧 PayTR Sorunları Düzeltiliyor..."

# Renk kodları
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Log fonksiyonları
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Proje dizini
PROJECT_DIR="/root/hoowell"
WEB_ROOT="/var/www/html"

# 1. Database tablosunu düzelt
fix_database() {
    log_info "Database tablosu düzeltiliyor..."
    
    if [ -f "$PROJECT_DIR/fix_payments_table.sql" ]; then
        mysql -u root -p'HoowellDB_2025' hoowell_network < "$PROJECT_DIR/fix_payments_table.sql"
        log_success "Database tablosu düzeltildi"
    else
        log_error "fix_payments_table.sql dosyası bulunamadı"
        return 1
    fi
}

# 2. Callback dosyalarını güncelle
update_callback_files() {
    log_info "Callback dosyaları güncelleniyor..."
    
    # Callback dosyasını güncelle
    if [ -f "$PROJECT_DIR/paytr_callback.php" ]; then
        sudo cp "$PROJECT_DIR/paytr_callback.php" "$WEB_ROOT/"
        sudo chown www-data:www-data "$WEB_ROOT/paytr_callback.php"
        sudo chmod 644 "$WEB_ROOT/paytr_callback.php"
        log_success "paytr_callback.php güncellendi"
    else
        log_error "paytr_callback.php bulunamadı"
        return 1
    fi
    
    # Debug dosyasını güncelle
    if [ -f "$PROJECT_DIR/debug_paytr_callback.php" ]; then
        sudo cp "$PROJECT_DIR/debug_paytr_callback.php" "$WEB_ROOT/"
        sudo chown www-data:www-data "$WEB_ROOT/debug_paytr_callback.php"
        sudo chmod 644 "$WEB_ROOT/debug_paytr_callback.php"
        log_success "debug_paytr_callback.php güncellendi"
    else
        log_error "debug_paytr_callback.php bulunamadı"
        return 1
    fi
}

# 3. Log dosyasını temizle
clear_logs() {
    log_info "Log dosyası temizleniyor..."
    
    if [ -f "/var/log/hoowell/paytr_callback.log" ]; then
        sudo truncate -s 0 /var/log/hoowell/paytr_callback.log
        log_success "Log dosyası temizlendi"
    else
        log_warning "Log dosyası bulunamadı, oluşturuluyor..."
        sudo mkdir -p /var/log/hoowell
        sudo touch /var/log/hoowell/paytr_callback.log
        sudo chown www-data:www-data /var/log/hoowell/paytr_callback.log
        sudo chmod 644 /var/log/hoowell/paytr_callback.log
        log_success "Log dosyası oluşturuldu"
    fi
}

# 4. Test ödemesi oluştur
create_test_payment() {
    log_info "Test ödemesi oluşturuluyor..."
    
    # Test ödemesi için SQL
    TEST_SQL="
    INSERT INTO payments (merchant_oid, user_id, payment_type, amount, total_amount, status, currency, test_mode, created_at, updated_at) 
    VALUES ('TEST_$(date +%s)', 1, 'education', 864.00, 864.00, 'pending', 'TL', 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE updated_at = NOW();
    "
    
    echo "$TEST_SQL" | mysql -u root -p'HoowellDB_2025' hoowell_network
    log_success "Test ödemesi oluşturuldu"
}

# 5. Hash test fonksiyonu
test_hash_calculation() {
    log_info "Hash hesaplama test ediliyor..."
    
    # Test verileri
    MERCHANT_OID="TEST_$(date +%s)"
    STATUS="success"
    TOTAL_AMOUNT="8640000"
    MERCHANT_KEY="tMCPPznCxw8sb8b8"
    MERCHANT_SALT="bF1uwkXPAhDw5yok"
    
    # Hash hesapla
    HASH_STR="${MERCHANT_OID}${MERCHANT_SALT}${STATUS}${TOTAL_AMOUNT}"
    CALCULATED_HASH=$(echo -n "$HASH_STR" | openssl dgst -sha256 -hmac "$MERCHANT_KEY" -binary | base64)
    
    log_info "Test Hash String: $HASH_STR"
    log_info "Calculated Hash: $CALCULATED_HASH"
    
    # Test callback simülasyonu
    curl -X POST "https://hoowell.net/paytr_callback.php" \
         -d "merchant_oid=$MERCHANT_OID" \
         -d "status=$STATUS" \
         -d "total_amount=$TOTAL_AMOUNT" \
         -d "hash=$CALCULATED_HASH" \
         -d "test_mode=1" \
         -s -o /dev/null -w "HTTP: %{http_code}\n"
    
    log_success "Hash test tamamlandı"
}

# 6. Ana fonksiyon
main() {
    echo "=========================================="
    echo "PayTR Sorunları Düzeltme Script'i"
    echo "HOOWELL Payment System"
    echo "=========================================="
    echo ""
    
    # Database düzelt
    fix_database
    
    # Callback dosyalarını güncelle
    update_callback_files
    
    # Log'ları temizle
    clear_logs
    
    # Test ödemesi oluştur
    create_test_payment
    
    # Hash test
    test_hash_calculation
    
    echo ""
    echo "=========================================="
    echo "🎉 Düzeltme İşlemleri Tamamlandı!"
    echo "=========================================="
    echo ""
    echo "📋 Sonraki Adımlar:"
    echo "1. Debug sayfasını ziyaret edin:"
    echo "   https://hoowell.net/debug_paytr_callback.php"
    echo ""
    echo "2. Log dosyasını kontrol edin:"
    echo "   tail -f /var/log/hoowell/paytr_callback.log"
    echo ""
    echo "3. Test ödemesi yapın ve sonuçları kontrol edin"
    echo ""
    echo "4. PayTR panelinden bildirim URL'ini kontrol edin:"
    echo "   https://hoowell.net/paytr_callback.php"
    echo ""
}

# Script'i çalıştır
main "$@"
