# 🚀 Sunucu Güncelleme Adım Adım Rehber

## 📋 Ön Hazırlık (Yerel Bilgisayarda)

### 1. 🔍 Son Değişiklikleri Kontrol Et
```bash
# Değişen dosyaları gör
git status

# Son commit'leri kontrol et
git log --oneline -10
```

### 2. 💾 Yerel Değişiklikleri Commit Et
```bash
# Tüm değişiklikleri ekle
git add .

# Commit yap
git commit -m "feat: Login responsive optimization, Discovery video cards fix, Session timeout fix, Leadership panel improvements"

# GitHub'a push et
git push origin main
```

## 🖥️ Sunucu Bağlantısı ve Hazırlık

### 3. 🔐 Sunucuya Bağlan
```bash
# SSH ile sunucuya bağlan (kendi sunucu bilgilerinle değiştir)
ssh root@your-server-ip
# veya
ssh username@your-server-ip
```

### 4. 📂 Proje Dizinine Git
```bash
# Proje dizinine git
cd /var/www/hoowell-network
# veya projenin bulunduğu dizin
cd /home/username/hoowell-network
```

### 5. 💾 Mevcut Durumu Yedekle
```bash
# Veritabanı yedeği al
mysqldump -u root -p hoowell_network > backup_$(date +%Y%m%d_%H%M%S).sql

# Dosya yedeği al
cp -r . ../hoowell-network-backup-$(date +%Y%m%d_%H%M%S)

# PM2 durumunu kaydet
pm2 save
```

## 🔄 Güncelleme İşlemi

### 6. 📥 Yeni Kodu Çek
```bash
# Mevcut branch'i kontrol et
git branch

# Yeni değişiklikleri çek
git fetch origin

# Ana branch'e geç (main veya master)
git checkout main

# Yeni değişiklikleri merge et
git pull origin main
```

### 7. 📦 Dependencies Güncelle
```bash
# Backend dependencies
npm install

# Frontend dependencies
cd frontend
npm install
cd ..
```

### 8. 🏗️ Frontend Build Et
```bash
# Frontend'i production için build et
cd frontend
npm run build
cd ..
```

## 🗄️ Veritabanı Güncellemeleri

### 9. 📊 Yeni Tabloları Ekle (Eğer Varsa)
```bash
# MySQL'e bağlan
mysql -u root -p

# Veritabanını seç
USE hoowell_network;

# Muhasebe tablosunu ekle (yeni özellik)
CREATE TABLE IF NOT EXISTS accounting_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    account_type ENUM('individual', 'company') NOT NULL,
    iban VARCHAR(34) NOT NULL,
    bank_name VARCHAR(100),
    account_holder_name VARCHAR(100) NOT NULL,
    tc_identity_front VARCHAR(255),
    tax_plate VARCHAR(255),
    company_name VARCHAR(100),
    tax_number VARCHAR(20),
    is_approved BOOLEAN DEFAULT FALSE,
    approval_date TIMESTAMP NULL,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_accounting (user_id)
);

# Çıkış yap
EXIT;
```

### 10. 📁 Upload Klasörlerini Oluştur
```bash
# Muhasebe belgeleri için klasör oluştur
mkdir -p uploads/accounting
chmod 755 uploads/accounting

# Diğer upload klasörlerini kontrol et
ls -la uploads/
```

## 🔧 Servis Yeniden Başlatma

### 11. 🔄 PM2 ile Servisleri Yeniden Başlat
```bash
# Mevcut PM2 süreçlerini kontrol et
pm2 list

# Backend'i yeniden başlat
pm2 restart hoowell-backend
# veya
pm2 restart 0

# Logları kontrol et
pm2 logs hoowell-backend --lines 50
```

### 12. 🌐 Nginx Konfigürasyonunu Kontrol Et
```bash
# Nginx konfigürasyonunu test et
nginx -t

# Nginx'i yeniden yükle
systemctl reload nginx
```

## ✅ Doğrulama ve Test

### 13. 🧪 Sistem Testleri
```bash
# Backend'in çalışıp çalışmadığını kontrol et
curl http://localhost:5001/api/health
# veya
curl http://your-domain.com/api/health

# PM2 durumunu kontrol et
pm2 status

# Sistem kaynaklarını kontrol et
htop
# veya
top
```

### 14. 🌍 Web Sitesi Testleri
Tarayıcıda şunları test et:
- ✅ Ana sayfa yükleniyor mu?
- ✅ Login sayfası responsive çalışıyor mu?
- ✅ Discovery sayfası video kartları düzgün mü?
- ✅ Session timeout çalışıyor mu?
- ✅ Liderlik havuzları kapak sistemi çalışıyor mu?
- ✅ Muhasebe takip paneli açılıyor mu?

## 🚨 Sorun Giderme

### 15. 🔍 Hata Durumunda
```bash
# PM2 loglarını kontrol et
pm2 logs --lines 100

# Nginx loglarını kontrol et
tail -f /var/log/nginx/error.log

# MySQL loglarını kontrol et
tail -f /var/log/mysql/error.log

# Disk alanını kontrol et
df -h

# Memory kullanımını kontrol et
free -h
```

### 16. 🔙 Geri Alma (Eğer Gerekirse)
```bash
# Önceki commit'e geri dön
git log --oneline -5
git checkout COMMIT_HASH

# Veritabanını geri yükle
mysql -u root -p hoowell_network < backup_YYYYMMDD_HHMMSS.sql

# PM2'yi yeniden başlat
pm2 restart all
```

## 📊 Güncelleme Sonrası Kontrol Listesi

### ✅ Kontrol Edilecekler:
- [ ] Ana sayfa açılıyor
- [ ] Login sayfası 32" ekranda düzgün görünüyor
- [ ] Discovery video kartları responsive
- [ ] Session timeout 2 saat çalışıyor
- [ ] Liderlik havuzları kapak sistemi aktif
- [ ] Muhasebe paneli kayıt formu çalışıyor
- [ ] Tüm API endpoint'ler çalışıyor
- [ ] Database bağlantısı sağlam
- [ ] PM2 süreçleri stabil
- [ ] Nginx proxy çalışıyor

## 🔐 Güvenlik Kontrolleri

### 17. 🛡️ Son Güvenlik Kontrolleri
```bash
# Dosya izinlerini kontrol et
ls -la

# .env dosyasının güvenli olduğunu kontrol et
ls -la .env

# Upload klasörlerinin izinlerini kontrol et
ls -la uploads/

# Firewall durumunu kontrol et
ufw status
```

## 📝 Güncelleme Notları

### Yapılan Değişiklikler:
1. **Login Sayfası**: 32" ekran optimizasyonu
2. **Discovery Sayfası**: Video kartları responsive düzeltme
3. **Session Timeout**: 2 saat + activity reset sistemi
4. **Liderlik Havuzları**: Kapak sistemi + erişim kontrolü
5. **Muhasebe Paneli**: Ön kayıt sistemi + belge yükleme
6. **Turuncu Noktalar**: Login kartlarından kaldırıldı

### Yeni Özellikler:
- ✅ Responsive login tasarımı
- ✅ Gelişmiş session yönetimi
- ✅ Muhasebe bilgileri kayıt sistemi
- ✅ Liderlik havuzları erişim kontrolü
- ✅ Discovery video kartları optimizasyonu

## 🎯 Son Adımlar

### 18. 📈 Performans Optimizasyonu
```bash
# PM2 monitoring başlat
pm2 monit

# Sistem kaynaklarını optimize et
pm2 restart all --update-env
```

### 19. 📧 Bildirim (Opsiyonel)
```bash
# Güncelleme tamamlandı bildirimi
echo "Hoowell Network güncelleme tamamlandı - $(date)" | mail -s "Deployment Success" admin@hoowell.com
```

## ⚠️ Önemli Notlar

1. **Yedekleme**: Her zaman güncelleme öncesi yedek alın
2. **Test**: Güncelleme sonrası mutlaka test edin
3. **Monitoring**: İlk 24 saat sistem durumunu takip edin
4. **Rollback**: Sorun durumunda hızlıca geri alma planınız olsun
5. **Documentation**: Yapılan değişiklikleri kaydedin

## 🆘 Acil Durum İletişim

Sorun yaşarsanız:
1. PM2 loglarını kontrol edin
2. Nginx error loglarını inceleyin
3. Database bağlantısını test edin
4. Gerekirse önceki versiyona geri dönün

**Başarılar! 🚀**