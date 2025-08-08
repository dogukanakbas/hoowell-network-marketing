-- PayTR Başvurusu İçin Ek Sözleşme Kolonları
-- Tarih: 08.01.2025

-- Güvenlik için transaction başlat
START TRANSACTION;

-- Customers tablosuna PayTR için gerekli ek sözleşme kolonlarını ekle
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS contract3_accepted BOOLEAN DEFAULT FALSE COMMENT 'Mesafeli Satış Sözleşmesi',
ADD COLUMN IF NOT EXISTS contract4_accepted BOOLEAN DEFAULT FALSE COMMENT 'Ön Bilgilendirme Formu',
ADD COLUMN IF NOT EXISTS contract5_accepted BOOLEAN DEFAULT FALSE COMMENT 'Elektronik Ticaret Bilgilendirmesi';

-- Mevcut müşteriler için varsayılan değerleri TRUE yap (geriye dönük uyumluluk)
UPDATE customers 
SET 
    contract3_accepted = TRUE,
    contract4_accepted = TRUE,
    contract5_accepted = TRUE
WHERE contract3_accepted IS NULL 
   OR contract4_accepted IS NULL 
   OR contract5_accepted IS NULL;

-- İndeks ekle (performans için)
ALTER TABLE customers 
ADD INDEX IF NOT EXISTS idx_contracts (contract1_accepted, contract2_accepted, contract3_accepted, contract4_accepted, contract5_accepted);

-- Kontrol sorgusu
SELECT 
    'PayTR Contracts Migration' as migration_type,
    COUNT(*) as total_customers,
    SUM(CASE WHEN contract1_accepted = 1 THEN 1 ELSE 0 END) as contract1_accepted_count,
    SUM(CASE WHEN contract2_accepted = 1 THEN 1 ELSE 0 END) as contract2_accepted_count,
    SUM(CASE WHEN contract3_accepted = 1 THEN 1 ELSE 0 END) as contract3_accepted_count,
    SUM(CASE WHEN contract4_accepted = 1 THEN 1 ELSE 0 END) as contract4_accepted_count,
    SUM(CASE WHEN contract5_accepted = 1 THEN 1 ELSE 0 END) as contract5_accepted_count
FROM customers;

-- Transaction'ı commit et
COMMIT;

-- Başarı mesajı
SELECT 'PayTR contracts migration completed successfully!' as status;