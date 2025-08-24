const express = require('express');
const router = express.Router();
const axios = require('axios');

// TREPS API konfigürasyonu - YENİ BİLGİLER
const TREPS_CONFIG = {
  baseUrl: 'https://api.treps.io', // Yeni API URL
  username: 'apiuser',
  password: '9b{J_7Yo5i/D',
  merchantId: 35 // Yeni Üye İşyeri ID
};

// TREPS token alma
const getTrepsToken = async () => {
  try {
    console.log('TREPS authentication başlatılıyor...');
    
    const response = await axios.post(`${TREPS_CONFIG.baseUrl}/api/auth`, {
      username: TREPS_CONFIG.username,
      password: TREPS_CONFIG.password,
      merchantId: TREPS_CONFIG.merchantId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
    });

    if (response.data && response.data.data && response.data.data.access_token) {
      console.log('TREPS token başarıyla alındı');
      return response.data.data.access_token;
    } else {
      throw new Error('Token response formatı geçersiz');
    }
  } catch (error) {
    console.error('TREPS token hatası:', error);
    throw error;
  }
};

// IFRAME Ödeme oluşturma
router.post('/create-payment', async (req, res) => {
  console.log('TREPS create-payment endpoint çağrıldı');
  console.log('Request body:', req.body);
  
  try {
    // TREPS API'yi gerçek olarak çağır
    console.log('TREPS API gerçek ödeme isteği gönderiliyor...');
    
    // TREPS IFRAME ödeme verileri - Basitleştirilmiş
    const paymentData = {
      external_order_id: req.body.orderId || `Treps_ord_${Date.now()}`,
      amount: req.body.amount,
      currency: 'TRY',
      secure_flag: 1,
      transaction_type: 1,
      min_installment: 1,
      max_installment: 1,
      expire_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      return_url: 'https://panel.hoowell.net/payment?method=treps&result=success',
      retry_fail: true,
      iframe_flag: 1,
      iframe_web_uri: 'https://panel.hoowell.net',
      lang: 'tr',
      // Müşteri bilgileri
      buyer: {
        customer_id: req.body.customerId || `CUST-${Date.now()}`,
        name: req.body.customerName?.split(' ')[0] || 'Müşteri',
        surname: req.body.customerName?.split(' ').slice(1).join(' ') || 'Adı',
        email: req.body.customerEmail || 'musteri@hoowell.net',
        phone_number: req.body.customerPhone || '5551234567',
        country: 'TUR',
        city: req.body.customerCity || 'İstanbul',
        address: req.body.customerAddress || 'HOOWELL Adres',
        zip_code: req.body.customerZipCode || '34000'
      },
      // Ürün bilgileri
      products: [
        {
          product_id: req.body.productId || 'HOOWELL-PRODUCT',
          category: 'Alkali İyonizer',
          name: req.body.productName || 'HOOWELL Ürün',
          price: req.body.amount,
          quantity: 1,
          description: req.body.productDescription || 'HOOWELL Alkali İyonizer Sistemi'
        }
      ],
      // Fatura adresi
      billing_address: {
        name: req.body.customerName || 'Müşteri Adı',
        city: req.body.customerCity || 'İstanbul',
        country: 'Türkiye',
        address: req.body.customerAddress || 'HOOWELL Adres',
        zip_code: req.body.customerZipCode || '34000'
      },
      // Teslimat adresi
      shipping_address: {
        name: req.body.customerName || 'Müşteri Adı',
        city: req.body.customerCity || 'İstanbul',
        country: 'Türkiye',
        address: req.body.customerAddress || 'HOOWELL Adres',
        zip_code: req.body.customerZipCode || '34000'
      },

    };
    
    console.log('TREPS IFRAME ödeme isteği gönderiliyor:', paymentData);
    
    const token = await getTrepsToken();
    
    const response = await axios.post(`${TREPS_CONFIG.baseUrl}/api/payment/hostedpage`, paymentData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false
      })
    });
    
    console.log('TREPS IFRAME ödeme yanıtı:', response.data);
    
    if (response.data.status) {
      // TREPS dokümantasyonuna göre yanıt formatı
      const trepsData = response.data.data;
      
      res.json({
        success: true,
        url: trepsData.url || trepsData.iframe_url,
        token: trepsData.token || trepsData.payment_token,
        paymentId: trepsData.token || trepsData.payment_token,
        expire_date: trepsData.expire_date || trepsData.expires_at,
        message: 'TREPS IFRAME ödeme oluşturuldu'
      });
    } else {
      throw new Error(response.data.message || 'TREPS ödeme oluşturulamadı');
    }
    
  } catch (error) {
    console.error('TREPS IFRAME ödeme hatası:', error);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Ödeme durumu sorgulama
router.get('/payment-status/:paymentId', async (req, res) => {
  try {
    const token = await getTrepsToken();
    
    const response = await axios.get(`${TREPS_CONFIG.baseUrl}/api/payment/status/${req.params.paymentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false
      })
    });
    
    res.json({
      success: true,
      status: response.data.status,
      payment: response.data
    });
    
  } catch (error) {
    console.error('TREPS durum sorgulama hatası:', error);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Callback endpoint
router.post('/callback', async (req, res) => {
  try {
    console.log('TREPS callback:', req.body);
    
    // Ödeme durumunu güncelle
    const { paymentId, status, transactionId } = req.body;
    
    // Veritabanında ödeme durumunu güncelle
    // Bu kısmı kendi veritabanı yapınıza göre düzenleyin
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('TREPS callback hatası:', error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
