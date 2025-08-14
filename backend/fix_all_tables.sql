-- Tüm tablo düzeltmeleri tek dosyada
-- Customers tablosuna eksik sözleşme kolonlarını ekle
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS contract3_accepted BOOLEAN DEFAULT FALSE COMMENT 'Mesafeli Satış Sözleşmesi',
ADD COLUMN IF NOT EXISTS contract4_accepted BOOLEAN DEFAULT FALSE COMMENT 'Ön Bilgilendirme Formu',
ADD COLUMN IF NOT EXISTS contract5_accepted BOOLEAN DEFAULT FALSE COMMENT 'Elektronik Ticaret Bilgilendirmesi';

-- Payments tablosuna PayTR için gerekli kolonları ekle
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS merchant_oid VARCHAR(100) UNIQUE COMMENT 'PayTR merchant order ID',
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'manual' COMMENT 'Ödeme yöntemi: manual, paytr, etc';

-- Settings tablosunu oluştur
CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usd_to_try_rate DECIMAL(10,2) DEFAULT 40.00,
    vat_rate DECIMAL(5,2) DEFAULT 20.00,
    education_price_usd DECIMAL(10,2) DEFAULT 100.00,
    device_price_usd DECIMAL(10,2) DEFAULT 1800.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Varsayılan ayarları ekle
INSERT IGNORE INTO settings (id, usd_to_try_rate, vat_rate, education_price_usd, device_price_usd) 
VALUES (1, 40.00, 20.00, 100.00, 1800.00);

-- Kontrol sorguları
SELECT 'Customers table columns:' as info;
DESCRIBE customers;

SELECT 'Payments table columns:' as info;
DESCRIBE payments;

SELECT 'Settings table data:' as info;
SELECT * FROM settings;