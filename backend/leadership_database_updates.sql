-- HOOWELL Network Marketing - Liderlik ve Başkanlık Havuzu Veritabanı Güncellemeleri

USE hoowell_network;

-- 1. Liderlik Havuzu Dağıtım Tablosu
CREATE TABLE IF NOT EXISTS leadership_pool_distributions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    month_year VARCHAR(7) NOT NULL, -- Format: 2025-01
    pool_type ENUM('leadership', 'presidency') NOT NULL,
    
    -- Kullanıcı bilgileri
    user_career_level ENUM('star_leader', 'super_star_leader', 'presidents_team') NOT NULL,
    personal_sales_count INT DEFAULT 0,
    activated_partners_count INT DEFAULT 0,
    total_action_points INT DEFAULT 0,
    
    -- Havuz bilgileri
    total_pool_amount DECIMAL(15,2) NOT NULL,
    total_participants INT NOT NULL,
    total_pool_points INT NOT NULL,
    point_value DECIMAL(10,4) NOT NULL,
    
    -- Kazanç bilgileri
    user_earning DECIMAL(10,2) NOT NULL,
    is_qualified BOOLEAN DEFAULT FALSE,
    is_paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_user_month_pool (user_id, month_year, pool_type),
    INDEX idx_user_id (user_id),
    INDEX idx_month_year (month_year),
    INDEX idx_pool_type (pool_type),
    INDEX idx_user_career_level (user_career_level)
);

-- 2. Havuz İstatistikleri Tablosu
CREATE TABLE IF NOT EXISTS pool_statistics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    month_year VARCHAR(7) NOT NULL, -- Format: 2025-01
    
    -- Sistem geneli
    total_monthly_revenue DECIMAL(15,2) NOT NULL,
    total_active_users INT DEFAULT 0,
    
    -- Liderlik havuzu
    leadership_pool_amount DECIMAL(15,2) NOT NULL,
    leadership_participants INT DEFAULT 0,
    leadership_total_points INT DEFAULT 0,
    leadership_point_value DECIMAL(10,4) DEFAULT 0,
    leadership_distributed_amount DECIMAL(15,2) DEFAULT 0,
    
    -- Başkanlık havuzu
    presidency_pool_amount DECIMAL(15,2) NOT NULL,
    presidency_participants INT DEFAULT 0,
    presidency_total_points INT DEFAULT 0,
    presidency_point_value DECIMAL(10,4) DEFAULT 0,
    presidency_distributed_amount DECIMAL(15,2) DEFAULT 0,
    
    -- Durum
    is_calculated BOOLEAN DEFAULT FALSE,
    is_distributed BOOLEAN DEFAULT FALSE,
    calculated_at TIMESTAMP NULL,
    distributed_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_month_stats (month_year),
    INDEX idx_month_year (month_year),
    INDEX idx_is_calculated (is_calculated),
    INDEX idx_is_distributed (is_distributed)
);

-- 3. Monthly Activity tablosuna eksik alanları ekle (eğer yoksa)
ALTER TABLE monthly_activity 
ADD COLUMN IF NOT EXISTS qualified_for_leadership BOOLEAN DEFAULT FALSE AFTER is_active,
ADD COLUMN IF NOT EXISTS qualified_for_presidency BOOLEAN DEFAULT FALSE AFTER qualified_for_leadership,
ADD COLUMN IF NOT EXISTS leadership_earning DECIMAL(10,2) DEFAULT 0 AFTER qualified_for_presidency,
ADD COLUMN IF NOT EXISTS presidency_earning DECIMAL(10,2) DEFAULT 0 AFTER leadership_earning;

-- 4. Sistem ayarlarına liderlik havuzu ayarları ekle
INSERT IGNORE INTO system_settings (setting_key, setting_value) VALUES
('leadership_pool_percentage', '0.75'), -- %0.75
('presidency_pool_percentage', '1.25'), -- %1.25
('leadership_min_action_points', '5'),
('action_points_per_sale', '1'),
('action_points_per_partner', '2'),
('leadership_pool_active', 'true'),
('presidency_pool_active', 'true'),
('pool_distribution_day', '9'); -- Her ayın 9'unda dağıtım

-- 5. Liderlik havuzu hesaplama için stored procedure
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS CalculateLeadershipPools(IN target_month VARCHAR(7))
BEGIN
    DECLARE total_revenue DECIMAL(15,2) DEFAULT 0;
    DECLARE leadership_amount DECIMAL(15,2) DEFAULT 0;
    DECLARE presidency_amount DECIMAL(15,2) DEFAULT 0;
    DECLARE leadership_participants INT DEFAULT 0;
    DECLARE presidency_participants INT DEFAULT 0;
    DECLARE leadership_total_points INT DEFAULT 0;
    DECLARE presidency_total_points INT DEFAULT 0;
    DECLARE leadership_point_value DECIMAL(10,4) DEFAULT 0;
    DECLARE presidency_point_value DECIMAL(10,4) DEFAULT 0;
    
    -- O ayki toplam ciroyu hesapla
    SELECT COALESCE(SUM(sale_amount), 0) INTO total_revenue
    FROM sales_tracking 
    WHERE DATE_FORMAT(sale_date, '%Y-%m') = target_month 
    AND status = 'active';
    
    -- Havuz miktarlarını hesapla
    SET leadership_amount = total_revenue * 0.0075; -- %0.75
    SET presidency_amount = total_revenue * 0.0125; -- %1.25
    
    -- Liderlik havuzu katılımcılarını say ve toplam puanları hesapla
    SELECT 
        COUNT(*),
        COALESCE(SUM(total_activity_points), 0)
    INTO leadership_participants, leadership_total_points
    FROM monthly_activity ma
    JOIN users u ON ma.user_id = u.id
    WHERE ma.month_year = target_month 
    AND u.career_level IN ('star_leader', 'super_star_leader')
    AND ma.total_activity_points >= 5
    AND ma.is_active = TRUE;
    
    -- Başkanlık havuzu katılımcılarını say ve toplam puanları hesapla
    SELECT 
        COUNT(*),
        COALESCE(SUM(total_activity_points), 0)
    INTO presidency_participants, presidency_total_points
    FROM monthly_activity ma
    JOIN users u ON ma.user_id = u.id
    WHERE ma.month_year = target_month 
    AND u.career_level = 'presidents_team'
    AND ma.total_activity_points >= 5
    AND ma.is_active = TRUE;
    
    -- Puan başına değerleri hesapla
    IF leadership_total_points > 0 THEN
        SET leadership_point_value = leadership_amount / leadership_total_points;
    END IF;
    
    IF presidency_total_points > 0 THEN
        SET presidency_point_value = presidency_amount / presidency_total_points;
    END IF;
    
    -- İstatistikleri kaydet
    INSERT INTO pool_statistics (
        month_year, total_monthly_revenue,
        leadership_pool_amount, leadership_participants, leadership_total_points, leadership_point_value,
        presidency_pool_amount, presidency_participants, presidency_total_points, presidency_point_value,
        is_calculated, calculated_at
    ) VALUES (
        target_month, total_revenue,
        leadership_amount, leadership_participants, leadership_total_points, leadership_point_value,
        presidency_amount, presidency_participants, presidency_total_points, presidency_point_value,
        TRUE, CURRENT_TIMESTAMP
    ) ON DUPLICATE KEY UPDATE
        total_monthly_revenue = VALUES(total_monthly_revenue),
        leadership_pool_amount = VALUES(leadership_pool_amount),
        leadership_participants = VALUES(leadership_participants),
        leadership_total_points = VALUES(leadership_total_points),
        leadership_point_value = VALUES(leadership_point_value),
        presidency_pool_amount = VALUES(presidency_pool_amount),
        presidency_participants = VALUES(presidency_participants),
        presidency_total_points = VALUES(presidency_total_points),
        presidency_point_value = VALUES(presidency_point_value),
        is_calculated = TRUE,
        calculated_at = CURRENT_TIMESTAMP;
    
    -- Liderlik havuzu dağıtımlarını hesapla
    INSERT INTO leadership_pool_distributions (
        user_id, month_year, pool_type, user_career_level,
        personal_sales_count, activated_partners_count, total_action_points,
        total_pool_amount, total_participants, total_pool_points, point_value,
        user_earning, is_qualified
    )
    SELECT 
        ma.user_id,
        target_month,
        'leadership',
        u.career_level,
        ma.personal_sales_count,
        ma.partner_first_sales_count,
        ma.total_action_points,
        leadership_amount,
        leadership_participants,
        leadership_total_points,
        leadership_point_value,
        ma.total_action_points * leadership_point_value,
        TRUE
    FROM monthly_activity ma
    JOIN users u ON ma.user_id = u.id
    WHERE ma.month_year = target_month 
    AND u.career_level IN ('star_leader', 'super_star_leader')
    AND ma.total_activity_points >= 5
    AND ma.is_active = TRUE
    ON DUPLICATE KEY UPDATE
        personal_sales_count = VALUES(personal_sales_count),
        activated_partners_count = VALUES(activated_partners_count),
        total_action_points = VALUES(total_action_points),
        total_pool_amount = VALUES(total_pool_amount),
        total_participants = VALUES(total_participants),
        total_pool_points = VALUES(total_pool_points),
        point_value = VALUES(point_value),
        user_earning = VALUES(user_earning),
        updated_at = CURRENT_TIMESTAMP;
    
    -- Başkanlık havuzu dağıtımlarını hesapla
    INSERT INTO leadership_pool_distributions (
        user_id, month_year, pool_type, user_career_level,
        personal_sales_count, activated_partners_count, total_action_points,
        total_pool_amount, total_participants, total_pool_points, point_value,
        user_earning, is_qualified
    )
    SELECT 
        ma.user_id,
        target_month,
        'presidency',
        u.career_level,
        ma.personal_sales_count,
        ma.partner_first_sales_count,
        ma.total_action_points,
        presidency_amount,
        presidency_participants,
        presidency_total_points,
        presidency_point_value,
        ma.total_action_points * presidency_point_value,
        TRUE
    FROM monthly_activity ma
    JOIN users u ON ma.user_id = u.id
    WHERE ma.month_year = target_month 
    AND u.career_level = 'presidents_team'
    AND ma.total_action_points >= 5
    AND ma.is_active = TRUE
    ON DUPLICATE KEY UPDATE
        personal_sales_count = VALUES(personal_sales_count),
        activated_partners_count = VALUES(activated_partners_count),
        total_action_points = VALUES(total_action_points),
        total_pool_amount = VALUES(total_pool_amount),
        total_participants = VALUES(total_participants),
        total_pool_points = VALUES(total_pool_points),
        point_value = VALUES(point_value),
        user_earning = VALUES(user_earning),
        updated_at = CURRENT_TIMESTAMP;
        
END//
DELIMITER ;

-- 6. Aylık aksiyon puanlarını otomatik güncelleme trigger'ı
DELIMITER //
CREATE TRIGGER IF NOT EXISTS update_action_points_after_sale
AFTER INSERT ON sales_tracking
FOR EACH ROW
BEGIN
    DECLARE current_month VARCHAR(7);
    DECLARE current_sales INT DEFAULT 0;
    DECLARE current_partners INT DEFAULT 0;
    DECLARE total_points INT DEFAULT 0;
    
    SET current_month = DATE_FORMAT(NEW.sale_date, '%Y-%m');
    
    -- Mevcut satış sayısını al
    SELECT COALESCE(personal_sales_count, 0) INTO current_sales
    FROM monthly_activity 
    WHERE user_id = NEW.seller_id AND month_year = current_month;
    
    -- Satış sayısını artır
    SET current_sales = current_sales + 1;
    
    -- Partner aktivasyonu kontrolü (eğer bu bir partner'ın ilk satışıysa)
    IF NEW.sale_type = 'partner_registration' OR 
       (NEW.partner_id IS NOT NULL AND 
        (SELECT COUNT(*) FROM sales_tracking 
         WHERE seller_id = NEW.partner_id AND status = 'active') = 1) THEN
        SET current_partners = current_partners + 1;
    END IF;
    
    -- Toplam aksiyon puanını hesapla
    SET total_points = current_sales + (current_partners * 2);
    
    -- Monthly activity tablosunu güncelle
    INSERT INTO monthly_activity (
        user_id, month_year, personal_sales_count, partner_first_sales_count,
        total_activity_points, is_active, last_activity_date
    ) VALUES (
        NEW.seller_id, current_month, current_sales, current_partners,
        total_points, TRUE, DATE(NEW.sale_date)
    ) ON DUPLICATE KEY UPDATE
        personal_sales_count = current_sales,
        total_activity_points = total_points,
        is_active = TRUE,
        last_activity_date = DATE(NEW.sale_date),
        updated_at = CURRENT_TIMESTAMP;
        
END//
DELIMITER ;

-- 7. View oluştur - Liderlik havuzu özeti için
CREATE OR REPLACE VIEW leadership_pool_summary AS
SELECT 
    ps.month_year,
    ps.total_monthly_revenue,
    ps.leadership_pool_amount,
    ps.leadership_participants,
    ps.leadership_point_value,
    ps.presidency_pool_amount,
    ps.presidency_participants,
    ps.presidency_point_value,
    ps.is_calculated,
    ps.is_distributed,
    
    -- Liderlik havuzu dağıtım toplamı
    COALESCE(SUM(CASE WHEN lpd.pool_type = 'leadership' THEN lpd.user_earning ELSE 0 END), 0) as leadership_total_distributed,
    
    -- Başkanlık havuzu dağıtım toplamı
    COALESCE(SUM(CASE WHEN lpd.pool_type = 'presidency' THEN lpd.user_earning ELSE 0 END), 0) as presidency_total_distributed,
    
    ps.created_at,
    ps.updated_at
    
FROM pool_statistics ps
LEFT JOIN leadership_pool_distributions lpd ON ps.month_year = lpd.month_year
GROUP BY ps.id, ps.month_year;

-- 8. İndeksler ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_leadership_distributions_month_pool ON leadership_pool_distributions(month_year, pool_type);
CREATE INDEX IF NOT EXISTS idx_leadership_distributions_user_month ON leadership_pool_distributions(user_id, month_year);
CREATE INDEX IF NOT EXISTS idx_pool_statistics_month ON pool_statistics(month_year);
CREATE INDEX IF NOT EXISTS idx_monthly_activity_points ON monthly_activity(total_activity_points);

-- 9. Bu ay için başlangıç verilerini oluştur
SET @current_month = DATE_FORMAT(CURDATE(), '%Y-%m');

-- Mevcut kullanıcılar için bu ayki monthly_activity kayıtlarını oluştur
INSERT IGNORE INTO monthly_activity (user_id, month_year)
SELECT id, @current_month 
FROM users 
WHERE role = 'partner' 
AND career_level IN ('star_leader', 'super_star_leader', 'presidents_team');

-- Bu ay için pool statistics kaydı oluştur
INSERT IGNORE INTO pool_statistics (month_year, total_monthly_revenue, leadership_pool_amount, presidency_pool_amount)
VALUES (@current_month, 0, 0, 0);

COMMIT;