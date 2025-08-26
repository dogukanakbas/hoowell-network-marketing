-- Hakan Dalkılıç'ın İş Ortakları Kontrol Script'i
USE hoowell_network;

-- 1. HAKAN DALKILIÇ'IN BİLGİLERİ
SELECT 'HAKAN DALKILIÇ BİLGİLERİ' as status;
SELECT 
    id,
    first_name,
    last_name,
    email,
    sponsor_id,
    active_partners,
    total_kkp,
    career_level,
    created_at
FROM users 
WHERE id = 2 OR email = 'hakandalkilic14@gmail.com';

-- 2. HAKAN DALKILIÇ'IN İŞ ORTAKLARI
SELECT 'HAKAN DALKILIÇ İŞ ORTAKLARI' as status;
SELECT 
    id,
    first_name,
    last_name,
    email,
    sponsor_id,
    created_by,
    total_kkp,
    career_level,
    created_at,
    CONCAT(first_name, ' ', last_name) as full_name
FROM users 
WHERE sponsor_id = 'P2025000014' OR created_by = 2
ORDER BY created_at DESC;

-- 3. HAKAN DALKILIÇ'IN İŞ ORTAKLARI SAYISI
SELECT 'HAKAN DALKILIÇ İŞ ORTAKLARI SAYISI' as status;
SELECT 
    COUNT(*) as toplam_is_ortagi
FROM users 
WHERE sponsor_id = 'P2025000014' OR created_by = 2;

-- 4. HAKAN DALKILIÇ'IN AKTİF İŞ ORTAKLARI
SELECT 'HAKAN DALKILIÇ AKTİF İŞ ORTAKLARI' as status;
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.sponsor_id,
    u.created_by,
    u.total_kkp,
    u.career_level,
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
WHERE u.sponsor_id = 'P2025000014' OR u.created_by = 2
ORDER BY u.created_at DESC;

-- 5. HAKAN DALKILIÇ'IN AKTİF İŞ ORTAKLARI SAYISI
SELECT 'HAKAN DALKILIÇ AKTİF İŞ ORTAKLARI SAYISI' as status;
SELECT 
    COUNT(*) as aktif_is_ortagi_sayisi
FROM users u
WHERE (u.sponsor_id = 'P2025000014' OR u.created_by = 2)
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
);

-- 6. HAKAN DALKILIÇ'IN PASİF İŞ ORTAKLARI
SELECT 'HAKAN DALKILIÇ PASİF İŞ ORTAKLARI' as status;
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.sponsor_id,
    u.created_by,
    u.total_kkp,
    u.career_level,
    u.created_at
FROM users u
WHERE (u.sponsor_id = 'P2025000014' OR u.created_by = 2)
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
)
ORDER BY u.created_at DESC;
