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
    
    // TREPS Hostedpage ödeme verileri - /api/payment/hostedpage endpoint
    const paymentData = {
      external_order_id: req.body.orderId || `HOOWELL_${Date.now()}`,
      amount: req.body.amount,
      currency: 'TRY',
      secure_flag: 1,
      transaction_type: 1,
      min_installment: 1,
      max_installment: 1,
      expire_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 saat sonra
      return_url: 'https://panel.hoowell.net/payment/success?payment_type=franchise',
      retry_fail: true,
      iframe_flag: 1, // IFRAME = 1
      iframe_web_uri: 'https://panel.hoowell.net',
      lang: 'tr',
      client_ip: req.ip || '',
      description: req.body.description || 'HOOWELL Ödeme',
      // Müşteri bilgileri - TREPS formatına uygun
      buyer: {
        customer_id: req.body.customerId || `CUST-${Date.now()}`,
        name: req.body.customerName?.trim()?.split(' ')[0] || '',
        surname: req.body.customerName?.trim()?.split(' ').slice(1).join(' ') || '',
        email: req.body.customerEmail || '',
        phone_number: req.body.customerPhone || '',
        country: 'TUR',
        city: req.body.customerCity || '',
        address: req.body.customerAddress || '',
        zip_code: req.body.customerZipCode || '',
        citizenship_number: req.body.citizenshipNumber || null
      },
      // Ürün bilgileri - TREPS formatına uygun
      products: [
        {
          product_id: req.body.productId || `PROD-${Date.now()}`,
          category: req.body.productCategory || 'Ürün',
          name: req.body.productName || 'HOOWELL Ürün',
          price: req.body.amount,
          quantity: 1,
          description: req.body.productDescription || 'HOOWELL Ürün',
          unit: 'adet'
        }
      ],
      // Fatura adresi
      billing_address: {
        name: req.body.customerName?.trim() || '',
        city: req.body.customerCity || '',
        country: 'Türkiye',
        address: req.body.customerAddress || '',
        zip_code: req.body.customerZipCode || ''
      },
      // Teslimat adresi
      shipping_address: {
        name: req.body.customerName?.trim() || '',
        city: req.body.customerCity || '',
        country: 'Türkiye',
        address: req.body.customerAddress || '',
        zip_code: req.body.customerZipCode || ''
      },
      // CSS değişkenleri
      css_variables: {
        text_color: '#1f2937',
        text_font_weight: '500',
        font_family: 'Segoe UI, Roboto, sans-serif',
        font_size: '16px',
        input_bg: '#ffffff',
        input_border: '1px solid #d1d5db',
        input_radius: '8px',
        input_padding: '12px',
        input_color: '#111827',
        input_font_weight: '400',
        button_background_color: '#10b981',
        button_background_color_hover: '#059669',
        button_color: '#ffffff',
        button_color_hover: '#ffffff',
        button_padding: '12px 24px',
        button_border: 'none',
        button_border_hover: 'none',
        button_width: '100%',
        button_max_width: '300px',
        button_transition: 'all 0.3s ease',
        button_container_text_align: 'center',
        button_container_margin_top: '24px',
        label_margin: '0 0 8px 0',
        installment_border_color: '#e5e7eb',
        installment_selected_border_color: '#10b981',
        installment_selected_background_color: '#ecfdf5',
        hide_installments: '0',
        hide_pay_button: '0',
        hide_labels: '0'
      }
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
    
    if (response.data && response.data.status) {
      // TREPS dokümantasyonuna göre yanıt formatı
      const trepsData = response.data.data;
      
      if (!trepsData || !trepsData.url) {
        throw new Error('TREPS yanıtında URL bulunamadı');
      }
      
      res.json({
        success: true,
        url: trepsData.url,
        token: trepsData.token,
        paymentId: trepsData.token,
        expire_date: trepsData.expire_date,
        message: 'TREPS IFRAME ödeme oluşturuldu'
      });
    } else {
      throw new Error(response.data?.message || 'TREPS ödeme oluşturulamadı');
    }
    
  } catch (error) {
    console.error('TREPS IFRAME ödeme hatası:', error);
    
    // TREPS API'den 403 hatası alındıysa
    if (error.response && error.response.status === 403) {
      return res.status(403).json({
        success: false,
        error: 'TREPS ödeme sistemi şu anda kullanılamıyor. Lütfen PAYTR ile ödeme yapın.',
        trepsError: true,
        details: 'TREPS hesap ayarları sorunlu'
      });
    }
    
    // Diğer hatalar için
    return res.status(500).json({
      success: false,
      error: 'Ödeme sistemi hatası. Lütfen daha sonra tekrar deneyin.',
      details: error.message
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
    if (status === 'success') {
      // Başarılı ödeme - partner kaydını aktif et
      // Bu kısmı kendi veritabanı yapınıza göre düzenleyin
      console.log('TREPS başarılı ödeme:', paymentId);
    } else {
      // Başarısız ödeme - partner kaydı beklemekte kalır
      console.log('TREPS başarısız ödeme:', paymentId);
    }
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('TREPS callback hatası:', error);
    res.status(500).json({ success: false });
  }
});

// Payment success endpoint (GET ve POST)
router.get('/payment-success', async (req, res) => {
  try {
    const { paymentId, status } = req.query;
    
    console.log('TREPS payment success (GET):', { paymentId, status });
    
    // Ödeme durumunu kontrol et
    if (status === 'success') {
      // Başarılı ödeme - kullanıcıyı frontend'e yönlendir
      res.redirect(`https://panel.hoowell.net/payment/success?paymentId=${paymentId}&status=success&method=treps&payment_type=franchise`);
    } else {
      // Başarısız ödeme - ama kayıt alınmış olmalı
      res.redirect(`https://panel.hoowell.net/payment/fail?paymentId=${paymentId}&status=failed&method=treps&payment_type=franchise`);
    }
    
  } catch (error) {
    console.error('TREPS payment success error:', error);
    res.redirect('https://panel.hoowell.net/payment/fail?error=unknown');
  }
});

// Payment success endpoint (POST) - TREPS'ten POST isteği gelirse
router.post('/payment-success', async (req, res) => {
  try {
    const { paymentId, status } = req.body;
    
    console.log('TREPS payment success (POST):', { paymentId, status });
    
    // Ödeme durumunu kontrol et
    if (status === 'success') {
      // Başarılı ödeme - kullanıcıyı frontend'e yönlendir
      res.redirect(`https://panel.hoowell.net/payment/success?paymentId=${paymentId}&status=success&method=treps&payment_type=franchise`);
    } else {
      // Başarısız ödeme - ama kayıt alınmış olmalı
      res.redirect(`https://panel.hoowell.net/payment/fail?paymentId=${paymentId}&status=failed&method=treps&payment_type=franchise`);
    }
    
  } catch (error) {
    console.error('TREPS payment success error:', error);
    res.redirect('https://panel.hoowell.net/payment/fail?error=unknown');
  }
});

module.exports = router;