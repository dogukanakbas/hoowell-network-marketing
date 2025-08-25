-- Eğitim Durumu Kontrol Script'i
USE hoowell_network;

-- 1. Eğitimi tamamlayan kullanıcıları listele
SELECT 'EĞİTİMİ TAMAMLAYAN KULLANICILAR' as status;
SELECT 
    id,
    first_name,
    last_name,
    email,
    education_completed,
    education_deadline,
    education_started_at,
    created_at
FROM users 
WHERE education_completed = 1
ORDER BY created_at DESC;

-- 2. Eğitimi tamamlamayan kullanıcıları listele
SELECT 'EĞİTİMİ TAMAMLAMAYAN KULLANICILAR' as status;
SELECT 
    id,
    first_name,
    last_name,
    email,
    education_completed,
    education_deadline,
    education_started_at,
    created_at
FROM users 
WHERE education_completed = 0 OR education_completed IS NULL
ORDER BY created_at DESC;

-- 3. Eğitim istatistikleri
SELECT 'EĞİTİM İSTATİSTİKLERİ' as status;
SELECT 
    'Toplam Partner' as kategori,
    COUNT(*) as sayi
FROM users 
WHERE role = 'partner'
UNION ALL
SELECT 
    'Eğitimi Tamamlayan' as kategori,
    COUNT(*) as sayi
FROM users 
WHERE role = 'partner' AND education_completed = 1
UNION ALL
SELECT 
    'Eğitimi Tamamlamayan' as kategori,
    COUNT(*) as sayi
FROM users 
WHERE role = 'partner' AND (education_completed = 0 OR education_completed IS NULL);

-- 4. Belirli kullanıcıların eğitim durumu
SELECT 'BELİRLİ KULLANICILARIN EĞİTİM DURUMU' as status;
SELECT 
    id,
    first_name,
    last_name,
    email,
    education_completed,
    education_deadline,
    education_started_at
FROM users 
WHERE first_name IN ('TOLGA', 'BİLAL', 'HÜSEYİN', 'YUSUF', 'SEHER', 'GÜLSEMİN')
ORDER BY first_name;
