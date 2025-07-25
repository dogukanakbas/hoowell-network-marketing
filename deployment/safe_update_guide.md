# HOOWELL Güvenli Güncelleme Rehberi

## 🎯 AMAÇ
Mevcut sunucudaki verileri kaybetmeden sistemi güncellemek.

## ⚠️ ÖNEMLİ UYARILAR
- Bu işlemler sırasında sistem kısa süre erişilemez olabilir
- Mutlaka yedek alın
- İşlemleri sırayla yapın
- Her adımdan sonra test edin

## 📋 GÜNCELLEME ADIMLARI

### 1. YEDEK ALMA (KRİTİK!)
```bash
# Veritabanı yedeği
mysqldump -u root -p hoowell_network > backup_$(date +%Y%m%d_%H%M%S).sql

# Dosya yedeği
tar -czf files_backup_$(date +%Y%m%d_%H%M%S).tar.gz /path/to/hoowell/

# Yedekleri güvenli yere kopyalayın
```

### 2. MEVCUT DURUM TESPİTİ
```bash
# Sunucuda mevcut tabloları kontrol et
mysql -u root -p hoowell_network -e "SHOW TABLES;"

# Kullanıcı sayısını kontrol et
mysql -u root -p hoowell_network -e "SELECT COUNT(*) as user_count FROM users;"

# Müşteri sayısını kontrol et
mysql -u root -p hoowell_network -e "SELECT COUNT(*) as customer_count FROM customers;"
```

### 3. EKSİK TABLO EKLEME
```sql
-- customer_satisfaction_rewards tablosunu ekle
USE hoowell_network;

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
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_reward_date (reward_date),
    INDEX idx_status (status)
);
```

### 4. TABLO YAPILARINI GÜNCELLEME
```sql
-- users tablosuna eksik alanlar varsa ekle
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS payment_pending BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS payment_blocked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS education_started_at DATETIME NULL;

-- customers tablosuna eksik alanlar varsa ekle  
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS delivery_city VARCHAR(100),
ADD COLUMN IF NOT EXISTS delivery_district VARCHAR(100),
ADD COLUMN IF NOT EXISTS billing_address TEXT,
ADD COLUMN IF NOT EXISTS billing_city VARCHAR(100),
ADD COLUMN IF NOT EXISTS billing_district VARCHAR(100),
ADD COLUMN IF NOT EXISTS same_address BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS order_id VARCHAR(50);
```

### 5. BACKEND GÜNCELLEME
```bash
# Mevcut backend'i yedekle
cp -r backend backend_backup_$(date +%Y%m%d)

# Yeni backend dosyalarını kopyala
# server.js ve diğer dosyaları güncelle

# Node modules'ları güncelle
cd backend
npm install
```

### 6. FRONTEND GÜNCELLEME
```bash
# Mevcut frontend'i yedekle
cp -r frontend frontend_backup_$(date +%Y%m%d)

# Yeni frontend dosyalarını kopyala
# React bileşenlerini güncelle

# Dependencies'leri güncelle
cd frontend
npm install
npm run build
```

### 7. VERİ TUTARLILIK KONTROLÜ
```sql
-- KKP hesaplamalarını düzelt
UPDATE users u SET 
total_kkp = (
    SELECT COALESCE(
        (SELECT SUM(total_amount)/40 FROM customers WHERE created_by = u.id), 0
    ) + 
    (SELECT COUNT(*) * 120 FROM users WHERE created_by = u.id AND role = 'partner')
),
active_partners = (
    SELECT COUNT(*) FROM users WHERE created_by = u.id AND role = 'partner'
);

-- Müşteri durumlarını düzelt
UPDATE customers SET status = 'confirmed' WHERE status = 'pending';
```

### 8. SİSTEM AYARLARINI GÜNCELLE
```sql
-- Sistem ayarlarını kontrol et ve güncelle
INSERT INTO system_settings (setting_key, setting_value) VALUES
('usd_to_try_rate', '40'),
('vat_rate', '20'),
('education_price_usd', '100'),
('device_price_usd', '1800')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);
```

### 9. SERVİSLERİ YENİDEN BAŞLAT
```bash
# Backend servisi
pm2 restart hoowell-backend

# Frontend servisi (nginx)
sudo systemctl reload nginx

# Veritabanı servisi (gerekirse)
sudo systemctl restart mysql
```

### 10. TEST VE DOĞRULAMA
```bash
# API testleri
curl -X GET "http://localhost:5001/api/dashboard/stats"

# Frontend testi
curl -X GET "http://localhost:3000"

# Veritabanı bağlantı testi
mysql -u root -p hoowell_network -e "SELECT COUNT(*) FROM users;"
```

## 🔧 SORUN GİDERME

### Backend Başlamazsa:
```bash
# Log kontrolü
pm2 logs hoowell-backend

# Port kontrolü
netstat -tulpn | grep :5001

# Manuel başlatma
cd backend && node server.js
```

### Frontend Görünmezse:
```bash
# Nginx log kontrolü
sudo tail -f /var/log/nginx/error.log

# Build kontrolü
cd frontend && npm run build

# Nginx config kontrolü
sudo nginx -t
```

### Veritabanı Sorunları:
```bash
# MySQL log kontrolü
sudo tail -f /var/log/mysql/error.log

# Bağlantı testi
mysql -u root -p -e "SHOW DATABASES;"

# Tablo kontrolü
mysql -u root -p hoowell_network -e "SHOW TABLES;"
```

## 📊 BAŞARI KRİTERLERİ

✅ Tüm mevcut kullanıcılar korundu
✅ Tüm müşteri kayıtları korundu  
✅ KKP puanları doğru hesaplanıyor
✅ Tüm API endpoint'leri çalışıyor
✅ Frontend düzgün yükleniyor
✅ Admin paneli erişilebilir
✅ Yeni özellikler aktif

## 🆘 ACİL DURUM PLANI

Eğer bir şeyler ters giderse:

```bash
# Veritabanını geri yükle
mysql -u root -p hoowell_network < backup_YYYYMMDD_HHMMSS.sql

# Dosyaları geri yükle
tar -xzf files_backup_YYYYMMDD_HHMMSS.tar.gz

# Servisleri yeniden başlat
pm2 restart all
sudo systemctl restart nginx
```

## 📞 DESTEK

Sorun yaşarsanız:
1. Log dosyalarını kontrol edin
2. Yedeklerden geri yükleyin
3. Adım adım tekrar deneyin