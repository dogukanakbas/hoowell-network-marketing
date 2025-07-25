-- HOOWELL Veritabanı Yedek Scripti
-- Bu script mevcut verilerin yedeğini alır

-- Kullanıcı istatistikleri
SELECT 
    'BACKUP_INFO' as type,
    COUNT(*) as total_users,
    SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count,
    SUM(CASE WHEN role = 'partner' THEN 1 ELSE 0 END) as partner_count,
    SUM(total_kkp) as total_kkp_system,
    NOW() as backup_date
FROM users;

-- Müşteri istatistikleri  
SELECT 
    'CUSTOMER_INFO' as type,
    COUNT(*) as total_customers,
    SUM(total_amount) as total_sales_amount,
    COUNT(DISTINCT created_by) as active_sellers,
    NOW() as backup_date
FROM customers;

-- Ödeme istatistikleri
SELECT 
    'PAYMENT_INFO' as type,
    COUNT(*) as total_payments,
    SUM(CASE WHEN status = 'approved' THEN amount_try ELSE 0 END) as approved_amount,
    SUM(CASE WHEN status = 'pending' THEN amount_try ELSE 0 END) as pending_amount,
    NOW() as backup_date
FROM payments;

-- Eğitim istatistikleri
SELECT 
    'EDUCATION_INFO' as type,
    COUNT(DISTINCT user_id) as users_in_education,
    COUNT(*) as total_video_progress,
    SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_videos,
    NOW() as backup_date
FROM user_video_progress;

-- Satış takip istatistikleri
SELECT 
    'SALES_TRACKING_INFO' as type,
    COUNT(*) as total_sales_records,
    SUM(sale_amount) as total_sale_amount,
    SUM(bonus_amount) as total_bonus_amount,
    COUNT(DISTINCT seller_id) as active_sellers,
    NOW() as backup_date
FROM sales_tracking;

-- Sponsorluk istatistikleri
SELECT 
    'SPONSORSHIP_INFO' as type,
    COUNT(*) as total_sponsorship_records,
    SUM(bronze_earnings + silver_earnings + gold_earnings + star_earnings + super_star_earnings) as total_sponsorship_earnings,
    COUNT(CASE WHEN first_sale_activated = 1 THEN 1 END) as activated_partnerships,
    NOW() as backup_date
FROM sponsorship_earnings;

-- Sistem ayarları
SELECT 
    'SYSTEM_SETTINGS' as type,
    setting_key,
    setting_value,
    updated_at
FROM system_settings
ORDER BY setting_key;