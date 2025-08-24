#!/bin/bash

echo "🚨 TREPS 500 HATASI - FINAL ÇÖZÜM"
echo "================================="

# 1. Backend'i tamamen durdur
echo "🛑 1. Backend durduruluyor..."
pm2 stop hoowell-backend

# 2. Backend'i yeniden başlat
echo "🔄 2. Backend yeniden başlatılıyor..."
pm2 start hoowell-backend
sleep 5

# 3. Backend durumunu kontrol et
echo "📋 3. Backend durumu:"
pm2 status

# 4. Backend loglarını kontrol et
echo "📊 4. Backend logları:"
pm2 logs hoowell-backend --lines 10

# 5. TREPS route'unu test et
echo "🧪 5. TREPS route test ediliyor..."
curl -X POST https://panel.hoowell.net/api/treps/create-payment \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "orderId": "test123"}' \
  -v

# 6. Test scriptini çalıştır
echo "🧪 6. TREPS test scripti çalıştırılıyor..."
cd /root/hoowell
node test_treps_new.js

# 7. Frontend build
echo "🏗️ 7. Frontend build ediliyor..."
cd /root/hoowell/frontend
npm run build

echo ""
echo "✅ Final çözüm tamamlandı!"
echo "🌐 Test: https://panel.hoowell.net/customer-registration"
echo "📊 Logları takip etmek için: pm2 logs hoowell-backend --follow"
