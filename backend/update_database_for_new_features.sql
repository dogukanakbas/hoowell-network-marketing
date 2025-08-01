-- HOOWELL Network Marketing Database Updates
-- Yeni frontend özelliklerine göre veritabanı güncellemeleri

USE hoowell_network;

-- 1. Doping Promosyonu için tablo
CREATE TABLE IF NOT EXISTS doping_promotion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    etap1_start_date DATE NOT NULL,
    etap1_end_date DATE NOT NULL,
    etap1_target_sales INT DEFAULT 40,
    etap1_achieved_sales INT DEFAULT 0,
    etap1_target_partners INT DEFAULT 7,
    etap1_achieved_partners INT DEFAULT 0,
    etap1_extra_points DECIMAL(10,3) DEFAULT 0,
    etap1_completed BOOLEAN DEFAULT FALSE,
    etap1_completed_date DATETIME NULL,
    
    etap2_start_date DATE NOT NULL,
    etap2_end_date DATE NOT NULL,
    etap2_target_sales INT DEFAULT 80,
    etap2_achieved_sales INT DEFAULT 0,
    etap2_target_partners INT DEFAULT 15,
    etap2_achieved_partners INT DEFAULT 0,
    etap2_extra_points DECIMAL(10,3) DEFAULT 0,
    etap2_completed BOOLEAN DEFAULT FALSE,
    etap2_completed_date DATETIME NULL,
    
    total_extra_points DECIMAL(10,3) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_user_doping (user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_etap1_end_date (etap1_end_date),
    INDEX idx_etap2_end_date (etap2_end_date)
);

-- 2. Memnun Müşteri Takip sistemi için güncellemeler
ALTER TABLE customers 
ADD COLUMN referral_count INT DEFAULT 0 AFTER total_amount,
ADD COLUMN gift1_earned BOOLEAN DEFAULT FALSE AFTER referral_count,
ADD COLUMN gift1_earned_date DATETIME NULL AFTER gift1_earned,
ADD COLUMN gift1_recipient VARCHAR(255) NULL AFTER gift1_earned_date,
ADD COLUMN gift2_earned BOOLEAN DEFAULT FALSE AFTER gift1_recipient,
ADD COLUMN gift2_earned_date DATETIME NULL AFTER gift2_earned,
ADD COLUMN gift2_recipient VARCHAR(255) NULL AFTER gift2_earned_date,
ADD COLUMN gift3_earned BOOLEAN DEFAULT FALSE AFTER gift2_recipient,
ADD COLUMN gift3_earned_date DATETIME NULL AFTER gift3_earned,
ADD COLUMN gift3_recipient VARCHAR(255) NULL AFTER gift3_earned_date,
ADD COLUMN loyalty_protection_until DATE NULL AFTER gift3_recipient;

-- 3. Sponsorluk Takip sistemi için güncellemeler
ALTER TABLE sponsorship_earnings 
ADD COLUMN partner_start_date DATE NULL AFTER first_sale_activated,
ADD COLUMN partner_phone VARCHAR(20) NULL AFTER partner_start_date,
ADD COLUMN partner_education_status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started' AFTER partner_phone,
ADD COLUMN bronze_limit DECIMAL(10,2) DEFAULT 750.00 AFTER bronze_earnings,
ADD COLUMN silver_limit DECIMAL(10,2) DEFAULT 1200.00 AFTER silver_earnings,
ADD COLUMN gold_limit DECIMAL(10,2) DEFAULT 1350.00 AFTER gold_earnings,
ADD COLUMN star_limit DECIMAL(10,2) DEFAULT 1200.00 AFTER star_earnings,
ADD COLUMN super_star_limit DECIMAL(10,2) DEFAULT 750.00 AFTER super_star_earnings,
ADD COLUMN total_earnings DECIMAL(10,2) DEFAULT 0 AFTER super_star_limit;

-- 4. Takım Takip sistemi için yeni tablo
CREATE TABLE IF NOT EXISTS team_tracking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    team_leader_id INT NOT NULL,
    member_id INT NOT NULL,
    member_sponsor_id VARCHAR(20),
    member_phone VARCHAR(20),
    member_education_status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
    member_career_level ENUM('bronze', 'silver', 'gold', 'star_leader', 'super_star_leader', 'presidents_team', 'country_distributor') DEFAULT 'bronze',
    
    -- Takip tablosu için alanlar
    franchise_percentage DECIMAL(5,2) DEFAULT 0,
    earning_percentage DECIMAL(5,2) DEFAULT 0,
    monthly_sales_volume DECIMAL(15,2) DEFAULT 0,
    monthly_franchise_income DECIMAL(10,2) DEFAULT 0,
    
    -- Kazanç tablosu için alanlar
    start_date DATE NOT NULL,
    total_kkp DECIMAL(15,2) DEFAULT 0,
    franchise_sales DECIMAL(15,2) DEFAULT 0,
    active_partners INT DEFAULT 0,
    monthly_sales_kkp DECIMAL(15,2) DEFAULT 0,
    activated_partners INT DEFAULT 0,
    is_active_this_month BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (team_leader_id) REFERENCES users(id),
    FOREIGN KEY (member_id) REFERENCES users(id),
    UNIQUE KEY unique_leader_member (team_leader_id, member_id),
    INDEX idx_team_leader_id (team_leader_id),
    INDEX idx_member_id (member_id),
    INDEX idx_member_career_level (member_career_level)
);

-- 5. Franchise Ağı Gelirleri için güncellemeler
CREATE TABLE IF NOT EXISTS franchise_network_earnings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    month_year VARCHAR(7) NOT NULL, -- Format: 2025-01
    user_career_level ENUM('silver', 'gold', 'star_leader', 'super_star_leader', 'presidents_team') NOT NULL,
    franchise_percentage DECIMAL(5,2) NOT NULL,
    
    -- Ağ hacmi bilgileri
    personal_volume DECIMAL(15,2) DEFAULT 0,
    team_volume DECIMAL(15,2) DEFAULT 0,
    total_network_volume DECIMAL(15,2) DEFAULT 0,
    
    -- Kazanç hesaplamaları
    gross_franchise_income DECIMAL(10,2) DEFAULT 0,
    blocked_income DECIMAL(10,2) DEFAULT 0, -- Aynı/yüksek kariyerden bloke edilen
    net_franchise_income DECIMAL(10,2) DEFAULT 0,
    
    is_active_month BOOLEAN DEFAULT FALSE,
    is_qualified BOOLEAN DEFAULT FALSE, -- Silver+ ve aktif
    paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_user_month (user_id, month_year),
    INDEX idx_user_id (user_id),
    INDEX idx_month_year (month_year),
    INDEX idx_user_career_level (user_career_level)
);

-- 6. Satış Takip sistemi için güncellemeler
ALTER TABLE sales_tracking 
ADD COLUMN customer_name VARCHAR(255) NULL AFTER customer_id,
ADD COLUMN payment_status ENUM('pending', 'paid') DEFAULT 'pending' AFTER status,
ADD COLUMN is_active_for_monthly BOOLEAN DEFAULT FALSE AFTER payment_status;

-- 7. Kullanıcı aylık aktiflik takibi için tablo
CREATE TABLE IF NOT EXISTS monthly_activity (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    month_year VARCHAR(7) NOT NULL, -- Format: 2025-01
    personal_sales_count INT DEFAULT 0,
    partner_first_sales_count INT DEFAULT 0,
    total_activity_points INT DEFAULT 0,
    is_active BOOLEAN DEFAULT FALSE,
    last_activity_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_user_month_activity (user_id, month_year),
    INDEX idx_user_id (user_id),
    INDEX idx_month_year (month_year),
    INDEX idx_is_active (is_active)
);

-- 8. Sistem ayarlarına yeni değerler ekle
INSERT INTO system_settings (setting_key, setting_value) VALUES
('doping_promotion_active', 'true'),
('doping_etap1_duration_days', '60'),
('doping_etap2_duration_days', '60'),
('doping_etap1_sales_target', '40'),
('doping_etap1_partners_target', '7'),
('doping_etap2_sales_target', '80'),
('doping_etap2_partners_target', '15'),
('customer_loyalty_protection_days', '60'),
('franchise_silver_percentage', '2'),
('franchise_gold_percentage', '4'),
('franchise_star_leader_percentage', '6'),
('franchise_super_star_leader_percentage', '8'),
('franchise_presidents_team_percentage', '10'),
('sales_activation_days', '15'),
('monthly_bonus_payment_day', '9')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- 9. Kullanıcı kariyer geçmişi için tablo
CREATE TABLE IF NOT EXISTS career_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    old_career_level ENUM('bronze', 'silver', 'gold', 'star_leader', 'super_star_leader', 'presidents_team', 'country_distributor'),
    new_career_level ENUM('bronze', 'silver', 'gold', 'star_leader', 'super_star_leader', 'presidents_team', 'country_distributor') NOT NULL,
    kkp_at_promotion DECIMAL(15,2) NOT NULL,
    partners_at_promotion INT NOT NULL,
    promotion_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bonus_earned DECIMAL(10,2) DEFAULT 0,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_promotion_date (promotion_date),
    INDEX idx_new_career_level (new_career_level)
);

-- 10. Global Seyahat Promosyonu için tablo (mevcut yapıyı koruyarak)
-- Bu tablo zaten mevcut, sadece eksik alanları ekleyelim
ALTER TABLE users 
ADD COLUMN global_travel_qualified BOOLEAN DEFAULT FALSE AFTER education_completed,
ADD COLUMN global_travel_points INT DEFAULT 0 AFTER global_travel_qualified;

-- 11. Kar Paylaşımı Promosyonu için tablo (mevcut yapıyı koruyarak)
-- Bu özellik için ayrı tablo gerekli değil, mevcut franchise sistemi kullanılabilir

-- 12. Dashboard için özet view oluştur
CREATE OR REPLACE VIEW user_dashboard_summary AS
SELECT 
    u.id,
    u.sponsor_id,
    u.first_name,
    u.last_name,
    u.career_level,
    u.total_kkp,
    u.active_partners,
    u.is_active,
    
    -- Satış istatistikleri
    COALESCE(SUM(st.sale_amount), 0) as total_sales,
    COALESCE(COUNT(st.id), 0) as total_sales_count,
    
    -- Bu ay satışları
    COALESCE(SUM(CASE WHEN MONTH(st.sale_date) = MONTH(CURRENT_DATE) 
                      AND YEAR(st.sale_date) = YEAR(CURRENT_DATE) 
                      THEN st.sale_amount ELSE 0 END), 0) as monthly_sales,
    
    -- Müşteri sayıları
    COALESCE(COUNT(DISTINCT c.id), 0) as total_customers,
    COALESCE(SUM(c.referral_count), 0) as total_referrals,
    
    -- Takım istatistikleri
    COALESCE(COUNT(DISTINCT se.partner_id), 0) as sponsored_partners,
    COALESCE(SUM(CASE WHEN se.first_sale_activated = TRUE THEN 1 ELSE 0 END), 0) as active_sponsored_partners,
    
    -- Aylık aktiflik
    COALESCE(ma.is_active, FALSE) as is_active_this_month,
    
    u.created_at,
    u.updated_at
    
FROM users u
LEFT JOIN sales_tracking st ON u.id = st.seller_id
LEFT JOIN customers c ON u.id = c.created_by
LEFT JOIN sponsorship_earnings se ON u.id = se.sponsor_id
LEFT JOIN monthly_activity ma ON u.id = ma.user_id 
    AND ma.month_year = DATE_FORMAT(CURRENT_DATE, '%Y-%m')
WHERE u.role = 'partner'
GROUP BY u.id;

-- 13. Trigger'lar oluştur (otomatik güncellemeler için)

-- Kullanıcı oluşturulduğunda otomatik profil ve doping promosyonu oluştur
DELIMITER //
CREATE TRIGGER after_user_insert 
AFTER INSERT ON users 
FOR EACH ROW 
BEGIN
    -- User profile oluştur
    INSERT INTO user_profiles (user_id, join_date) 
    VALUES (NEW.id, CURDATE());
    
    -- Partner ise doping promosyonu oluştur
    IF NEW.role = 'partner' THEN
        INSERT INTO doping_promotion (
            user_id, 
            etap1_start_date, 
            etap1_end_date,
            etap2_start_date,
            etap2_end_date
        ) VALUES (
            NEW.id,
            CURDATE(),
            DATE_ADD(CURDATE(), INTERVAL 60 DAY),
            DATE_ADD(CURDATE(), INTERVAL 61 DAY),
            DATE_ADD(CURDATE(), INTERVAL 120 DAY)
        );
        
        -- Aylık aktiflik kaydı oluştur
        INSERT INTO monthly_activity (user_id, month_year)
        VALUES (NEW.id, DATE_FORMAT(CURDATE(), '%Y-%m'));
    END IF;
END//
DELIMITER ;

-- Satış yapıldığında otomatik güncellemeler
DELIMITER //
CREATE TRIGGER after_sales_tracking_insert 
AFTER INSERT ON sales_tracking 
FOR EACH ROW 
BEGIN
    -- Satıcının aylık aktifliğini güncelle
    INSERT INTO monthly_activity (user_id, month_year, personal_sales_count, last_activity_date, is_active)
    VALUES (NEW.seller_id, DATE_FORMAT(NEW.sale_date, '%Y-%m'), 1, DATE(NEW.sale_date), TRUE)
    ON DUPLICATE KEY UPDATE 
        personal_sales_count = personal_sales_count + 1,
        last_activity_date = DATE(NEW.sale_date),
        is_active = TRUE;
        
    -- Doping promosyonu güncellemesi
    UPDATE doping_promotion 
    SET 
        etap1_achieved_sales = etap1_achieved_sales + 1,
        etap2_achieved_sales = CASE 
            WHEN NEW.sale_date >= etap2_start_date THEN etap2_achieved_sales + 1 
            ELSE etap2_achieved_sales 
        END
    WHERE user_id = NEW.seller_id 
    AND is_active = TRUE;
END//
DELIMITER ;

-- 14. İndeksler ekle (performans için)
CREATE INDEX idx_sales_tracking_seller_date ON sales_tracking(seller_id, sale_date);
CREATE INDEX idx_customers_created_by_referrals ON customers(created_by, referral_count);
CREATE INDEX idx_sponsorship_earnings_sponsor_partner ON sponsorship_earnings(sponsor_id, partner_id);
CREATE INDEX idx_team_tracking_leader_member ON team_tracking(team_leader_id, member_id);
CREATE INDEX idx_franchise_network_user_month ON franchise_network_earnings(user_id, month_year);
CREATE INDEX idx_monthly_activity_user_month ON monthly_activity(user_id, month_year);

-- 15. Başlangıç verileri ekle (mevcut kullanıcılar için)
-- Mevcut kullanıcılar için eksik kayıtları oluştur
INSERT IGNORE INTO user_profiles (user_id, join_date)
SELECT id, DATE(created_at) FROM users WHERE role = 'partner';

INSERT IGNORE INTO monthly_activity (user_id, month_year)
SELECT id, DATE_FORMAT(CURDATE(), '%Y-%m') FROM users WHERE role = 'partner';

-- Mevcut partner'lar için doping promosyonu oluştur
INSERT IGNORE INTO doping_promotion (
    user_id, 
    etap1_start_date, 
    etap1_end_date,
    etap2_start_date,
    etap2_end_date
)
SELECT 
    id,
    CURDATE(),
    DATE_ADD(CURDATE(), INTERVAL 60 DAY),
    DATE_ADD(CURDATE(), INTERVAL 61 DAY),
    DATE_ADD(CURDATE(), INTERVAL 120 DAY)
FROM users 
WHERE role = 'partner';

-- 16. Stored Procedure'lar (hesaplamalar için)

-- Aylık franchise gelirlerini hesapla
DELIMITER //
CREATE PROCEDURE CalculateMonthlyFranchiseEarnings(IN target_month VARCHAR(7))
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE user_id INT;
    DECLARE user_career VARCHAR(50);
    DECLARE franchise_pct DECIMAL(5,2);
    
    DECLARE user_cursor CURSOR FOR 
        SELECT id, career_level FROM users 
        WHERE role = 'partner' 
        AND career_level IN ('silver', 'gold', 'star_leader', 'super_star_leader', 'presidents_team');
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN user_cursor;
    
    user_loop: LOOP
        FETCH user_cursor INTO user_id, user_career;
        IF done THEN
            LEAVE user_loop;
        END IF;
        
        -- Franchise yüzdesini belirle
        SET franchise_pct = CASE user_career
            WHEN 'silver' THEN 2
            WHEN 'gold' THEN 4
            WHEN 'star_leader' THEN 6
            WHEN 'super_star_leader' THEN 8
            WHEN 'presidents_team' THEN 10
            ELSE 0
        END;
        
        -- Franchise gelirini hesapla ve kaydet
        INSERT INTO franchise_network_earnings (
            user_id, month_year, user_career_level, franchise_percentage,
            total_network_volume, net_franchise_income, is_qualified
        )
        SELECT 
            user_id,
            target_month,
            user_career,
            franchise_pct,
            COALESCE(SUM(st.sale_amount), 0) as network_volume,
            COALESCE(SUM(st.sale_amount), 0) * franchise_pct / 100 as franchise_income,
            CASE WHEN ma.is_active = TRUE THEN TRUE ELSE FALSE END as qualified
        FROM sales_tracking st
        LEFT JOIN monthly_activity ma ON ma.user_id = user_id AND ma.month_year = target_month
        WHERE DATE_FORMAT(st.sale_date, '%Y-%m') = target_month
        AND st.seller_id IN (
            SELECT member_id FROM team_tracking WHERE team_leader_id = user_id
        )
        ON DUPLICATE KEY UPDATE
            total_network_volume = VALUES(total_network_volume),
            net_franchise_income = VALUES(net_franchise_income),
            is_qualified = VALUES(is_qualified);
            
    END LOOP;
    
    CLOSE user_cursor;
END//
DELIMITER ;

-- Kullanıcı istatistiklerini güncelle
DELIMITER //
CREATE PROCEDURE UpdateUserStatistics(IN target_user_id INT)
BEGIN
    UPDATE users u
    SET 
        total_kkp = (
            SELECT COALESCE(SUM(kkp_earned), 0) 
            FROM sales_tracking 
            WHERE seller_id = target_user_id
        ),
        active_partners = (
            SELECT COUNT(*) 
            FROM sponsorship_earnings 
            WHERE sponsor_id = target_user_id 
            AND first_sale_activated = TRUE
        )
    WHERE u.id = target_user_id;
END//
DELIMITER ;

COMMIT;