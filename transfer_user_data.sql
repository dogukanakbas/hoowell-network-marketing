-- KULLANICI VERİLERİNİ TAŞIMA SORGULARI
-- p2025000033 ID'sini YENİ_ID ile değiştir

-- 1. Kullanıcılar tablosu - sponsor_id güncelle
UPDATE users 
SET sponsor_id = 'YENİ_ID' 
WHERE sponsor_id = 'p2025000033';

-- 2. Satış takibi tablosu - seller_id güncelle
UPDATE sales_tracking 
SET seller_id = 'YENİ_ID' 
WHERE seller_id = 'p2025000033';

-- 3. Müşteri memnuniyeti tablosu - seller_id güncelle
UPDATE customer_satisfaction 
SET seller_id = 'YENİ_ID' 
WHERE seller_id = 'p2025000033';

-- 4. Sponsorluk takibi tablosu - sponsor_id güncelle
UPDATE sponsorship_tracking 
SET sponsor_id = 'YENİ_ID' 
WHERE sponsor_id = 'p2025000033';

-- 5. Takım takibi tablosu - leader_id güncelle
UPDATE team_tracking 
SET leader_id = 'YENİ_ID' 
WHERE leader_id = 'p2025000033';

-- 6. Kariyer takibi tablosu - user_id güncelle
UPDATE career_tracking 
SET user_id = 'YENİ_ID' 
WHERE user_id = 'p2025000033';

-- 7. Ödemeler tablosu - user_id güncelle
UPDATE payments 
SET user_id = 'YENİ_ID' 
WHERE user_id = 'p2025000033';

-- 8. Diğer tablolar (varsa)
-- UPDATE table_name SET column_name = 'YENİ_ID' WHERE column_name = 'p2025000033';
