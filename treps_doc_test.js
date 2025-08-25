const axios = require('axios');
const https = require('https');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

async function testWithDocExample() {
  try {
    console.log('🔐 TREPS Dokümantasyon Örneği Test');
    
    // TREPS dokümantasyonundaki örnek bilgiler
    const authData = {
      merchant_id: 35,
      username: 'apiuser',
      password: '9b{J_7Yo5i/D'
    };

    console.log('📤 Auth verisi:', JSON.stringify(authData, null, 2));
    console.log('URL: https://api.treps.io/api/auth');

    const authResponse = await axios.post('https://api.treps.io/api/auth', authData, {
      httpsAgent,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Auth Response:', JSON.stringify(authResponse.data, null, 2));

  } catch (error) {
    console.error('\n❌ TREPS Auth Hatası:');
    console.error('Status:', error.response?.status);
    console.error('Data:', JSON.stringify(error.response?.data, null, 2));
    
    if (error.response?.data?.message === 'invalid_username_or_password') {
      console.error('\n🔍 ÇÖZÜM ÖNERİLERİ:');
      console.error('1. TREPS support ile iletişime geç');
      console.error('2. Doğru kullanıcı adı/şifre bilgilerini al');
      console.error('3. Test hesabı mı production hesabı mı kontrol et');
      console.error('4. API endpoint değişmiş olabilir');
    }
  }
}

testWithDocExample();
