-- Muhasebe Takip Paneli için veritabanı tabloları

-- Kazanç türleri tablosu
CREATE TABLE IF NOT EXISTS earning_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kazanç kayıtları tablosu
CREATE TABLE IF NOT EXISTS earnings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    earning_type_id INT NOT NULL,
    related_person VARCHAR(255), -- Satışı yapan kişi adı
    sale_date DATE,
    earn_date DATE, -- Hak ediş tarihi
    payment_date DATE, -- Ödeme tarihi
    amount_usd DECIMAL(10,2) NOT NULL,
    exchange_rate DECIMAL(8,4) DEFAULT 40.0000,
    tax_rate DECIMAL(5,2) DEFAULT 20.00, -- Vergi oranı %20
    payment_status ENUM('BEKLEMEDE', 'ÖDENDİ', 'İPTAL') DEFAULT 'BEKLEMEDE',
    is_company BOOLEAN DEFAULT FALSE, -- Şirket mi bireysel mi
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (earning_type_id) REFERENCES earning_types(id)
);

-- Kazanç türlerini ekle
INSERT INTO earning_types (name, description) VALUES
('SATIŞ', 'Ürün satış komisyonu'),
('PROMOSYON', 'Promosyon bonusu'),
('ORTAKLIK PROMOSYONU', 'Ortaklık promosyon bonusu'),
('TAKIM KOMİSYONU', 'Takım komisyon bonusu'),
('LİDERLİK HAVUZLARI', 'Liderlik havuz bonusu'),
('KARİYER BONUSU', 'Kariyer seviye bonusu'),
('KAR PAYLAŞIMI', 'Yıllık kar paylaşım bonusu');

-- Örnek kazanç kayıtları ekle (test için)
INSERT INTO earnings (
    user_id, earning_type_id, related_person, sale_date, earn_date, payment_date,
    amount_usd, exchange_rate, payment_status, is_company
) VALUES
-- Bireysel kazançlar
(1, 1, 'CAN DALKILIÇ', '2025-07-29', '2025-08-13', '2025-08-13', 252.00, 40.00, 'BEKLEMEDE', FALSE),
(1, 1, 'CAN KARAÇ', '2025-07-15', '2025-07-30', '2025-07-30', 252.00, 40.00, 'ÖDENDİ', FALSE),
(1, 2, 'CAN KARAÇ', '2025-07-15', '2025-07-30', '2025-07-30', 60.00, 40.00, 'ÖDENDİ', FALSE),
(1, 3, 'MAHMUT GÜNGÖR', '2025-07-12', '2025-07-27', '2025-07-27', 90.00, 40.00, 'ÖDENDİ', FALSE),
(1, 4, NULL, '2025-07-01', '2025-08-05', '2025-08-09', 900.00, 40.00, 'ÖDENDİ', FALSE),
(1, 5, NULL, '2025-07-01', '2025-08-05', '2025-08-09', 1200.00, 40.00, 'ÖDENDİ', FALSE),
(1, 6, NULL, '2025-07-10', '2025-07-10', '2025-07-10', 400.00, 40.00, 'ÖDENDİ', FALSE),
(1, 7, NULL, '2025-01-01', '2025-01-15', '2025-02-15', 8200.00, 40.00, 'ÖDENDİ', FALSE),

-- Şirket kazançları (aynı kullanıcı için)
(1, 1, 'CAN DALKILIÇ', '2025-07-29', '2025-08-13', '2025-08-13', 252.00, 40.00, 'BEKLEMEDE', TRUE),
(1, 1, 'CAN KARAÇ', '2025-07-15', '2025-07-30', '2025-07-30', 252.00, 40.00, 'ÖDENDİ', TRUE),
(1, 2, 'CAN KARAÇ', '2025-07-15', '2025-07-30', '2025-07-30', 60.00, 40.00, 'ÖDENDİ', TRUE),
(1, 3, 'MAHMUT GÜNGÖR', '2025-07-12', '2025-07-27', '2025-07-27', 90.00, 40.00, 'ÖDENDİ', TRUE),
(1, 4, NULL, '2025-07-01', '2025-08-05', '2025-08-09', 900.00, 40.00, 'ÖDENDİ', TRUE),
(1, 5, NULL, '2025-07-01', '2025-08-05', '2025-08-09', 1200.00, 40.00, 'ÖDENDİ', TRUE),
(1, 6, NULL, '2025-07-10', '2025-07-10', '2025-07-10', 400.00, 40.00, 'ÖDENDİ', TRUE),
(1, 7, NULL, '2025-01-01', '2025-01-15', '2025-02-15', 8200.00, 40.00, 'ÖDENDİ', TRUE);