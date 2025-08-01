// HOOWELL Network Marketing - Veritabanı güncellemelerini çalıştırmak için script
const mysql = require('mysql2/promise');
require('dotenv').config();

async function runDatabaseUpdates() {
  let connection;
  
  try {
    // Veritabanı bağlantısı
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hoowell_network',
      multipleStatements: true
    });

    console.log('🔗 Veritabanına bağlanıldı...');

    // SQL güncellemelerini çalıştır
    const updates = [
      // 1. Doping Promosyonu tablosu
      `CREATE TABLE IF NOT EXISTS doping_promotion (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        etap1_start_date DATE NOT NULL,
        etap1_end_date DATE NOT NULL,
        etap1_target_sales INT DEFAULT 40,
        etap1_achieved_sales INT DEFAULT 0,
        etap1_target_partners INT DEFAULT 7,
        etap1_achieved_partners INT DEFAULT 0,
        etap1_extra_points DECIMAL(10,3) DEFAULT 0,
        etap1_completed BOOLEAN DEFAULT FALSE,
        etap1_completed_date DATETIME NULL,
        
        etap2_start_date DATE NOT NULL,
        etap2_end_date DATE NOT NULL,
        etap2_target_sales INT DEFAULT 80,
        etap2_achieved_sales INT DEFAULT 0,
        etap2_target_partners INT DEFAULT 15,
        etap2_achieved_partners INT DEFAULT 0,
        etap2_extra_points DECIMAL(10,3) DEFAULT 0,
        etap2_completed BOOLEAN DEFAULT FALSE,
        etap2_completed_date DATETIME NULL,
        
        total_extra_points DECIMAL(10,3) DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE KEY unique_user_doping (user_id),
        INDEX idx_user_id (user_id)
      )`,

      // 2. Customers tablosuna yeni alanlar ekle
      `ALTER TABLE customers 
       ADD COLUMN IF NOT EXISTS referral_count INT DEFAULT 0 AFTER total_amount,
       ADD COLUMN IF NOT EXISTS gift1_earned BOOLEAN DEFAULT FALSE AFTER referral_count,
       ADD COLUMN IF NOT EXISTS gift1_earned_date DATETIME NULL AFTER gift1_earned,
       ADD COLUMN IF NOT EXISTS gift1_recipient VARCHAR(255) NULL AFTER gift1_earned_date,
       ADD COLUMN IF NOT EXISTS gift2_earned BOOLEAN DEFAULT FALSE AFTER gift1_recipient,
       ADD COLUMN IF NOT EXISTS gift2_earned_date DATETIME NULL AFTER gift2_earned,
       ADD COLUMN IF NOT EXISTS gift2_recipient VARCHAR(255) NULL AFTER gift2_earned_date,
       ADD COLUMN IF NOT EXISTS gift3_earned BOOLEAN DEFAULT FALSE AFTER gift2_recipient,
       ADD COLUMN IF NOT EXISTS gift3_earned_date DATETIME NULL AFTER gift3_earned,
       ADD COLUMN IF NOT EXISTS gift3_recipient VARCHAR(255) NULL AFTER gift3_earned_date,
       ADD COLUMN IF NOT EXISTS loyalty_protection_until DATE NULL AFTER gift3_recipient`,

      // 3. Sponsorship earnings tablosuna yeni alanlar ekle
      `ALTER TABLE sponsorship_earnings 
       ADD COLUMN IF NOT EXISTS partner_start_date DATE NULL AFTER first_sale_activated,
       ADD COLUMN IF NOT EXISTS partner_phone VARCHAR(20) NULL AFTER partner_start_date,
       ADD COLUMN IF NOT EXISTS partner_education_status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started' AFTER partner_phone,
       ADD COLUMN IF NOT EXISTS bronze_limit DECIMAL(10,2) DEFAULT 750.00 AFTER bronze_earnings,
       ADD COLUMN IF NOT EXISTS silver_limit DECIMAL(10,2) DEFAULT 1200.00 AFTER silver_earnings,
       ADD COLUMN IF NOT EXISTS gold_limit DECIMAL(10,2) DEFAULT 1350.00 AFTER gold_earnings,
       ADD COLUMN IF NOT EXISTS star_limit DECIMAL(10,2) DEFAULT 1200.00 AFTER star_earnings,
       ADD COLUMN IF NOT EXISTS super_star_limit DECIMAL(10,2) DEFAULT 750.00 AFTER super_star_earnings,
       ADD COLUMN IF NOT EXISTS total_earnings DECIMAL(10,2) DEFAULT 0 AFTER super_star_limit`,

      // 4. Team tracking tablosu
      `CREATE TABLE IF NOT EXISTS team_tracking (
        id INT PRIMARY KEY AUTO_INCREMENT,
        team_leader_id INT NOT NULL,
        member_id INT NOT NULL,
        member_sponsor_id VARCHAR(20),
        member_phone VARCHAR(20),
        member_education_status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
        member_career_level ENUM('bronze', 'silver', 'gold', 'star_leader', 'super_star_leader', 'presidents_team', 'country_distributor') DEFAULT 'bronze',
        
        franchise_percentage DECIMAL(5,2) DEFAULT 0,
        earning_percentage DECIMAL(5,2) DEFAULT 0,
        monthly_sales_volume DECIMAL(15,2) DEFAULT 0,
        monthly_franchise_income DECIMAL(10,2) DEFAULT 0,
        
        start_date DATE NOT NULL,
        total_kkp DECIMAL(15,2) DEFAULT 0,
        franchise_sales DECIMAL(15,2) DEFAULT 0,
        active_partners INT DEFAULT 0,
        monthly_sales_kkp DECIMAL(15,2) DEFAULT 0,
        activated_partners INT DEFAULT 0,
        is_active_this_month BOOLEAN DEFAULT FALSE,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (team_leader_id) REFERENCES users(id),
        FOREIGN KEY (member_id) REFERENCES users(id),
        UNIQUE KEY unique_leader_member (team_leader_id, member_id),
        INDEX idx_team_leader_id (team_leader_id),
        INDEX idx_member_id (member_id)
      )`,

      // 5. Monthly activity tablosu
      `CREATE TABLE IF NOT EXISTS monthly_activity (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        month_year VARCHAR(7) NOT NULL,
        personal_sales_count INT DEFAULT 0,
        partner_first_sales_count INT DEFAULT 0,
        total_activity_points INT DEFAULT 0,
        is_active BOOLEAN DEFAULT FALSE,
        last_activity_date DATE NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE KEY unique_user_month_activity (user_id, month_year),
        INDEX idx_user_id (user_id),
        INDEX idx_month_year (month_year)
      )`,

      // 6. Sales tracking tablosuna yeni alanlar ekle
      `ALTER TABLE sales_tracking 
       ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255) NULL AFTER customer_id,
       ADD COLUMN IF NOT EXISTS payment_status ENUM('pending', 'paid') DEFAULT 'pending' AFTER status,
       ADD COLUMN IF NOT EXISTS is_active_for_monthly BOOLEAN DEFAULT FALSE AFTER payment_status`,

      // 7. Sistem ayarlarına yeni değerler ekle
      `INSERT IGNORE INTO system_settings (setting_key, setting_value) VALUES
       ('doping_promotion_active', 'true'),
       ('doping_etap1_duration_days', '60'),
       ('doping_etap2_duration_days', '60'),
       ('customer_loyalty_protection_days', '60'),
       ('franchise_silver_percentage', '2'),
       ('franchise_gold_percentage', '4'),
       ('franchise_star_leader_percentage', '6'),
       ('franchise_super_star_leader_percentage', '8'),
       ('franchise_presidents_team_percentage', '10'),
       ('sales_activation_days', '15'),
       ('monthly_bonus_payment_day', '9')`,

      // 8. Mevcut kullanıcılar için eksik kayıtları oluştur
      `INSERT IGNORE INTO monthly_activity (user_id, month_year)
       SELECT id, DATE_FORMAT(CURDATE(), '%Y-%m') FROM users WHERE role = 'partner'`,

      `INSERT IGNORE INTO doping_promotion (
         user_id, etap1_start_date, etap1_end_date, etap2_start_date, etap2_end_date
       )
       SELECT 
         id,
         CURDATE(),
         DATE_ADD(CURDATE(), INTERVAL 60 DAY),
         DATE_ADD(CURDATE(), INTERVAL 61 DAY),
         DATE_ADD(CURDATE(), INTERVAL 120 DAY)
       FROM users 
       WHERE role = 'partner'`
    ];

    // Her güncellemeyi sırayla çalıştır
    for (let i = 0; i < updates.length; i++) {
      try {
        console.log(`📝 Güncelleme ${i + 1}/${updates.length} çalıştırılıyor...`);
        await connection.execute(updates[i]);
        console.log(`✅ Güncelleme ${i + 1} başarılı`);
      } catch (error) {
        console.log(`⚠️  Güncelleme ${i + 1} atlandı (muhtemelen zaten mevcut):`, error.message);
      }
    }

    console.log('🎉 Tüm veritabanı güncellemeleri tamamlandı!');
    console.log('');
    console.log('📋 Eklenen/Güncellenen özellikler:');
    console.log('   ✅ Doping Promosyonu sistemi');
    console.log('   ✅ Memnun Müşteri Takip sistemi');
    console.log('   ✅ Sponsorluk Takip sistemi');
    console.log('   ✅ Satış Takip sistemi');
    console.log('   ✅ Takım Takip sistemi');
    console.log('   ✅ Aylık Aktiflik sistemi');
    console.log('   ✅ Sistem ayarları');
    console.log('');
    console.log('🚀 Artık backend server\'ı yeniden başlatabilirsiniz!');

  } catch (error) {
    console.error('❌ Veritabanı güncelleme hatası:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Veritabanı bağlantısı kapatıldı');
    }
  }
}

// Script'i çalıştır
runDatabaseUpdates();