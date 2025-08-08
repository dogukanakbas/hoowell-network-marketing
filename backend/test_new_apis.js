// Yeni API endpoint'lerini test etmek için script

const axios = require('axios');

const BASE_URL = 'http://localhost:5001';
const TEST_TOKEN = 'your_test_token_here'; // Admin token ile değiştirin

const testEndpoints = [
  '/api/team/tracker',
  '/api/leadership/pools',
  '/api/global-travel/data',
  '/api/doping-promotion/progress',
  '/api/profit-sharing/data',
  '/api/sponsorship/my-partners'
];

async function testAPI() {
  console.log('🚀 API Endpoint Test Başlıyor...\n');

  for (const endpoint of testEndpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`
        },
        timeout: 5000
      });

      console.log(`✅ ${endpoint} - Status: ${response.status}`);
      console.log(`   Response keys: ${Object.keys(response.data).join(', ')}\n`);
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ ${endpoint} - Status: ${error.response.status}`);
        console.log(`   Error: ${error.response.data.message || 'Unknown error'}\n`);
      } else {
        console.log(`❌ ${endpoint} - Network Error: ${error.message}\n`);
      }
    }
  }

  console.log('🏁 Test Tamamlandı!');
}

// Test çalıştır
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };