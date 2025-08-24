const axios = require('axios');

// TREPS API test
async function testTrepsAPI() {
  console.log('🧪 TREPS API TEST BAŞLIYOR...');
  console.log('================================');
  
  const TREPS_CONFIG = {
    baseUrl: 'https://api.treps.io',
    username: 'apiuser',
    password: '9b{J_7Yo5i/D',
    merchantId: 35
  };
  
  try {
    console.log('1️⃣ Authentication test ediliyor...');
    console.log('URL:', `${TREPS_CONFIG.baseUrl}/api/auth`);
    console.log('Credentials:', {
      username: TREPS_CONFIG.username,
      password: '***HIDDEN***',
      merchantId: TREPS_CONFIG.merchantId
    });
    
    const authResponse = await axios.post(`${TREPS_CONFIG.baseUrl}/api/auth`, {
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
    
    console.log('✅ Authentication başarılı!');
    console.log('Response:', JSON.stringify(authResponse.data, null, 2));
    
    if (authResponse.data && authResponse.data.data && authResponse.data.data.access_token) {
      const token = authResponse.data.data.access_token;
      console.log('🔑 Token alındı:', token.substring(0, 20) + '...');
      
      // 2. IFRAME ödeme test
      console.log('\n2️⃣ IFRAME ödeme test ediliyor...');
      
      const paymentData = {
        external_order_id: `test_ord_${Date.now()}`,
        amount: 100.00,
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
        lang: 'tr'
      };
      
      const paymentResponse = await axios.post(`${TREPS_CONFIG.baseUrl}/api/payment/hostedpage`, paymentData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
      });
      
      console.log('✅ IFRAME ödeme başarılı!');
      console.log('Response:', JSON.stringify(paymentResponse.data, null, 2));
      
    } else {
      console.log('❌ Token alınamadı!');
      console.log('Response:', authResponse.data);
    }
    
  } catch (error) {
    console.error('❌ TREPS API test hatası:');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Headers:', error.response.headers);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.request) {
      console.error('Request:', error.request);
    }
  }
}

// Test çalıştır
testTrepsAPI();
