-- Eksik tabloları oluştur
USE hoowell_network;

-- Sales Tracking Table (Satış Takip Tablosu)
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
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (partner_id) REFERENCES users(id)
);

-- User Profiles Table (Kullanıcı Profilleri)
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sponsorship Earnings Table (Sponsorluk Kazançları)
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
    UNIQUE KEY unique_sponsor_partner (sponsor_id, partner_id)
);

-- Network Tree Table (Ağ Ağacı)
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
    FOREIGN KEY (sponsor_id) REFERENCES users(id)
);

-- Customers Table güncellemesi (Foreign Key ekle)
ALTER TABLE customers 
ADD CONSTRAINT fk_customers_created_by 
FOREIGN KEY (created_by) REFERENCES users(id);

-- Global Travel Data Table (Global Seyahat Verileri)
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

-- Accounting Data Tables (Muhasebe Verileri)
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
    FOREIGN KEY (user_id) REFERENCES users(id)
);

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
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for better performance
CREATE INDEX idx_sales_tracking_seller ON sales_tracking(seller_id);
CREATE INDEX idx_sales_tracking_date ON sales_tracking(sale_date);
CREATE INDEX idx_user_profiles_active ON user_profiles(is_active_this_month);
CREATE INDEX idx_sponsorship_earnings_sponsor ON sponsorship_earnings(sponsor_id);
CREATE INDEX idx_network_tree_parent ON network_tree(parent_id);
CREATE INDEX idx_accounting_earnings_user ON accounting_earnings(user_id);
CREATE INDEX idx_accounting_earnings_date ON accounting_earnings(earning_date);