-- HOOWELL Yeni Tablolar Ekleme Scripti
-- Bu script mevcut verileri koruyarak yeni tabloları ekler
-- Tarih: $(date)
-- Güvenli: IF NOT EXISTS kullanır, mevcut verileri korur

USE hoowell_network;

-- ==================== EĞİTİM SİSTEMİ TABLOLARI ====================

-- Eğitim videoları tablosu
CREATE TABLE IF NOT EXISTS education_videos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    video_title VARCHAR(255) NOT NULL,
    video_description TEXT,
    video_url VARCHAR(500) NOT NULL,
    video_duration INT DEFAULT 0,
    video_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Eğitim soruları tablosu
CREATE TABLE IF NOT EXISTS education_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    video_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'true_false') NOT NULL,
    correct_answer VARCHAR(10) NOT NULL,
    option_a VARCHAR(255),
    option_b VARCHAR(255),
    option_c VARCHAR(255),
    option_d VARCHAR(255),
    points INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (video_id) REFERENCES education_videos(id)
);

-- Kullanıcı video ilerlemesi tablosu
CREATE TABLE IF NOT EXISTS user_video_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    video_id INT NOT NULL,
    watched BOOLEAN DEFAULT FALSE,
    exam_taken BOOLEAN DEFAULT FALSE,
    exam_score INT DEFAULT 0,
    exam_passed BOOLEAN DEFAULT FALSE,
    watched_at TIMESTAMP NULL,
    exam_taken_at TIMESTAMP NULL,
    UNIQUE KEY unique_user_video (user_id, video_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (video_id) REFERENCES education_videos(id)
);

-- ==================== SPONSORLUK TAKİBİ TABLOLARI ====================

-- Sponsorluk kazançları tablosu
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
    activation_date DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sponsor_id) REFERENCES users(id),
    FOREIGN KEY (partner_id) REFERENCES users(id),
    UNIQUE KEY unique_sponsor_partner (sponsor_id, partner_id)
);

-- ==================== MUHASEBE SİSTEMİ TABLOLARI ====================

-- Muhasebe bilgileri tablosu
CREATE TABLE IF NOT EXISTS accounting_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    account_type ENUM('individual', 'company') NOT NULL,
    iban VARCHAR(50) NOT NULL,
    bank_name VARCHAR(100),
    account_holder_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    tax_number VARCHAR(20),
    tc_identity_front VARCHAR(255),
    tax_plate VARCHAR(255),
    is_approved BOOLEAN DEFAULT FALSE,
    approval_date TIMESTAMP NULL,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ==================== SATIŞ TAKİBİ TABLOLARI ====================

-- Satış takip sistemi tablosu
CREATE TABLE IF NOT EXISTS sales_tracking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT NOT NULL,
    customer_id INT,
    partner_id INT,
    product_name VARCHAR(255) NOT NULL,
    sale_amount DECIMAL(10,2) NOT NULL,
    sale_date DATE NOT NULL,
    bonus_date DATE NOT NULL,
    bonus_amount DECIMAL(10,2) NOT NULL,
    sale_type ENUM('product_sale', 'customer_registration', 'partner_registration', 'franchise') NOT NULL,
    status ENUM('pending', 'active') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (partner_id) REFERENCES users(id)
);

-- ==================== KARİYER BONUSLARI TABLOLARI ====================

-- Kariyer bonusları tablosu
CREATE TABLE IF NOT EXISTS career_bonuses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    career_level VARCHAR(50) NOT NULL,
    bonus_amount_usd DECIMAL(10,2) NOT NULL,
    bonus_amount_try DECIMAL(10,2) NOT NULL,
    kkp_achieved DECIMAL(15,2) NOT NULL,
    status ENUM('pending', 'paid') DEFAULT 'pending',
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ==================== SİSTEM AYARLARI TABLOSU ====================

-- System settings tablosu
CREATE TABLE IF NOT EXISTS system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==================== ÜRÜNLER TABLOSU ====================

-- Products tablosu
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    product_code VARCHAR(50) UNIQUE NOT NULL,
    usd_price DECIMAL(10,2) NOT NULL,
    kkp_points INT DEFAULT 0,
    vat_percentage DECIMAL(5,2) DEFAULT 20.00,
    sale_price_try DECIMAL(10,2),
    vat_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    stock_quantity INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_product_code (product_code),
    INDEX idx_is_active (is_active)
);

-- ==================== MEVCUT TABLOLARA KOLON EKLEME ====================

-- Users tablosuna yeni kolonlar ekle (sadece yoksa)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS city VARCHAR(100) AFTER full_address,
ADD COLUMN IF NOT EXISTS district VARCHAR(100) AFTER city,
ADD COLUMN IF NOT EXISTS full_address TEXT AFTER district,
ADD COLUMN IF NOT EXISTS registration_type ENUM('individual','corporate') DEFAULT 'individual' AFTER partner_type,
ADD COLUMN IF NOT EXISTS total_kkp DECIMAL(15,2) DEFAULT 0 AFTER career_level,
ADD COLUMN IF NOT EXISTS active_partners INT DEFAULT 0 AFTER total_kkp,
ADD COLUMN IF NOT EXISTS education_deadline DATETIME NULL AFTER education_completed,
ADD COLUMN IF NOT EXISTS education_started_at DATETIME NULL AFTER education_deadline,
ADD COLUMN IF NOT EXISTS backoffice_access BOOLEAN DEFAULT FALSE AFTER education_started_at,
ADD COLUMN IF NOT EXISTS payment_pending BOOLEAN DEFAULT FALSE AFTER backoffice_access,
ADD COLUMN IF NOT EXISTS payment_blocked BOOLEAN DEFAULT FALSE AFTER payment_pending,
ADD COLUMN IF NOT EXISTS payment_block_date DATETIME AFTER payment_blocked,
ADD COLUMN IF NOT EXISTS created_by INT AFTER payment_block_date,
ADD COLUMN IF NOT EXISTS partner_type ENUM('individual','corporate') DEFAULT 'individual' AFTER created_by,
ADD COLUMN IF NOT EXISTS tc_no VARCHAR(11) AFTER partner_type,
ADD COLUMN IF NOT EXISTS delivery_address TEXT AFTER tc_no,
ADD COLUMN IF NOT EXISTS billing_address TEXT AFTER delivery_address,
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255) AFTER billing_address,
ADD COLUMN IF NOT EXISTS tax_office VARCHAR(255) AFTER company_name,
ADD COLUMN IF NOT EXISTS tax_no VARCHAR(20) AFTER tax_office,
ADD COLUMN IF NOT EXISTS authorized_person VARCHAR(255) AFTER tax_no,
ADD COLUMN IF NOT EXISTS referrer_sponsor_id VARCHAR(20) AFTER authorized_person;

-- ==================== VARSayılan VERİLER EKLEME ====================

-- Varsayılan sistem ayarları (sadece yoksa ekle)
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

-- Varsayılan ürünler (sadece yoksa ekle)
INSERT IGNORE INTO products (product_name, product_code, usd_price, kkp_points, vat_percentage, sale_price_try, vat_price, total_price, stock_quantity) VALUES
('Eğitim Paketi', 'EDU001', 100.00, 100, 20.00, 4000.00, 800.00, 4800.00, 999),
('Cihaz Paketi', 'DEV001', 1800.00, 1800, 20.00, 72000.00, 14400.00, 86400.00, 50),
('Bronze Paketi', 'BRONZE001', 500.00, 500, 20.00, 20000.00, 4000.00, 24000.00, 100),
('Silver Paketi', 'SILVER001', 1000.00, 1000, 20.00, 40000.00, 8000.00, 48000.00, 75),
('Gold Paketi', 'GOLD001', 2000.00, 2000, 20.00, 80000.00, 16000.00, 96000.00, 25);

-- Örnek eğitim videoları (sadece yoksa ekle)
INSERT IGNORE INTO education_videos (video_title, video_description, video_url, video_duration, video_order, is_active) VALUES
('Hoowell Sistemine Giriş', 'Hoowell network marketing sisteminin temelleri ve nasıl çalıştığı', 'https://www.youtube.com/watch?v=sample1', 15, 1, TRUE),
('Ürün Kataloğu ve Satış Teknikleri', 'Hoowell ürünlerini tanıma ve satış stratejileri', 'https://www.youtube.com/watch?v=sample2', 20, 2, TRUE),
('Network Marketing Prensipleri', 'Network marketing sektörünün temel prensipleri ve başarı faktörleri', 'https://www.youtube.com/watch?v=sample3', 25, 3, TRUE),
('Müşteri İlişkileri Yönetimi', 'Müşteri memnuniyeti ve uzun vadeli ilişki kurma', 'https://www.youtube.com/watch?v=sample4', 18, 4, TRUE),
('Takım Yönetimi ve Liderlik', 'Takım oluşturma, motivasyon ve liderlik becerileri', 'https://www.youtube.com/watch?v=sample5', 22, 5, TRUE);

-- ==================== KONTROL SORGULARI ====================

-- Yeni tabloları listele
SELECT 'YENİ TABLOLAR BAŞARIYLA EKLENDİ!' as durum;

-- Veri sayılarını kontrol et
SELECT 'VERİ SAYILARI:' as info;
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'payments', COUNT(*) FROM payments
UNION ALL
SELECT 'sales', COUNT(*) FROM sales
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'system_settings', COUNT(*) FROM system_settings
UNION ALL
SELECT 'education_videos', COUNT(*) FROM education_videos;

-- Script tamamlandı mesajı
SELECT 'HOOWELL TABLOLARI BAŞARIYLA GÜNCELLENDİ!' as tamamlandi;
