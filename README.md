# HOOWELL Global Alkali İyonizer Sistemleri

Modern bir alkali iyonizer sistemleri platformu. React frontend, Node.js backend ve MySQL veritabanı kullanılarak geliştirilmiştir.

## Özellikler

### Kullanıcı Sistemi
- **Admin Panel**: 5 admin kullanıcısı ile sistem yönetimi
- **İş Ortağı Sistemi**: Bronze'dan Ülke Distribütörü'ne kadar 7 kariyer seviyesi
- **Genealoji Ağacı**: Network yapısının görselleştirilmesi

### Ödeme Sistemi
- **IBAN ile Ödeme**: Eğitim (100$) ve Cihaz (1800$) paketleri
- **Dekont Yükleme**: Ödeme belgelerinin sisteme yüklenmesi
- **Manuel Onay**: Admin panelinden ödeme onayları
- **Otomatik KDV Hesaplama**: %20 KDV dahil fiyatlandırma

### Eğitim Sistemi
- **10 Video Eğitimi**: Google Drive entegrasyonu
- **Sınav Sistemi**: Her video sonrası 10 soru, 7 doğru gerekli
- **Sıralı Erişim**: Önceki sınavı geçmeden sonraki videoya erişim yok
- **Backoffice Erişimi**: Tüm eğitimler tamamlandıktan sonra açılır

### Bonus Sistemleri
- **Kariyer Atlama Bonusları**: Tek seferlik bonuslar
- **Ortaklık Bonusu**: Alt seviye satışlarından komisyon
- **Franchise Ağı Kazançları**: Aylık network bonusları

## Kurulum

### Gereksinimler
- Node.js (v16+)
- MySQL (v8+)
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repo-url>
cd hoowell-network-marketing
```

2. **Bağımlılıkları yükleyin**
```bash
npm run install-all
```

3. **Veritabanını oluşturun**
```bash
# MySQL'e bağlanın ve database.sql dosyasını çalıştırın
mysql -u root -p < backend/database.sql
```

4. **Ortam değişkenlerini ayarlayın**
```bash
# .env dosyasını düzenleyin
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hoowell_network
```

5. **Uygulamayı başlatın**
```bash
npm run dev
```

## Varsayılan Giriş Bilgileri

### Admin Kullanıcıları
- **Kullanıcı Adı**: admin1, admin2, admin3, admin4, admin5
- **E-posta**: admin1@hoowell.com, admin2@hoowell.com, ...
- **Şifre**: password (tüm adminler için)

## API Endpoints

### Authentication
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Kullanıcı bilgileri

### Dashboard
- `GET /api/dashboard/stats` - Dashboard istatistikleri
- `GET /api/news` - Haberler

### Payments
- `POST /api/payments` - Ödeme kaydı oluşturma
- `GET /api/payments/my` - Kullanıcının ödemeleri

### Education
- `GET /api/videos` - Video listesi
- `GET /api/education/progress` - Eğitim ilerlemesi
- `POST /api/education/submit-exam` - Sınav gönderimi

### Admin
- `GET /api/admin/users` - Kullanıcı listesi
- `POST /api/admin/users` - Yeni kullanıcı oluşturma
- `GET /api/admin/payments` - Ödeme onayları
- `PUT /api/admin/payments/:id/approve` - Ödeme onaylama

## Teknoloji Stack

### Frontend
- React 18
- React Router DOM
- Axios
- CSS3 (Custom Design)

### Backend
- Node.js
- Express.js
- MySQL2
- JWT Authentication
- Multer (File Upload)
- bcryptjs (Password Hashing)

### Database
- MySQL 8.0
- Relational Database Design
- Foreign Key Constraints

## Proje Yapısı

```
hoowell-network-marketing/
├── backend/
│   ├── server.js          # Ana server dosyası
│   └── database.sql       # Veritabanı şeması
├── frontend/
│   ├── src/
│   │   ├── components/    # React bileşenleri
│   │   ├── context/       # Context API
│   │   └── App.js         # Ana uygulama
│   └── public/
├── uploads/
│   └── receipts/          # Dekont dosyaları
├── .env                   # Ortam değişkenleri
└── package.json           # Proje bağımlılıkları
```

## Geliştirme

### Frontend Geliştirme
```bash
cd frontend
npm start
```

### Backend Geliştirme
```bash
npm run server
```

### Eş Zamanlı Geliştirme
```bash
npm run dev
```

## Güvenlik

- JWT token tabanlı kimlik doğrulama
- Şifre hashleme (bcrypt)
- File upload güvenliği
- SQL injection koruması
- CORS yapılandırması

## Lisans

Bu proje özel mülkiyettir. Tüm hakları saklıdır.

## Destek

Teknik destek için: support@hoowell.com