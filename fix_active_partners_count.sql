-- Aktif İş Ortağı Sayılarını Düzeltme Script'i
-- Bu script mevcut active_partners sayılarını doğru hesaplamaya göre günceller

-- 1. Mevcut durumu kontrol et
SELECT 
    'MEVCUT DURUM' as durum,
    COUNT(*) as toplam_kullanici,
    SUM(active_partners) as toplam_aktif_partner_sayisi,
    AVG(active_partners) as ortalama_aktif_partner
FROM users 
WHERE role = 'partner';

-- 2. Doğru aktif iş ortağı sayılarını hesapla ve güncelle
UPDATE users u 
SET active_partners = (
    SELECT COUNT(*) 
    FROM users partner 
    WHERE partner.created_by = u.id 
    AND partner.is_active = TRUE 
    AND partner.payment_confirmed = TRUE 
    AND partner.education_completed = TRUE
    AND EXISTS (
        SELECT 1 FROM sales_tracking st 
        WHERE st.seller_id = partner.id 
        AND st.sale_type IN ('product_sale', 'customer_registration')
        AND st.status = 'active'
        AND MONTH(st.sale_date) = MONTH(NOW()) 
        AND YEAR(st.sale_date) = YEAR(NOW())
    )
)
WHERE u.role = 'partner';

-- 3. Güncelleme sonrası durumu kontrol et
SELECT 
    'GÜNCELLEME SONRASI' as durum,
    COUNT(*) as toplam_kullanici,
    SUM(active_partners) as toplam_aktif_partner_sayisi,
    AVG(active_partners) as ortalama_aktif_partner
FROM users 
WHERE role = 'partner';

-- 4. Detaylı rapor
SELECT 
    u.id,
    CONCAT(u.first_name, ' ', u.last_name) as kullanici_adi,
    u.active_partners as aktif_is_ortagi_sayisi,
    u.career_level as kariyer_seviyesi,
    u.payment_confirmed as odeme_onayli,
    u.education_completed as egitim_tamamlandi,
    u.is_active as aktif
FROM users u 
WHERE u.role = 'partner' AND u.active_partners > 0
ORDER BY u.active_partners DESC;

-- 5. Sonuç raporu
SELECT 
    'Aktif iş ortağı sayıları düzeltildi' as sonuc,
    NOW() as guncelleme_tarihi;
