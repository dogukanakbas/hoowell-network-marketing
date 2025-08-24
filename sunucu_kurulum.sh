#!/bin/bash

echo "🏦 HOOWELL TREPS ENTEGRASYONU KURULUMU BAŞLIYOR..."
echo "=================================================="
echo ""

# 1. Backend restart
echo "📡 1. Backend yeniden başlatılıyor..."
pm2 restart hoowell-backend
sleep 3

# 2. Backend durumu kontrol et
echo "📋 2. Backend durumu kontrol ediliyor..."
pm2 status
echo ""

# 3. Backend logları kontrol et
echo "📊 3. Son backend logları:"
pm2 logs hoowell-backend --lines 10
echo ""

# 4. Frontend build
echo "🏗️ 4. Frontend build ediliyor..."
cd /root/hoowell/frontend
npm run build
echo ""

# 5. Build durumu kontrol et
echo "📁 5. Build dosyaları kontrol ediliyor..."
ls -la build/
echo ""

# 6. TREPS test et
echo "🧪 6. TREPS entegrasyonu test ediliyor..."
cd /root/hoowell
node test_treps_new.js
echo ""

# 7. Nginx restart
echo "🌐 7. Nginx yeniden başlatılıyor..."
systemctl restart nginx
sleep 2

# 8. Nginx durumu kontrol et
echo "📊 8. Nginx durumu:"
systemctl status nginx --no-pager
echo ""

# 9. SSL sertifikaları kontrol et
echo "🔒 9. SSL sertifikaları kontrol ediliyor..."
certbot certificates
echo ""

echo ""
echo "🎉 KURULUM TAMAMLANDI!"
echo "======================"
echo ""
echo "🌐 Test URL'leri:"
echo "   Ana Site: https://hoowell.net"
echo "   Panel: https://panel.hoowell.net"
echo "   Müşteri Kayıt: https://panel.hoowell.net/customer-registration"
echo ""
echo "📊 Logları takip etmek için:"
echo "   pm2 logs hoowell-backend --follow"
echo ""
echo "🔧 Hata durumunda:"
echo "   pm2 restart hoowell-backend"
echo "   systemctl restart nginx"
