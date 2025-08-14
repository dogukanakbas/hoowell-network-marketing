-- PayTR Callback için Payments tablosunu düzeltme
-- HOOWELL Payment System
-- Tarih: 08.01.2025

USE hoowell_network;

-- paytr_status kolonunu ekle (eğer yoksa)
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS paytr_status VARCHAR(50) DEFAULT NULL 
COMMENT 'PayTR callback status';

-- payment_type kolonunu ekle (eğer yoksa)
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS payment_type VARCHAR(50) DEFAULT NULL 
COMMENT 'Payment type: education, device, franchise';

-- partner_id kolonunu ekle (eğer yoksa)
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS partner_id INT DEFAULT NULL 
COMMENT 'Business partner ID for franchise payments';

-- amount kolonunu ekle (eğer yoksa)
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS amount DECIMAL(10,2) DEFAULT NULL 
COMMENT 'Payment amount';

-- total_amount kolonunu ekle (eğer yoksa)
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) DEFAULT NULL 
COMMENT 'Total payment amount';

-- currency kolonunu ekle (eğer yoksa)
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'TL' 
COMMENT 'Payment currency';

-- test_mode kolonunu ekle (eğer yoksa)
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS test_mode TINYINT(1) DEFAULT 0 
COMMENT 'Test mode flag';

-- updated_at kolonunu ekle (eğer yoksa)
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
COMMENT 'Last update timestamp';

-- created_at kolonunu ekle (eğer yoksa)
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
COMMENT 'Creation timestamp';

-- Kolonları kontrol et
DESCRIBE payments;
