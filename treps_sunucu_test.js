const axios = require('axios');
const https = require('https');

// TREPS Konfigürasyonu
const TREPS_CONFIG = {
  baseUrl: 'https://api.treps.io',
  merchantId: 35,
  username: 'apiuser',
  password: '9b{J_7Yo5i/D'
};

// SSL sertifika doğrulamasını bypass et
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

async function testTrepsAPI() {
  try {
    console.log('🔐 TREPS Authentication başlatılıyor...');
    
    // 1. Authentication
    const authResponse = await axios.post(`${TREPS_CONFIG.baseUrl}/api/auth`, {
      merchant_id: TREPS_CONFIG.merchantId,
      username: TREPS_CONFIG.username,
      password: TREPS_CONFIG.password
    }, {
      httpsAgent,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('✅ Authentication başarılı!');
    console.log('Token:', authResponse.data.data.access_token);
    
    const token = authResponse.data.data.access_token;

    // 2. IFRAME Ödeme Testi
    console.log('\n💳 TREPS IFRAME ödeme testi başlatılıyor...');
    
    const paymentData = {
      external_order_id: `TEST_${Date.now()}`,
      amount: 100,
      currency: 'TRY',
      secure_flag: 1,
      transaction_type: 1,
      min_installment: 1,
      max_installment: 1,
      expire_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      return_url: 'https://panel.hoowell.net/payment?method=treps&result=success',
      retry_fail: true,
      iframe_flag: 1,
      iframe_web_uri: 'https://panel.hoowell.net/customer-registration',
      lang: 'tr',
      client_ip: '127.0.0.1',
      description: 'TREPS Test Ödeme',
      buyer: {
        customer_id: `TEST_CUST_${Date.now()}`,
        name: 'Test',
        surname: 'Müşteri',
        email: 'test@hoowell.net',
        phone_number: '5551234567',
        country: 'TUR',
        city: 'İstanbul',
        address: 'Test Adres',
        zip_code: '34000',
        citizenship_number: null
      },
      products: [
        {
          product_id: 'TEST_PRODUCT',
          category: 'Test',
          name: 'Test Ürün',
          price: 100,
          quantity: 1,
          description: 'Test ürün açıklaması',
          unit: 'adet'
        }
      ],
      billing_address: {
        name: 'Test Müşteri',
        city: 'İstanbul',
        country: 'Türkiye',
        address: 'Test Adres',
        zip_code: '34000'
      },
      shipping_address: {
        name: 'Test Müşteri',
        city: 'İstanbul',
        country: 'Türkiye',
        address: 'Test Adres',
        zip_code: '34000'
      }
    };

    console.log('📤 Ödeme verileri gönderiliyor...');
    console.log('URL:', `${TREPS_CONFIG.baseUrl}/api/payment/hostedpage`);
    console.log('Data:', JSON.stringify(paymentData, null, 2));

    const paymentResponse = await axios.post(`${TREPS_CONFIG.baseUrl}/api/payment/hostedpage`, paymentData, {
      httpsAgent,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('\n✅ TREPS IFRAME ödeme başarılı!');
    console.log('Response:', JSON.stringify(paymentResponse.data, null, 2));

  } catch (error) {
    console.error('\n❌ TREPS API Hatası:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Headers:', error.response?.headers);
    console.error('Data:', error.response?.data);
    console.error('URL:', error.config?.url);
    console.error('Method:', error.config?.method);
    
    if (error.response?.status === 403) {
      console.error('\n🔍 403 Forbidden Analizi:');
      console.error('- Authentication başarılı ama ödeme izni yok');
      console.error('- TREPS hesap ayarlarında IFRAME ödeme aktif değil');
      console.error('- Domain whitelist eksik olabilir');
    }
  }
}

// Test çalıştır
testTrepsAPI();
