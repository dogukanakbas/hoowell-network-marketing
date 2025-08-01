// Muhasebe Takip Paneli API Endpoints

const mysql = require('mysql2/promise');

// Veritabanı bağlantısı
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hoowell_db'
};

// Muhasebe verilerini getir
const getAccountingData = async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const userId = req.user.id;

    // Bireysel kazançları getir
    const [bireyselRows] = await connection.execute(`
      SELECT 
        e.id,
        et.name as earning_type,
        e.related_person,
        DATE_FORMAT(e.sale_date, '%d.%m.%Y') as sale_date,
        DATE_FORMAT(e.earn_date, '%d.%m.%Y') as earn_date,
        DATE_FORMAT(e.payment_date, '%d.%m.%Y') as payment_date,
        e.amount_usd,
        e.exchange_rate,
        e.tax_rate,
        e.payment_status,
        -- Bireysel için KDV dahil hesaplama
        ROUND(e.amount_usd * (1 + e.tax_rate/100), 2) as taxed_amount,
        ROUND(e.amount_usd * (1 + e.tax_rate/100) * e.exchange_rate, 2) as net_amount_tl
      FROM earnings e
      JOIN earning_types et ON e.earning_type_id = et.id
      WHERE e.user_id = ? AND e.is_company = FALSE
      ORDER BY e.created_at DESC
    `, [userId]);

    // Şirket kazançları getir
    const [sirketRows] = await connection.execute(`
      SELECT 
        e.id,
        et.name as earning_type,
        e.related_person,
        DATE_FORMAT(e.sale_date, '%d.%m.%Y') as sale_date,
        DATE_FORMAT(e.earn_date, '%d.%m.%Y') as earn_date,
        DATE_FORMAT(e.payment_date, '%d.%m.%Y') as payment_date,
        e.amount_usd,
        e.exchange_rate,
        e.tax_rate,
        e.payment_status,
        -- Şirket için stopaj kesintisi hesaplama
        ROUND(e.amount_usd * (1 - e.tax_rate/100), 2) as stopaj_amount,
        ROUND(e.amount_usd * (1 - e.tax_rate/100) * e.exchange_rate, 2) as net_amount_tl
      FROM earnings e
      JOIN earning_types et ON e.earning_type_id = et.id
      WHERE e.user_id = ? AND e.is_company = TRUE
      ORDER BY e.created_at DESC
    `, [userId]);

    await connection.end();

    res.json({
      success: true,
      data: {
        bireysel: bireyselRows,
        sirket: sirketRows
      }
    });

  } catch (error) {
    console.error('Muhasebe verileri getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Muhasebe verileri getirilemedi',
      error: error.message
    });
  }
};

// Yeni kazanç kaydı ekle
const addEarning = async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const userId = req.user.id;
    
    const {
      earning_type_id,
      related_person,
      sale_date,
      earn_date,
      payment_date,
      amount_usd,
      exchange_rate,
      is_company,
      payment_status
    } = req.body;

    const [result] = await connection.execute(`
      INSERT INTO earnings (
        user_id, earning_type_id, related_person, sale_date, earn_date, 
        payment_date, amount_usd, exchange_rate, is_company, payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId, earning_type_id, related_person, sale_date, earn_date,
      payment_date, amount_usd, exchange_rate, is_company, payment_status
    ]);

    await connection.end();

    res.json({
      success: true,
      message: 'Kazanç kaydı başarıyla eklendi',
      earning_id: result.insertId
    });

  } catch (error) {
    console.error('Kazanç ekleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Kazanç kaydı eklenemedi',
      error: error.message
    });
  }
};

// Kazanç kaydını güncelle
const updateEarning = async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const userId = req.user.id;
    const earningId = req.params.id;
    
    const {
      payment_status,
      payment_date,
      amount_usd,
      exchange_rate
    } = req.body;

    const [result] = await connection.execute(`
      UPDATE earnings 
      SET payment_status = ?, payment_date = ?, amount_usd = ?, exchange_rate = ?
      WHERE id = ? AND user_id = ?
    `, [payment_status, payment_date, amount_usd, exchange_rate, earningId, userId]);

    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kazanç kaydı bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Kazanç kaydı başarıyla güncellendi'
    });

  } catch (error) {
    console.error('Kazanç güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Kazanç kaydı güncellenemedi',
      error: error.message
    });
  }
};

// Kazanç türlerini getir
const getEarningTypes = async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(`
      SELECT id, name, description
      FROM earning_types
      ORDER BY name
    `);

    await connection.end();

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error('Kazanç türleri getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Kazanç türleri getirilemedi',
      error: error.message
    });
  }
};

// Özet istatistikleri getir
const getAccountingSummary = async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const userId = req.user.id;

    // Bireysel özet
    const [bireyselSummary] = await connection.execute(`
      SELECT 
        COUNT(*) as total_records,
        SUM(CASE WHEN payment_status = 'ÖDENDİ' THEN amount_usd ELSE 0 END) as paid_usd,
        SUM(CASE WHEN payment_status = 'BEKLEMEDE' THEN amount_usd ELSE 0 END) as pending_usd,
        SUM(CASE WHEN payment_status = 'ÖDENDİ' THEN amount_usd * (1 + tax_rate/100) * exchange_rate ELSE 0 END) as paid_tl,
        SUM(CASE WHEN payment_status = 'BEKLEMEDE' THEN amount_usd * (1 + tax_rate/100) * exchange_rate ELSE 0 END) as pending_tl
      FROM earnings
      WHERE user_id = ? AND is_company = FALSE
    `, [userId]);

    // Şirket özet
    const [sirketSummary] = await connection.execute(`
      SELECT 
        COUNT(*) as total_records,
        SUM(CASE WHEN payment_status = 'ÖDENDİ' THEN amount_usd ELSE 0 END) as paid_usd,
        SUM(CASE WHEN payment_status = 'BEKLEMEDE' THEN amount_usd ELSE 0 END) as pending_usd,
        SUM(CASE WHEN payment_status = 'ÖDENDİ' THEN amount_usd * (1 - tax_rate/100) * exchange_rate ELSE 0 END) as paid_tl,
        SUM(CASE WHEN payment_status = 'BEKLEMEDE' THEN amount_usd * (1 - tax_rate/100) * exchange_rate ELSE 0 END) as pending_tl
      FROM earnings
      WHERE user_id = ? AND is_company = TRUE
    `, [userId]);

    await connection.end();

    res.json({
      success: true,
      data: {
        bireysel: bireyselSummary[0],
        sirket: sirketSummary[0]
      }
    });

  } catch (error) {
    console.error('Muhasebe özet getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Muhasebe özeti getirilemedi',
      error: error.message
    });
  }
};

module.exports = {
  getAccountingData,
  addEarning,
  updateEarning,
  getEarningTypes,
  getAccountingSummary
};