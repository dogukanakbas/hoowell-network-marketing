#!/bin/bash

# Güvenli Partner Transfer Script'i
# Hakan Dalkılıç'ın partnerlerini Hoowell Admin'e transfer eder

echo "🔄 HOOWELL PARTNER TRANSFER İŞLEMİ"
echo "=================================="

# 1. YEDEK ALMA
echo "📦 Veritabanı yedeği alınıyor..."
BACKUP_FILE="backup_before_transfer_$(date +%Y%m%d_%H%M%S).sql"
mysqldump -u root -p hoowell_network users > "$BACKUP_FILE"
echo "✅ Yedek alındı: $BACKUP_FILE"

# 2. TRANSFER ÖNCESİ KONTROL
echo ""
echo "🔍 Transfer öncesi durum kontrol ediliyor..."
mysql -u root -p hoowell_network -e "
SELECT 'TRANSFER ÖNCESİ DURUM' as status;
SELECT 
    'Hakan Dalkılıç Partner Sayısı' as info,
    COUNT(*) as partner_count
FROM users 
WHERE sponsor_id = 'P2025000014' OR created_by = 2;
SELECT 
    'Hoowell Admin Partner Sayısı' as info,
    COUNT(*) as partner_count
FROM users 
WHERE sponsor_id = 'P2025000000' OR created_by = 1;
"

# 3. KULLANICI ONAYI
echo ""
read -p "❓ Transfer işlemini başlatmak istiyor musunuz? (y/N): " confirm
if [[ $confirm != [yY] ]]; then
    echo "❌ Transfer işlemi iptal edildi."
    exit 1
fi

# 4. TRANSFER İŞLEMİ
echo ""
echo "🔄 Partner transfer işlemi başlatılıyor..."

mysql -u root -p hoowell_network -e "
-- sponsor_id güncelleme
UPDATE users 
SET sponsor_id = 'P2025000000'
WHERE sponsor_id = 'P2025000014';

-- created_by güncelleme
UPDATE users 
SET created_by = 1
WHERE created_by = 2;
"

echo "✅ Transfer işlemi tamamlandı!"

# 5. TRANSFER SONRASI KONTROL
echo ""
echo "🔍 Transfer sonrası durum kontrol ediliyor..."
mysql -u root -p hoowell_network -e "
SELECT 'TRANSFER SONRASI DURUM' as status;
SELECT 
    'Hakan Dalkılıç Yeni Partner Sayısı' as info,
    COUNT(*) as partner_count
FROM users 
WHERE sponsor_id = 'P2025000014' OR created_by = 2;
SELECT 
    'Hoowell Admin Yeni Partner Sayısı' as info,
    COUNT(*) as partner_count
FROM users 
WHERE sponsor_id = 'P2025000000' OR created_by = 1;
"

echo ""
echo "🎉 Partner transfer işlemi başarıyla tamamlandı!"
echo "📁 Yedek dosyası: $BACKUP_FILE"
