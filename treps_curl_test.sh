#!/bin/bash

echo "🔐 TREPS Authentication Test (curl)"

# 1. Authentication
echo "📤 Auth isteği gönderiliyor..."
AUTH_RESPONSE=$(curl -s -X POST https://api.treps.io/api/auth \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "merchant_id": 35,
    "username": "apiuser",
    "password": "9b{J_7Yo5i/D"
  }')

echo "Auth Response: $AUTH_RESPONSE"

# Token çıkar
TOKEN=$(echo $AUTH_RESPONSE | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Token alınamadı!"
    exit 1
fi

echo "✅ Token alındı: $TOKEN"

# 2. IFRAME Test
echo "💳 IFRAME test başlatılıyor..."

PAYMENT_RESPONSE=$(curl -s -X POST https://api.treps.io/api/payment/hostedpage \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "external_order_id": "CURL_TEST_123",
    "amount": 100,
    "currency": "TRY",
    "secure_flag": 1,
    "transaction_type": 1,
    "min_installment": 1,
    "max_installment": 1,
    "expire_date": "2025-08-25T23:00:00.000Z",
    "return_url": "https://panel.hoowell.net",
    "retry_fail": true,
    "iframe_flag": 1,
    "iframe_web_uri": "https://panel.hoowell.net",
    "lang": "tr",
    "client_ip": "127.0.0.1",
    "description": "Curl Test"
  }')

echo "Payment Response: $PAYMENT_RESPONSE"

# HTTP status code kontrol
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST https://api.treps.io/api/payment/hostedpage \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "external_order_id": "CURL_TEST_123",
    "amount": 100,
    "currency": "TRY",
    "secure_flag": 1,
    "transaction_type": 1,
    "min_installment": 1,
    "max_installment": 1,
    "expire_date": "2025-08-25T23:00:00.000Z",
    "return_url": "https://panel.hoowell.net",
    "retry_fail": true,
    "iframe_flag": 1,
    "iframe_web_uri": "https://panel.hoowell.net",
    "lang": "tr",
    "client_ip": "127.0.0.1",
    "description": "Curl Test"
  }')

echo "HTTP Status Code: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ TREPS API çalışıyor!"
elif [ "$HTTP_CODE" = "403" ]; then
    echo "❌ 403 Forbidden - TREPS hesap ayarları sorunlu"
else
    echo "❌ HTTP $HTTP_CODE - Diğer hata"
fi
