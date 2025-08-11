# 🚀 SUNUCU İŞ ORTAĞI KAYIT HATASI DÜZELTİM REHBERİ

## 📋 Sunucuda GitHub'dan Çektikten Sonra Yapılacaklar

### 🔧 ADIM 1: Veritabanı Kolonlarını Ekle

#### A) Sunucuya SSH ile bağlan
```bash
ssh your-username@your-server-ip
cd /path/to/your/project
```

#### B) Migration script'ini çalıştır
```bash
# Önce backup al
mysqldump -u root -p hoowell_network > backup_$(date +%Y%m%d_%H%M%S).sql

# Migration script'ini çalıştır
mysql -u root -p hoowell_network < backend/safe_add_partner_columns.sql
```

#### C) Veritabanı durumunu kontrol et
```bash
mysql -u root -p hoowell_network -e "SELECT COUNT(*) as column_count FROM information_schema.columns WHERE table_schema = 'hoowell_network' AND table_name = 'users';"
```

### 🔧 ADIM 2: Backend Server.js Dosyasını Kontrol Et

#### A) INSERT sorgusunu kontrol et
```bash
grep -A 10 "INSERT INTO users" backend/server.js | grep -A 5 "VALUES"
```

#### B) Eğer VALUES kısmında 34 parametre varsa düzelt:
```bash
# Dosyayı düzenle
nano backend/server.js
```

**Aranacak satır (2324. satır civarı):**
```javascript
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
```

**Değiştirilecek satır (36 parametre olmalı):**
```javascript
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
```

### 🔧 ADIM 3: Otomatik Düzeltme Script'i

Eğer manuel düzeltmek istemiyorsan, bu script'i kullan:

```bash
# Otomatik düzeltme script'i oluştur
cat > fix_partner_registration.sh << 'EOF'
#!/bin/bash

echo "🚀 İş Ortağı Kayıt Hatası Düzeltiliyor..."

# 1. Backup al
echo "📦 Backup alınıyor..."
mysqldump -u root -p hoowell_network > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Veritabanı kolonlarını ekle
echo "🗄️ Veritabanı kolonları ekleniyor..."
mysql -u root -p hoowell_network < backend/safe_add_partner_columns.sql

# 3. Backend dosyasını düzelt
echo "🔧 Backend dosyası düzeltiliyor..."
sed -i 's/) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`/) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`/g' backend/server.js

# 4. PM2 restart
echo "🔄 Backend yeniden başlatılıyor..."
pm2 restart hoowell-backend

echo "✅ Düzeltme tamamlandı!"
EOF

# Script'i çalıştırılabilir yap
chmod +x fix_partner_registration.sh

# Script'i çalıştır
./fix_partner_registration.sh
```

### 🔧 ADIM 4: Manuel Kontrol ve Test

#### A) Backend loglarını kontrol et
```bash
pm2 logs hoowell-backend
```

#### B) Veritabanı bağlantısını test et
```bash
mysql -u root -p hoowell_network -e "DESCRIBE users;" | grep -E "(country_code|partner_type|registration_type)"
```

#### C) İş ortağı kayıt işlemini test et
```bash
# Test endpoint'i
curl -X POST http://localhost:5001/api/partner/register-new \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "registration_type": "individual",
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "phone": "5551234567",
    "country_code": "+90"
  }'
```

### 🔧 ADIM 5: Production Ayarları

#### A) Nginx konfigürasyonunu kontrol et
```bash
sudo nginx -t
sudo systemctl reload nginx
```

#### B) SSL sertifikasını kontrol et
```bash
sudo certbot certificates
```

#### C) Firewall ayarlarını kontrol et
```bash
sudo ufw status
```

## 🚨 SORUN GİDERME

### Hata 1: "Column count doesn't match value count"
**Çözüm:**
```bash
# Backend server.js dosyasındaki VALUES kısmını kontrol et
grep -n "VALUES.*?" backend/server.js | grep "partner"
# 36 parametre olmalı (?, ?, ?, ... 36 adet)
```

### Hata 2: "Unknown column 'country_code'"
**Çözüm:**
```bash
# Migration script'ini tekrar çalıştır
mysql -u root -p hoowell_network < backend/safe_add_partner_columns.sql
```

### Hata 3: "Duplicate column name"
**Çözüm:**
```bash
# Normal, bazı kolonlar zaten mevcut
# Migration script güvenli, hata vermez
```

### Hata 4: PM2 başlatma sorunu
**Çözüm:**
```bash
# PM2'yi yeniden başlat
pm2 delete hoowell-backend
pm2 start backend/server.js --name hoowell-backend
pm2 save
```

## 📊 KONTROL LİSTESİ

### Veritabanı Kontrolleri:
- [ ] `country_code` kolonu mevcut
- [ ] `partner_type` kolonu mevcut
- [ ] `registration_type` kolonu mevcut
- [ ] `contract1_accepted` - `contract5_accepted` kolonları mevcut
- [ ] Toplam 48 kolon var

### Backend Kontrolleri:
- [ ] INSERT sorgusunda 36 kolon var
- [ ] VALUES kısmında 36 parametre var
- [ ] PM2 çalışıyor
- [ ] Port 5001 açık

### Frontend Kontrolleri:
- [ ] Ülke kodu seçimi çalışıyor
- [ ] Form gönderimi başarılı
- [ ] Hata mesajları doğru

## 🎯 BAŞARILI SONUÇ

Bu adımları tamamladıktan sonra:
- ✅ İş ortağı kayıt sistemi çalışacak
- ✅ Ülke kodu seçimi aktif olacak
- ✅ Bireysel ve kurumsal kayıt seçenekleri çalışacak
- ✅ Tüm form verileri kaydedilecek

## 📞 DESTEK

Sorun yaşarsan:
1. PM2 loglarını kontrol et: `pm2 logs hoowell-backend`
2. Nginx loglarını kontrol et: `sudo tail -f /var/log/nginx/error.log`
3. MySQL loglarını kontrol et: `sudo tail -f /var/log/mysql/error.log`

**Not:** Bu rehber sunucuda production ortamında güvenli şekilde uygulanabilir.