-- İş ortağı kayıt sistemi için eksik kolonları güvenli şekilde ekle
USE hoowell_network;

-- Stored procedure ile güvenli kolon ekleme
DELIMITER $$

CREATE PROCEDURE AddColumnIfNotExists(
    IN table_name VARCHAR(100),
    IN column_name VARCHAR(100),
    IN column_definition TEXT
)
BEGIN
    DECLARE column_exists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO column_exists
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
    AND table_name = table_name
    AND column_name = column_name;
    
    IF column_exists = 0 THEN
        SET @sql = CONCAT('ALTER TABLE ', table_name, ' ADD COLUMN ', column_name, ' ', column_definition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$

DELIMITER ;

-- Eksik kolonları ekle
CALL AddColumnIfNotExists('users', 'country_code', 'VARCHAR(10) DEFAULT \'+90\' COMMENT \'Telefon ülke kodu\'');
CALL AddColumnIfNotExists('users', 'partner_type', 'VARCHAR(50) DEFAULT \'individual\' COMMENT \'İş ortağı türü: individual/corporate\'');
CALL AddColumnIfNotExists('users', 'registration_type', 'VARCHAR(50) DEFAULT \'individual\' COMMENT \'Kayıt türü: individual/corporate\'');
CALL AddColumnIfNotExists('users', 'tc_no', 'VARCHAR(11) COMMENT \'TC Kimlik Numarası\'');
CALL AddColumnIfNotExists('users', 'company_name', 'VARCHAR(255) COMMENT \'Şirket adı (kurumsal kayıt için)\'');
CALL AddColumnIfNotExists('users', 'tax_office', 'VARCHAR(255) COMMENT \'Vergi dairesi\'');
CALL AddColumnIfNotExists('users', 'tax_no', 'VARCHAR(50) COMMENT \'Vergi numarası\'');
CALL AddColumnIfNotExists('users', 'authorized_first_name', 'VARCHAR(100) COMMENT \'Yetkili kişi adı\'');
CALL AddColumnIfNotExists('users', 'authorized_last_name', 'VARCHAR(100) COMMENT \'Yetkili kişi soyadı\'');
CALL AddColumnIfNotExists('users', 'city', 'VARCHAR(100) COMMENT \'İl\'');
CALL AddColumnIfNotExists('users', 'district', 'VARCHAR(100) COMMENT \'İlçe\'');
CALL AddColumnIfNotExists('users', 'full_address', 'TEXT COMMENT \'Tam adres\'');
CALL AddColumnIfNotExists('users', 'delivery_address', 'TEXT COMMENT \'Teslimat adresi\'');
CALL AddColumnIfNotExists('users', 'billing_address', 'TEXT COMMENT \'Fatura adresi\'');
CALL AddColumnIfNotExists('users', 'contract1_accepted', 'BOOLEAN DEFAULT FALSE COMMENT \'İş Ortaklığı Sözleşmesi\'');
CALL AddColumnIfNotExists('users', 'contract2_accepted', 'BOOLEAN DEFAULT FALSE COMMENT \'Gizlilik Sözleşmesi\'');
CALL AddColumnIfNotExists('users', 'contract3_accepted', 'BOOLEAN DEFAULT FALSE COMMENT \'Mesafeli Satış Sözleşmesi\'');
CALL AddColumnIfNotExists('users', 'contract4_accepted', 'BOOLEAN DEFAULT FALSE COMMENT \'Ön Bilgilendirme Formu\'');
CALL AddColumnIfNotExists('users', 'contract5_accepted', 'BOOLEAN DEFAULT FALSE COMMENT \'Elektronik Ticaret Bilgilendirmesi\'');
CALL AddColumnIfNotExists('users', 'total_amount', 'DECIMAL(10,2) DEFAULT 0 COMMENT \'Toplam ödeme tutarı\'');
CALL AddColumnIfNotExists('users', 'registration_step', 'INT DEFAULT 1 COMMENT \'Kayıt adımı\'');
CALL AddColumnIfNotExists('users', 'registration_completed', 'BOOLEAN DEFAULT FALSE COMMENT \'Kayıt tamamlandı mı\'');
CALL AddColumnIfNotExists('users', 'education_deadline', 'TIMESTAMP NULL COMMENT \'Eğitim tamamlama son tarihi\'');
CALL AddColumnIfNotExists('users', 'education_started_at', 'TIMESTAMP NULL COMMENT \'Eğitime başlama tarihi\'');
CALL AddColumnIfNotExists('users', 'payment_blocked', 'BOOLEAN DEFAULT FALSE COMMENT \'Ödeme engellenmiş mi\'');
CALL AddColumnIfNotExists('users', 'payment_pending', 'BOOLEAN DEFAULT FALSE COMMENT \'Ödeme beklemede mi\'');

-- Stored procedure'u temizle
DROP PROCEDURE AddColumnIfNotExists;

-- Mevcut kullanıcılar için varsayılan değerleri güncelle
UPDATE users 
SET 
    country_code = COALESCE(country_code, '+90'),
    partner_type = COALESCE(partner_type, 'individual'),
    registration_type = COALESCE(registration_type, 'individual'),
    registration_step = COALESCE(registration_step, 6),
    registration_completed = COALESCE(registration_completed, TRUE),
    contract1_accepted = COALESCE(contract1_accepted, TRUE),
    contract2_accepted = COALESCE(contract2_accepted, TRUE),
    contract3_accepted = COALESCE(contract3_accepted, TRUE),
    contract4_accepted = COALESCE(contract4_accepted, TRUE),
    contract5_accepted = COALESCE(contract5_accepted, TRUE)
WHERE role = 'partner';

-- Admin kullanıcıları için özel güncelleme
UPDATE users 
SET 
    country_code = COALESCE(country_code, '+90'),
    registration_completed = COALESCE(registration_completed, TRUE),
    registration_step = COALESCE(registration_step, 6)
WHERE role = 'admin';

-- Kontrol sorgusu
SELECT 
    COUNT(*) as total_users,
    SUM(CASE WHEN registration_completed = 1 THEN 1 ELSE 0 END) as completed_registrations,
    SUM(CASE WHEN country_code IS NOT NULL THEN 1 ELSE 0 END) as users_with_country_code
FROM users;

-- Tablo yapısını kontrol et
DESCRIBE users;