#!/bin/bash

# 🚀 HOOWELL Hızlı Manuel Kurulum Komutları
# Bu dosyayı sunucuda çalıştırın

echo "🚀 HOOWELL Hızlı Manuel Kurulum Başlıyor..."
echo "================================================"

# 1. Sunucuya bağlanın
echo "📡 Sunucuya bağlanın:"
echo "ssh root@your-server-ip"
echo "cd /root/hoowell"
echo ""

# 2. Backend güncelleme
echo "🔧 Backend güncelleme:"
echo "nano backend/server.js"
echo "# Yeni server.js içeriğini yapıştırın"
echo ""

# 3. Frontend dosyaları
echo "🎨 Frontend dosyaları güncelleme:"
echo "nano frontend/src/components/AdminPartnerDataFix.js"
echo "nano frontend/src/components/AdminCareerManagement.js"
echo "nano frontend/src/components/AdminMonthlySales.js"
echo "nano frontend/src/components/AdminPaymentDetails.js"
echo "nano frontend/src/components/AdminCompanyManagement.js"
echo "nano frontend/src/components/AdminCustomerDataFix.js"
echo "nano frontend/src/components/Layout.js"
echo "nano frontend/src/components/AdminSystemSettings.js"
echo "nano frontend/src/components/KisiselYonetim.js"
echo "nano frontend/src/components/FranchiseNetwork.js"
echo "nano frontend/src/components/PaymentSuccess.js"
echo "nano frontend/src/components/PaymentFail.js"
echo "nano frontend/src/components/CustomerSatisfactionTracker.js"
echo "nano frontend/src/components/SponsorshipTracker.js"
echo ""

# 4. Veritabanı
echo "🗄️ Veritabanı güncelleme:"
echo "mysql -u root -p hoowell_network < add_nickname_column.sql"
echo ""

# 5. PM2 restart
echo "🔄 PM2 yeniden başlatma:"
echo "pm2 restart all"
echo "pm2 logs"
echo ""

echo "✅ Kurulum tamamlandı!"
echo "🌐 Test: https://panel.hoowell.net/admin"

