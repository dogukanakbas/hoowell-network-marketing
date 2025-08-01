-- Eksik tabloları oluştur

USE hoowell_network;

-- Muhasebe Takip Paneli için tablolar
CREATE TABLE IF NOT EXISTS earning_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS earnings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    earning_type_id INT NOT NULL,
    related_person VARCHAR(255),
    sale_date DATE,
    earn_date DATE,
    payment_date DATE,
    amount_usd DECIMAL(10,2) NOT NULL,
    exchange_rate DECIMAL(8,4) DEFAULT 40.0000,
    tax_rate DECIMAL(5,2) DEFAULT 20.00,
    payment_status ENUM('BEKLEMEDE', 'ÖDENDİ', 'İPTAL') DEFAULT 'BEKLEMEDE',
    is_company BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (earning_type_id) REFERENCES earning_types(id)
);

-- Global Seyahat için tablo
CREATE TABLE IF NOT EXISTS global_travel_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    start_date VARCHAR(20) DEFAULT 'EYLÜL 2025',
    end_date VARCHAR(20) DEFAULT 'AĞUSTOS 2026',
    sales1_target DECIMAL(10,2) DEFAULT 40000,
    sales1_current DECIMAL(10,2) DEFAULT 0,
    sales1_remaining DECIMAL(10,2) DEFAULT 40000,
    sales2_target DECIMAL(10,2) DEFAULT 65000,
    sales2_current DECIMAL(10,2) DEFAULT 0,
    sales2_remaining DECIMAL(10,2) DEFAULT 65000,
    partnership_target INT DEFAULT 5,
    partnership_current INT DEFAULT 0,
    partnership_remaining INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_travel (user_id)
);

-- Admin sistem ayarları için tablo
CREATE TABLE IF NOT EXISTS admin_system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(255),
    product_code VARCHAR(100),
    usd_price DECIMAL(10,2),
    kkp_points DECIMAL(10,2),
    vat_percentage DECIMAL(5,2),
    sales_price_try DECIMAL(10,2),
    vat_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    stock_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Kazanç türlerini ekle
INSERT IGNORE INTO earning_types (name, description) VALUES
('SATIŞ', 'Ürün satış komisyonu'),
('PROMOSYON', 'Promosyon bonusu'),
('ORTAKLIK PROMOSYONU', 'Ortaklık promosyon bonusu'),
('TAKIM KOMİSYONU', 'Takım komisyon bonusu'),
('LİDERLİK HAVUZLARI', 'Liderlik havuz bonusu'),
('KARİYER BONUSU', 'Kariyer seviye bonusu'),
('KAR PAYLAŞIMI', 'Yıllık kar paylaşım bonusu');

-- Tüm kullanıcılar için global seyahat verisi oluştur
INSERT IGNORE INTO global_travel_data (user_id) 
SELECT id FROM users WHERE role = 'partner';

-- Varsayılan sistem ayarları
INSERT IGNORE INTO admin_system_settings (
    product_name, product_code, usd_price, kkp_points, vat_percentage,
    sales_price_try, vat_price, total_price, stock_count
) VALUES (
    'Hoowell Hybrid Alkali İyonizer', 'HW-HAI-2025', 1800.00, 1800.00, 20.00,
    72000.00, 14400.00, 86400.00, 500
);