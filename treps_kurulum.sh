#!/bin/bash

echo "🏦 TREPS ENTEGRASYONU KURULUMU BAŞLIYOR..."
echo "=========================================="

# 1. Backend restart
echo "📡 Backend yeniden başlatılıyor..."
pm2 restart hoowell-backend

# 2. Logları kontrol et
echo "📋 Backend logları kontrol ediliyor..."
pm2 logs hoowell-backend --lines 10

# 3. TREPS test et
echo "🧪 TREPS entegrasyonu test ediliyor..."
cd /root/hoowell
node test_treps_new.js

# 4. Test sonuçlarını kontrol et
echo "✅ Test tamamlandı!"
echo "📊 Sonuçları kontrol etmek için: pm2 logs hoowell-backend"

echo ""
echo "🎉 TREPS KURULUMU TAMAMLANDI!"
echo "🌐 Test etmek için: https://panel.hoowell.net"
