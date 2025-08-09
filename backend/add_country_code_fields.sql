-- Telefon numarası için ülke kodu alanları ekleme
USE hoowell_network;

-- Users tablosuna ülke kodu alanları ekle
ALTER TABLE users ADD COLUMN country_code VARCHAR(10) DEFAULT '+90' COMMENT 'Telefon ülke kodu';

-- Customers tablosuna ülke kodu alanları ekle
ALTER TABLE customers ADD COLUMN country_code VARCHAR(10) DEFAULT '+90' COMMENT 'Telefon ülke kodu';
ALTER TABLE customers ADD COLUMN authorized_country_code VARCHAR(10) DEFAULT '+90' COMMENT 'Yetkili telefon ülke kodu';

-- Mevcut kayıtlar için varsayılan değerleri ayarla
UPDATE users SET country_code = '+90' WHERE country_code IS NULL;
UPDATE customers SET country_code = '+90' WHERE country_code IS NULL;
UPDATE customers SET authorized_country_code = '+90' WHERE authorized_country_code IS NULL;

-- Kontrol sorgusu
SELECT 
    'Country Code Migration' as migration_type,
    (SELECT COUNT(*) FROM users WHERE country_code = '+90') as users_with_turkey_code,
    (SELECT COUNT(*) FROM customers WHERE country_code = '+90') as customers_with_turkey_code,
    (SELECT COUNT(*) FROM customers WHERE authorized_country_code = '+90') as authorized_with_turkey_code;