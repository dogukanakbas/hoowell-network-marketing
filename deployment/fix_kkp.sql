-- KKP Hesaplamalarını Düzeltme Script'i
USE hoowell_network;

-- Önce mevcut durumu göster
SELECT 'BEFORE UPDATE - Current KKP Status' as status;
SELECT 
    COUNT(*) as total_partners,
    SUM(total_kkp) as total_kkp_before,
    AVG(total_kkp) as avg_kkp_before
FROM users WHERE role = 'partner';

-- Müşteri durumlarını düzelt (pending -> confirmed)
UPDATE customers SET status = 'confirmed' WHERE status = 'pending';

-- KKP hesaplamalarını düzelt
UPDATE users u SET 
total_kkp = (
    -- Müşteri satışlarından KKP (total_amount USD cinsinden, direkt KKP)
    COALESCE((SELECT SUM(total_amount) FROM customers WHERE created_by = u.id AND status = 'confirmed'), 0) + 
    -- Partner kayıtlarından KKP (120 KKP per partner)
    COALESCE((SELECT COUNT(*) * 120 FROM users WHERE created_by = u.id AND role = 'partner'), 0)
),
active_partners = (
    SELECT COUNT(*) FROM users WHERE created_by = u.id AND role = 'partner'
)
WHERE u.role = 'partner';

-- Sonucu göster
SELECT 'AFTER UPDATE - Updated KKP Status' as status;
SELECT 
    COUNT(*) as total_partners,
    SUM(total_kkp) as total_kkp_after,
    AVG(total_kkp) as avg_kkp_after
FROM users WHERE role = 'partner';

-- Detaylı sonuçlar
SELECT 'DETAILED RESULTS' as status;
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.total_kkp,
    u.active_partners,
    (SELECT COUNT(*) FROM customers WHERE created_by = u.id) as customer_count,
    (SELECT COALESCE(SUM(total_amount), 0) FROM customers WHERE created_by = u.id) as customer_sales
FROM users u 
WHERE u.role = 'partner' AND (u.total_kkp > 0 OR u.active_partners > 0)
ORDER BY u.total_kkp DESC;

SELECT 'KKP FIX COMPLETED SUCCESSFULLY' as final_status;