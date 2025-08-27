-- Franchise Satışlarını Satış Takip Panelinden Kaldırma
-- Bu script franchise satışlarını sales_tracking tablosundan kaldırır

-- 1. Mevcut franchise satışlarını kontrol et
SELECT 
    COUNT(*) as total_franchise_sales,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_franchise_sales,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_franchise_sales
FROM sales_tracking 
WHERE sale_type = 'franchise';

-- 2. Franchise satışlarını kaldır (sadece satış takip panelinden)
-- Veriler payments tablosunda korunur, sadece sales_tracking'den kaldırılır
DELETE FROM sales_tracking 
WHERE sale_type = 'franchise';

-- 3. Temizlik sonrası kontrol
SELECT 
    COUNT(*) as remaining_sales,
    COUNT(CASE WHEN sale_type = 'product_sale' THEN 1 END) as product_sales,
    COUNT(CASE WHEN sale_type = 'customer_registration' THEN 1 END) as customer_registrations,
    COUNT(CASE WHEN sale_type = 'franchise' THEN 1 END) as franchise_sales
FROM sales_tracking;

-- 4. Sonuç raporu
SELECT 
    'Franchise satışları satış takip panelinden kaldırıldı' as result,
    NOW() as cleanup_date;
