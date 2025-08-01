const mysql = require('mysql2/promise');
const fs = require('fs').promises;
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hoowell_network'
};

async function setupAccountingDatabase() {
  let connection;
  
  try {
    console.log('Muhasebe veritabanı kurulumu başlatılıyor...');
    
    // Veritabanı bağlantısı
    connection = await mysql.createConnection(dbConfig);
    console.log('Veritabanına bağlanıldı');
    
    // SQL dosyasını oku
    const sqlContent = await fs.readFile('./create_accounting_tables.sql', 'utf8');
    
    // SQL komutlarını ayır ve çalıştır
    const sqlCommands = sqlContent.split(';').filter(cmd => cmd.trim().length > 0);
    
    for (const command of sqlCommands) {
      if (command.trim()) {
        try {
          await connection.execute(command);
          console.log('✓ SQL komutu başarıyla çalıştırıldı');
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            console.log('⚠ Veri zaten mevcut, atlanıyor...');
          } else {
            console.error('SQL komutu hatası:', error.message);
          }
        }
      }
    }
    
    console.log('✅ Muhasebe veritabanı kurulumu tamamlandı!');
    
  } catch (error) {
    console.error('❌ Veritabanı kurulum hatası:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Veritabanı bağlantısı kapatıldı');
    }
  }
}

// Script'i çalıştır
if (require.main === module) {
  setupAccountingDatabase();
}

module.exports = { setupAccountingDatabase };