-- KKP Değerlerini Güncelleme Script'i
USE hoowell_network;

-- Önce mevcut durumu göster
SELECT 'BEFORE UPDATE - KKP Values' as status;
SELECT 
    id,
    first_name,
    last_name,
    total_kkp,
    career_level,
    created_at
FROM users 
WHERE id IN (18, 24)
ORDER BY id;

-- KKP değerlerini güncelle
UPDATE users 
SET total_kkp = CASE 
    WHEN id = 18 THEN 200  -- SEHER ECEVİT: 240 → 200
    WHEN id = 24 THEN 300  -- GÜLSEMİN DEMİR: 360 → 300
    ELSE total_kkp
END
WHERE id IN (18, 24);

-- Güncelleme sonrası durumu göster
SELECT 'AFTER UPDATE - KKP Values' as status;
SELECT 
    id,
    first_name,
    last_name,
    total_kkp,
    career_level,
    created_at
FROM users 
WHERE id IN (18, 24)
ORDER BY id;

-- Tüm partnerlerin KKP durumunu kontrol et
SELECT 'ALL PARTNERS KKP STATUS' as status;
SELECT 
    id,
    first_name,
    last_name,
    total_kkp,
    career_level,
    CASE 
        WHEN total_kkp > 0 THEN 'Aktif'
        ELSE 'Pasif'
    END as status
FROM users 
WHERE role = 'partner' AND total_kkp > 0
ORDER BY total_kkp DESC;
