-- HOOWELL Database Backup Script
-- Sunucuda çalıştırılacak backup komutu

-- 1. Tam veritabanı backup'ı
-- mysqldump -u root -p hoowell_network > hoowell_backup_$(date +%Y%m%d_%H%M%S).sql

-- 2. Sadece kullanıcı verilerini backup
-- mysqldump -u root -p hoowell_network users payments user_video_progress > users_backup_$(date +%Y%m%d_%H%M%S).sql

-- 3. Yeni tablolar için kontrol
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'hoowell_network' 
AND TABLE_NAME IN ('customers', 'customer_references');

-- 4. Mevcut users tablosu yapısını kontrol
DESCRIBE users;