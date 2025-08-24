const axios = require('axios');
const https = require('https');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

async function debugTest() {
  try {
    console.log('🔐 TREPS Authentication başlatılıyor...');
    
    // 1. Authentication
    const authResponse = await axios.post('https://api.treps.io/api/auth', {
      merchant_id: 35,
      username: 'apiuser',
      password: '9b{J_7Yo5i/D'
    }, {
      httpsAgent,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Authentication başarılı!');
    console.log('Response:', JSON.stringify(authResponse.data, null, 2));
    
    const token = authResponse.data.data.access_token;
    console.log('Token:', token);

    // 2. IFRAME Test
    console.log('\n💳 IFRAME test başlatılıyor...');
    
    const testData = {
      external_order_id: `DEBUG_${Date.now()}`,
      amount: 100,
      currency: 'TRY',
      secure_flag: 1,
      transaction_type: 1,
      min_installment: 1,
      max_installment: 1,
      expire_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      return_url: 'https://panel.hoowell.net',
      retry_fail: true,
      iframe_flag: 1,
      iframe_web_uri: 'https://panel.hoowell.net',
      lang: 'tr',
      client_ip: '127.0.0.1',
      description: 'Debug Test'
    };

    console.log('📤 Test verisi:', JSON.stringify(testData, null, 2));

    const paymentResponse = await axios.post('https://api.treps.io/api/payment/hostedpage', testData, {
      httpsAgent,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000
    });

    console.log('\n✅ IFRAME test başarılı!');
    console.log('Response:', JSON.stringify(paymentResponse.data, null, 2));

  } catch (error) {
    console.error('\n❌ TREPS Debug Hatası:');
    console.error('Error Type:', error.constructor.name);
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Status Text:', error.response.statusText);
      console.error('Response Headers:', JSON.stringify(error.response.headers, null, 2));
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
      console.error('Request URL:', error.config?.url);
      console.error('Request Method:', error.config?.method);
      console.error('Request Headers:', JSON.stringify(error.config?.headers, null, 2));
    } else if (error.request) {
      console.error('Request Error:', error.request);
    } else {
      console.error('Error Config:', error.config);
    }
    
    console.error('Full Error:', error);
  }
}

debugTest();
