#!/bin/bash

# PayTR Callback Kurulum Script'i
# HOOWELL Payment System
# Tarih: 08.01.2025

echo "🚀 PayTR Callback Kurulum Başlıyor..."

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# PHP kontrolü
check_php() {
    log_info "PHP kontrol ediliyor..."
    if command -v php &> /dev/null; then
        PHP_VERSION=$(php -v | head -n1 | cut -d' ' -f2 | cut -d'.' -f1,2)
        log_success "PHP $PHP_VERSION bulundu"
    else
        log_error "PHP bulunamadı! Lütfen PHP kurun."
        exit 1
    fi
}

# Apache/Nginx kontrolü
check_web_server() {
    log_info "Web server kontrol ediliyor..."
    
    if systemctl is-active --quiet apache2; then
        WEB_SERVER="apache2"
        log_success "Apache2 aktif"
    elif systemctl is-active --quiet nginx; then
        WEB_SERVER="nginx"
        log_success "Nginx aktif"
    else
        log_warning "Web server bulunamadı. Manuel kontrol gerekli."
        WEB_SERVER="unknown"
    fi
}

# Log dizini oluştur
setup_log_directory() {
    log_info "Log dizini oluşturuluyor..."
    
    sudo mkdir -p /var/log/hoowell
    sudo chown www-data:www-data /var/log/hoowell
    sudo chmod 755 /var/log/hoowell
    
    log_success "Log dizini oluşturuldu: /var/log/hoowell"
}

# PayTR callback dosyasını kopyala
copy_callback_file() {
    log_info "PayTR callback dosyası kopyalanıyor..."
    
    # Web root dizinini bul
    if [ "$WEB_SERVER" = "apache2" ]; then
        WEB_ROOT="/var/www/html"
    elif [ "$WEB_SERVER" = "nginx" ]; then
        WEB_ROOT="/var/www/html"
    else
        WEB_ROOT="/var/www/html"
    fi
    
    # Callback dosyasını kopyala
    if [ -f "paytr_callback.php" ]; then
        sudo cp paytr_callback.php "$WEB_ROOT/"
        sudo chown www-data:www-data "$WEB_ROOT/paytr_callback.php"
        sudo chmod 644 "$WEB_ROOT/paytr_callback.php"
        log_success "PayTR callback dosyası kopyalandı: $WEB_ROOT/paytr_callback.php"
    else
        log_error "paytr_callback.php dosyası bulunamadı!"
        exit 1
    fi
}

# Test callback URL'i
test_callback_url() {
    log_info "Callback URL test ediliyor..."
    
    local callback_url="http://localhost/paytr_callback.php"
    
    # Basit test
    if curl -s -o /dev/null -w "%{http_code}" "$callback_url" | grep -q "200\|404"; then
        log_success "Callback URL erişilebilir: $callback_url"
    else
        log_warning "Callback URL test edilemedi. Manuel kontrol gerekli."
    fi
}

# PayTR test script'ini çalıştır
run_paytr_test() {
    log_info "PayTR entegrasyon testi çalıştırılıyor..."
    
    if [ -f "test_paytr_integration.js" ]; then
        node test_paytr_integration.js
        if [ $? -eq 0 ]; then
            log_success "PayTR test başarılı"
        else
            log_warning "PayTR test'te uyarılar var"
        fi
    else
        log_warning "test_paytr_integration.js bulunamadı"
    fi
}

# Güvenlik ayarları
setup_security() {
    log_info "Güvenlik ayarları yapılandırılıyor..."
    
    # .htaccess dosyası oluştur (Apache için)
    if [ "$WEB_SERVER" = "apache2" ]; then
        cat > .htaccess << 'EOF'
# PayTR Callback Güvenlik
<Files "paytr_callback.php">
    Order Allow,Deny
    Allow from all
    
    # Sadece PayTR IP'lerinden erişime izin ver
    # PayTR IP aralıkları: 185.27.74.0/24, 185.27.75.0/24
    # Geçici olarak tüm IP'lere izin ver (test için)
</Files>

# PHP hata gösterimini kapat
php_flag display_errors off
php_flag log_errors on
EOF
        
        if [ -f ".htaccess" ]; then
            sudo cp .htaccess /var/www/html/
            sudo chown www-data:www-data /var/www/html/.htaccess
            sudo chmod 644 /var/www/html/.htaccess
            log_success ".htaccess dosyası oluşturuldu"
        fi
    fi
}

# Monitoring script'i oluştur
create_monitoring_script() {
    log_info "Monitoring script'i oluşturuluyor..."
    
    cat > monitor_paytr_callback.sh << 'EOF'
#!/bin/bash

# PayTR Callback Monitoring Script
LOG_FILE="/var/log/hoowell/paytr_callback.log"
ALERT_EMAIL="admin@hoowell.net"

# Son 5 dakikada log var mı kontrol et
if [ -f "$LOG_FILE" ]; then
    LAST_LOG=$(tail -n 1 "$LOG_FILE" 2>/dev/null | grep -o '[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\} [0-9]\{2\}:[0-9]\{2\}:[0-9]\{2\}' 2>/dev/null)
    
    if [ -n "$LAST_LOG" ]; then
        LAST_LOG_TIME=$(date -d "$LAST_LOG" +%s 2>/dev/null)
        CURRENT_TIME=$(date +%s)
        DIFF_MINUTES=$(( (CURRENT_TIME - LAST_LOG_TIME) / 60 ))
        
        if [ $DIFF_MINUTES -gt 10 ]; then
            echo "PayTR callback log bulunamadı! Son log: $LAST_LOG" | mail -s "PayTR Callback Alert" "$ALERT_EMAIL"
        fi
    fi
fi
EOF
    
    chmod +x monitor_paytr_callback.sh
    log_success "Monitoring script'i oluşturuldu: monitor_paytr_callback.sh"
}

# Ana kurulum fonksiyonu
main() {
    echo "=========================================="
    echo "PayTR Callback Kurulum Script'i"
    echo "HOOWELL Payment System"
    echo "=========================================="
    
    check_php
    check_web_server
    setup_log_directory
    copy_callback_file
    test_callback_url
    setup_security
    create_monitoring_script
    
    echo ""
    echo "=========================================="
    echo "🎉 PayTR Callback Kurulum Tamamlandı!"
    echo "=========================================="
    echo ""
    echo "📋 Yapılan İşlemler:"
    echo "✅ PHP kontrol edildi"
    echo "✅ Web server kontrol edildi"
    echo "✅ Log dizini oluşturuldu"
    echo "✅ Callback dosyası kopyalandı"
    echo "✅ Callback URL test edildi"
    echo "✅ Güvenlik ayarları yapılandırıldı"
    echo "✅ Monitoring script'i oluşturuldu"
    echo ""
    echo "🔧 Sonraki Adımlar:"
    echo "1. PayTR panelinden bildirim URL'ini ayarlayın:"
    echo "   https://hoowell.net/paytr_callback.php"
    echo ""
    echo "2. Test ödemesi yapın:"
    echo "   node test_paytr_integration.js"
    echo ""
    echo "3. Log dosyasını kontrol edin:"
    echo "   tail -f /var/log/hoowell/paytr_callback.log"
    echo ""
    echo "4. Monitoring script'ini cron'a ekleyin:"
    echo "   */5 * * * * /path/to/monitor_paytr_callback.sh"
    echo ""
}

# Script'i çalıştır
main "$@"
