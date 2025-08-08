-- Eksik tabloları oluşturma scripti

-- User profiles tablosu (eğer yoksa)
CREATE TABLE IF NOT EXISTS user_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    profile_photo VARCHAR(255),
    join_date DATE,
    last_login DATETIME,
    total_sales DECIMAL(15,2) DEFAULT 0,
    monthly_sales DECIMAL(15,2) DEFAULT 0,
    team_size INT DEFAULT 0,
    active_team_members INT DEFAULT 0,
    personal_volume DECIMAL(15,2) DEFAULT 0,
    team_volume DECIMAL(15,2) DEFAULT 0,
    notes TEXT,
    is_active_this_month BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_profile (user_id)
);

-- Sponsorship earnings tablosu (eğer yoksa)
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
    FOREIGN KEY (sponsor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (partner_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_sponsor_partner (sponsor_id, partner_id)
);

-- Sales tracking tablosu (eğer yoksa)
CREATE TABLE IF NOT EXISTS sales_tracking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT NOT NULL,
    customer_id INT NULL,
    partner_id INT NULL,
    sale_type ENUM('product_sale', 'partner_registration', 'education_package') NOT NULL,
    product_name VARCHAR(255),
    sale_amount DECIMAL(15,2) NOT NULL,
    bonus_amount DECIMAL(15,2) DEFAULT 0,
    sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    bonus_date DATETIME NULL,
    status ENUM('pending', 'active', 'paid') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (partner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Earning types tablosu (muhasebe için)
CREATE TABLE IF NOT EXISTS earning_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default earning types
INSERT IGNORE INTO earning_types (id, name, description) VALUES
(1, 'Kariyer Atlama Bonusu', 'Kariyer seviyesi yükseltme bonusu'),
(2, 'Sponsorluk Komisyonu', 'Alt seviye satışlarından komisyon'),
(3, 'Kar Paylaşımı', 'Yıllık kar paylaşımı havuzu'),
(4, 'Franchise Ağı Bonusu', 'Aylık franchise ağı bonusu'),
(5, 'Doping Promosyonu', 'İlk 120 gün doping promosyonu'),
(6, 'Müşteri Satış Bonusu', 'Direkt müşteri satış bonusu');

-- Earnings tablosu (muhasebe için)
CREATE TABLE IF NOT EXISTS earnings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    earning_type_id INT NOT NULL,
    related_person VARCHAR(255),
    sale_date DATE,
    earn_date DATE,
    payment_date DATE NULL,
    amount_usd DECIMAL(15,2) NOT NULL,
    exchange_rate DECIMAL(8,4) DEFAULT 40.0000,
    tax_rate DECIMAL(5,2) DEFAULT 20.00,
    payment_status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
    is_company BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (earning_type_id) REFERENCES earning_types(id)
);

-- Expenses tablosu (muhasebe için)
CREATE TABLE IF NOT EXISTS expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    expense_type VARCHAR(100) NOT NULL,
    description TEXT,
    amount_usd DECIMAL(15,2) NOT NULL,
    exchange_rate DECIMAL(8,4) DEFAULT 40.0000,
    expense_date DATE,
    receipt_path VARCHAR(255),
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INT NULL,
    approved_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Global travel data tablosu
CREATE TABLE IF NOT EXISTS global_travel_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    year INT NOT NULL,
    total_sales_usd DECIMAL(15,2) DEFAULT 0,
    total_sales_count INT DEFAULT 0,
    active_partners INT DEFAULT 0,
    level1_qualified BOOLEAN DEFAULT FALSE,
    level2_qualified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_year (user_id, year)
);

-- Customer references tablosu (müşteri memnuniyeti için)
CREATE TABLE IF NOT EXISTS customer_references (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    reference_name VARCHAR(100) NOT NULL,
    reference_surname VARCHAR(100) NOT NULL,
    reference_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Customer satisfaction rewards tablosu
CREATE TABLE IF NOT EXISTS customer_satisfaction_rewards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    reward_level INT NOT NULL,
    reward_name VARCHAR(255) NOT NULL,
    reward_description TEXT,
    earned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    claimed BOOLEAN DEFAULT FALSE,
    claimed_date DATETIME NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Network tree tablosu
CREATE TABLE IF NOT EXISTS network_tree (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    parent_id INT NULL,
    sponsor_id INT NOT NULL,
    level INT DEFAULT 1,
    tree_path TEXT,
    left_count INT DEFAULT 0,
    right_count INT DEFAULT 0,
    total_downline INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (sponsor_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_tree (user_id)
);

-- Career bonuses tablosu (eğer yoksa)
CREATE TABLE IF NOT EXISTS career_bonuses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    career_level VARCHAR(50) NOT NULL,
    bonus_amount DECIMAL(10,2) NOT NULL,
    kkp_threshold DECIMAL(15,2) NOT NULL,
    paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Mevcut kullanıcılar için user_profiles oluştur
INSERT IGNORE INTO user_profiles (user_id, join_date, total_sales, team_size, is_active_this_month)
SELECT id, DATE(created_at), 0, 0, FALSE 
FROM users 
WHERE role = 'partner';

-- Mevcut partnerler için sponsorship_earnings oluştur
INSERT IGNORE INTO sponsorship_earnings (sponsor_id, partner_id, bronze_earnings, silver_earnings, gold_earnings, star_earnings, super_star_earnings, monthly_earnings, first_sale_activated)
SELECT u.created_by, u.id, 0, 0, 0, 0, 0, 0, FALSE
FROM users u
WHERE u.role = 'partner' AND u.created_by IS NOT NULL;