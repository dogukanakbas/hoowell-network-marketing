#!/bin/bash

# Güvenli Satış Verisi Temizleme Script'i
echo "🧹 SATIŞ TAKİP PANELİ VERİ TEMİZLEME"
echo "====================================="

# 1. YEDEK ALMA
echo ""
echo "📦 Veritabanı yedeği alınıyor..."
BACKUP_FILE="backup_before_sales_cleanup_$(date +%Y%m%d_%H%M%S).sql"
mysqldump -u root -p hoowell_network > "$BACKUP_FILE"
echo "✅ Yedek alındı: $BACKUP_FILE"

# 2. MEVCUT DURUMU KONTROL ET
echo ""
echo "🔍 Mevcut satış verilerini kontrol ediliyor..."
mysql -u root -p hoowell_network -e "
SELECT 'MEVCUT SATIŞ VERİLERİ' as status;
SELECT 
    sale_type,
    COUNT(*) as satis_sayisi,
    SUM(sale_amount) as toplam_tutar
FROM sales_tracking 
GROUP BY sale_type
ORDER BY satis_sayisi DESC;
"

# 3. FRANCHISE SATIŞLARINI LİSTELE
echo ""
echo "📋 Silinecek franchise satışları listeleniyor..."
mysql -u root -p hoowell_network -e "
SELECT 'FRANCHISE SATIŞLARI (SİLİNECEK)' as status;
SELECT 
    id,
    seller_id,
    product_name,
    sale_type,
    sale_amount,
    sale_date,
    status
FROM sales_tracking 
WHERE sale_type IN ('franchise_education', 'franchise_education_hidden', 'partner_registration')
ORDER BY created_at DESC;
"

# 4. KULLANICI ONAYI
echo ""
read -p "❓ Franchise satışlarını silmek istiyor musunuz? (y/N): " confirm
if [[ $confirm != [yY] ]]; then
    echo "❌ Silme işlemi iptal edildi."
    exit 1
fi

# 5. SİLME İŞLEMİ
echo ""
echo "🗑️ Franchise satışları siliniyor..."
mysql -u root -p hoowell_network -e "
DELETE FROM sales_tracking 
WHERE sale_type IN ('franchise_education', 'franchise_education_hidden', 'partner_registration');
"
echo "✅ Franchise satışları silindi!"

# 6. SİLME SONRASI KONTROL
echo ""
echo "🔍 Silme sonrası durum kontrol ediliyor..."
mysql -u root -p hoowell_network -e "
SELECT 'SİLME SONRASI KALAN SATIŞLAR' as status;
SELECT 
    sale_type,
    COUNT(*) as satis_sayisi,
    SUM(sale_amount) as toplam_tutar
FROM sales_tracking 
GROUP BY sale_type
ORDER BY satis_sayisi DESC;
"

echo ""
echo "🎉 Satış verisi temizleme işlemi tamamlandı!"
echo "📁 Yedek dosyası: $BACKUP_FILE"
