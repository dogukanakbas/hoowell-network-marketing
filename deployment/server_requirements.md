# Sunucu Gereksinimleri ve Kontrol Listesi

## 🖥️ Sunucu Özellikleri
**Lütfen aşağıdaki bilgileri kontrol edin:**

### Sistem Gereksinimleri:
- [ ] **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- [ ] **RAM**: Minimum 2GB (Önerilen 4GB+)
- [ ] **Disk**: Minimum 20GB boş alan
- [ ] **CPU**: 2 core önerilen

### Kurulu Olması Gerekenler:
- [ ] **Node.js**: v16+ (kontrol: `node --version`)
- [ ] **npm**: v8+ (kontrol: `npm --version`)
- [ ] **MySQL**: v8.0+ (kontrol: `mysql --version`)
- [ ] **Nginx**: v1.18+ (kontrol: `nginx -v`)
- [ ] **Git**: (kontrol: `git --version`)

### Ağ Ayarları:
- [ ] **Port 80**: HTTP için açık
- [ ] **Port 443**: HTTPS için açık
- [ ] **Port 3306**: MySQL için açık (sadece localhost)
- [ ] **Port 5001**: Backend API için açık

### Domain Ayarları:
- [ ] **DNS A Record**: hoowell.net → Sunucu IP
- [ ] **DNS A Record**: www.hoowell.net → Sunucu IP
- [ ] **SSL Sertifikası**: Let's Encrypt ile kurulacak

## 🔧 Kurulum Öncesi Kontrol Komutları

```bash
# Sistem bilgileri
uname -a
free -h
df -h

# Gerekli yazılımlar
node --version
npm --version
mysql --version
nginx -v
git --version

# Port kontrolü
sudo netstat -tlnp | grep -E ':(80|443|3306|5001)'

# MySQL bağlantı testi
mysql -u root -p -e "SELECT VERSION();"
```

## 📋 Deployment Checklist

### Öncesi:
- [ ] Sunucu gereksinimlerini kontrol et
- [ ] PayTR merchant bilgilerini al
- [ ] Email SMTP ayarlarını hazırla
- [ ] Database backup al

### Sırasında:
- [ ] SSL sertifikası kur
- [ ] Nginx konfigüre et
- [ ] Environment variables ayarla
- [ ] Database migration çalıştır
- [ ] PM2 ile servisi başlat

### Sonrası:
- [ ] PayTR panel ayarlarını güncelle
- [ ] Email gönderimini test et
- [ ] Ödeme akışını test et
- [ ] Monitoring kur