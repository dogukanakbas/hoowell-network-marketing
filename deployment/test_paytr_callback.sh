#!/bin/bash

# 🧪 PayTR Callback Test Script'i

echo "🧪 PayTR Callback Test Başlıyor..."

# Test 1: Basit erişim testi
echo "Test 1: Basit erişim testi"
curl -I https://hoowell.net/paytr_callback.php

echo -e "\n"

# Test 2: POST isteği testi
echo "Test 2: POST isteği testi"
curl -X POST https://hoowell.net/paytr_callback.php \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "merchant_oid=TEST123&status=success&total_amount=1000&hash=dummy_hash"

echo -e "\n"

# Test 3: PayTR formatında test
echo "Test 3: PayTR formatında test"
curl -X POST https://hoowell.net/paytr_callback.php \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "User-Agent: PayTR-Callback/1.0" \
  -d "merchant_oid=HOOWELL$(date +%s)&status=success&total_amount=5000&hash=test_hash_$(date +%s)"

echo -e "\n"

# Test 4: Log dosyasını kontrol et
echo "Test 4: Log dosyası kontrolü"
if [ -f "/var/log/hoowell/paytr_callback.log" ]; then
    echo "✅ Log dosyası mevcut"
    echo "Son 5 satır:"
    sudo tail -5 /var/log/hoowell/paytr_callback.log
else
    echo "❌ Log dosyası bulunamadı"
fi

echo -e "\n"

# Test 5: PHP error log kontrolü
echo "Test 5: PHP error log kontrolü"
if [ -f "/var/log/php8.1-fpm.log" ]; then
    echo "PHP-FPM log son 3 satır:"
    sudo tail -3 /var/log/php8.1-fpm.log
fi

echo -e "\n"
echo "🎯 PayTR Panel'de kullanılacak URL:"
echo "   Bildirim URL'i: https://hoowell.net/paytr_callback.php"
echo "   Başarılı Ödeme: https://hoowell.net/payment/success"
echo "   Başarısız Ödeme: https://hoowell.net/payment/fail"