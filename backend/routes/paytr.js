const express = require('express');
const router = express.Router();
const paytrService = require('../paytrService');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

// Database connection (server.js'deki ile aynı)
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hoowell_db'
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'hoowell_secret_key';

// Auth middleware (server.js'deki ile aynı)
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Token bulunamadı' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Geçersiz token' });
  }
};

// PayTR ödeme oluşturma
router.post('/create-payment', auth, async (req, res) => {
  try {
    const { payment_type, user_info, partner_id, custom_amount } = req.body;
    const userId = req.user.id;

    // Kullanıcı bilgilerini al
    const userQuery = 'SELECT * FROM users WHERE id = ?';
    const [users] = await db.promise().execute(userQuery, [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    const user = users[0];

    // Ödeme tutarını hesapla
    const settingsQuery = 'SELECT * FROM settings WHERE id = 1';
    const [settings] = await db.promise().execute(settingsQuery);
    const setting = settings[0] || {};

    const usdRate = parseFloat(setting.usd_to_try_rate || 40);
    const vatRate = parseFloat(setting.vat_rate || 20);

    let usdAmount;
    let productName;
    let totalAmount;
    
    if (payment_type === 'education') {
      usdAmount = parseFloat(setting.education_price_usd || 100);
      productName = 'Hoowell Eğitim Paketi';
      const tryAmount = usdAmount * usdRate;
      const vatAmount = tryAmount * (vatRate / 100);
      totalAmount = Math.round((tryAmount + vatAmount) * 100); // PayTR kuruş cinsinden bekler
    } else if (payment_type === 'device') {
      usdAmount = parseFloat(setting.device_price_usd || 1800);
      productName = 'Hoowell Cihaz Paketi';
      const tryAmount = usdAmount * usdRate;
      const vatAmount = tryAmount * (vatRate / 100);
      totalAmount = Math.round((tryAmount + vatAmount) * 100); // PayTR kuruş cinsinden bekler
    } else if (payment_type === 'franchise') {
      // İş ortağı ödemesi için custom amount kullan
      totalAmount = Math.round((custom_amount || 4800) * 100); // PayTR kuruş cinsinden bekler
      usdAmount = (custom_amount || 4800) / usdRate;
      productName = 'Hoowell Franchise Satış Paketi';
    } else {
      return res.status(400).json({ message: 'Geçersiz ödeme türü' });
    }

    // totalAmount yukarıda hesaplandı

    // Benzersiz sipariş numarası oluştur (sadece alfanumerik)
    const merchant_oid = `HOOWELL${Date.now()}${userId}`;

    // Ödeme kaydını veritabanına ekle
    let insertQuery, insertParams;
    
    if (payment_type === 'franchise') {
      insertQuery = `
        INSERT INTO payments (user_id, payment_type, amount_usd, amount_try, vat_amount, total_amount, 
                             merchant_oid, status, payment_method, partner_id, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'paytr', ?, NOW())
      `;
      insertParams = [
        userId, 
        payment_type, 
        usdAmount, 
        totalAmount / 100, // TL cinsinden
        0, // Franchise'da KDV ayrı hesaplanmıyor
        totalAmount / 100, // Veritabanında TL cinsinden sakla
        merchant_oid,
        partner_id
      ];
    } else {
      const tryAmount = usdAmount * usdRate;
      const vatAmount = tryAmount * (vatRate / 100);
      insertQuery = `
        INSERT INTO payments (user_id, payment_type, amount_usd, amount_try, vat_amount, total_amount, 
                             merchant_oid, status, payment_method, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'paytr', NOW())
      `;
      insertParams = [
        userId, 
        payment_type, 
        usdAmount, 
        tryAmount, 
        vatAmount, 
        totalAmount / 100, // Veritabanında TL cinsinden sakla
        merchant_oid
      ];
    }
    
    await db.promise().execute(insertQuery, insertParams);

    // Kullanıcının IP adresini al (local development için fake IP)
    let user_ip = req.headers['x-forwarded-for'] || 
                  req.connection.remoteAddress || 
                  req.socket.remoteAddress ||
                  (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                  '127.0.0.1';
    
    // Local development için geçerli bir IP kullan
    if (user_ip === '127.0.0.1' || user_ip === '::1' || user_ip.includes('::ffff:127.0.0.1')) {
      user_ip = '85.34.78.112'; // Test için geçerli bir IP
    }

    // PayTR ödeme verilerini hazırla
    const paymentData = {
      merchant_oid,
      email: user_info?.email || user.email,
      payment_amount: totalAmount, // Kuruş cinsinden
      user_name: user_info?.name || `${user.first_name} ${user.last_name}`,
      user_address: user_info?.address || 'Türkiye',
      user_phone: user_info?.phone || user.phone || '5555555555',
      user_ip: user_ip.replace('::ffff:', ''), // IPv4 formatına çevir
      // Production/Test URL'leri
      merchant_ok_url: process.env.NODE_ENV === 'production' 
        ? `${process.env.FRONTEND_URL || 'https://hoowell.net'}/payment/success`
        : 'https://www.paytr.com/odeme/test-ok',
      merchant_fail_url: process.env.NODE_ENV === 'production'
        ? `${process.env.FRONTEND_URL || 'https://hoowell.net'}/payment/fail` 
        : 'https://www.paytr.com/odeme/test-fail',
      user_basket: JSON.stringify(paytrService.formatUserBasket([
        {
          name: productName,
          price: totalAmount,
          quantity: 1
        }
      ])),
      currency: 'TL',
      test_mode: process.env.NODE_ENV !== 'production' ? 1 : 0
    };

    // PayTR token oluştur
    const paymentResult = await paytrService.createPayment(paymentData);

    if (paymentResult.success) {
      res.json({
        success: true,
        paymentUrl: paymentResult.paymentUrl,
        merchant_oid,
        amount: totalAmount / 100
      });
    } else {
      res.status(400).json({
        success: false,
        message: paymentResult.error
      });
    }

  } catch (error) {
    console.error('PayTR payment creation error:', error);
    res.status(500).json({ message: 'Ödeme oluşturulurken hata oluştu' });
  }
});

// PayTR callback endpoint
router.post('/callback', async (req, res) => {
  try {
    const callbackData = req.body;
    
    // Callback'i doğrula
    if (!paytrService.verifyCallback(callbackData)) {
      console.error('PayTR callback verification failed');
      return res.status(400).send('FAIL');
    }

    const { merchant_oid, status, total_amount } = callbackData;

    // Ödeme kaydını güncelle
    let paymentStatus;
    if (status === 'success') {
      paymentStatus = 'approved';
    } else {
      paymentStatus = 'failed';
    }

    const updateQuery = `
      UPDATE payments 
      SET status = ?, paytr_status = ?, updated_at = NOW() 
      WHERE merchant_oid = ?
    `;
    
    await db.promise().execute(updateQuery, [paymentStatus, status, merchant_oid]);

    // Eğer ödeme başarılıysa kullanıcının eğitim erişimini aç
    if (status === 'success') {
      const paymentQuery = 'SELECT * FROM payments WHERE merchant_oid = ?';
      const [payments] = await db.promise().execute(paymentQuery, [merchant_oid]);
      
      if (payments.length > 0) {
        const payment = payments[0];
        
        if (payment.payment_type === 'education') {
          const updateUserQuery = 'UPDATE users SET education_access = 1 WHERE id = ?';
          await db.promise().execute(updateUserQuery, [payment.user_id]);
        }
      }
    }

    res.send('OK');

  } catch (error) {
    console.error('PayTR callback error:', error);
    res.status(500).send('FAIL');
  }
});

// Ödeme başarı durumu kontrolü
router.get('/payment-status/:merchant_oid', auth, async (req, res) => {
  try {
    const { merchant_oid } = req.params;
    const userId = req.user.id;

    const query = 'SELECT * FROM payments WHERE merchant_oid = ? AND user_id = ?';
    const [payments] = await db.promise().execute(query, [merchant_oid, userId]);

    if (payments.length === 0) {
      return res.status(404).json({ message: 'Ödeme bulunamadı' });
    }

    const payment = payments[0];
    res.json({
      status: payment.status,
      paytr_status: payment.paytr_status,
      amount: payment.total_amount,
      payment_type: payment.payment_type,
      created_at: payment.created_at
    });

  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({ message: 'Ödeme durumu kontrol edilemedi' });
  }
});

module.exports = router;