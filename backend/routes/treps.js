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
  try {
    // Test için mock response (TREPS API çalışmıyorsa)
    if (process.env.NODE_ENV === 'development' || process.env.TREPS_MOCK === 'true') {
      const mockToken = `HST-MOCK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('TREPS Mock Mode: IFRAME ödeme oluşturuldu');
      
      res.json({
        success: true,
        url: process.env.NODE_ENV === 'production' 
          ? `https://hp.treps.io/iframe/${mockToken}`
          : `https://hp.treps.io/iframe/${mockToken}`,
        token: mockToken,
        paymentId: mockToken, // Mock için de paymentId ekle
        expire_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        message: 'TREPS IFRAME ödeme oluşturuldu (TEST MODE)'
      });
      return;
    }
    
    // TREPS IFRAME ödeme verileri - Geliştirilmiş
    const paymentData = {
      external_order_id: req.body.orderId || `Treps_ord_${Date.now()}`,
      amount: req.body.amount,
      currency: 'TRY',
      secure_flag: 1, // 3D Secure zorunlu
      transaction_type: 1, // Auth
      min_installment: 1,
      max_installment: 1,
      expire_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 saat geçerli
      return_url: process.env.NODE_ENV === 'production' 
        ? 'https://panel.hoowell.net/payment?method=treps&result=success'
        : `${req.protocol}://${req.get('host')}/payment?method=treps&result=success`,
      retry_fail: true,
      iframe_flag: 1, // IFRAME modu
      iframe_web_uri: process.env.NODE_ENV === 'production' 
        ? 'https://panel.hoowell.net' 
        : `https://${req.get('host')}`,
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
      css_variables: {
        text_color: "#1f2937",
        text_font_weight: "500",
        font_family: "Segoe UI, Roboto, sans-serif",
        font_size: "16px",
        input_bg: "#ffffff",
        input_border: "1px solid #d1d5db",
        input_radius: "8px",
        input_padding: "12px",
        input_color: "#111827",
        input_font_weight: "400",
        button_background_color: "#10b981",
        button_background_color_hover: "#059669",
        button_color: "#ffffff",
        button_color_hover: "#ffffff",
        button_padding: "12px 24px",
        button_border: "none",
        button_border_hover: "none",
        button_width: "100%",
        button_max_width: "300px",
        button_transition: "all 0.3s ease",
        button_container_text_align: "center",
        button_container_margin_top: "24px",
        label_margin: "0 0 8px 0",
        installment_border_color: "#e5e7eb",
        installment_selected_border_color: "#10b981",
        installment_selected_background_color: "#ecfdf5",
        hide_installments: "0",
        hide_pay_button: "0",
        hide_labels: "0"
      },
      buyer: {
        customer_id: req.body.customerId || `CUST-${Date.now()}`,
        name: req.body.customerName?.split(' ')[0] || 'Müşteri',
        surname: req.body.customerName?.split(' ').slice(1).join(' ') || 'Adı',
        email: req.body.customerEmail || 'musteri@example.com',
        phone_number: req.body.customerPhone || '5551234567',
        country: 'TUR',
        city: req.body.customerCity || 'İstanbul',
        address: req.body.customerAddress || 'Adres bilgisi',
        zip_code: req.body.customerZipCode || '34000'
      },
      products: [
        {
          product_id: req.body.productId || 'HOOWELL-PRODUCT',
          category: 'Su Arıtma Sistemi',
          name: req.body.productName || 'HOOWELL Ürün',
          price: req.body.amount,
          quantity: 1,
          description: req.body.description || 'HOOWELL Su Arıtma Sistemi'
        }
      ],
      billing_address: {
        name: req.body.customerName || 'Müşteri Adı',
        city: req.body.customerCity || 'İstanbul',
        country: 'Türkiye',
        address: req.body.customerAddress || 'Fatura Adresi',
        zip_code: req.body.customerZipCode || '34000'
      },
      shipping_address: {
        name: req.body.customerName || 'Müşteri Adı',
        city: req.body.customerCity || 'İstanbul',
        country: 'Türkiye',
        address: req.body.customerAddress || 'Teslimat Adresi',
        zip_code: req.body.customerZipCode || '34000'
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
      // SSL sertifika doğrulamasını devre dışı bırak (sadece test için)
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false
      })
    });
    
    console.log('TREPS IFRAME ödeme yanıtı:', response.data);
    
    if (response.data.status) {
      res.json({
        success: true,
        url: response.data.data.url,
        token: response.data.data.token,
        paymentId: response.data.data.token, // TREPS token'ını paymentId olarak kullan
        expire_date: response.data.data.expire_date,
        message: 'TREPS IFRAME ödeme oluşturuldu'
      });
    } else {
      throw new Error(response.data.message || 'TREPS ödeme oluşturulamadı');
    }
    
  } catch (error) {
    console.error('TREPS IFRAME ödeme hatası:', error);
    
    // Hata durumunda da mock response döndür (test için)
    if (process.env.NODE_ENV === 'development' || process.env.TREPS_MOCK === 'true') {
      const mockToken = `HST-ERROR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      res.json({
        success: true,
        url: process.env.NODE_ENV === 'production' 
          ? `https://pohp.treps.tr/iframe/${mockToken}`
          : `https://pohp.treps.tr/iframe/${mockToken}`,
        token: mockToken,
        paymentId: mockToken, // Mock için de paymentId ekle
        expire_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        message: 'TREPS IFRAME ödeme oluşturuldu (TEST MODE - API Error)'
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Ödeme durumu sorgulama
router.get('/payment-status/:paymentId', async (req, res) => {
  try {
    // Test için mock response (TREPS API çalışmıyorsa)
    if (process.env.NODE_ENV === 'development' || process.env.TREPS_MOCK === 'true') {
      // Simüle edilmiş ödeme durumu (test için)
      const mockStatuses = ['pending', 'processing', 'completed'];
      const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
      
      res.json({
        success: true,
        status: randomStatus,
        payment: {
          id: req.params.paymentId,
          status: randomStatus,
          amount: 14976,
          currency: 'TRY',
          description: 'HOOWELL Test Ödeme'
        }
      });
      return;
    }
    
    const token = await getTrepsToken();
    
    const response = await axios.get(`${TREPS_CONFIG.baseUrl}/api/payment/status/${req.params.paymentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      // SSL sertifika doğrulamasını devre dışı bırak (sadece test için)
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
    
    // Hata durumunda da mock response döndür (test için)
    if (process.env.NODE_ENV === 'development') {
      res.json({
        success: true,
        status: 'pending',
        payment: {
          id: req.params.paymentId,
          status: 'pending',
          amount: 14976,
          currency: 'TRY',
          description: 'HOOWELL Test Ödeme (Error)'
        }
      });
      return;
    }
    
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
