-- Kariyer Seviyeleri Kontrol ve Güncelleme Script'i
USE hoowell_network;

-- 1. TÜM KULLANICILARIN KARİYER SEVİYELERİ
SELECT 'TÜM KULLANICILARIN KARİYER SEVİYELERİ' as status;
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

-- 2. BRONZE OLMAYAN KULLANICILAR
SELECT 'BRONZE OLMAYAN KULLANICILAR' as status;
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

-- 3. BRONZE OLAN KULLANICILAR
SELECT 'BRONZE OLAN KULLANICILAR' as status;
SELECT 
    id,
    first_name,
    last_name,
    email,
    career_level,
    total_kkp,
    created_at
FROM users 
WHERE role = 'partner' AND career_level = 'bronze'
ORDER BY id;

-- 4. KARİYER SEVİYESİ İSTATİSTİKLERİ
SELECT 'KARİYER SEVİYESİ İSTATİSTİKLERİ' as status;
SELECT 
    career_level,
    COUNT(*) as kullanici_sayisi
FROM users 
WHERE role = 'partner'
GROUP BY career_level
ORDER BY kullanici_sayisi DESC;

-- 5. BELİRLİ KULLANICILARIN KARİYER SEVİYELERİ
SELECT 'BELİRLİ KULLANICILARIN KARİYER SEVİYELERİ' as status;
SELECT 
    id,
    first_name,
    last_name,
    email,
    career_level,
    total_kkp,
    created_at
FROM users 
WHERE first_name IN ('TOLGA', 'BİLAL', 'HÜSEYİN', 'YUSUF', 'SEHER', 'GÜLSEMİN', 'İBRAHİM', 'ATİLLA', 'ALİ', 'SABRİ', 'MELEK', 'MEHMET', 'HAKAN', 'ERDOĞAN', 'LEVENT')
ORDER BY id;
