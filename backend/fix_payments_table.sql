-- Payments tablosuna PayTR için gerekli kolonları ekle
ALTER TABLE payments 
ADD COLUMN merchant_oid VARCHAR(100) UNIQUE COMMENT 'PayTR merchant order ID',
ADD COLUMN payment_method VARCHAR(50) DEFAULT 'manual' COMMENT 'Ödeme yöntemi: manual, paytr, etc';

-- Kontrol et
DESCRIBE payments;