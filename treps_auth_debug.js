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

async function debugAuth() {
  try {
    console.log('🔐 TREPS Authentication başlatılıyor...');
    
    // Authentication
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

    console.log('✅ Authentication response alındı');
    console.log('Status:', authResponse.status);
    console.log('Headers:', authResponse.headers);
    console.log('Full Response:', JSON.stringify(authResponse.data, null, 2));
    
    // Response yapısını kontrol et
    console.log('\n📊 Response yapısı:');
    console.log('data:', typeof authResponse.data);
    console.log('data.data:', typeof authResponse.data.data);
    console.log('data.data.access_token:', authResponse.data.data?.access_token);
    console.log('data.access_token:', authResponse.data.access_token);
    console.log('data.token:', authResponse.data.token);

  } catch (error) {
    console.error('❌ Hata:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

debugAuth();
