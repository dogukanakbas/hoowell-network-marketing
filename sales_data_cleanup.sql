-- Satış Takip Paneli Veri Temizleme Script'i
USE hoowell_network;

-- 1. MEVCUT SATIŞ VERİLERİNİ KONTROL ET
SELECT 'MEVCUT SATIŞ VERİLERİ' as status;
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
ORDER BY created_at DESC;

-- 2. FRANCHISE SATIŞLARINI LİSTELE (SİLİNECEK)
SELECT 'FRANCHISE SATIŞLARI (SİLİNECEK)' as status;
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

-- 3. ÜRÜN SATIŞLARINI LİSTELE (KALACAK)
SELECT 'ÜRÜN SATIŞLARI (KALACAK)' as status;
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

-- 4. SATIŞ İSTATİSTİKLERİ
SELECT 'SATIŞ İSTATİSTİKLERİ' as status;
SELECT 
    sale_type,
    COUNT(*) as satis_sayisi,
    SUM(sale_amount) as toplam_tutar
FROM sales_tracking 
GROUP BY sale_type
ORDER BY satis_sayisi DESC;

-- 5. FRANCHISE SATIŞLARINI SİL (DİKKAT: ÖNCE YEDEK ALIN!)
-- DELETE FROM sales_tracking 
-- WHERE sale_type IN ('franchise_education', 'franchise_education_hidden', 'partner_registration');

-- 6. SİLME SONRASI KONTROL
SELECT 'SİLME SONRASI KALAN SATIŞLAR' as status;
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
ORDER BY created_at DESC;

-- 7. YENİ İSTATİSTİKLER
SELECT 'SİLME SONRASI İSTATİSTİKLER' as status;
SELECT 
    sale_type,
    COUNT(*) as satis_sayisi,
    SUM(sale_amount) as toplam_tutar
FROM sales_tracking 
GROUP BY sale_type
ORDER BY satis_sayisi DESC;
