-- KKP Puanları Güncelleme Script'i
USE hoowell_network;

-- GÜNCELLEME ÖNCESİ YEDEK ALMA
-- mysqldump -u root -p hoowell_network users > backup_kkp_update_$(date +%Y%m%d_%H%M%S).sql

-- 1. GÜNCELLEME ÖNCESİ DURUM
SELECT 'GÜNCELLEME ÖNCESİ KKP DURUMU' as status;
SELECT 
    id,
    first_name,
    last_name,
    email,
    total_kkp,
    career_level,
    created_at
FROM users 
WHERE role = 'partner' AND total_kkp > 0
ORDER BY total_kkp DESC;

-- 2. KKP GÜNCELLEME ÖRNEKLERİ
-- Örnek 1: Belirli kullanıcının KKP'sini güncelle
-- UPDATE users 
-- SET total_kkp = 150
-- WHERE id = 18;  -- SEHER ECEVİT

-- Örnek 2: Belirli kullanıcının KKP'sini güncelle
-- UPDATE users 
-- SET total_kkp = 250
-- WHERE id = 24;  -- GÜLSEMİN DEMİR

-- Örnek 3: Toplu KKP güncelleme
-- UPDATE users 
-- SET total_kkp = CASE 
--     WHEN id = 18 THEN 150  -- SEHER ECEVİT
--     WHEN id = 24 THEN 250  -- GÜLSEMİN DEMİR
--     WHEN id = 14 THEN 100  -- TOLGA BOZACI
--     WHEN id = 13 THEN 120  -- BİLAL ŞENGÜL
--     ELSE total_kkp
-- END
-- WHERE id IN (18, 24, 14, 13);

-- Örnek 4: Tüm partnerlerin KKP'sini sıfırla
-- UPDATE users 
-- SET total_kkp = 0
-- WHERE role = 'partner';

-- Örnek 5: Belirli kariyer seviyesindeki kullanıcıların KKP'sini güncelle
-- UPDATE users 
-- SET total_kkp = 100
-- WHERE role = 'partner' AND career_level = 'bronze';

-- 3. GÜNCELLEME SONRASI KONTROL
SELECT 'GÜNCELLEME SONRASI KKP DURUMU' as status;
SELECT 
    id,
    first_name,
    last_name,
    email,
    total_kkp,
    career_level,
    created_at
FROM users 
WHERE role = 'partner' AND total_kkp > 0
ORDER BY total_kkp DESC;

-- 4. GÜNCELLEME İSTATİSTİKLERİ
SELECT 'GÜNCELLEME SONRASI İSTATİSTİKLER' as status;
SELECT 
    'Toplam Partner' as kategori,
    COUNT(*) as sayi
FROM users 
WHERE role = 'partner'
UNION ALL
SELECT 
    'KKP Puanı Olan' as kategori,
    COUNT(*) as sayi
FROM users 
WHERE role = 'partner' AND total_kkp > 0
UNION ALL
SELECT 
    'KKP Puanı Olmayan' as kategori,
    COUNT(*) as sayi
FROM users 
WHERE role = 'partner' AND (total_kkp = 0 OR total_kkp IS NULL);
