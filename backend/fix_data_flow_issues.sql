-- Veri akışı sorunlarını düzelten SQL script'i

USE hoowell_network;

-- 1. Doping promosyonu için tablo oluştur
CREATE TABLE IF NOT EXISTS doping_promotion_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    etap1_sales INT DEFAULT 0,
    etap1_partners INT DEFAULT 0,
    etap1_completed BOOLEAN DEFAULT FALSE,
    etap1_bonus_awarded BOOLEAN DEFAULT FALSE,
    etap2_sales INT DEFAULT 0,
    etap2_partners INT DEFAULT 0,
    etap2_completed BOOLEAN DEFAULT FALSE,
    etap2_bonus_awarded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_doping (user_id)
);

-- 2. Customer satisfaction rewards tablosunu güncelle
ALTER TABLE customer_satisfaction_rewards 
ADD COLUMN IF NOT EXISTS reward_value DECIMAL(10,2) DEFAULT 0 AFTER reward_description;

-- 3. Customers tablosuna referans sayısı için view oluştur
CREATE OR REPLACE VIEW customer_with_references AS
SELECT 
    c.*,
    COUNT(cr.id) as reference_count
FROM customers c
LEFT JOIN customer_references cr ON c.id = cr.customer_id
GROUP BY c.id;

-- 4. KKP hesaplama düzeltmesi için trigger oluştur
DELIMITER //

CREATE TRIGGER IF NOT EXISTS update_kkp_on_customer_insert
AFTER INSERT ON customers
FOR EACH ROW
BEGIN
    -- KKP = net product price (KDV hariç)
    UPDATE users 
    SET total_kkp = total_kkp + NEW.product_price 
    WHERE id = NEW.created_by;
    
    -- Sales tracking kaydı oluştur
    INSERT INTO sales_tracking (
        seller_id, customer_id, sale_type, product_name, 
        sale_amount, bonus_amount, sale_date, bonus_date, status
    ) VALUES (
        NEW.created_by, NEW.id, 'product_sale', 
        CASE WHEN NEW.selected_product = 'education' THEN 'Eğitim Paketi' ELSE 'Cihaz Paketi' END,
        NEW.product_price, NEW.product_price, NOW(), NOW(), 'active'
    );
END//

DELIMITER ;

-- 5. Referans ekleme trigger'ı
DELIMITER //

CREATE TRIGGER IF NOT EXISTS update_rewards_on_reference_insert
AFTER INSERT ON customer_references
FOR EACH ROW
BEGIN
    DECLARE ref_count INT DEFAULT 0;
    DECLARE reward_name VARCHAR(255) DEFAULT '';
    DECLARE reward_value DECIMAL(10,2) DEFAULT 0;
    
    -- Müşterinin toplam referans sayısını al
    SELECT COUNT(*) INTO ref_count 
    FROM customer_references 
    WHERE customer_id = NEW.customer_id;
    
    -- Ödül belirle
    IF ref_count = 1 THEN
        SET reward_name = '450 USD Değerinde Ücretsiz Filtre';
        SET reward_value = 450;
    ELSEIF ref_count = 2 THEN
        SET reward_name = '410 USD Değerinde El Terminali';
        SET reward_value = 410;
    ELSEIF ref_count = 3 THEN
        SET reward_name = '500 USD Değerinde Franchise Lisans';
        SET reward_value = 500;
    END IF;
    
    -- Ödül varsa ekle
    IF reward_name != '' THEN
        INSERT INTO customer_satisfaction_rewards (
            customer_id, reward_level, reward_name, 
            reward_description, reward_value, earned_date
        ) VALUES (
            NEW.customer_id, ref_count, reward_name,
            CONCAT(ref_count, '. referans ödülü'), reward_value, NOW()
        );
    END IF;
END//

DELIMITER ;

-- 6. Mevcut verileri düzelt
-- Yanlış KKP hesaplamalarını düzelt (sadece net fiyat üzerinden)
UPDATE users u SET total_kkp = (
    SELECT COALESCE(SUM(c.product_price), 0) 
    FROM customers c 
    WHERE c.created_by = u.id AND c.status = 'confirmed'
) WHERE u.role = 'partner';

-- 7. Eksik sales_tracking kayıtlarını oluştur
INSERT IGNORE INTO sales_tracking (
    seller_id, customer_id, sale_type, product_name, 
    sale_amount, bonus_amount, sale_date, bonus_date, status
)
SELECT 
    c.created_by, c.id, 'product_sale',
    CASE WHEN c.selected_product = 'education' THEN 'Eğitim Paketi' ELSE 'Cihaz Paketi' END,
    c.product_price, c.product_price, c.created_at, c.created_at, 'active'
FROM customers c
WHERE c.status = 'confirmed'
AND NOT EXISTS (
    SELECT 1 FROM sales_tracking st 
    WHERE st.customer_id = c.id AND st.seller_id = c.created_by
);

-- 8. Doping promosyonu için başlangıç verileri
INSERT IGNORE INTO doping_promotion_progress (user_id)
SELECT id FROM users WHERE role = 'partner';

-- 9. Index'leri optimize et
CREATE INDEX IF NOT EXISTS idx_customers_created_by_status ON customers(created_by, status);
CREATE INDEX IF NOT EXISTS idx_customer_references_customer_id ON customer_references(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_tracking_seller_date ON sales_tracking(seller_id, sale_date);
CREATE INDEX IF NOT EXISTS idx_users_sponsor_created ON users(sponsor_id, created_at);

-- 10. View'ları güncelle
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
    u.id,
    u.sponsor_id,
    u.first_name,
    u.last_name,
    u.total_kkp,
    u.career_level,
    COUNT(DISTINCT c.id) as total_customers,
    COUNT(DISTINCT cr.id) as total_references,
    COUNT(DISTINCT p.id) as total_partners,
    COALESCE(SUM(c.product_price), 0) as total_sales_usd
FROM users u
LEFT JOIN customers c ON u.id = c.created_by AND c.status = 'confirmed'
LEFT JOIN customer_references cr ON c.id = cr.customer_id
LEFT JOIN users p ON u.sponsor_id = p.sponsor_id
WHERE u.role = 'partner'
GROUP BY u.id;