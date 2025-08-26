-- KKP Puanları Kontrol ve Güncelleme Script'i
USE hoowell_network;

-- 1. TÜM KULLANICILARIN KKP DURUMU
SELECT 'TÜM KULLANICILARIN KKP DURUMU' as status;
SELECT 
    id,
    first_name,
    last_name,
    email,
    total_kkp,
    career_level,
    created_at
FROM users 
WHERE role = 'partner'
ORDER BY total_kkp DESC;

-- 2. KKP'Sİ OLAN KULLANICILAR
SELECT 'KKP Puanı Olan Kullanıcılar' as status;
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

-- 3. KKP'Sİ OLMAYAN KULLANICILAR
SELECT 'KKP Puanı Olmayan Kullanıcılar' as status;
SELECT 
    id,
    first_name,
    last_name,
    email,
    total_kkp,
    career_level,
    created_at
FROM users 
WHERE role = 'partner' AND (total_kkp = 0 OR total_kkp IS NULL)
ORDER BY created_at DESC;

-- 4. KKP İSTATİSTİKLERİ
SELECT 'KKP İSTATİSTİKLERİ' as status;
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

-- 5. BELİRLİ KULLANICILARIN KKP DURUMU
SELECT 'BELİRLİ KULLANICILARIN KKP DURUMU' as status;
SELECT 
    id,
    first_name,
    last_name,
    email,
    total_kkp,
    career_level,
    created_at
FROM users 
WHERE first_name IN ('TOLGA', 'BİLAL', 'HÜSEYİN', 'YUSUF', 'SEHER', 'GÜLSEMİN', 'İBRAHİM', 'ATİLLA', 'ALİ', 'SABRİ', 'MELEK', 'MEHMET', 'HAKAN', 'ERDOĞAN', 'LEVENT', 'TOLGA', 'BİLAL', 'HÜSEYİN', 'YUSUF', 'SEHER', 'GÜLSEMİN', 'İBRAHİM', 'ATİLLA', 'ALİ', 'SABRİ', 'MELEK', 'MEHMET', 'HAKAN', 'ERDOĞAN', 'LEVENT')
ORDER BY first_name;
