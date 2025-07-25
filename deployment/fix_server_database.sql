-- SUNUCU VERİTABANI DÜZELTME SCRIPT'İ
USE hoowell_network;

-- 1. Eksik tabloları oluştur
CREATE TABLE IF NOT EXISTS user_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    profile_photo VARCHAR(255),
    join_date DATETIME,
    last_login DATETIME,
    total_sales DECIMAL(15,2) DEFAULT 0,
    monthly_sales DECIMAL(15,2) DEFAULT 0,
    team_size INT DEFAULT 0,
    active_team_members INT DEFAULT 0,
    personal_volume DECIMAL(15,2) DEFAULT 0,
    team_volume DECIMAL(15,2) DEFAULT 0,
    is_active_this_month BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_profile (user_id),
    INDEX idx_user_id (user_id)
);

CREATE TABLE IF NOT EXISTS customer_satisfaction_rewards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    reward_type ENUM('referral', 'satisfaction', 'loyalty') NOT NULL,
    reward_amount_usd DECIMAL(10,2) NOT NULL,
    reward_amount_try DECIMAL(10,2) NOT NULL,
    reward_date DATETIME NOT NULL,
    status ENUM('pending', 'approved', 'paid') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    INDEX idx_customer_id (customer_id)
);

-- 2. Mevcut kullanıcılar için profil kayıtları oluştur
INSERT INTO user_profiles (user_id, join_date, is_active_this_month)
SELECT id, created_at, FALSE FROM users
ON DUPLICATE KEY UPDATE user_id = user_id;

-- 3. Müşteri durumlarını düzelt
UPDATE customers SET status = 'confirmed' WHERE status = 'pending';

-- 4. KKP hesaplamalarını düzelt (KDV hariç)
SELECT 'KKP DÜZELTME BAŞLIYOR...' as status;

-- Geçici tablo oluştur
CREATE TEMPORARY TABLE temp_kkp_fix AS
SELECT 
    u.id,
    -- Partner KKP: Her partner 120 KKP
    COALESCE((SELECT COUNT(*) * 120 FROM users u2 WHERE u2.created_by = u.id AND u2.role = 'partner'), 0) as partner_kkp,
    -- Müşteri KKP: KDV hariç net fiyat (product_price alanı varsa kullan, yoksa total_amount/1.2)
    COALESCE((
        SELECT SUM(
            CASE 
                WHEN product_price IS NOT NULL AND product_price > 0 THEN product_price
                ELSE total_amount / 1.2  -- KDV'yi çıkar (%20 KDV varsayımı)
            END
        ) 
        FROM customers c WHERE c.created_by = u.id
    ), 0) as customer_kkp,
    -- Aktif partner sayısı
    COALESCE((SELECT COUNT(*) FROM users u3 WHERE u3.created_by = u.id AND u3.role = 'partner'), 0) as partner_count
FROM users u WHERE u.role = 'partner';

-- Hesaplanan değerleri göster
SELECT 'HESAPLANAN KKP DEĞERLERİ:' as info;
SELECT 
    u.first_name,
    u.last_name,
    t.partner_kkp,
    t.customer_kkp,
    (t.partner_kkp + t.customer_kkp) as total_kkp,
    t.partner_count
FROM users u
JOIN temp_kkp_fix t ON u.id = t.id
WHERE (t.partner_kkp + t.customer_kkp) > 0;

-- Users tablosunu güncelle
UPDATE users u
JOIN temp_kkp_fix t ON u.id = t.id
SET 
    u.total_kkp = t.partner_kkp + t.customer_kkp,
    u.active_partners = t.partner_count;

-- Sonucu göster
SELECT 'KKP GÜNCELLEME TAMAMLANDI!' as status;
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.total_kkp,
    u.active_partners
FROM users u 
WHERE u.role = 'partner' AND u.total_kkp > 0
ORDER BY u.total_kkp DESC;

-- Genel istatistik
SELECT 
    'GENEL İSTATİSTİK' as info,
    COUNT(*) as toplam_partner,
    SUM(total_kkp) as toplam_kkp,
    AVG(total_kkp) as ortalama_kkp,
    SUM(active_partners) as toplam_alt_partner
FROM users WHERE role = 'partner';

-- Geçici tabloyu temizle
DROP TEMPORARY TABLE temp_kkp_fix;

-- 5. Sistem ayarlarını güncelle
INSERT INTO system_settings (setting_key, setting_value) VALUES
('usd_to_try_rate', '40'),
('vat_rate', '20'),
('education_price_usd', '100'),
('device_price_usd', '1800')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

SELECT 'VERİTABANI DÜZELTME TAMAMLANDI!' as final_status;