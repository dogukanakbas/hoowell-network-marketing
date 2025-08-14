-- PayTR entegrasyonu için payments tablosuna yeni alanlar ekleme

ALTER TABLE payments 
ADD COLUMN merchant_oid VARCHAR(100) NULL AFTER id,
ADD COLUMN paytr_status VARCHAR(50) NULL AFTER status,
ADD COLUMN payment_method ENUM('iban', 'paytr') DEFAULT 'iban' AFTER payment_type;

-- Index ekle
ALTER TABLE payments 
ADD INDEX idx_merchant_oid (merchant_oid);

-- Mevcut kayıtları güncelle
UPDATE payments SET payment_method = 'iban' WHERE payment_method IS NULL;