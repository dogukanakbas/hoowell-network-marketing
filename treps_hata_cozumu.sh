#!/bin/bash

echo "🚨 TREPS HATASI ÇÖZÜMÜ BAŞLIYOR..."
echo "=================================="

# 1. Backend loglarını kontrol et
echo "📊 1. Backend logları kontrol ediliyor..."
pm2 logs hoowell-backend --lines 20

# 2. Backend'i yeniden başlat
echo "🔄 2. Backend yeniden başlatılıyor..."
pm2 restart hoowell-backend
sleep 3

# 3. Backend durumunu kontrol et
echo "📋 3. Backend durumu:"
pm2 status

# 4. TREPS route'unu test et
echo "🧪 4. TREPS route test ediliyor..."
curl -X POST https://panel.hoowell.net/api/treps/create-payment \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "orderId": "test123"}' \
  -v

# 5. Test scriptini çalıştır
echo "🧪 5. TREPS test scripti çalıştırılıyor..."
cd /root/hoowell
node test_treps_new.js

echo ""
echo "✅ Hata çözümü tamamlandı!"
echo "📊 Logları takip etmek için: pm2 logs hoowell-backend --follow"
