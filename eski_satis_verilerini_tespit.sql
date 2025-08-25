-- Eski Satış Verilerini Tespit ve Silme Script'i
USE hoowell_network;

-- 1. Tüm satış tablolarını kontrol et
SELECT 'SALES TRACKING TABLE' as table_name;
SELECT 
    COUNT(*) as total_records,
    COUNT(DISTINCT seller_id) as unique_sellers,
    COUNT(DISTINCT customer_id) as unique_customers,
    MIN(created_at) as oldest_record,
    MAX(created_at) as newest_record
FROM sales_tracking;

-- 2. Satış türlerini listele
SELECT 'SALE TYPES' as info;
SELECT 
    sale_type,
    product_name,
    COUNT(*) as count,
    SUM(sale_amount) as total_amount,
    MIN(created_at) as oldest,
    MAX(created_at) as newest
FROM sales_tracking 
GROUP BY sale_type, product_name
ORDER BY count DESC;

-- 3. Eski tarihli satışları tespit et (örnek: 2024'ten önceki)
SELECT 'OLD SALES (BEFORE 2024)' as info;
SELECT 
    id,
    seller_id,
    customer_id,
    sale_type,
    product_name,
    sale_amount,
    created_at
FROM sales_tracking 
WHERE YEAR(created_at) < 2024
ORDER BY created_at DESC;

-- 4. Belirli seller_id'ye ait satışları kontrol et
SELECT 'SALES BY SELLER' as info;
SELECT 
    seller_id,
    COUNT(*) as sale_count,
    SUM(sale_amount) as total_amount,
    MIN(created_at) as first_sale,
    MAX(created_at) as last_sale
FROM sales_tracking 
GROUP BY seller_id
ORDER BY sale_count DESC;

-- 5. Test satışlarını tespit et
SELECT 'POTENTIAL TEST SALES' as info;
SELECT 
    id,
    seller_id,
    customer_id,
    sale_type,
    product_name,
    sale_amount,
    created_at
FROM sales_tracking 
WHERE 
    sale_amount = 0 OR 
    sale_amount < 1000 OR
    customer_id IS NULL OR
    seller_id IN (SELECT id FROM users WHERE email LIKE '%test%')
ORDER BY created_at DESC;

-- 6. Duplicate satışları tespit et
SELECT 'POTENTIAL DUPLICATE SALES' as info;
SELECT 
    seller_id,
    customer_id,
    sale_type,
    product_name,
    sale_amount,
    COUNT(*) as duplicate_count,
    GROUP_CONCAT(id) as sale_ids
FROM sales_tracking 
WHERE customer_id IS NOT NULL
GROUP BY seller_id, customer_id, sale_type, product_name, sale_amount
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;
