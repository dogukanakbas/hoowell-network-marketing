const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Fetih1453',
  database: process.env.DB_NAME || 'hoowell_network'
});

async function checkAndFixDatabase() {
  try {
    console.log('🔍 Database bağlantısı kontrol ediliyor...');
    
    // Test connection
    await db.promise().execute('SELECT 1');
    console.log('✅ Database bağlantısı başarılı!');
    
    // Check and create missing tables
    const tables = [
      'user_profiles',
      'sponsorship_earnings', 
      'network_tree',
      'dashboard_stats',
      'exam_results',
      'video_completion_log',
      'user_activity_log'
    ];
    
    for (const table of tables) {
      try {
        const [result] = await db.promise().execute(`SHOW TABLES LIKE '${table}'`);
        if (result.length === 0) {
          console.log(`❌ ${table} tablosu eksik`);
        } else {
          console.log(`✅ ${table} tablosu mevcut`);
        }
      } catch (error) {
        console.log(`❌ ${table} kontrol hatası:`, error.message);
      }
    }
    
    // Check career_bonuses columns
    try {
      const [columns] = await db.promise().execute(`SHOW COLUMNS FROM career_bonuses`);
      const columnNames = columns.map(col => col.Field);
      
      const requiredColumns = ['bonus_amount_usd', 'bonus_amount_try', 'kkp_achieved', 'status', 'awarded_at'];
      
      console.log('\n📊 career_bonuses tablosu kolonları:');
      requiredColumns.forEach(col => {
        if (columnNames.includes(col)) {
          console.log(`✅ ${col} kolonu mevcut`);
        } else {
          console.log(`❌ ${col} kolonu eksik`);
        }
      });
      
    } catch (error) {
      console.log('❌ career_bonuses tablo kontrol hatası:', error.message);
    }
    
    // Check payments enum
    try {
      const [result] = await db.promise().execute(`SHOW COLUMNS FROM payments WHERE Field = 'payment_type'`);
      if (result.length > 0) {
        console.log('\n💳 payments.payment_type enum:', result[0].Type);
      }
    } catch (error) {
      console.log('❌ payments tablo kontrol hatası:', error.message);
    }
    
    console.log('\n🔧 Database düzeltme işlemi başlatılıyor...');
    
    // Fix payments enum
    try {
      await db.promise().execute(`ALTER TABLE payments MODIFY COLUMN payment_type ENUM('education', 'device', 'franchise') NOT NULL`);
      console.log('✅ payments.payment_type enum düzeltildi');
    } catch (error) {
      console.log('⚠️ payments enum düzeltme hatası:', error.message);
    }
    
    // Create user_profiles table
    try {
      await db.promise().execute(`
        CREATE TABLE IF NOT EXISTS user_profiles (
          id INT PRIMARY KEY AUTO_INCREMENT,
          user_id INT NOT NULL,
          profile_photo VARCHAR(255),
          join_date DATE NOT NULL,
          last_login DATETIME,
          total_sales DECIMAL(15,2) DEFAULT 0,
          monthly_sales DECIMAL(15,2) DEFAULT 0,
          team_size INT DEFAULT 0,
          active_team_members INT DEFAULT 0,
          personal_volume DECIMAL(15,2) DEFAULT 0,
          team_volume DECIMAL(15,2) DEFAULT 0,
          rank_qualification_date DATE,
          next_rank_target DECIMAL(15,2) DEFAULT 0,
          achievements JSON,
          notes TEXT,
          is_active_this_month BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          UNIQUE KEY unique_user_profile (user_id),
          INDEX idx_user_id (user_id),
          INDEX idx_join_date (join_date),
          INDEX idx_total_sales (total_sales)
        )
      `);
      console.log('✅ user_profiles tablosu oluşturuldu');
    } catch (error) {
      console.log('⚠️ user_profiles oluşturma hatası:', error.message);
    }
    
    // Create sponsorship_earnings table
    try {
      await db.promise().execute(`
        CREATE TABLE IF NOT EXISTS sponsorship_earnings (
          id INT PRIMARY KEY AUTO_INCREMENT,
          sponsor_id INT NOT NULL,
          partner_id INT NOT NULL,
          bronze_earnings DECIMAL(10,2) DEFAULT 0,
          silver_earnings DECIMAL(10,2) DEFAULT 0,
          gold_earnings DECIMAL(10,2) DEFAULT 0,
          star_earnings DECIMAL(10,2) DEFAULT 0,
          super_star_earnings DECIMAL(10,2) DEFAULT 0,
          monthly_earnings DECIMAL(10,2) DEFAULT 0,
          first_sale_activated BOOLEAN DEFAULT FALSE,
          activation_date DATETIME NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (sponsor_id) REFERENCES users(id),
          FOREIGN KEY (partner_id) REFERENCES users(id),
          UNIQUE KEY unique_sponsor_partner (sponsor_id, partner_id),
          INDEX idx_sponsor_id (sponsor_id),
          INDEX idx_partner_id (partner_id)
        )
      `);
      console.log('✅ sponsorship_earnings tablosu oluşturuldu');
    } catch (error) {
      console.log('⚠️ sponsorship_earnings oluşturma hatası:', error.message);
    }
    
    // Add missing columns to career_bonuses
    const careerBonusColumns = [
      { name: 'bonus_amount_usd', definition: 'DECIMAL(10,2) DEFAULT 0 AFTER bonus_amount' },
      { name: 'bonus_amount_try', definition: 'DECIMAL(10,2) DEFAULT 0 AFTER bonus_amount_usd' },
      { name: 'kkp_achieved', definition: 'DECIMAL(15,2) DEFAULT 0 AFTER kkp_threshold' },
      { name: 'status', definition: 'ENUM("pending", "paid") DEFAULT "pending" AFTER paid' },
      { name: 'awarded_at', definition: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER created_at' }
    ];
    
    for (const col of careerBonusColumns) {
      try {
        await db.promise().execute(`ALTER TABLE career_bonuses ADD COLUMN ${col.name} ${col.definition}`);
        console.log(`✅ career_bonuses.${col.name} kolonu eklendi`);
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`✅ career_bonuses.${col.name} kolonu zaten mevcut`);
        } else {
          console.log(`⚠️ career_bonuses.${col.name} ekleme hatası:`, error.message);
        }
      }
    }
    
    // Initialize user profiles for existing users
    try {
      await db.promise().execute(`
        INSERT IGNORE INTO user_profiles (user_id, join_date, total_sales, team_size, is_active_this_month)
        SELECT id, DATE(created_at), 0, 0, FALSE 
        FROM users 
        WHERE role = 'partner'
      `);
      console.log('✅ Mevcut kullanıcılar için profiller oluşturuldu');
    } catch (error) {
      console.log('⚠️ Profil oluşturma hatası:', error.message);
    }
    
    // Initialize sponsorship earnings
    try {
      await db.promise().execute(`
        INSERT IGNORE INTO sponsorship_earnings (sponsor_id, partner_id, bronze_earnings, silver_earnings, gold_earnings, star_earnings, super_star_earnings, monthly_earnings, first_sale_activated)
        SELECT 
          u1.id as sponsor_id,
          u2.id as partner_id,
          0, 0, 0, 0, 0, 0, FALSE
        FROM users u1
        JOIN users u2 ON u2.created_by = u1.id
        WHERE u1.role = 'partner' AND u2.role = 'partner'
      `);
      console.log('✅ Mevcut ilişkiler için sponsorluk kazançları oluşturuldu');
    } catch (error) {
      console.log('⚠️ Sponsorluk kazançları oluşturma hatası:', error.message);
    }
    
    console.log('\n🎉 Database düzeltme işlemi tamamlandı!');
    console.log('🔄 Server\'ı yeniden başlatın.');
    
  } catch (error) {
    console.error('❌ Database kontrol hatası:', error);
  } finally {
    db.end();
  }
}

checkAndFixDatabase();