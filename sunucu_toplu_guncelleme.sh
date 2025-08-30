#!/bin/bash

# HOOWELL Sunucu Toplu Güncelleme Scripti
# Bu script tüm son değişiklikleri sunucuya yükler

echo "🚀 HOOWELL Sunucu Toplu Güncelleme Başlıyor..."
echo "================================================"

# Sunucu bilgileri (değiştirin)
SERVER_IP="your-server-ip"
SERVER_USER="root"
SERVER_PATH="/root/hoowell"

# 1. Backend güncelleme
echo "📦 Backend güncelleniyor..."
scp backend/server.js $SERVER_USER@$SERVER_IP:$SERVER_PATH/backend/

# 2. Frontend güncelleme
echo "🎨 Frontend güncelleniyor..."
scp frontend/src/components/AdminPartnerDataFix.js $SERVER_USER@$SERVER_IP:$SERVER_PATH/frontend/src/components/
scp frontend/src/components/AdminCareerManagement.js $SERVER_USER@$SERVER_IP:$SERVER_PATH/frontend/src/components/
scp frontend/src/components/AdminMonthlySales.js $SERVER_USER@$SERVER_IP:$SERVER_PATH/frontend/src/components/
scp frontend/src/components/AdminPaymentDetails.js $SERVER_USER@$SERVER_IP:$SERVER_PATH/frontend/src/components/
scp frontend/src/components/AdminCompanyManagement.js $SERVER_USER@$SERVER_IP:$SERVER_PATH/frontend/src/components/
scp frontend/src/components/AdminCustomerDataFix.js $SERVER_USER@$SERVER_IP:$SERVER_PATH/frontend/src/components/
scp frontend/src/components/Layout.js $SERVER_USER@$SERVER_IP:$SERVER_PATH/frontend/src/components/
scp frontend/src/components/AdminSystemSettings.js $SERVER_USER@$SERVER_IP:$SERVER_PATH/frontend/src/components/
scp frontend/src/components/KisiselYonetim.js $SERVER_USER@$SERVER_IP:$SERVER_PATH/frontend/src/components/
scp frontend/src/components/FranchiseNetwork.js $SERVER_USER@$SERVER_IP:$SERVER_PATH/frontend/src/components/
scp frontend/src/components/PaymentSuccess.js $SERVER_USER@$SERVER_IP:$SERVER_PATH/frontend/src/components/
scp frontend/src/components/PaymentFail.js $SERVER_USER@$SERVER_IP:$SERVER_PATH/frontend/src/components/
scp frontend/src/components/CustomerSatisfactionTracker.js $SERVER_USER@$SERVER_IP:$SERVER_PATH/frontend/src/components/
scp frontend/src/components/SponsorshipTracker.js $SERVER_USER@$SERVER_IP:$SERVER_PATH/frontend/src/components/

# 3. Veritabanı güncelleme
echo "🗄️ Veritabanı güncelleniyor..."
scp add_nickname_column.sql $SERVER_USER@$SERVER_IP:$SERVER_PATH/

# 4. Sunucuda çalıştırma
echo "🔄 Sunucuda güncellemeler uygulanıyor..."
ssh $SERVER_USER@$SERVER_IP << 'EOF'
cd /root/hoowell

# Veritabanı güncelleme
echo "Veritabanı güncelleniyor..."
mysql -u root -p hoowell_network < add_nickname_column.sql

# PM2 restart
echo "PM2 yeniden başlatılıyor..."
pm2 restart all

echo "✅ Güncelleme tamamlandı!"
EOF

echo "🎉 Toplu güncelleme tamamlandı!"
echo "================================================"
echo "📋 Güncellenen dosyalar:"
echo "  - backend/server.js (nickname sistemi, admin API'leri)"
echo "  - AdminPartnerDataFix.js (iş ortağı verileri)"
echo "  - AdminCareerManagement.js (ürün yönetimi)"
echo "  - AdminMonthlySales.js (aylık satışlar)"
echo "  - AdminPaymentDetails.js (ödeme detayları)"
echo "  - Layout.js (admin menü)"
echo "  - KisiselYonetim.js (nickname sistemi)"
echo "  - FranchiseNetwork.js (nickname gösterimi)"
echo "  - PaymentSuccess.js (merkezleme)"
echo "  - PaymentFail.js (merkezleme)"
echo "  - CustomerSatisfactionTracker.js (referans görüntüleme)"
echo "  - SponsorshipTracker.js (tablo genişletme)"
echo "  - add_nickname_column.sql (veritabanı)"
echo ""
echo "🌐 Sunucu: https://panel.hoowell.net"
echo "🔧 PM2 Logları: pm2 logs"
