# SUNUCU GÜNCELLEME REHBERİ

## 🎯 SUNUCUDAKI SORUNLAR
1. **KKP Hesaplama:** KDV dahil hesaplanıyor (yanlış)
2. **Franchise Ağı:** user_profiles tablosu eksik
3. **API Hatalar:** Eski backend kodu

## 📋 ADIM ADIM ÇÖZÜM

### 1. YEDEK AL (KRİTİK!)
```bash
# Veritabanı yedeği
mysqldump -u root -p hoowell_network > backup_$(date +%Y%m%d_%H%M%S).sql

# Dosya yedeği
tar -czf hoowell_backup_$(date +%Y%m%d_%H%M%S).tar.gz .
```

### 2. EKSİK TABLOLARI OLUŞTUR
```sql
-- user_profiles tablosunu oluştur
CREATE TABLE IF NOT EXISTS user_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    profile_photo VARCHAR(255),
    join_date DATETIME,
    last_login DATETIME,
    total_sales DECIMAL(15,2) DEFAULT 0,
    monthly_sales DECIMAL(15,2) DEFAULT 0,
    team_size INT DEFAULT 0,
    active_team_members INT DEFAULT 0,
    personal_volume DECIMAL(15,2) DEFAULT 0,
    team_volume DECIMAL(15,2) DEFAULT 0,
    is_active_this_month BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_profile (user_id)
);

-- customer_satisfaction_rewards tablosunu oluştur
CREATE TABLE IF NOT EXISTS customer_satisfaction_rewards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    reward_type ENUM('referral', 'satisfaction', 'loyalty') NOT NULL,
    reward_amount_usd DECIMAL(10,2) NOT NULL,
    reward_amount_try DECIMAL(10,2) NOT NULL,
    reward_date DATETIME NOT NULL,
    status ENUM('pending', 'approved', 'paid') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Mevcut kullanıcılar için profil kayıtları oluştur
INSERT INTO user_profiles (user_id, join_date, is_active_this_month)
SELECT id, created_at, FALSE FROM users
ON DUPLICATE KEY UPDATE user_id = user_id;
```

### 3. KKP HESAPLAMALARINI DÜZELT
```sql
-- Önce mevcut durumu göster
SELECT 'BEFORE KKP FIX' as status;
SELECT 
    u.id,
    u.first_name,
    u.total_kkp,
    (SELECT COUNT(*) FROM users WHERE created_by = u.id AND role = 'partner') as partners,
    (SELECT COUNT(*) FROM customers WHERE created_by = u.id) as customers
FROM users u WHERE u.role = 'partner';

-- KKP hesaplamalarını düzelt (KDV hariç)
-- Geçici tablo oluştur
CREATE TEMPORARY TABLE temp_kkp AS
SELECT 
    u.id,
    -- Partner KKP: Her partner 120 KKP
    COALESCE((SELECT COUNT(*) * 120 FROM users u2 WHERE u2.created_by = u.id AND u2.role = 'partner'), 0) as partner_kkp,
    -- Müşteri KKP: KDV hariç net fiyat (product_price)
    COALESCE((SELECT SUM(product_price) FROM customers c WHERE c.created_by = u.id), 0) as customer_kkp,
    -- Aktif partner sayısı
    COALESCE((SELECT COUNT(*) FROM users u3 WHERE u3.created_by = u.id AND u3.role = 'partner'), 0) as partner_count
FROM users u WHERE u.role = 'partner';

-- Users tablosunu güncelle
UPDATE users u
JOIN temp_kkp t ON u.id = t.id
SET 
    u.total_kkp = t.partner_kkp + t.customer_kkp,
    u.active_partners = t.partner_count;

-- Sonucu göster
SELECT 'AFTER KKP FIX' as status;
SELECT 
    u.id,
    u.first_name,
    u.total_kkp,
    u.active_partners
FROM users u WHERE u.role = 'partner' AND u.total_kkp > 0;

-- Geçici tabloyu temizle
DROP TEMPORARY TABLE temp_kkp;
```

### 4. BACKEND DOSYALARINI GÜNCELLE
```bash
# Mevcut backend'i yedekle
cp -r backend backend_old

# Yeni backend dosyalarını yükle (GitHub'dan veya FTP ile)
# server.js ve diğer dosyaları güncelle

# Dependencies'leri güncelle
cd backend
npm install

# PM2 ile yeniden başlat
pm2 restart hoowell-backend
```

### 5. FRONTEND'İ GÜNCELLE
```bash
# Mevcut frontend'i yedekle
cp -r frontend frontend_old

# Yeni frontend dosyalarını yükle
# React bileşenlerini güncelle

# Build al
cd frontend
npm install
npm run build

# Nginx'i yeniden yükle
sudo systemctl reload nginx
```

### 6. VERİ TUTARLILIK KONTROLÜ
```sql
-- Müşteri durumlarını düzelt
UPDATE customers SET status = 'confirmed' WHERE status = 'pending';

-- Sistem ayarlarını güncelle
INSERT INTO system_settings (setting_key, setting_value) VALUES
('usd_to_try_rate', '40'),
('vat_rate', '20'),
('education_price_usd', '100'),
('device_price_usd', '1800')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);
```

### 7. TEST VE DOĞRULAMA
```bash
# API testleri
curl -X GET "http://localhost:5001/api/dashboard/stats"

# Franchise ağı testi
curl -X GET "http://localhost:5001/api/network/tree"

# KKP kontrol
mysql -u root -p hoowell_network -e "SELECT SUM(total_kkp) FROM users WHERE role='partner';"
```

## 🔧 SORUN GİDERME

### Backend Hatası Alırsan:
```bash
# Logları kontrol et
pm2 logs hoowell-backend

# Eski backend'e geri dön
rm -rf backend
mv backend_old backend
pm2 restart hoowell-backend
```

### Frontend Hatası Alırsan:
```bash
# Eski frontend'e geri dön
rm -rf frontend
mv frontend_old frontend
sudo systemctl reload nginx
```

### Veritabanı Hatası Alırsan:
```bash
# Yedekten geri yükle
mysql -u root -p hoowell_network < backup_YYYYMMDD_HHMMSS.sql
```

## ✅ BAŞARI KRİTERLERİ

Güncelleme başarılı olduğunda:
- ✅ Franchise ağında kişilere tıklayınca hata vermez
- ✅ KKP puanları KDV hariç hesaplanır
- ✅ Kariyer takip panelinde doğru KKP görünür
- ✅ Tüm API'ler çalışır
- ✅ Mevcut veriler korunur

## 📞 DESTEK

Her adımı dikkatli takip et. Sorun yaşarsan:
1. Logları kontrol et
2. Yedeklerden geri yükle
3. Adım adım tekrar dene