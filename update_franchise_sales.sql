-- Franchise Eğitim Paketi Satışlarını Satış Takip Panelinden Kaldırma
-- Bu script mevcut franchise eğitim paketi satışlarını 'hidden' olarak işaretler

-- 1. Önce mevcut franchise eğitim paketi satışlarını kontrol et
SELECT 
    COUNT(*) as total_franchise_sales,
    seller_id,
    sale_type,
    product_name,
    sale_date
FROM sales_tracking 
WHERE sale_type = 'franchise_education' 
GROUP BY seller_id, sale_type;

-- 2. Franchise eğitim paketi satışlarını 'hidden' olarak işaretle
-- Bu şekilde satış takip panelinde görünmez ama veriler korunur
UPDATE sales_tracking 
SET sale_type = 'franchise_education_hidden'
WHERE sale_type = 'franchise_education';

-- 3. Güncelleme sonrası kontrol
SELECT 
    COUNT(*) as updated_franchise_sales,
    sale_type
FROM sales_tracking 
WHERE sale_type IN ('franchise_education', 'franchise_education_hidden')
GROUP BY sale_type;

-- 4. Satış takip panelinde görünecek satışları kontrol et
SELECT 
    COUNT(*) as visible_sales,
    sale_type
FROM sales_tracking 
WHERE sale_type != 'franchise_education_hidden'
GROUP BY sale_type;
