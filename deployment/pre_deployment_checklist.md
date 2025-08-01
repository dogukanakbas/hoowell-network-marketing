# 📋 DEPLOYMENT ÖNCESİ CHECKLİST

## 🎯 Bu listeyi deployment öncesi mutlaka kontrol edin!

### ✅ **SUNUCU GEREKSİNİMLERİ**

#### Sistem Gereksinimleri:
- [ ] **Ubuntu 20.04+ / CentOS 8+** işletim sistemi
- [ ] **En az 2GB RAM** (4GB önerilir)
- [ ] **En az 20GB disk alanı** (50GB önerilir)
- [ ] **Node.js 18+** kurulu
- [ ] **MySQL 8.0+** kurulu
- [ ] **Nginx** kurulu
- [ ] **PM2** kurulu (`npm install -g pm2`)
- [ ] **Git** kurulu (eğer git kullanıyorsanız)

#### Network Gereksinimleri:
- [ ] **80 portu** açık (HTTP)
- [ ] **443 portu** açık (HTTPS)
- [ ] **5001 portu** açık (Backend API)
- [ ] **Domain DNS** ayarları yapılmış
- [ ] **SSL sertifikası** hazır (Let's Encrypt önerilir)

---

### 🔐 **GÜVENLİK AYARLARI**

#### Database Güvenliği:
- [ ] **MySQL root şifresi** güçlü
- [ ] **Yeni database kullanıcısı** oluşturulmuş
- [ ] **Database kullanıcı izinleri** sınırlandırılmış
- [ ] **Remote database erişimi** kapatılmış (gerekli değilse)

#### Sistem Güvenliği:
- [ ] **Firewall (UFW)** aktif
- [ ] **SSH key authentication** aktif
- [ ] **Root login** devre dışı
- [ ] **Fail2ban** kurulu (önerilir)
- [ ] **Automatic security updates** aktif

#### Uygulama Güvenliği:
- [ ] **JWT secret** güçlü ve unique
- [ ] **Database şifreleri** güçlü
- [ ] **Email şifreleri** güvenli
- [ ] **.env dosyası** git'e eklenmemiş

---

### 💾 **BACKUP STRATEJİSİ**

#### Mevcut Sistem Backup'ı:
- [ ] **Mevcut database** tam backup alınmış
- [ ] **Mevcut dosyalar** backup alınmış
- [ ] **Backup dosyaları** güvenli yerde saklanıyor
- [ ] **Backup restore testi** yapılmış

#### Otomatik Backup Sistemi:
- [ ] **Günlük database backup** planlanmış
- [ ] **Haftalık full backup** planlanmış
- [ ] **Backup retention policy** belirlenmiş
- [ ] **Backup monitoring** kurulmuş

---

### 🌐 **DOMAIN VE DNS**

#### Domain Ayarları:
- [ ] **A record** sunucu IP'sine yönlendiriliyor
- [ ] **www subdomain** ana domain'e yönlendiriliyor
- [ ] **DNS propagation** tamamlanmış (24-48 saat)
- [ ] **Domain expiry date** kontrol edilmiş

#### SSL Sertifikası:
- [ ] **Let's Encrypt** kurulumu planlanmış
- [ ] **Certbot** kurulu
- [ ] **Auto-renewal** ayarlanacak
- [ ] **HTTPS redirect** yapılacak

---

### 📁 **PROJE DOSYALARI**

#### Kod Hazırlığı:
- [ ] **Tüm kod değişiklikleri** commit edilmiş
- [ ] **Production branch** hazır
- [ ] **Dependencies** güncel
- [ ] **Build process** test edilmiş

#### Konfigürasyon Dosyaları:
- [ ] **Production .env** hazırlanmış
- [ ] **Database connection strings** doğru
- [ ] **API endpoints** production URL'leri
- [ ] **Email settings** production ayarları

#### Static Assets:
- [ ] **Images** optimize edilmiş
- [ ] **CSS/JS** minify edilmiş
- [ ] **Font files** dahil edilmiş
- [ ] **Favicon** eklenmiş

---

### 🗄️ **DATABASE HAZIRLIĞI**

#### Mevcut Veri Kontrolü:
- [ ] **Kullanıcı sayısı** tespit edilmiş
- [ ] **Kritik tablolar** listelenmiş
- [ ] **Veri tutarlılığı** kontrol edilmiş
- [ ] **Foreign key constraints** kontrol edilmiş

#### Migration Planı:
- [ ] **Migration script** hazırlanmış
- [ ] **Rollback plan** hazırlanmış
- [ ] **Test database'de** migration test edilmiş
- [ ] **Downtime süresi** hesaplanmış

---

### 🔧 **DEPLOYMENT ARAÇLARI**

#### Otomatik Deployment:
- [ ] **Deployment script** hazırlanmış
- [ ] **Environment variables** ayarlanmış
- [ ] **Build process** otomatikleştirilmiş
- [ ] **Health check** endpoints hazır

#### Monitoring:
- [ ] **PM2 monitoring** kurulacak
- [ ] **Nginx logs** monitoring
- [ ] **Database performance** monitoring
- [ ] **Error tracking** sistemi (Sentry vb.)

---

### 👥 **TEAM HAZIRLIĞI**

#### Deployment Team:
- [ ] **Deployment sorumlusu** atanmış
- [ ] **Database admin** hazır
- [ ] **DevOps engineer** hazır
- [ ] **Backup sorumlusu** atanmış

#### İletişim Planı:
- [ ] **Deployment zamanı** duyurulmuş
- [ ] **Downtime window** planlanmış
- [ ] **Emergency contacts** hazırlanmış
- [ ] **Rollback criteria** belirlenmiş

---

### 📊 **TEST PLANI**

#### Pre-deployment Tests:
- [ ] **Unit tests** geçiyor
- [ ] **Integration tests** geçiyor
- [ ] **Database migration** test edilmiş
- [ ] **Build process** test edilmiş

#### Post-deployment Tests:
- [ ] **Health check** endpoints
- [ ] **User login** testi
- [ ] **Critical features** testi
- [ ] **Performance** testi

---

### 🚨 **ACİL DURUM PLANI**

#### Rollback Stratejisi:
- [ ] **Database rollback** script hazır
- [ ] **Code rollback** planı hazır
- [ ] **DNS rollback** planı hazır
- [ ] **Rollback test** yapılmış

#### Emergency Contacts:
- [ ] **System admin** iletişim bilgileri
- [ ] **Database admin** iletişim bilgileri
- [ ] **Domain provider** destek bilgileri
- [ ] **Hosting provider** destek bilgileri

---

### 📝 **DOKÜMANTASYON**

#### Deployment Dokümantasyonu:
- [ ] **Step-by-step guide** hazırlanmış
- [ ] **Configuration files** dokümante edilmiş
- [ ] **Troubleshooting guide** hazırlanmış
- [ ] **Post-deployment checklist** hazırlanmış

#### Operational Dokümantasyonu:
- [ ] **Monitoring guide** hazırlanmış
- [ ] **Backup/restore procedures** dokümante edilmiş
- [ ] **Maintenance procedures** hazırlanmış
- [ ] **Emergency procedures** dokümante edilmiş

---

## 🎯 **DEPLOYMENT GÜNÜ CHECKLİST**

### Deployment Öncesi (T-2 saat):
- [ ] **Tüm team members** hazır
- [ ] **Final backup** alınmış
- [ ] **Maintenance page** hazırlanmış
- [ ] **Monitoring tools** aktif

### Deployment Sırasında (T-0):
- [ ] **Maintenance mode** aktif
- [ ] **Database migration** başlatılmış
- [ ] **Code deployment** başlatılmış
- [ ] **Services restart** yapılmış

### Deployment Sonrası (T+1 saat):
- [ ] **Health checks** geçiyor
- [ ] **Critical features** çalışıyor
- [ ] **Performance** normal
- [ ] **Maintenance mode** kapatılmış

### Post-deployment (T+24 saat):
- [ ] **System stability** kontrol edilmiş
- [ ] **Error logs** kontrol edilmiş
- [ ] **Performance metrics** normal
- [ ] **User feedback** toplanmış

---

## ✅ **FINAL ONAY**

Bu checklist'teki tüm maddeler tamamlandıktan sonra deployment'a başlayabilirsiniz.

**Deployment Sorumlusu İmzası:** _________________ **Tarih:** _________

**Database Admin İmzası:** _________________ **Tarih:** _________

**DevOps Engineer İmzası:** _________________ **Tarih:** _________

---

**🚨 HATIRLATMA:** Bu checklist'i atlamamak kritik önem taşır. Her madde sistem güvenliği ve veri bütünlüğü için gereklidir!