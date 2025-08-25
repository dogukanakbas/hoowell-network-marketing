#!/bin/bash

# Sunucu Güncelleme Script'i
echo "🔄 HOOWELL SUNUCU GÜNCELLEME İŞLEMİ"
echo "=================================="

# 1. YEDEK ALMA
echo ""
echo "📦 Veritabanı yedeği alınıyor..."
BACKUP_FILE="backup_before_update_$(date +%Y%m%d_%H%M%S).sql"
mysqldump -u root -p hoowell_network > "$BACKUP_FILE"
echo "✅ Yedek alındı: $BACKUP_FILE"

# 2. GİT PULL
echo ""
echo "🔄 GitHub'dan güncellemeler çekiliyor..."
cd /root/hoowell
git pull origin main
echo "✅ Git pull tamamlandı"

# 3. NPM PAKETLERİ GÜNCELLE
echo ""
echo "📦 NPM paketleri güncelleniyor..."
cd /root/hoowell/frontend
npm install
echo "✅ Frontend paketleri güncellendi"

cd /root/hoowell/backend
npm install
echo "✅ Backend paketleri güncellendi"

# 4. FRONTEND BUILD
echo ""
echo "🏗️ Frontend build ediliyor..."
cd /root/hoowell/frontend
npm run build
echo "✅ Frontend build tamamlandı"

# 5. PM2 RESTART
echo ""
echo "🔄 PM2 servisleri yeniden başlatılıyor..."
pm2 restart all
echo "✅ PM2 servisleri yeniden başlatıldı"

# 6. NGINX RELOAD
echo ""
echo "🔄 Nginx yeniden yükleniyor..."
systemctl reload nginx
echo "✅ Nginx yeniden yüklendi"

# 7. KONTROL
echo ""
echo "🔍 Servisler kontrol ediliyor..."
pm2 status
echo ""
echo "📊 Nginx durumu:"
systemctl status nginx --no-pager -l

echo ""
echo "🎉 Sunucu güncelleme işlemi tamamlandı!"
echo "📁 Yedek dosyası: $BACKUP_FILE"
