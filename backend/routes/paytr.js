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
        ? `${process.env.FRONTEND_URL || 'https://panel.hoowell.net'}/payment/success?payment_type=franchise`
        : 'https://www.paytr.com/odeme/test-ok',
      merchant_fail_url: process.env.NODE_ENV === 'production'
        ? `${process.env.FRONTEND_URL || 'https://panel.hoowell.net'}/payment/fail?payment_type=franchise` 
        : 'https://www.paytr.com/odeme/test-fail',
      user_basket: paytrService.base64Encode(JSON.stringify([
        [productName, (totalAmount / 100).toFixed(2), 1]
      ])),
      currency: 'TL',
      test_mode: 0 // Test modunu kapat - Canlı mod için
    };

    // PayTR token oluştur
    const paymentResult = await paytrService.createPayment(paymentData);

    if (paymentResult.success) {
      res.json({
        success: true,
        paymentUrl: paymentResult.paymentUrl,
        iframeUrl: paymentResult.iframeUrl,
        iframeToken: paymentResult.iframeToken,
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

// PayTR callback endpoint (iframe desteği ile)
router.post('/callback', async (req, res) => {
  await handlePayTRCallback(req, res);
});

// GET callback endpoint (bazı durumlar için)
router.get('/callback', async (req, res) => {
  await handlePayTRCallback(req, res);
});

// PayTR callback handler function
const handlePayTRCallback = async (req, res) => {
  try {
    const callbackData = req.body;
    console.log('=== PayTR CALLBACK BAŞLADI ===');
    console.log('PayTR Callback Data:', JSON.stringify(callbackData, null, 2));
    console.log('Request Headers:', req.headers);
    console.log('Request IP:', req.ip || req.connection.remoteAddress);
    
    // Gerekli alanları kontrol et
    if (!callbackData.merchant_oid || !callbackData.status || !callbackData.hash) {
      console.error('PayTR callback: Eksik parametreler');
      return res.status(400).send('FAIL');
    }

    // Callback'i doğrula
    if (!paytrService.verifyCallback(callbackData)) {
      console.error('PayTR callback verification failed');
      console.error('Callback Data:', callbackData);
      return res.status(400).send('FAIL');
    }

    const { merchant_oid, status, total_amount } = callbackData;
    console.log(`PayTR Callback: ${merchant_oid} - Status: ${status} - Amount: ${total_amount}`);

    // Önce ödeme kaydının var olup olmadığını kontrol et
    const checkQuery = 'SELECT * FROM payments WHERE merchant_oid = ?';
    const [existingPayments] = await db.promise().execute(checkQuery, [merchant_oid]);
    
    if (existingPayments.length === 0) {
      console.error(`PayTR callback: Ödeme kaydı bulunamadı - ${merchant_oid}`);
      return res.status(404).send('FAIL');
    }

    const payment = existingPayments[0];
    console.log('Mevcut ödeme kaydı:', payment);

    // Eğer ödeme zaten işlenmişse tekrar işleme
    if (payment.status === 'approved' && status === 'success') {
      console.log(`PayTR callback: Ödeme zaten onaylanmış - ${merchant_oid}`);
      return res.send('OK');
    }

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
    console.log(`Ödeme durumu güncellendi: ${merchant_oid} -> ${paymentStatus}`);

    // Eğer ödeme başarılıysa kullanıcının eğitim erişimini aç
    if (status === 'success') {
      if (payment.payment_type === 'education') {
        const updateUserQuery = 'UPDATE users SET education_access = 1 WHERE id = ?';
        await db.promise().execute(updateUserQuery, [payment.user_id]);
        console.log(`Eğitim erişimi açıldı - User ID: ${payment.user_id}`);
      } else if (payment.payment_type === 'franchise' && payment.partner_id) {
        // İş ortağı ödemesi başarılıysa partner kaydını aktif et
        const updatePartnerQuery = 'UPDATE users SET payment_pending = FALSE, payment_confirmed = TRUE, is_active = TRUE WHERE id = ?';
        await db.promise().execute(updatePartnerQuery, [payment.partner_id]);
        console.log(`İş ortağı kaydı aktif edildi - Partner ID: ${payment.partner_id}`);
      }
    } else {
      // Ödeme başarısız olsa bile kayıt alınmış olmalı
      if (payment.payment_type === 'franchise' && payment.partner_id) {
        // İş ortağı kaydını "beklemede" durumunda tut
        const updatePartnerQuery = 'UPDATE users SET payment_pending = TRUE, payment_confirmed = FALSE WHERE id = ?';
        await db.promise().execute(updatePartnerQuery, [payment.partner_id]);
        console.log(`İş ortağı kaydı beklemekte - Partner ID: ${payment.partner_id}`);
      }
    }

    console.log(`=== PayTR CALLBACK TAMAMLANDI: ${merchant_oid} - ${status} ===`);
    res.send('OK');

  } catch (error) {
    console.error('=== PayTR CALLBACK HATASI ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    res.status(500).send('FAIL');
  }
};

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

// PayTR iframe için özel endpoint (token ile ödeme sayfası)
router.get('/iframe/:token', async (req, res) => {
  const { token } = req.params;
  
  // Basit HTML sayfası döndür
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>PayTR Güvenli Ödeme</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
            .container { padding: 20px; text-align: center; }
            .loading { color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="loading">PayTR ödeme sayfası yükleniyor...</div>
        </div>
        
        <script src="https://www.paytr.com/js/iframeResizer.min.js"></script>
        <iframe 
            src="https://www.paytr.com/odeme/guvenli/${token}" 
            id="paytriframe" 
            frameborder="0" 
            scrolling="no"
            style="width: 100%; min-height: 500px;">
        </iframe>
        
        <script>
            // Iframe'i resize et
            if (typeof iFrameResize !== 'undefined') {
                iFrameResize({
                    log: false,
                    checkOrigin: false,
                    onMessage: function(messageData) {
                        console.log('PayTR Message:', messageData);
                        
                        // Parent window'a mesaj gönder
                        if (window.parent !== window) {
                            window.parent.postMessage(messageData, '*');
                        }
                    }
                }, '#paytriframe');
            }
            
            // Loading'i gizle
            setTimeout(() => {
                const loading = document.querySelector('.loading');
                if (loading) loading.style.display = 'none';
            }, 2000);
        </script>
    </body>
    </html>
  `;
  
  res.send(html);
});

module.exports = router;