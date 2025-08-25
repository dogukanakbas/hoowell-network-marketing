-- Hakan Dalkılıç Partnerlerini Hoowell Admin'e Transfer Etme
USE hoowell_network;

-- TRANSFER ÖNCESİ YEDEK ALMA
-- mysqldump -u root -p hoowell_network users > backup_before_transfer_$(date +%Y%m%d_%H%M%S).sql

-- 1. TRANSFER ÖNCESİ DURUM KONTROLÜ
SELECT 'TRANSFER ÖNCESİ DURUM' as status;

-- Hakan Dalkılıç'ın partner sayısı
SELECT 
    'Hakan Dalkılıç Partner Sayısı' as info,
    COUNT(*) as partner_count
FROM users 
WHERE sponsor_id = 'P2025000014' OR created_by = 2;

-- Hoowell Admin'in partner sayısı
SELECT 
    'Hoowell Admin Partner Sayısı' as info,
    COUNT(*) as partner_count
FROM users 
WHERE sponsor_id = 'P2025000000' OR created_by = 1;

-- 2. PARTNER TRANSFER İŞLEMİ
-- sponsor_id'yi P2025000000 (Hoowell Admin) olarak güncelle
UPDATE users 
SET sponsor_id = 'P2025000000'
WHERE sponsor_id = 'P2025000014';

-- created_by'yi 1 (Hoowell Admin ID) olarak güncelle
UPDATE users 
SET created_by = 1
WHERE created_by = 2;

-- 3. TRANSFER SONRASI DURUM KONTROLÜ
SELECT 'TRANSFER SONRASI DURUM' as status;

-- Hakan Dalkılıç'ın yeni partner sayısı
SELECT 
    'Hakan Dalkılıç Yeni Partner Sayısı' as info,
    COUNT(*) as partner_count
FROM users 
WHERE sponsor_id = 'P2025000014' OR created_by = 2;

-- Hoowell Admin'in yeni partner sayısı
SELECT 
    'Hoowell Admin Yeni Partner Sayısı' as info,
    COUNT(*) as partner_count
FROM users 
WHERE sponsor_id = 'P2025000000' OR created_by = 1;

-- 4. TRANSFER EDİLEN PARTNERLERİ LİSTELE
SELECT 'TRANSFER EDİLEN PARTNERLER' as status;
SELECT 
    id,
    first_name,
    last_name,
    email,
    sponsor_id,
    created_by,
    total_kkp,
    created_at,
    CONCAT(first_name, ' ', last_name) as full_name
FROM users 
WHERE sponsor_id = 'P2025000000' AND created_by = 1
ORDER BY created_at DESC;

-- 5. HAKAN DALKILIÇ'IN GÜNCEL DURUMU
SELECT 'HAKAN DALKILIÇ GÜNCEL DURUMU' as status;
SELECT 
    id,
    first_name,
    last_name,
    email,
    sponsor_id,
    active_partners,
    total_kkp,
    created_at
FROM users 
WHERE id = 2;
