# Test Verilerini Silme Rehberi

## 🗑️ Test Verilerini Silme Yöntemleri

### 1. Otomatik Script ile Silme
```bash
# Script'i çalıştır
./test_verilerini_sil.sh
```

### 2. Manuel MySQL Komutları

#### Test Kullanıcılarını Listele:
```sql
SELECT sponsor_id, email, first_name, last_name, created_at 
FROM users 
WHERE email LIKE '%test%' OR email LIKE '%@example.com%' OR first_name LIKE '%test%';
```

#### Test Kullanıcılarını Sil:
```sql
DELETE FROM users WHERE email LIKE '%test%' OR email LIKE '%@example.com%' OR first_name LIKE '%test%';
```

#### Test Satışlarını Listele:
```sql
SELECT * FROM sales_tracking WHERE sale_type = 'test' OR amount = 0;
```

#### Test Satışlarını Sil:
```sql
DELETE FROM sales_tracking WHERE sale_type = 'test' OR amount = 0;
```

#### Test Ödemelerini Listele:
```sql
SELECT * FROM payments WHERE amount = 0 OR payment_type = 'test';
```

#### Test Ödemelerini Sil:
```sql
DELETE FROM payments WHERE amount = 0 OR payment_type = 'test';
```

#### Test Müşteri Kayıtlarını Listele:
```sql
SELECT * FROM customer_satisfaction WHERE customer_name LIKE '%test%';
```

#### Test Müşteri Kayıtlarını Sil:
```sql
DELETE FROM customer_satisfaction WHERE customer_name LIKE '%test%';
```

#### Test Sponsorluk Kayıtlarını Listele:
```sql
SELECT * FROM sponsorship_tracking WHERE partner_name LIKE '%test%';
```

#### Test Sponsorluk Kayıtlarını Sil:
```sql
DELETE FROM sponsorship_tracking WHERE partner_name LIKE '%test%';
```

#### Test Takım Kayıtlarını Listele:
```sql
SELECT * FROM team_tracking WHERE member_name LIKE '%test%';
```

#### Test Takım Kayıtlarını Sil:
```sql
DELETE FROM team_tracking WHERE member_name LIKE '%test%';
```

#### Test Kariyer Kayıtlarını Listele:
```sql
SELECT * FROM career_tracking WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%test%');
```

#### Test Kariyer Kayıtlarını Sil:
```sql
DELETE FROM career_tracking WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%test%');
```

### 3. Belirli Kullanıcıyı Silme

#### Kullanıcıyı ve Tüm Verilerini Sil:
```sql
-- Önce kullanıcı ID'sini bul
SELECT id, sponsor_id, email FROM users WHERE email = 'test@example.com';

-- Sonra tüm verilerini sil
DELETE FROM users WHERE id = KULLANICI_ID;
DELETE FROM sales_tracking WHERE user_id = KULLANICI_ID;
DELETE FROM customer_satisfaction WHERE user_id = KULLANICI_ID;
DELETE FROM sponsorship_tracking WHERE user_id = KULLANICI_ID;
DELETE FROM team_tracking WHERE user_id = KULLANICI_ID;
DELETE FROM career_tracking WHERE user_id = KULLANICI_ID;
DELETE FROM payments WHERE user_id = KULLANICI_ID;
```

### 4. Güvenli Silme İşlemi

#### Önce Yedek Al:
```bash
# Veritabanı yedeği al
mysqldump -u root -p hoowell_network > backup_before_delete_$(date +%Y%m%d_%H%M%S).sql
```

#### Test Verilerini Kontrol Et:
```sql
-- Silmeden önce kontrol et
SELECT COUNT(*) as test_users FROM users WHERE email LIKE '%test%';
SELECT COUNT(*) as test_sales FROM sales_tracking WHERE sale_type = 'test';
SELECT COUNT(*) as test_payments FROM payments WHERE payment_type = 'test';
```

### 5. Önemli Notlar

⚠️ **DİKKAT:**
- Silme işlemi geri alınamaz
- Önce yedek alın
- Test verilerini silmeden önce kontrol edin
- Production verilerini etkilememesine dikkat edin

### 6. Hızlı Temizlik

#### Tüm Test Verilerini Tek Seferde Sil:
```sql
-- Test kullanıcıları ve ilişkili verileri sil
DELETE FROM career_tracking WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%test%');
DELETE FROM team_tracking WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%test%');
DELETE FROM sponsorship_tracking WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%test%');
DELETE FROM customer_satisfaction WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%test%');
DELETE FROM sales_tracking WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%test%');
DELETE FROM payments WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%test%');
DELETE FROM users WHERE email LIKE '%test%' OR email LIKE '%@example.com%';
```
