# 🔄 Güvenli Sunucu Güncelleme Rehberi

## ADIM 1: Sunucuya Bağlanın
```bash
ssh root@hoowell.net
# veya
ssh username@hoowell.net
```

## ADIM 2: Mevcut Durumu Kontrol Edin
```bash
# Hangi dizinde olduğunuzu kontrol edin
pwd

# Proje dizinine gidin (muhtemelen şu konumlardan biri)
cd /var/www/hoowell_son
# veya
cd /home/username/hoowell_son
# veya
cd /root/hoowell_son

# Mevcut git durumunu kontrol edin
git status
git branch
```

## ADIM 3: Veritabanı Backup Alın (ÇOK ÖNEMLİ!)
```bash
# Backup dizini oluşturun
mkdir -p backups

# Veritabanı backup alın
mysqldump -u root -p hoowell_network > backups/backup_$(date +%Y%m%d_%H%M%S).sql

# Backup'ın oluştuğunu kontrol edin
ls -la backups/
```

## ADIM 4: Mevcut Servisleri Durdurun
```bash
# PM2 ile çalışan servisleri kontrol edin
pm2 list

# Servisleri durdurun (ama silmeyin)
pm2 stop all

# Nginx'i durdurun (opsiyonel)
sudo systemctl stop nginx
```

## ADIM 5: Mevcut Kodu Yedekleyin
```bash
# Mevcut kodu yedekleyin
cp -r . ../hoowell_son_backup_$(date +%Y%m%d_%H%M%S)

# Yedek oluştuğunu kontrol edin
ls -la ../
```

## ADIM 6: Git'ten Yeni Kodları Çekin
```bash
# Mevcut değişiklikleri stash'leyin (eğer varsa)
git stash

# Ana branch'e geçin
git checkout main

# En son kodları çekin
git pull origin main

# Çekilen değişiklikleri kontrol edin
git log --oneline -5
```

## ADIM 7: Dependencies Güncelleyin
```bash
# Backend dependencies
npm install

# Frontend dependencies
cd frontend
npm install
cd ..
```

## ADIM 8: Frontend Build Yapın
```bash
cd frontend
npm run build
cd ..
```

## ADIM 9: Veritabanı Migration'larını Çalıştırın
```bash
# Yeni migration dosyalarını çalıştırın
mysql -u root -p hoowell_network < backend/fix_customers_table.sql
mysql -u root -p hoowell_network < backend/create_settings_table.sql  
mysql -u root -p hoowell_network < backend/fix_payments_table.sql

# Veritabanı yapısını kontrol edin
mysql -u root -p hoowell_network -e "DESCRIBE customers;"
mysql -u root -p hoowell_network -e "DESCRIBE payments;"
mysql -u root -p hoowell_network -e "DESCRIBE settings;"
```

## ADIM 10: Environment Dosyasını Kontrol Edin
```bash
# Mevcut .env dosyasını kontrol edin
cat .env

# Eğer .env yoksa, production template'den oluşturun
if [ ! -f .env ]; then
    cp .env.production .env
    echo "⚠️  .env dosyası oluşturuldu, lütfen düzenleyin!"
fi
```

## ADIM 11: Servisleri Yeniden Başlatın
```bash
# PM2 ile servisleri başlatın
pm2 restart all

# Eğer PM2'de servis yoksa, yeni başlatın
pm2 start backend/server.js --name hoowell-backend

# Servis durumunu kontrol edin
pm2 status
pm2 logs hoowell-backend --lines 20
```

## ADIM 12: Nginx'i Başlatın
```bash
# Nginx konfigürasyonunu test edin
sudo nginx -t

# Nginx'i başlatın
sudo systemctl start nginx
sudo systemctl status nginx
```

## ADIM 13: Test Edin
```bash
# Backend API test
curl http://localhost:5001/api/test || echo "API test endpoint yok"

# Frontend test
curl http://hoowell.net || curl http://localhost

# PM2 loglarını kontrol edin
pm2 logs hoowell-backend --lines 10
```

## ADIM 14: Sorun Varsa Geri Dönüş
```bash
# Eğer sorun varsa, yedekten geri dönün
# pm2 stop all
# rm -rf ./*
# cp -r ../hoowell_son_backup_YYYYMMDD_HHMMSS/* .
# pm2 restart all
```

## ✅ Başarı Kontrol Listesi
- [ ] Veritabanı backup alındı
- [ ] Kod yedeklendi  
- [ ] Git pull başarılı
- [ ] Dependencies yüklendi
- [ ] Frontend build yapıldı
- [ ] Database migration'lar çalıştı
- [ ] PM2 servisleri çalışıyor
- [ ] Nginx çalışıyor
- [ ] Site erişilebilir
- [ ] PayTR test edildi