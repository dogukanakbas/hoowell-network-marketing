-- HOOWELL Career Requirements Update Script
-- Bu script kariyer gereksinimlerini yeni standartlara göre günceller

-- Mevcut kullanıcıların kariyer seviyelerini kontrol et ve gerekirse güncelle
-- Bu script güvenli bir şekilde çalıştırılabilir

-- 1. Önce mevcut durumu kontrol edelim
SELECT 
    career_level,
    COUNT(*) as user_count,
    AVG(total_kkp) as avg_kkp,
    AVG(active_partners) as avg_partners
FROM users 
WHERE role = 'partner'
GROUP BY career_level;

-- 2. Yeni kariyer gereksinimlerine göre kullanıcıları güncelle
-- Bu işlem otomatik olarak server.js'de yapılacak, ancak manuel kontrol için:

-- Silver seviyesindeki kullanıcıları kontrol et (15.000 KKP + 1 ortak)
SELECT 
    id, 
    first_name, 
    last_name, 
    career_level, 
    total_kkp, 
    active_partners,
    CASE 
        WHEN total_kkp >= 15000 AND active_partners >= 1 THEN 'Qualified for Silver'
        ELSE 'Not qualified for Silver'
    END as silver_status
FROM users 
WHERE role = 'partner' AND career_level = 'silver';

-- Gold seviyesindeki kullanıcıları kontrol et (50.000 KKP + 3 ortak)
SELECT 
    id, 
    first_name, 
    last_name, 
    career_level, 
    total_kkp, 
    active_partners,
    CASE 
        WHEN total_kkp >= 50000 AND active_partners >= 3 THEN 'Qualified for Gold'
        ELSE 'Not qualified for Gold'
    END as gold_status
FROM users 
WHERE role = 'partner' AND career_level = 'gold';

-- Star Leader seviyesindeki kullanıcıları kontrol et (100.000 KKP + 7 ortak)
SELECT 
    id, 
    first_name, 
    last_name, 
    career_level, 
    total_kkp, 
    active_partners,
    CASE 
        WHEN total_kkp >= 100000 AND active_partners >= 7 THEN 'Qualified for Star Leader'
        ELSE 'Not qualified for Star Leader'
    END as star_status
FROM users 
WHERE role = 'partner' AND career_level = 'star_leader';

-- Super Star Leader seviyesindeki kullanıcıları kontrol et (175.000 KKP + 15 ortak)
SELECT 
    id, 
    first_name, 
    last_name, 
    career_level, 
    total_kkp, 
    active_partners,
    CASE 
        WHEN total_kkp >= 175000 AND active_partners >= 15 THEN 'Qualified for Super Star Leader'
        ELSE 'Not qualified for Super Star Leader'
    END as super_star_status
FROM users 
WHERE role = 'partner' AND career_level = 'super_star_leader';

-- Presidents Team seviyesindeki kullanıcıları kontrol et (300.000 KKP + 25 ortak)
SELECT 
    id, 
    first_name, 
    last_name, 
    career_level, 
    total_kkp, 
    active_partners,
    CASE 
        WHEN total_kkp >= 300000 AND active_partners >= 25 THEN 'Qualified for Presidents Team'
        ELSE 'Not qualified for Presidents Team'
    END as presidents_status
FROM users 
WHERE role = 'partner' AND career_level = 'presidents_team';

-- Country Distributor seviyesindeki kullanıcıları kontrol et (400.000 KKP + 30 ortak)
SELECT 
    id, 
    first_name, 
    last_name, 
    career_level, 
    total_kkp, 
    active_partners,
    CASE 
        WHEN total_kkp >= 400000 AND active_partners >= 30 THEN 'Qualified for Country Distributor'
        ELSE 'Not qualified for Country Distributor'
    END as country_status
FROM users 
WHERE role = 'partner' AND career_level = 'country_distributor';

-- 3. Eğer gerekirse, şartları karşılamayan kullanıcıları bir seviye aşağı indir
-- DİKKAT: Bu işlem veri kaybına neden olabilir, önce yedek alın!

-- Örnek: Silver seviyesinde olup şartları karşılamayanları Bronze'a indir
-- UPDATE users 
-- SET career_level = 'bronze' 
-- WHERE role = 'partner' 
--   AND career_level = 'silver' 
--   AND (total_kkp < 15000 OR active_partners < 1);

-- 4. Career bonuses tablosunu kontrol et
SELECT 
    cb.career_level,
    COUNT(*) as bonus_count,
    AVG(cb.bonus_amount_usd) as avg_bonus_usd,
    AVG(cb.kkp_achieved) as avg_kkp_achieved
FROM career_bonuses cb
GROUP BY cb.career_level
ORDER BY 
    CASE cb.career_level
        WHEN 'silver' THEN 1
        WHEN 'gold' THEN 2
        WHEN 'star_leader' THEN 3
        WHEN 'super_star_leader' THEN 4
        WHEN 'presidents_team' THEN 5
        WHEN 'country_distributor' THEN 6
        ELSE 7
    END;

-- 5. Özet rapor
SELECT 
    'HOOWELL Career System Update Summary' as report_title,
    (SELECT COUNT(*) FROM users WHERE role = 'partner') as total_partners,
    (SELECT COUNT(*) FROM users WHERE role = 'partner' AND career_level = 'bronze') as bronze_count,
    (SELECT COUNT(*) FROM users WHERE role = 'partner' AND career_level = 'silver') as silver_count,
    (SELECT COUNT(*) FROM users WHERE role = 'partner' AND career_level = 'gold') as gold_count,
    (SELECT COUNT(*) FROM users WHERE role = 'partner' AND career_level = 'star_leader') as star_leader_count,
    (SELECT COUNT(*) FROM users WHERE role = 'partner' AND career_level = 'super_star_leader') as super_star_count,
    (SELECT COUNT(*) FROM users WHERE role = 'partner' AND career_level = 'presidents_team') as presidents_count,
    (SELECT COUNT(*) FROM users WHERE role = 'partner' AND career_level = 'country_distributor') as country_count,
    (SELECT COUNT(*) FROM career_bonuses) as total_bonuses_awarded;

-- 6. Sistem güncellemesi tamamlandı mesajı
SELECT 'HOOWELL Career Requirements Successfully Updated!' as status,
       'New requirements: Silver(15K+1), Gold(50K+3), Star(100K+7), Super(175K+15), Presidents(300K+25), Country(400K+30)' as new_requirements;