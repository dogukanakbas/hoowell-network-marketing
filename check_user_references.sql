-- p2025000033 ID'sinin hangi tablolarda kullanıldığını kontrol et
-- Bu sorguları sırayla çalıştır

-- 1. Kullanıcılar tablosu
SELECT COUNT(*) as user_count FROM users WHERE sponsor_id = 'p2025000033';
SELECT * FROM users WHERE sponsor_id = 'p2025000033' LIMIT 5;

-- 2. Satış takibi tablosu
SELECT COUNT(*) as sales_count FROM sales_tracking WHERE seller_id = 'p2025000033';
SELECT * FROM sales_tracking WHERE seller_id = 'p2025000033' LIMIT 5;

-- 3. Müşteri memnuniyeti tablosu
SELECT COUNT(*) as customer_count FROM customer_satisfaction WHERE seller_id = 'p2025000033';
SELECT * FROM customer_satisfaction WHERE seller_id = 'p2025000033' LIMIT 5;

-- 4. Sponsorluk takibi tablosu
SELECT COUNT(*) as sponsorship_count FROM sponsorship_tracking WHERE sponsor_id = 'p2025000033';
SELECT * FROM sponsorship_tracking WHERE sponsor_id = 'p2025000033' LIMIT 5;

-- 5. Takım takibi tablosu
SELECT COUNT(*) as team_count FROM team_tracking WHERE leader_id = 'p2025000033';
SELECT * FROM team_tracking WHERE leader_id = 'p2025000033' LIMIT 5;

-- 6. Kariyer takibi tablosu
SELECT COUNT(*) as career_count FROM career_tracking WHERE user_id = 'p2025000033';
SELECT * FROM career_tracking WHERE user_id = 'p2025000033' LIMIT 5;

-- 7. Ödemeler tablosu
SELECT COUNT(*) as payment_count FROM payments WHERE user_id = 'p2025000033';
SELECT * FROM payments WHERE user_id = 'p2025000033' LIMIT 5;
