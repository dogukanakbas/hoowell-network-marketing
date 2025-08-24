const axios = require('axios');
const https = require('https');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

async function minimalTest() {
  try {
    // 1. Auth
    const auth = await axios.post('https://api.treps.io/api/auth', {
      merchant_id: 35,
      username: 'apiuser',
      password: '9b{J_7Yo5i/D'
    }, { httpsAgent });

    const token = auth.data.data.access_token;
    console.log('✅ Auth başarılı');

    // 2. Minimal IFRAME test
    const minimalData = {
      external_order_id: `MIN_${Date.now()}`,
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
      description: 'Minimal Test'
    };

    console.log('📤 Minimal test gönderiliyor...');
    const payment = await axios.post('https://api.treps.io/api/payment/hostedpage', minimalData, {
      httpsAgent,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Minimal test başarılı!');
    console.log(payment.data);

  } catch (error) {
    console.error('❌ Minimal test hatası:', error.response?.status, error.response?.data);
  }
}

minimalTest();
