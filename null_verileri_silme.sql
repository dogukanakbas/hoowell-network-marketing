-- NULL Verileri Güvenli Silme Script'i
USE hoowell_network;

-- Önce mevcut durumu göster
SELECT 'BEFORE DELETE - NULL Veriler' as status;
SELECT 
    COUNT(*) as total_records,
    COUNT(CASE WHEN customer_id IS NULL THEN 1 END) as null_customer_id,
    COUNT(CASE WHEN partner_id IS NULL THEN 1 END) as null_partner_id,
    COUNT(CASE WHEN customer_id IS NULL AND partner_id IS NULL THEN 1 END) as both_null
FROM sales_tracking;

-- NULL verileri listele
SELECT 'NULL VERİLER LİSTESİ' as info;
SELECT 
    id,
    seller_id,
    customer_id,
    partner_id,
    sale_type,
    product_name,
    sale_amount,
    status,
    created_at
FROM sales_tracking 
WHERE customer_id IS NULL AND partner_id IS NULL
ORDER BY created_at DESC;

-- Partner registration NULL verilerini sil
DELETE FROM sales_tracking 
WHERE sale_type = 'partner_registration' 
AND customer_id IS NULL 
AND partner_id IS NULL;

-- Sonucu göster
SELECT 'AFTER DELETE - Remaining Records' as status;
SELECT 
    COUNT(*) as total_records,
    COUNT(CASE WHEN customer_id IS NULL THEN 1 END) as null_customer_id,
    COUNT(CASE WHEN partner_id IS NULL THEN 1 END) as null_partner_id,
    COUNT(CASE WHEN customer_id IS NULL AND partner_id IS NULL THEN 1 END) as both_null
FROM sales_tracking;

-- Kalan satış türlerini göster
SELECT 'REMAINING SALE TYPES' as info;
SELECT 
    sale_type,
    product_name,
    COUNT(*) as count,
    SUM(sale_amount) as total_amount
FROM sales_tracking 
GROUP BY sale_type, product_name
ORDER BY count DESC;
