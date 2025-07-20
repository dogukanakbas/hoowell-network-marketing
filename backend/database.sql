-- Hoowell Network Marketing Database Schema

CREATE DATABASE IF NOT EXISTS hoowell_network;
USE hoowell_network;

-- System Settings Table
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO system_settings (setting_key, setting_value) VALUES
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

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'partner') DEFAULT 'partner',
    sponsor_id VARCHAR(20),
    career_level ENUM('bronze', 'silver', 'gold', 'star_leader', 'super_star_leader', 'presidents_team', 'country_distributor') DEFAULT 'bronze',
    total_kkp DECIMAL(15,2) DEFAULT 0,
    active_partners INT DEFAULT 0,
    is_active BOOLEAN DEFAULT FALSE,
    payment_confirmed BOOLEAN DEFAULT FALSE,
    education_completed BOOLEAN DEFAULT FALSE,
    education_deadline DATETIME NULL,
    education_started_at DATETIME NULL,
    backoffice_access BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    payment_pending BOOLEAN DEFAULT FALSE,
    payment_blocked BOOLEAN DEFAULT FALSE,
    payment_block_date DATETIME,
    created_by INT,
    partner_type ENUM('individual','corporate'),
    tc_no VARCHAR(11),
    delivery_address TEXT,
    billing_address TEXT,
    company_name VARCHAR(255),
    tax_office VARCHAR(255),
    tax_no VARCHAR(20),
    authorized_person VARCHAR(255),
    referrer_sponsor_id VARCHAR(20),
    -- Yeni kayıt sistemi için ek alanlar
    city VARCHAR(100),
    district VARCHAR(100),
    full_address TEXT,
    authorized_first_name VARCHAR(100),
    authorized_last_name VARCHAR(100),
    registration_type ENUM('individual', 'corporate'),
    contract1_accepted BOOLEAN DEFAULT FALSE,
    contract2_accepted BOOLEAN DEFAULT FALSE,
    total_amount DECIMAL(10,2) DEFAULT 0,
    registration_step INT DEFAULT 1,
    registration_completed BOOLEAN DEFAULT FALSE,
    UNIQUE KEY sponsor_id (sponsor_id),
    INDEX idx_created_by (created_by),
    INDEX idx_referrer_sponsor_id (referrer_sponsor_id),
    INDEX idx_registration_type (registration_type),
    INDEX idx_city (city)
);

-- Insert default admin users
INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active, payment_confirmed, education_completed, backoffice_access, sponsor_id) VALUES
('hoowell', 'admin@hoowell.net', '$2a$10$g/UMsawVSpxhjsbBWUH2OOCnF14KDgFJHBwic.dAZvmWBTTZJlMBu', 'Hoowell', 'Admin', 'admin', TRUE, TRUE, TRUE, TRUE, 'P2025000000'),
('hakandalkilic', 'hakandalkilic14@gmail.com', '$2a$10$RYydMaICbfrAP2EvSWgIQOrrNkTI7zm4wayQD2esRrOOUNndKBhZi', 'Hakan', 'Dalkılıç', 'admin', TRUE, TRUE, TRUE, TRUE, 'P2025000014'),
('hakandemiray', 'sporfuturisti@gmail.com', '$2a$10$dNnspNyHfybj0XKKHDxZku9KH95q3.lvtV/sNFgjWHGeEjf8YNXYq', 'Hakan', 'Demiray', 'admin', TRUE, TRUE, TRUE, TRUE, 'P2025000033'),
('admin3', 'admin3@hoowell.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'Three', 'admin', TRUE, TRUE, TRUE, TRUE, 'P2025000003'),
('admin4', 'admin4@hoowell.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'Four', 'admin', TRUE, TRUE, TRUE, TRUE, 'P2025000004'),
('admin5', 'admin5@hoowell.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'Five', 'admin', TRUE, TRUE, TRUE, TRUE, 'P2025000005');

-- Payments Table
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    payment_type ENUM('education', 'device') NOT NULL,
    amount_usd DECIMAL(10,2) NOT NULL,
    amount_try DECIMAL(10,2) NOT NULL,
    vat_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    receipt_path VARCHAR(255),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approved_by INT,
    approved_at TIMESTAMP NULL,
    verified_by INT,
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- Videos Table
CREATE TABLE videos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    google_drive_url TEXT NOT NULL,
    cover_image VARCHAR(255) DEFAULT NULL,
    order_number INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert videos
INSERT INTO videos (title, description, google_drive_url, cover_image, order_number) VALUES
('Hoowell\'e Hoşgeldiniz', 'Hoowell ailesine katıldığınız için teşekkürler. Bu videoda size sistemimizi tanıtıyoruz.', 'https://drive.google.com/file/d/1vg6RsU-b2hk4i6FDimAGnvWaESy6Qvnh/view?usp=sharing', '/video-covers/video-1-cover.jpg', 1),
('Kaliteli Satıcı Olmak İçin Psikolojik Hazırlık', 'Başarılı bir satış temsilcisi olmak için gerekli zihinsel hazırlık süreçleri.', 'https://drive.google.com/file/d/1zk45_cn-r3_EtUvKGIDFJRsEx7SKFke4/view?usp=sharing', '/video-covers/video-2-cover.jpg', 2),
('İyi Bir Satıcının Sahip Olması Gereken Özellikler', 'Başarılı satış temsilcilerinin ortak özellikleri ve bu özellikleri nasıl geliştirebileceğiniz.', 'https://drive.google.com/file/d/1bDJPS2-f1D9uxrABUsK2GwGdFfA_c06x/view?usp=sharing', '/video-covers/video-3-cover.jpg', 3),
('Kaliteli Reklam ve Satışın Senaryosu', 'Etkili reklam stratejileri ve satış senaryolarının nasıl hazırlanacağı.', 'https://drive.google.com/file/d/17a3oIhtoQDFkI7CqzQbSPLi0mU8R71ca/view?usp=sharing', '/video-covers/video-4-cover.jpg', 4),
('Mazeret Aşmak ve Satış Teknikleri', 'Müşteri itirazlarını aşma teknikleri ve etkili satış yöntemleri.', 'https://drive.google.com/file/d/1O1Op_EiAzhpmd68hk-8pXxL57ABrSk8w/view?usp=sharing', '/video-covers/video-5-cover.jpg', 5),
('Düzenli Memnun Müşteri Kitlesi Oluşturmak', 'Sadık müşteri portföyü oluşturma ve müşteri memnuniyetini artırma stratejileri.', 'https://drive.google.com/file/d/1-5zB-thDF4SZGt1fpeTpLr71geuor0WP/view?usp=sharing', '/video-covers/video-6-cover.jpg', 6),
('Müşteri Kontak Listesi Nasıl Yapılır ve Yönetilir', 'Etkili müşteri veritabanı oluşturma ve yönetme teknikleri.', 'https://drive.google.com/file/d/1Oo7dl-4Yxch7CEd38nCkzJ7mimraw1-A/view?usp=sharing', '/video-covers/video-7-cover.jpg', 7),
('Takım Kur Pasif Gelir Kazan', 'Network marketing sisteminde takım oluşturma ve pasif gelir elde etme yöntemleri.', 'https://drive.google.com/file/d/1ZeS0945o9nL2FXNO4Uj4_0G1nQjQTcjo/view?usp=sharing', '/video-covers/video-8-cover.jpg', 8),
('İşinizi Kurmak İçin Psikolojik Hazırlık', 'Kendi işinizi kurma sürecinde gerekli zihinsel hazırlık ve motivasyon teknikleri.', 'https://drive.google.com/file/d/19wmUPWpwTceuTUH_pUU3gzJiZCio3BRg/view?usp=sharing', '/video-covers/video-9-cover.jpg', 9),
('İşinize Başlama Zamanı', 'Artık hazırsınız! İşinize başlama ve ilk adımları atma rehberi.', 'https://drive.google.com/file/d/1vSVMfK9jEHa9OMkGBVI1-nVQYrcdCGF0/view?usp=sharing', '/video-covers/video-10-cover.jpg', 10);

-- Questions Table
CREATE TABLE questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    video_id INT NOT NULL,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_answer ENUM('a', 'b', 'c', 'd') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (video_id) REFERENCES videos(id)
);

-- User Video Progress Table
CREATE TABLE user_video_progress (
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
    FOREIGN KEY (video_id) REFERENCES videos(id)
);

-- Sales Table
CREATE TABLE sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT NOT NULL,
    buyer_id INT,
    sale_type ENUM('partner_registration', 'product_sale') NOT NULL,
    amount_usd DECIMAL(10,2) NOT NULL,
    kkp_earned DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed') DEFAULT 'pending',
    confirmed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id)
);

-- Career Bonuses Table
CREATE TABLE career_bonuses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    career_level VARCHAR(50) NOT NULL,
    bonus_amount DECIMAL(10,2) NOT NULL,
    kkp_threshold DECIMAL(15,2) NOT NULL,
    paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Partnership Bonuses Table
CREATE TABLE partnership_bonuses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sponsor_id INT NOT NULL,
    partner_id INT NOT NULL,
    partner_career_level VARCHAR(50) NOT NULL,
    sale_id INT NOT NULL,
    bonus_percentage DECIMAL(5,2) NOT NULL,
    bonus_amount DECIMAL(10,2) NOT NULL,
    total_earned_from_partner DECIMAL(10,2) DEFAULT 0,
    max_earning_limit DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sponsor_id) REFERENCES users(id),
    FOREIGN KEY (partner_id) REFERENCES users(id),
    FOREIGN KEY (sale_id) REFERENCES sales(id)
);

-- Franchise Bonuses Table
CREATE TABLE franchise_bonuses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    month_year VARCHAR(7) NOT NULL, -- Format: 2025-01
    total_network_volume DECIMAL(15,2) NOT NULL,
    bonus_percentage DECIMAL(5,2) NOT NULL,
    bonus_amount DECIMAL(10,2) NOT NULL,
    paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- News/Announcements Table
CREATE TABLE news (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Customers Table
CREATE TABLE customers (
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

-- Customer References Table
CREATE TABLE customer_references (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    reference_name VARCHAR(100) NOT NULL,
    reference_surname VARCHAR(100) NOT NULL,
    reference_phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);