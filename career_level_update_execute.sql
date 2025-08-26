-- Kariyer Seviyeleri Güncelleme Script'i
USE hoowell_network;

-- GÜNCELLEME ÖNCESİ YEDEK ALMA
-- mysqldump -u root -p hoowell_network users > backup_career_update_$(date +%Y%m%d_%H%M%S).sql

-- 1. GÜNCELLEME ÖNCESİ DURUM
SELECT 'GÜNCELLEME ÖNCESİ KARİYER SEVİYELERİ' as status;
SELECT 
    id,
    first_name,
    last_name,
    email,
    career_level,
    total_kkp,
    created_at
FROM users 
WHERE role = 'partner'
ORDER BY id;

-- 2. KARİYER SEVİYESİ GÜNCELLEME ÖRNEKLERİ

-- Örnek 1: Tüm partnerlerin kariyer seviyesini bronze yap
UPDATE users 
SET career_level = 'bronze'
WHERE role = 'partner';

-- Örnek 2: Belirli kullanıcıların kariyer seviyesini bronze yap
-- UPDATE users 
-- SET career_level = 'bronze'
-- WHERE id IN (18, 24, 14, 13, 12, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40);

-- Örnek 3: Belirli kullanıcıların kariyer seviyesini bronze yap (ID sırasıyla)
-- UPDATE users 
-- SET career_level = 'bronze'
-- WHERE id BETWEEN 12 AND 40;  -- 12'den 40'a kadar tüm kullanıcılar

-- Örnek 4: Belirli kullanıcıların kariyer seviyesini bronze yap (ad soyad ile)
-- UPDATE users 
-- SET career_level = 'bronze'
-- WHERE first_name IN ('TOLGA', 'BİLAL', 'HÜSEYİN', 'YUSUF', 'SEHER', 'GÜLSEMİN', 'İBRAHİM', 'ATİLLA', 'ALİ', 'SABRİ', 'MELEK', 'MEHMET', 'HAKAN', 'ERDOĞAN', 'LEVENT');

-- Örnek 5: Bronze olmayan kullanıcıların kariyer seviyesini bronze yap
-- UPDATE users 
-- SET career_level = 'bronze'
-- WHERE role = 'partner' AND career_level != 'bronze';

-- 3. GÜNCELLEME SONRASI KONTROL
SELECT 'GÜNCELLEME SONRASI KARİYER SEVİYELERİ' as status;
SELECT 
    id,
    first_name,
    last_name,
    email,
    career_level,
    total_kkp,
    created_at
FROM users 
WHERE role = 'partner'
ORDER BY id;

-- 4. GÜNCELLEME SONRASI İSTATİSTİKLER
SELECT 'GÜNCELLEME SONRASI İSTATİSTİKLER' as status;
SELECT 
    career_level,
    COUNT(*) as kullanici_sayisi
FROM users 
WHERE role = 'partner'
GROUP BY career_level
ORDER BY kullanici_sayisi DESC;

-- 5. BRONZE OLMAYAN KULLANICILAR KALDI MI?
SELECT 'BRONZE OLMAYAN KULLANICILAR KALDI MI?' as status;
SELECT 
    id,
    first_name,
    last_name,
    email,
    career_level,
    total_kkp,
    created_at
FROM users 
WHERE role = 'partner' AND career_level != 'bronze'
ORDER BY id;
