#!/bin/bash

echo "=== HOOWELL SUNUCU YENİLEME REHBERİ ==="
echo "Bu script veri kaybını önleyerek sunucuyu yeniler"
echo ""

# 1. VERİTABANI YEDEKLEME
echo "1. Veritabanı yedekleniyor..."
mysqldump -u root -p hoowell > /root/hoowell_backup_$(date +%Y%m%d_%H%M%S).sql
echo "✅ Veritabanı yedeklendi"

# 2. DOSYA YEDEKLEME
echo "2. Dosyalar yedekleniyor..."
tar -czf /root/hoowell_files_backup_$(date +%Y%m%d_%H%M%S).tar.gz /root/hoowell
echo "✅ Dosyalar yedeklendi"

# 3. NGINX KONFİGÜRASYONU YEDEKLEME
echo "3. Nginx konfigürasyonu yedekleniyor..."
cp /etc/nginx/sites-available/hoowell /root/nginx_backup_$(date +%Y%m%d_%H%M%S).conf
echo "✅ Nginx konfigürasyonu yedeklendi"

# 4. PM2 PROCESS LİSTESİ
echo "4. PM2 process listesi kaydediliyor..."
pm2 list > /root/pm2_backup_$(date +%Y%m%d_%H%M%S).txt
echo "✅ PM2 listesi kaydedildi"

echo ""
echo "=== YEDEKLEME TAMAMLANDI ==="
echo "Yedekler /root/ klasöründe saklandı"
echo ""

# 5. GİT PULL
echo "5. GitHub'dan güncel kodlar çekiliyor..."
cd /root/hoowell
git stash
git pull origin main
echo "✅ Kodlar güncellendi"

# 6. BACKEND KURULUMU
echo "6. Backend bağımlılıkları kuruluyor..."
cd /root/hoowell/backend
npm install
echo "✅ Backend bağımlılıkları kuruldu"

# 7. FRONTEND KURULUMU
echo "7. Frontend bağımlılıkları kuruluyor..."
cd /root/hoowell/frontend
npm install
echo "✅ Frontend bağımlılıkları kuruldu"

# 8. FRONTEND BUILD
echo "8. Frontend build ediliyor..."
npm run build
echo "✅ Frontend build edildi"

# 9. NGINX KONFİGÜRASYONU GÜNCELLE
echo "9. Nginx konfigürasyonu güncelleniyor..."
cp /root/hoowell/nginx_subdomain.conf /etc/nginx/sites-available/hoowell
nginx -t
if [ $? -eq 0 ]; then
    systemctl restart nginx
    echo "✅ Nginx güncellendi ve restart edildi"
else
    echo "❌ Nginx syntax hatası!"
    exit 1
fi

# 10. PM2 RESTART
echo "10. PM2 processleri restart ediliyor..."
pm2 restart all
echo "✅ PM2 processleri restart edildi"

# 11. DOSYA İZİNLERİ
echo "11. Dosya izinleri ayarlanıyor..."
chmod -R 755 /root/hoowell/frontend/build
chmod -R 755 /root/hoowell/uploads
chmod -R 755 /root/hoowell/hoowell_web
chown -R www-data:www-data /root/hoowell/uploads
echo "✅ Dosya izinleri ayarlandı"

# 12. SSL SERTİFİKASI (Panel subdomain için)
echo "12. SSL sertifikası kontrol ediliyor..."
certbot --nginx -d panel.hoowell.net --non-interactive --agree-tos --email admin@hoowell.net
echo "✅ SSL sertifikası güncellendi"

echo ""
echo "=== SUNUCU YENİLEME TAMAMLANDI ==="
echo ""
echo "🔗 Ana Site: https://hoowell.net"
echo "🔗 Panel: https://panel.hoowell.net"
echo ""
echo "📋 Kontrol Listesi:"
echo "1. Ana site açılıyor mu? (https://hoowell.net)"
echo "2. Panel açılıyor mu? (https://panel.hoowell.net)"
echo "3. Giriş yapılabiliyor mu?"
echo "4. API çalışıyor mu?"
echo "5. Dosya yüklemeleri çalışıyor mu?"
echo ""
echo "❓ Sorun varsa: pm2 logs, nginx error.log kontrol et"
