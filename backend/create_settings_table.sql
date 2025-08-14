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

-- Kontrol et
SELECT * FROM settings;