-- HOOWELL Eksik Kolonları Ekleme Scripti
-- Bu script eksik kolonları güvenli şekilde ekler

USE hoowell_network;

-- ==================== USERS TABLOSUNA EKSİK KOLONLAR ====================

-- shipping_address kolonu ekle
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'hoowell_network' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'shipping_address') = 0,
    'ALTER TABLE users ADD COLUMN shipping_address TEXT AFTER billing_address',
    'SELECT "shipping_address kolonu zaten mevcut" as durum'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ==================== SALES TABLOSUNA EKSİK KOLONLAR ====================

-- product_id kolonu ekle
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'hoowell_network' AND TABLE_NAME = 'sales' AND COLUMN_NAME = 'product_id') = 0,
    'ALTER TABLE sales ADD COLUMN product_id INT AFTER buyer_id',
    'SELECT "product_id kolonu zaten mevcut" as durum'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- quantity kolonu ekle
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'hoowell_network' AND TABLE_NAME = 'sales' AND COLUMN_NAME = 'quantity') = 0,
    'ALTER TABLE sales ADD COLUMN quantity INT DEFAULT 1 AFTER product_id',
    'SELECT "quantity kolonu zaten mevcut" as durum'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- unit_price kolonu ekle
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'hoowell_network' AND TABLE_NAME = 'sales' AND COLUMN_NAME = 'unit_price') = 0,
    'ALTER TABLE sales ADD COLUMN unit_price DECIMAL(10,2) DEFAULT 0 AFTER quantity',
    'SELECT "unit_price kolonu zaten mevcut" as durum'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- sale_date kolonu ekle
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'hoowell_network' AND TABLE_NAME = 'sales' AND COLUMN_NAME = 'sale_date') = 0,
    'ALTER TABLE sales ADD COLUMN sale_date DATE AFTER unit_price',
    'SELECT "sale_date kolonu zaten mevcut" as durum'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ==================== PAYMENTS TABLOSUNA EKSİK KOLONLAR ====================

-- payment_method kolonu ekle
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'hoowell_network' AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'payment_method') = 0,
    'ALTER TABLE payments ADD COLUMN payment_method ENUM(\'credit_card\', \'bank_transfer\', \'cash\', \'manual\') DEFAULT \'manual\' AFTER payment_type',
    'SELECT "payment_method kolonu zaten mevcut" as durum'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- notes kolonu ekle
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'hoowell_network' AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'notes') = 0,
    'ALTER TABLE payments ADD COLUMN notes TEXT AFTER payment_method',
    'SELECT "notes kolonu zaten mevcut" as durum'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- updated_at kolonu ekle
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'hoowell_network' AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'updated_at') = 0,
    'ALTER TABLE payments ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at',
    'SELECT "updated_at kolonu zaten mevcut" as durum'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ==================== KONTROL SORGULARI ====================

-- Eksik kolonları kontrol et
SELECT 'EKSİK KOLONLAR KONTROL EDİLDİ!' as durum;

-- Users tablosu kolonları
SELECT 'USERS TABLOSU KOLONLARI:' as info;
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hoowell_network' AND TABLE_NAME = 'users' 
ORDER BY ORDINAL_POSITION;

-- Sales tablosu kolonları
SELECT 'SALES TABLOSU KOLONLARI:' as info;
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hoowell_network' AND TABLE_NAME = 'sales' 
ORDER BY ORDINAL_POSITION;

-- Payments tablosu kolonları
SELECT 'PAYMENTS TABLOSU KOLONLARI:' as info;
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hoowell_network' AND TABLE_NAME = 'payments' 
ORDER BY ORDINAL_POSITION;

-- Script tamamlandı mesajı
SELECT 'EKSİK KOLONLAR BAŞARIYLA EKLENDİ!' as tamamlandi;
