#!/bin/bash

# PayTR Callback Kurulum Script'i - Sunucu Versiyonu
# HOOWELL Payment System
# Tarih: 08.01.2025

echo "🚀 PayTR Callback Kurulum Başlıyor (Sunucu)..."

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

# Proje dizini kontrolü
PROJECT_DIR="/root/hoowell"
if [ ! -d "$PROJECT_DIR" ]; then
    log_error "Proje dizini bulunamadı: $PROJECT_DIR"
    exit 1
fi

log_success "Proje dizini bulundu: $PROJECT_DIR"

# Web server kontrolü ve web root belirleme
check_web_server() {
    log_info "Web server kontrol ediliyor..."
    
    if systemctl is-active --quiet apache2; then
        WEB_SERVER="apache2"
        WEB_ROOT="/var/www/html"
        log_success "Apache2 aktif - Web Root: $WEB_ROOT"
    elif systemctl is-active --quiet nginx; then
        WEB_SERVER="nginx"
        WEB_ROOT="/var/www/html"
        log_success "Nginx aktif - Web Root: $WEB_ROOT"
    else
        log_warning "Web server bulunamadı. Manuel kontrol gerekli."
        WEB_SERVER="unknown"
        WEB_ROOT="/var/www/html"
    fi
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

# Log dizini oluştur
setup_log_directory() {
    log_info "Log dizini oluşturuluyor..."
    
    sudo mkdir -p /var/log/hoowell
    sudo chown www-data:www-data /var/log/hoowell
    sudo chmod 755 /var/log/hoowell
    
    log_success "Log dizini oluşturuldu: /var/log/hoowell"
}

# PayTR callback dosyalarını kopyala
copy_callback_files() {
    log_info "PayTR callback dosyaları kopyalanıyor..."
    
    # Callback dosyasını kopyala
    if [ -f "$PROJECT_DIR/paytr_callback.php" ]; then
        sudo cp "$PROJECT_DIR/paytr_callback.php" "$WEB_ROOT/"
        sudo chown www-data:www-data "$WEB_ROOT/paytr_callback.php"
        sudo chmod 644 "$WEB_ROOT/paytr_callback.php"
        log_success "PayTR callback dosyası kopyalandı: $WEB_ROOT/paytr_callback.php"
    else
        log_error "paytr_callback.php dosyası bulunamadı: $PROJECT_DIR/paytr_callback.php"
        exit 1
    fi
    
    # Debug dosyasını kopyala
    if [ -f "$PROJECT_DIR/debug_paytr_callback.php" ]; then
        sudo cp "$PROJECT_DIR/debug_paytr_callback.php" "$WEB_ROOT/"
        sudo chown www-data:www-data "$WEB_ROOT/debug_paytr_callback.php"
        sudo chmod 644 "$WEB_ROOT/debug_paytr_callback.php"
        log_success "Debug dosyası kopyalandı: $WEB_ROOT/debug_paytr_callback.php"
    else
        log_warning "debug_paytr_callback.php dosyası bulunamadı"
    fi
}

# Callback URL testi
test_callback_url() {
    log_info "Callback URL test ediliyor..."
    
    local callback_url="http://localhost/paytr_callback.php"
    local debug_url="http://localhost/debug_paytr_callback.php"
    
    # Basit test
    if curl -s -o /dev/null -w "%{http_code}" "$callback_url" | grep -q "200\|404"; then
        log_success "Callback URL erişilebilir: $callback_url"
    else
        log_warning "Callback URL test edilemedi. Manuel kontrol gerekli."
    fi
    
    # Debug URL testi
    if curl -s -o /dev/null -w "%{http_code}" "$debug_url" | grep -q "200"; then
        log_success "Debug URL erişilebilir: $debug_url"
    else
        log_warning "Debug URL test edilemedi."
    fi
}

# Database bağlantı testi
test_database_connection() {
    log_info "Database bağlantısı test ediliyor..."
    
    # MySQL bağlantı testi
    if mysql -u hoowell_user -p'HoowellDB_2025' -e "USE hoowell_network; SELECT 1;" &> /dev/null; then
        log_success "Database bağlantısı başarılı"
    else
        log_error "Database bağlantısı başarısız!"
        log_info "Database bilgilerini kontrol edin:"
        log_info "- Host: localhost"
        log_info "- Database: hoowell_network"
        log_info "- User: hoowell_user"
        log_info "- Password: HoowellDB_2025"
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
    
    # Sadece PayTR IP'lerinden erişime izin ver (opsiyonel)
    # PayTR IP aralıkları: 185.27.74.0/24, 185.27.75.0/24
    # Allow from 185.27.74.0/24
    # Allow from 185.27.75.0/24
</Files>

# PHP hata gösterimini kapat
php_flag display_errors off
php_flag log_errors on
EOF
        
        if [ -f ".htaccess" ]; then
            sudo cp .htaccess "$WEB_ROOT/"
            sudo chown www-data:www-data "$WEB_ROOT/.htaccess"
            sudo chmod 644 "$WEB_ROOT/.htaccess"
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

# Son 10 dakikada log var mı kontrol et
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
    sudo mv monitor_paytr_callback.sh /root/hoowell/
    log_success "Monitoring script'i oluşturuldu: /root/hoowell/monitor_paytr_callback.sh"
}

# Ana kurulum fonksiyonu
main() {
    echo "=========================================="
    echo "PayTR Callback Kurulum Script'i (Sunucu)"
    echo "HOOWELL Payment System"
    echo "=========================================="
    
    check_php
    check_web_server
    setup_log_directory
    copy_callback_files
    test_callback_url
    test_database_connection
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
    echo "✅ Callback dosyaları kopyalandı"
    echo "✅ Callback URL test edildi"
    echo "✅ Database bağlantısı test edildi"
    echo "✅ Güvenlik ayarları yapılandırıldı"
    echo "✅ Monitoring script'i oluşturuldu"
    echo ""
    echo "🔧 Sonraki Adımlar:"
    echo "1. Debug sayfasını ziyaret edin:"
    echo "   http://your-domain.com/debug_paytr_callback.php"
    echo ""
    echo "2. PayTR panelinden bildirim URL'ini ayarlayın:"
    echo "   https://hoowell.net/paytr_callback.php"
    echo ""
    echo "3. Test ödemesi yapın ve log'ları kontrol edin:"
    echo "   tail -f /var/log/hoowell/paytr_callback.log"
    echo ""
    echo "4. Monitoring script'ini cron'a ekleyin:"
    echo "   */5 * * * * /root/hoowell/monitor_paytr_callback.sh"
    echo ""
    echo "5. Web server'ı yeniden başlatın:"
    if [ "$WEB_SERVER" = "apache2" ]; then
        echo "   sudo systemctl restart apache2"
    elif [ "$WEB_SERVER" = "nginx" ]; then
        echo "   sudo systemctl restart nginx"
    fi
    echo ""
}

# Script'i çalıştır
main "$@"
