-- Aktiflik Hesaplama Sistemi Düzeltmesi
USE hoowell_network;

-- 1. Mevcut franchise satışlarını kontrol et
SELECT 'MEVCUT FRANCHISE SATIŞLARI' as status;
SELECT 
    id,
    seller_id,
    product_name,
    sale_type,
    sale_amount,
    sale_date,
    status,
    created_at
FROM sales_tracking 
WHERE sale_type IN ('franchise_education', 'franchise_education_hidden', 'partner_registration')
ORDER BY created_at DESC;

-- 2. Ürün satışlarını kontrol et (aktiflik için geçerli)
SELECT 'ÜRÜN SATIŞLARI (AKTİFLİK İÇİN GEÇERLİ)' as status;
SELECT 
    id,
    seller_id,
    product_name,
    sale_type,
    sale_amount,
    sale_date,
    status,
    created_at
FROM sales_tracking 
WHERE sale_type IN ('product_sale', 'customer_registration')
ORDER BY created_at DESC;

-- 3. Kullanıcıların aktiflik durumunu kontrol et
SELECT 'KULLANICILARIN AKTİFLİK DURUMU' as status;
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.created_at,
    -- Bu ay ürün satış sayısı
    (SELECT COUNT(*) 
     FROM sales_tracking st 
     WHERE st.seller_id = u.id 
     AND st.sale_type IN ('product_sale', 'customer_registration')
     AND MONTH(st.sale_date) = MONTH(CURDATE())
     AND YEAR(st.sale_date) = YEAR(CURDATE())
     AND (st.status = 'active' OR (st.status = 'pending' AND st.bonus_date <= NOW()))) as product_sales_this_month,
    -- Bu ay yeni iş ortağı ilk satış sayısı
    (SELECT COUNT(*) 
     FROM sales_tracking st 
     WHERE st.seller_id = u.id 
     AND st.sale_type = 'partner_registration'
     AND MONTH(st.sale_date) = MONTH(CURDATE())
     AND YEAR(st.sale_date) = YEAR(CURDATE())
     AND (st.status = 'active' OR (st.status = 'pending' AND st.bonus_date <= NOW()))) as new_partner_sales_this_month,
    -- Aktiflik durumu
    CASE 
        WHEN (SELECT COUNT(*) 
              FROM sales_tracking st 
              WHERE st.seller_id = u.id 
              AND st.sale_type IN ('product_sale', 'customer_registration')
              AND MONTH(st.sale_date) = MONTH(CURDATE())
              AND YEAR(st.sale_date) = YEAR(CURDATE())
              AND (st.status = 'active' OR (st.status = 'pending' AND st.bonus_date <= NOW()))) > 0
        OR (SELECT COUNT(*) 
            FROM sales_tracking st 
            WHERE st.seller_id = u.id 
            AND st.sale_type = 'partner_registration'
            AND MONTH(st.sale_date) = MONTH(CURDATE())
            AND YEAR(st.sale_date) = YEAR(CURDATE())
            AND (st.status = 'active' OR (st.status = 'pending' AND st.bonus_date <= NOW()))) > 0
        THEN 'AKTİF'
        ELSE 'PASİF'
    END as activity_status
FROM users u
WHERE u.role = 'partner'
ORDER BY u.created_at DESC;

-- 4. Aktiflik istatistikleri
SELECT 'AKTİFLİK İSTATİSTİKLERİ' as status;
SELECT 
    'Toplam Partner' as kategori,
    COUNT(*) as sayi
FROM users 
WHERE role = 'partner'
UNION ALL
SELECT 
    'Bu Ay Aktif' as kategori,
    COUNT(*) as sayi
FROM users u
WHERE u.role = 'partner'
AND (
    (SELECT COUNT(*) 
     FROM sales_tracking st 
     WHERE st.seller_id = u.id 
     AND st.sale_type IN ('product_sale', 'customer_registration')
     AND MONTH(st.sale_date) = MONTH(CURDATE())
     AND YEAR(st.sale_date) = YEAR(CURDATE())
     AND (st.status = 'active' OR (st.status = 'pending' AND st.bonus_date <= NOW()))) > 0
    OR 
    (SELECT COUNT(*) 
     FROM sales_tracking st 
     WHERE st.seller_id = u.id 
     AND st.sale_type = 'partner_registration'
     AND MONTH(st.sale_date) = MONTH(CURDATE())
     AND YEAR(st.sale_date) = YEAR(CURDATE())
     AND (st.status = 'active' OR (st.status = 'pending' AND st.bonus_date <= NOW()))) > 0
)
UNION ALL
SELECT 
    'Bu Ay Pasif' as kategori,
    COUNT(*) as sayi
FROM users u
WHERE u.role = 'partner'
AND (
    (SELECT COUNT(*) 
     FROM sales_tracking st 
     WHERE st.seller_id = u.id 
     AND st.sale_type IN ('product_sale', 'customer_registration')
     AND MONTH(st.sale_date) = MONTH(CURDATE())
     AND YEAR(st.sale_date) = YEAR(CURDATE())
     AND (st.status = 'active' OR (st.status = 'pending' AND st.bonus_date <= NOW()))) = 0
    AND 
    (SELECT COUNT(*) 
     FROM sales_tracking st 
     WHERE st.seller_id = u.id 
     AND st.sale_type = 'partner_registration'
     AND MONTH(st.sale_date) = MONTH(CURDATE())
     AND YEAR(st.sale_date) = YEAR(CURDATE())
     AND (st.status = 'active' OR (st.status = 'pending' AND st.bonus_date <= NOW()))) = 0
);
