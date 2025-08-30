-- HOOWELL Nickname Sistemi
-- Users tablosuna nickname kolonu ekleme

USE hoowell_network;

-- Nickname kolonu ekle
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'hoowell_network' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'nickname') = 0,
    'ALTER TABLE users ADD COLUMN nickname VARCHAR(50) UNIQUE AFTER username',
    'SELECT "nickname kolonu zaten mevcut" as durum'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Mevcut kullanıcılara otomatik nickname ata
UPDATE users 
SET nickname = CONCAT('user_', id) 
WHERE nickname IS NULL OR nickname = '';

-- Kontrol
SELECT 'NICKNAME SİSTEMİ KURULDU!' as durum;
SELECT COUNT(*) as toplam_kullanici FROM users;
SELECT COUNT(*) as nickname_olan FROM users WHERE nickname IS NOT NULL;
