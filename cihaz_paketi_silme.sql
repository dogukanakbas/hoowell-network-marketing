-- Cihaz Paketi Satışlarını Silme Script'i
USE hoowell_network;

-- Önce mevcut durumu göster
SELECT 'BEFORE DELETE - Cihaz Paketi Satışları' as status;
SELECT 
    COUNT(*) as total_device_sales,
    SUM(sale_amount) as total_amount,
    AVG(sale_amount) as avg_amount
FROM sales_tracking 
WHERE product_name = 'Cihaz Paketi';

-- Cihaz Paketi satışlarını listele
SELECT 
    id,
    seller_id,
    customer_id,
    sale_type,
    product_name,
    sale_amount,
    sale_date,
    status
FROM sales_tracking 
WHERE product_name = 'Cihaz Paketi'
ORDER BY created_at DESC;

-- Cihaz Paketi satışlarını sil
DELETE FROM sales_tracking 
WHERE product_name = 'Cihaz Paketi';

-- Sonucu göster
SELECT 'AFTER DELETE - Remaining Sales' as status;
SELECT 
    product_name,
    COUNT(*) as count,
    SUM(sale_amount) as total_amount
FROM sales_tracking 
GROUP BY product_name
ORDER BY count DESC;

-- Toplam satış sayısını göster
SELECT 'FINAL STATUS' as status;
SELECT 
    COUNT(*) as total_remaining_sales,
    SUM(sale_amount) as total_remaining_amount
FROM sales_tracking;
