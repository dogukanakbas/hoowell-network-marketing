-- HOOWELL Database Migration Script
-- Mevcut verileri koruyarak yeni özellikleri ekler

USE hoowell_network;

-- 1. Önce yeni tabloları kontrol et, yoksa oluştur
CREATE TABLE IF NOT EXISTS customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id VARCHAR(20) UNIQUE NOT NULL,
    registration_type ENUM('individual', 'corporate') NOT NULL,
    
    -- Bireysel müşteri bilgileri
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    tc_no VARCHAR(11),
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    
    -- Kurumsal müşteri bilgileri
    company_name VARCHAR(255),
    tax_office VARCHAR(255),
    tax_no VARCHAR(20),
    authorized_person VARCHAR(255),
    authorized_email VARCHAR(100),
    authorized_phone VARCHAR(20),
    
    -- Adres bilgileri
    delivery_address TEXT NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_district VARCHAR(100) NOT NULL,
    billing_address TEXT,
    billing_city VARCHAR(100),
    billing_district VARCHAR(100),
    same_address BOOLEAN DEFAULT TRUE,
    
    -- Ürün bilgileri
    selected_product VARCHAR(50),
    product_price DECIMAL(10,2),
    product_vat DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    
    -- Sözleşme onayları
    contract1_accepted BOOLEAN DEFAULT FALSE,
    contract2_accepted BOOLEAN DEFAULT FALSE,
    
    -- Sistem bilgileri
    created_by INT,
    order_id VARCHAR(50),
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_customer_id (customer_id),
    INDEX idx_email (email),
    INDEX idx_created_by (created_by),
    INDEX idx_status (status),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 2. Customer References tablosu
CREATE TABLE IF NOT EXISTS customer_references (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    reference_name VARCHAR(100) NOT NULL,
    reference_surname VARCHAR(100) NOT NULL,
    reference_phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- 3. Users tablosuna yeni alanları ekle (sadece yoksa)
-- MySQL'de IF NOT EXISTS desteklenmediği için önce kontrol edelim

-- City kolonu ekle
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hoowell_network' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'city';

SET @sql = IF(@col_exists = 0, 'ALTER TABLE users ADD COLUMN city VARCHAR(100)', 'SELECT "city column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- District kolonu ekle
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hoowell_network' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'district';

SET @sql = IF(@col_exists = 0, 'ALTER TABLE users ADD COLUMN district VARCHAR(100)', 'SELECT "district column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Full_address kolonu ekle
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hoowell_network' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'full_address';

SET @sql = IF(@col_exists = 0, 'ALTER TABLE users ADD COLUMN full_address TEXT', 'SELECT "full_address column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Authorized_first_name kolonu ekle
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hoowell_network' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'authorized_first_name';

SET @sql = IF(@col_exists = 0, 'ALTER TABLE users ADD COLUMN authorized_first_name VARCHAR(100)', 'SELECT "authorized_first_name column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Authorized_last_name kolonu ekle
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hoowell_network' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'authorized_last_name';

SET @sql = IF(@col_exists = 0, 'ALTER TABLE users ADD COLUMN authorized_last_name VARCHAR(100)', 'SELECT "authorized_last_name column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Registration_type kolonu ekle
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hoowell_network' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'registration_type';

SET @sql = IF(@col_exists = 0, 'ALTER TABLE users ADD COLUMN registration_type ENUM(''individual'', ''corporate'')', 'SELECT "registration_type column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Contract1_accepted kolonu ekle
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hoowell_network' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'contract1_accepted';

SET @sql = IF(@col_exists = 0, 'ALTER TABLE users ADD COLUMN contract1_accepted BOOLEAN DEFAULT FALSE', 'SELECT "contract1_accepted column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Contract2_accepted kolonu ekle
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hoowell_network' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'contract2_accepted';

SET @sql = IF(@col_exists = 0, 'ALTER TABLE users ADD COLUMN contract2_accepted BOOLEAN DEFAULT FALSE', 'SELECT "contract2_accepted column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Total_amount kolonu ekle
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hoowell_network' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'total_amount';

SET @sql = IF(@col_exists = 0, 'ALTER TABLE users ADD COLUMN total_amount DECIMAL(10,2) DEFAULT 0', 'SELECT "total_amount column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Registration_step kolonu ekle
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hoowell_network' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'registration_step';

SET @sql = IF(@col_exists = 0, 'ALTER TABLE users ADD COLUMN registration_step INT DEFAULT 1', 'SELECT "registration_step column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Registration_completed kolonu ekle
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hoowell_network' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'registration_completed';

SET @sql = IF(@col_exists = 0, 'ALTER TABLE users ADD COLUMN registration_completed BOOLEAN DEFAULT FALSE', 'SELECT "registration_completed column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4. Mevcut admin kullanıcılarının sponsor_id'lerini güncelle (sadece NULL olanlar)
UPDATE users SET sponsor_id = 'P2025000000' WHERE username = 'hoowell' AND sponsor_id IS NULL;
UPDATE users SET sponsor_id = 'P2025000014' WHERE username = 'hakandalkilic' AND sponsor_id IS NULL;
UPDATE users SET sponsor_id = 'P2025000033' WHERE username = 'hakandemiray' AND sponsor_id IS NULL;
UPDATE users SET sponsor_id = 'P2025000003' WHERE username = 'admin3' AND sponsor_id IS NULL;
UPDATE users SET sponsor_id = 'P2025000004' WHERE username = 'admin4' AND sponsor_id IS NULL;
UPDATE users SET sponsor_id = 'P2025000005' WHERE username = 'admin5' AND sponsor_id IS NULL;

-- 5. Sistem ayarlarını kontrol et ve eksikleri ekle
INSERT IGNORE INTO system_settings (setting_key, setting_value) VALUES
('usd_to_try_rate', '40'),
('vat_rate', '20'),
('education_price_usd', '100'),
('device_price_usd', '1800'),
('bronze_kkp_required', '0'),
('silver_kkp_required', '20000'),
('gold_kkp_required', '50000'),
('star_leader_kkp_required', '100000'),
('super_star_leader_kkp_required', '175000'),
('presidents_team_kkp_required', '300000'),
('country_distributor_kkp_required', '400000'),
('silver_partners_required', '1'),
('gold_partners_required', '3'),
('star_leader_partners_required', '7'),
('super_star_leader_partners_required', '15'),
('presidents_team_partners_required', '25'),
('country_distributor_partners_required', '30');

-- 6. Mevcut kullanıcıların eksik alanlarını güncelle
UPDATE users SET 
    registration_completed = TRUE,
    registration_step = 6
WHERE role = 'partner' AND registration_completed IS NULL;

-- 7. Kontrol sorguları
SELECT 'Migration completed successfully' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_customers FROM customers;
SELECT COUNT(*) as total_settings FROM system_settings;