#!/bin/bash

echo "=== FRANCHISE SATIŞ VERİLERİNİ GÜNCELLEME ==="
echo "Bu script mevcut franchise eğitim paketi satışlarını satış takip panelinden kaldırır"
echo ""

# 1. YEDEKLEME
echo "1. Veritabanı yedekleniyor..."
mysqldump -u root -p hoowell > /root/hoowell_franchise_backup_$(date +%Y%m%d_%H%M%S).sql
echo "✅ Yedekleme tamamlandı"

# 2. MEVCUT VERİLERİ KONTROL ET
echo "2. Mevcut franchise satışları kontrol ediliyor..."
mysql -u root -p hoowell -e "
SELECT 
    COUNT(*) as total_franchise_sales,
    sale_type
FROM sales_tracking 
WHERE sale_type = 'franchise_education' 
GROUP BY sale_type;
"

# 3. KULLANICI ONAYI
echo ""
read -p "Devam etmek istiyor musunuz? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ İşlem iptal edildi"
    exit 1
fi

# 4. GÜNCELLEME
echo "3. Franchise satışları güncelleniyor..."
mysql -u root -p hoowell -e "
UPDATE sales_tracking 
SET sale_type = 'franchise_education_hidden'
WHERE sale_type = 'franchise_education';
"

# 5. SONUÇ KONTROLÜ
echo "4. Güncelleme sonucu kontrol ediliyor..."
mysql -u root -p hoowell -e "
SELECT 
    COUNT(*) as updated_franchise_sales,
    sale_type
FROM sales_tracking 
WHERE sale_type IN ('franchise_education', 'franchise_education_hidden')
GROUP BY sale_type;
"

# 6. BACKEND RESTART
echo "5. Backend restart ediliyor..."
pm2 restart hoowell-backend
echo "✅ Backend restart edildi"

echo ""
echo "=== GÜNCELLEME TAMAMLANDI ==="
echo "✅ Mevcut franchise satışları satış takip panelinden kaldırıldı"
echo "✅ Veriler korundu (hidden olarak işaretlendi)"
echo "✅ Yeni franchise satışları da görünmeyecek"
echo ""
echo "🔗 Test: https://panel.hoowell.net/satis-takip"
