-- Hakan Dalkılıç'ın Partnerlerini Listeleme ve Transfer Hazırlığı
USE hoowell_network;

-- 1. Hakan Dalkılıç'ın bilgilerini kontrol et
SELECT 'HAKAN DALKILIÇ BİLGİLERİ' as status;
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
WHERE id = 2 OR email = 'hakandalkilic14@gmail.com';

-- 2. Hakan Dalkılıç'ın partnerlerini listele
SELECT 'HAKAN DALKILIÇ PARTNERLERİ' as status;
SELECT 
    id,
    first_name,
    last_name,
    email,
    sponsor_id,
    created_by,
    total_kkp,
    active_partners,
    created_at,
    CONCAT(first_name, ' ', last_name) as full_name
FROM users 
WHERE sponsor_id = 'P2025000014' OR created_by = 2
ORDER BY created_at DESC;

-- 3. Hoowell Admin bilgilerini kontrol et
SELECT 'HOOWELL ADMIN BİLGİLERİ' as status;
SELECT 
    id,
    first_name,
    last_name,
    email,
    sponsor_id,
    active_partners,
    total_kkp
FROM users 
WHERE id = 1 OR email = 'admin@hoowell.net';

-- 4. Transfer edilecek partner sayısını say
SELECT 'TRANSFER EDİLECEK PARTNER SAYISI' as status;
SELECT 
    COUNT(*) as transfer_edilecek_partner_sayisi
FROM users 
WHERE sponsor_id = 'P2025000014' OR created_by = 2;
