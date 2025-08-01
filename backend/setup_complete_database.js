const mysql = require('mysql2/promise');
const fs = require('fs').promises;
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hoowell_network'
};

async function setupCompleteDatabase() {
  let connection;
  
  try {
    console.log('🚀 Hoowell Network veritabanı kurulumu başlatılıyor...');
    
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Veritabanına bağlanıldı');
    
    // Ana veritabanı yapısını kur
    console.log('📋 Ana veritabanı yapısı kuruluyor...');
    const mainSql = await fs.readFile('./database.sql', 'utf8');
    const mainCommands = mainSql.split(';').filter(cmd => cmd.trim().length > 0);
    
    for (const command of mainCommands) {
      if (command.trim()) {
        try {
          await connection.execute(command);
        } catch (error) {
          if (!error.message.includes('already exists') && !error.message.includes('Duplicate entry')) {
            console.log('⚠️ SQL Uyarısı:', error.message.substring(0, 100));
          }
        }
      }
    }
    
    // Eksik tabloları ekle
    console.log('🔧 Eksik tablolar ekleniyor...');
    const fixSql = await fs.readFile('./fix_missing_tables.sql', 'utf8');
    const fixCommands = fixSql.split(';').filter(cmd => cmd.trim().length > 0);
    
    for (const command of fixCommands) {
      if (command.trim()) {
        try {
          await connection.execute(command);
        } catch (error) {
          if (!error.message.includes('already exists') && !error.message.includes('Duplicate entry')) {
            console.log('⚠️ Fix SQL Uyarısı:', error.message.substring(0, 100));
          }
        }
      }
    }
    
    // Tablo kontrolü yap
    console.log('🔍 Tablo kontrolü yapılıyor...');
    const [tables] = await connection.execute('SHOW TABLES');
    const tableNames = tables.map(row => Object.values(row)[0]);
    
    const requiredTables = [
      'users', 'payments', 'videos', 'questions', 'customers', 
      'sales_tracking', 'sponsorship_earnings', 'customer_satisfaction_rewards',
      'network_tree', 'user_profiles', 'system_settings', 'earning_types', 
      'earnings', 'global_travel_data', 'admin_system_settings'
    ];
    
    console.log('📊 Mevcut tablolar:');
    requiredTables.forEach(table => {
      const exists = tableNames.includes(table);
      console.log(`${exists ? '✅' : '❌'} ${table}`);
    });
    
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));
    if (missingTables.length === 0) {
      console.log('🎉 Tüm gerekli tablolar mevcut!');
    } else {
      console.log('⚠️ Eksik tablolar:', missingTables.join(', '));
    }
    
    // Kullanıcı sayısını kontrol et
    const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log(`👥 Toplam kullanıcı sayısı: ${userCount[0].count}`);
    
    // Admin kullanıcıları kontrol et
    const [adminCount] = await connection.execute('SELECT COUNT(*) as count FROM users WHERE role = "admin"');
    console.log(`👑 Admin kullanıcı sayısı: ${adminCount[0].count}`);
    
    console.log('✅ Veritabanı kurulumu tamamlandı!');
    
  } catch (error) {
    console.error('❌ Veritabanı kurulum hatası:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Veritabanı bağlantısı kapatıldı');
    }
  }
}

// Script'i çalıştır
if (require.main === module) {
  setupCompleteDatabase();
}

module.exports = { setupCompleteDatabase };