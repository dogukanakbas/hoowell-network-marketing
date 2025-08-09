-- İş ortağı kayıt paneli için ek sözleşme alanları ekleme
-- Users tablosuna PayTR için gerekli ek sözleşme kolonlarını ekle

USE hoowell_network;

-- Sözleşme alanlarını ekle (hata verirse zaten mevcut demektir)
ALTER TABLE users ADD COLUMN contract3_accepted BOOLEAN DEFAULT FALSE COMMENT 'Mesafeli Satış Sözleşmesi';
ALTER TABLE users ADD COLUMN contract4_accepted BOOLEAN DEFAULT FALSE COMMENT 'Ön Bilgilendirme Formu';
ALTER TABLE users ADD COLUMN contract5_accepted BOOLEAN DEFAULT FALSE COMMENT 'Elektronik Ticaret Bilgilendirmesi';

-- Mevcut iş ortakları için varsayılan değerleri TRUE yap (geriye dönük uyumluluk)
UPDATE users 
SET 
    contract3_accepted = TRUE,
    contract4_accepted = TRUE,
    contract5_accepted = TRUE
WHERE role = 'partner' 
  AND (contract3_accepted IS NULL 
       OR contract4_accepted IS NULL 
       OR contract5_accepted IS NULL);

-- İndeks ekle (performans için)
ALTER TABLE users ADD INDEX idx_partner_contracts (contract1_accepted, contract2_accepted, contract3_accepted, contract4_accepted, contract5_accepted);

-- Kontrol sorgusu
SELECT 
    'Partner Contracts Migration' as migration_type,
    COUNT(*) as total_partners,
    SUM(CASE WHEN contract1_accepted = 1 THEN 1 ELSE 0 END) as contract1_accepted_count,
    SUM(CASE WHEN contract2_accepted = 1 THEN 1 ELSE 0 END) as contract2_accepted_count,
    SUM(CASE WHEN contract3_accepted = 1 THEN 1 ELSE 0 END) as contract3_accepted_count,
    SUM(CASE WHEN contract4_accepted = 1 THEN 1 ELSE 0 END) as contract4_accepted_count,
    SUM(CASE WHEN contract5_accepted = 1 THEN 1 ELSE 0 END) as contract5_accepted_count
FROM users 
WHERE role = 'partner';