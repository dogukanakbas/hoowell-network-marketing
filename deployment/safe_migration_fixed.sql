-- HOOWELL Network Marketing - MySQL Uyumlu Güvenli Veri Migrasyonu
-- Bu script eski MySQL versiyonları ile uyumludur

-- Güvenlik için transaction başlat
START TRANSACTION;

-- 1. BACKUP TABLOSU OLUŞTUR (Güvenlik için)
DROP TABLE IF EXISTS users_migration_backup;
CREATE TABLE users_migration_backup AS SELECT * FROM users;

-- 2. MEVCUT KOLONLARI KONTROL ET VE EKLE (Güvenli yöntem)

-- education_deadline kolonu ekle
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'users' 
     AND table_schema = DATABASE() 
     AND column_name = 'education_deadline') > 0,
    'SELECT "education_deadline column already exists"',
    'ALTER TABLE users ADD COLUMN education_deadline TIMESTAMP NULL AFTER education_completed'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- education_started_at kolonu ekle
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'users' 
     AND table_schema = DATABASE() 
     AND column_name = 'education_started_at') > 0,
    'SELECT "education_started_at column already exists"',
    'ALTER TABLE users ADD COLUMN education_started_at TIMESTAMP NULL AFTER education_deadline'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- payment_blocked kolonu ekle
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'users' 
     AND table_schema = DATABASE() 
     AND column_name = 'payment_blocked') > 0,
    'SELECT "payment_blocked column already exists"',
    'ALTER TABLE users ADD COLUMN payment_blocked BOOLEAN DEFAULT FALSE AFTER payment_confirmed'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- payment_pending kolonu ekle
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'users' 
     AND table_schema = DATABASE() 
     AND column_name = 'payment_pending') > 0,
    'SELECT "payment_pending column already exists"',
    'ALTER TABLE users ADD COLUMN payment_pending BOOLEAN DEFAULT FALSE AFTER payment_blocked'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- backoffice_access kolonu ekle (eğer yoksa)
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'users' 
     AND table_schema = DATABASE() 
     AND column_name = 'backoffice_access') > 0,
    'SELECT "backoffice_access column already exists"',
    'ALTER TABLE users ADD COLUMN backoffice_access BOOLEAN DEFAULT FALSE AFTER education_completed'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3. MEVCUT KULLANICILAR İÇİN VARSAYILAN DEĞERLER ATAYIN
-- Eski kullanıcılar (1 günden eski) için eğitimi tamamlanmış say
UPDATE users 
SET 
    education_completed = COALESCE(education_completed, TRUE),
    backoffice_access = COALESCE(backoffice_access, TRUE),
    payment_blocked = COALESCE(payment_blocked, FALSE),
    payment_pending = COALESCE(payment_pending, FALSE)
WHERE role = 'partner' 
AND created_at < DATE_SUB(NOW(), INTERVAL 1 DAY);

-- Yeni kullanıcılar için eğitim süresi ver
UPDATE users 
SET 
    education_completed = COALESCE(education_completed, FALSE),
    backoffice_access = COALESCE(backoffice_access, FALSE),
    education_deadline = COALESCE(education_deadline, DATE_ADD(created_at, INTERVAL 7 DAY)),
    education_started_at = COALESCE(education_started_at, created_at),
    payment_blocked = COALESCE(payment_blocked, FALSE),
    payment_pending = COALESCE(payment_pending, TRUE)
WHERE role = 'partner' 
AND created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY);

-- 4. YENİ TABLOLARI OLUŞTUR (SADECE YOKSA)

-- Sales Tracking Table
CREATE TABLE IF NOT EXISTS sales_tracking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT NOT NULL,
    customer_id INT NULL,
    partner_id INT NULL,
    sale_type ENUM('product_sale', 'partner_registration', 'education_package') NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    sale_amount DECIMAL(10,2) NOT NULL,
    bonus_amount DECIMAL(10,2) NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bonus_date TIMESTAMP NOT NULL,
    status ENUM('pending', 'active', 'paid') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id),
    INDEX idx_seller_date (seller_id, sale_date),
    INDEX idx_status (status)
);

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    profile_photo VARCHAR(255),
    join_date DATE,
    last_login TIMESTAMP,
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
    INDEX idx_active (is_active_this_month),
    INDEX idx_sales (total_sales)
);

-- Sponsorship Earnings Table
CREATE TABLE IF NOT EXISTS sponsorship_earnings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sponsor_id INT NOT NULL,
    partner_id INT NOT NULL,
    bronze_earnings DECIMAL(10,2) DEFAULT 0,
    silver_earnings DECIMAL(10,2) DEFAULT 0,
    gold_earnings DECIMAL(10,2) DEFAULT 0,
    star_earnings DECIMAL(10,2) DEFAULT 0,
    super_star_earnings DECIMAL(10,2) DEFAULT 0,
    monthly_earnings DECIMAL(10,2) DEFAULT 0,
    first_sale_activated BOOLEAN DEFAULT FALSE,
    activation_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sponsor_id) REFERENCES users(id),
    FOREIGN KEY (partner_id) REFERENCES users(id),
    UNIQUE KEY unique_sponsor_partner (sponsor_id, partner_id),
    INDEX idx_sponsor (sponsor_id),
    INDEX idx_earnings (monthly_earnings)
);

-- Network Tree Table
CREATE TABLE IF NOT EXISTS network_tree (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    parent_id INT,
    sponsor_id INT,
    level INT DEFAULT 1,
    tree_path TEXT,
    left_count INT DEFAULT 0,
    right_count INT DEFAULT 0,
    total_downline INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES users(id),
    FOREIGN KEY (sponsor_id) REFERENCES users(id),
    INDEX idx_parent (parent_id),
    INDEX idx_level (level)
);

-- Global Travel Data Table
CREATE TABLE IF NOT EXISTS global_travel_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    total_points DECIMAL(10,2) DEFAULT 0,
    used_points DECIMAL(10,2) DEFAULT 0,
    available_points DECIMAL(10,2) DEFAULT 0,
    travel_level ENUM('bronze', 'silver', 'gold', 'platinum') DEFAULT 'bronze',
    last_travel_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Accounting Earnings Table
CREATE TABLE IF NOT EXISTS accounting_earnings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    earning_type ENUM('sales_commission', 'partner_bonus', 'career_bonus', 'franchise_bonus') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency ENUM('USD', 'TRY') DEFAULT 'USD',
    description TEXT,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    net_amount DECIMAL(10,2),
    earning_date DATE NOT NULL,
    status ENUM('pending', 'confirmed', 'paid') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_date (user_id, earning_date),
    INDEX idx_status (status)
);

-- Accounting Expenses Table
CREATE TABLE IF NOT EXISTS accounting_expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    expense_type VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency ENUM('USD', 'TRY') DEFAULT 'TRY',
    description TEXT,
    receipt_path VARCHAR(255),
    expense_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_date (user_id, expense_date)
);

-- 5. MEVCUT KULLANICILAR İÇİN PROFIL OLUŞTUR
INSERT IGNORE INTO user_profiles (user_id, join_date, total_sales, team_size, is_active_this_month)
SELECT 
    id, 
    DATE(created_at), 
    COALESCE(total_kkp / 40, 0), -- KKP'yi USD'ye çevir
    0, 
    FALSE 
FROM users 
WHERE role = 'partner';

-- 6. MEVCUT KULLANICILAR İÇİN NETWORK TREE OLUŞTUR
INSERT IGNORE INTO network_tree (user_id, parent_id, sponsor_id, level, tree_path)
SELECT 
    id,
    created_by,
    created_by,
    1, -- Başlangıç seviyesi
    CAST(id AS CHAR)
FROM users 
WHERE role = 'partner';

-- 7. MEVCUT KULLANICILAR İÇİN GLOBAL TRAVEL DATA OLUŞTUR
INSERT IGNORE INTO global_travel_data (user_id, total_points, available_points)
SELECT 
    id,
    0,
    0
FROM users 
WHERE role = 'partner';

-- 8. SPONSORSHIP EARNINGS KAYITLARI OLUŞTUR
INSERT IGNORE INTO sponsorship_earnings (sponsor_id, partner_id, bronze_earnings, silver_earnings, gold_earnings, star_earnings, super_star_earnings, monthly_earnings)
SELECT 
    s.id as sponsor_id,
    u.id as partner_id,
    0, 0, 0, 0, 0, 0
FROM users u
JOIN users s ON u.created_by = s.id
WHERE u.role = 'partner' AND s.role = 'partner';

-- 9. PERFORMANS İÇİN İNDEKSLER EKLE (Güvenli yöntem)
-- Sadece yoksa index ekle
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
     WHERE table_name = 'users' 
     AND table_schema = DATABASE() 
     AND index_name = 'idx_sponsor_id') > 0,
    'SELECT "idx_sponsor_id already exists"',
    'ALTER TABLE users ADD INDEX idx_sponsor_id (sponsor_id)'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
     WHERE table_name = 'users' 
     AND table_schema = DATABASE() 
     AND index_name = 'idx_career_level') > 0,
    'SELECT "idx_career_level already exists"',
    'ALTER TABLE users ADD INDEX idx_career_level (career_level)'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 10. KONTROL SORGUSU - MIGRATION BAŞARILI MI?
SELECT 
    'Migration Control' as check_type,
    COUNT(*) as total_users,
    SUM(CASE WHEN education_completed = 1 THEN 1 ELSE 0 END) as completed_education,
    SUM(CASE WHEN backoffice_access = 1 THEN 1 ELSE 0 END) as has_backoffice,
    (SELECT COUNT(*) FROM user_profiles) as profiles_created,
    (SELECT COUNT(*) FROM network_tree) as network_nodes,
    (SELECT COUNT(*) FROM global_travel_data) as travel_data_created
FROM users 
WHERE role = 'partner';

-- 11. BACKUP TABLOSU KONTROL
SELECT 
    'Backup Control' as check_type,
    COUNT(*) as backup_records,
    MIN(created_at) as oldest_user,
    MAX(created_at) as newest_user
FROM users_migration_backup;

-- Transaction'ı commit et (her şey başarılıysa)
COMMIT;

-- Başarı mesajı
SELECT 'Migration completed successfully! Check the control queries above.' as status;

-- ROLLBACK için komut (sadece sorun olursa kullan):
-- ROLLBACK;
-- DROP TABLE IF EXISTS users_migration_backup;