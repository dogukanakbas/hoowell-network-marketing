#!/bin/bash

# Hızlı PayTR Düzeltme Script'i
# HOOWELL Payment System

echo "🔧 Hızlı PayTR Düzeltme..."

# Database düzelt
echo "🗄️ Database düzeltiliyor..."
mysql -u root -p'HoowellDB_2025' hoowell_network < fix_payments_table.sql

# Dosyaları güncelle
echo "📁 Dosyalar güncelleniyor..."
sudo cp paytr_callback.php /var/www/html/
sudo cp debug_paytr_callback.php /var/www/html/
sudo chown www-data:www-data /var/www/html/paytr_callback.php
sudo chown www-data:www-data /var/www/html/debug_paytr_callback.php

# Log'ları temizle
echo "📝 Log'lar temizleniyor..."
sudo truncate -s 0 /var/log/hoowell/paytr_callback.log

echo "✅ Düzeltme tamamlandı!"
echo ""
echo "📋 Test edin:"
echo "1. https://hoowell.net/debug_paytr_callback.php"
echo "2. tail -f /var/log/hoowell/paytr_callback.log"
echo ""
