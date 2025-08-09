-- İş ortağı kayıt sistemi için eksik kolonları ekle
USE hoowell_network;

-- Users tablosuna eksik kolonları ekle (hata verirse zaten mevcut demektir)
ALTER TABLE users ADD COLUMN country_code VARCHAR(10) DEFAULT '+90' COMMENT 'Telefon ülke kodu';
ALTER TABLE users ADD COLUMN partner_type VARCHAR(50) DEFAULT 'individual' COMMENT 'İş ortağı türü: individual/corporate';
ALTER TABLE users ADD COLUMN registration_type VARCHAR(50) DEFAULT 'individual' COMMENT 'Kayıt türü: individual/corporate';
ALTER TABLE users ADD COLUMN tc_no VARCHAR(11) COMMENT 'TC Kimlik Numarası';
ALTER TABLE users ADD COLUMN company_name VARCHAR(255) COMMENT 'Şirket adı (kurumsal kayıt için)';
ALTER TABLE users ADD COLUMN tax_office VARCHAR(255) COMMENT 'Vergi dairesi';
ALTER TABLE users ADD COLUMN tax_no VARCHAR(50) COMMENT 'Vergi numarası';
ALTER TABLE users ADD COLUMN authorized_first_name VARCHAR(100) COMMENT 'Yetkili kişi adı';
ALTER TABLE users ADD COLUMN authorized_last_name VARCHAR(100) COMMENT 'Yetkili kişi soyadı';
ALTER TABLE users ADD COLUMN city VARCHAR(100) COMMENT 'İl';
ALTER TABLE users ADD COLUMN district VARCHAR(100) COMMENT 'İlçe';
ALTER TABLE users ADD COLUMN full_address TEXT COMMENT 'Tam adres';
ALTER TABLE users ADD COLUMN delivery_address TEXT COMMENT 'Teslimat adresi';
ALTER TABLE users ADD COLUMN billing_address TEXT COMMENT 'Fatura adresi';
ALTER TABLE users ADD COLUMN contract1_accepted BOOLEAN DEFAULT FALSE COMMENT 'İş Ortaklığı Sözleşmesi';
ALTER TABLE users ADD COLUMN contract2_accepted BOOLEAN DEFAULT FALSE COMMENT 'Gizlilik Sözleşmesi';
ALTER TABLE users ADD COLUMN contract3_accepted BOOLEAN DEFAULT FALSE COMMENT 'Mesafeli Satış Sözleşmesi';
ALTER TABLE users ADD COLUMN contract4_accepted BOOLEAN DEFAULT FALSE COMMENT 'Ön Bilgilendirme Formu';
ALTER TABLE users ADD COLUMN contract5_accepted BOOLEAN DEFAULT FALSE COMMENT 'Elektronik Ticaret Bilgilendirmesi';
ALTER TABLE users ADD COLUMN total_amount DECIMAL(10,2) DEFAULT 0 COMMENT 'Toplam ödeme tutarı';
ALTER TABLE users ADD COLUMN registration_step INT DEFAULT 1 COMMENT 'Kayıt adımı';
ALTER TABLE users ADD COLUMN registration_completed BOOLEAN DEFAULT FALSE COMMENT 'Kayıt tamamlandı mı';
ALTER TABLE users ADD COLUMN education_deadline TIMESTAMP NULL COMMENT 'Eğitim tamamlama son tarihi';
ALTER TABLE users ADD COLUMN education_started_at TIMESTAMP NULL COMMENT 'Eğitime başlama tarihi';
ALTER TABLE users ADD COLUMN payment_blocked BOOLEAN DEFAULT FALSE COMMENT 'Ödeme engellenmiş mi';
ALTER TABLE users ADD COLUMN payment_pending BOOLEAN DEFAULT FALSE COMMENT 'Ödeme beklemede mi';

-- İndeksler ekle (performans için)
CREATE INDEX idx_users_country_code ON users(country_code);
CREATE INDEX idx_users_registration_type ON users(registration_type);
CREATE INDEX idx_users_city ON users(city);
CREATE INDEX idx_users_registration_completed ON users(registration_completed);
CREATE INDEX idx_users_education_deadline ON users(education_deadline);

-- Mevcut kullanıcılar için varsayılan değerleri güncelle
UPDATE users 
SET 
    country_code = '+90',
    partner_type = 'individual',
    registration_type = 'individual',
    registration_step = 6,
    registration_completed = TRUE,
    contract1_accepted = TRUE,
    contract2_accepted = TRUE,
    contract3_accepted = TRUE,
    contract4_accepted = TRUE,
    contract5_accepted = TRUE
WHERE role = 'partner' AND registration_completed IS NULL;

-- Admin kullanıcıları için özel güncelleme
UPDATE users 
SET 
    country_code = '+90',
    registration_completed = TRUE,
    registration_step = 6
WHERE role = 'admin';

-- Kontrol sorgusu
SELECT 
    COUNT(*) as total_users,
    SUM(CASE WHEN registration_completed = 1 THEN 1 ELSE 0 END) as completed_registrations,
    SUM(CASE WHEN country_code IS NOT NULL THEN 1 ELSE 0 END) as users_with_country_code
FROM users;

-- Tablo yapısını kontrol et
DESCRIBE users;