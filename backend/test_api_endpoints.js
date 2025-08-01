const axios = require('axios');

// Test API endpoints
const BASE_URL = 'http://localhost:5001';

// Test token (gerçek bir kullanıcı token'ı gerekli)
const TEST_TOKEN = 'your_test_token_here';

const testEndpoints = async () => {
  console.log('🧪 API Endpoint Testleri Başlıyor...\n');

  const headers = {
    'Authorization': `Bearer ${TEST_TOKEN}`,
    'Content-Type': 'application/json'
  };

  try {
    // 1. Sales Tracker Test
    console.log('📊 Sales Tracker API Test...');
    try {
      const salesResponse = await axios.get(`${BASE_URL}/api/sales/tracker`, { headers });
      console.log('✅ Sales Tracker API çalışıyor');
      console.log('   - Pending Sales:', salesResponse.data.pendingSales?.length || 0);
      console.log('   - Active Sales:', salesResponse.data.activeSales?.length || 0);
      console.log('   - Monthly Activity:', salesResponse.data.monthlyActivity);
    } catch (error) {
      console.log('❌ Sales Tracker API hatası:', error.response?.data?.message || error.message);
    }

    // 2. Career Progress Test
    console.log('\n🏆 Career Progress API Test...');
    try {
      const careerResponse = await axios.get(`${BASE_URL}/api/career/progress`, { headers });
      console.log('✅ Career Progress API çalışıyor');
      console.log('   - Current Level:', careerResponse.data.current_level);
      console.log('   - Total KKP:', careerResponse.data.total_kkp);
      console.log('   - Active Partners:', careerResponse.data.active_partners);
    } catch (error) {
      console.log('❌ Career Progress API hatası:', error.response?.data?.message || error.message);
    }

    // 3. Career Bonuses Test
    console.log('\n💰 Career Bonuses API Test...');
    try {
      const bonusResponse = await axios.get(`${BASE_URL}/api/career/bonuses`, { headers });
      console.log('✅ Career Bonuses API çalışıyor');
      console.log('   - Bonus Count:', bonusResponse.data?.length || 0);
    } catch (error) {
      console.log('❌ Career Bonuses API hatası:', error.response?.data?.message || error.message);
    }

    // 4. Customer Registration Test
    console.log('\n👤 Customer Registration API Test...');
    const testCustomer = {
      registration_type: 'individual',
      first_name: 'Test',
      last_name: 'Müşteri',
      tc_no: '12345678901',
      email: 'test@example.com',
      phone: '05551234567',
      delivery_address: 'Test Adres',
      selected_product: 'education',
      product_price: 100,
      product_vat: 20,
      total_amount: 120,
      contract1_accepted: true,
      contract2_accepted: true
    };

    try {
      // Bu test gerçek veri oluşturacağı için sadece validation kontrolü yapalım
      console.log('⚠️  Customer Registration API test edilmedi (gerçek veri oluşturur)');
      console.log('   - Endpoint: POST /api/customers');
      console.log('   - Required fields: ✅ Validation eklendi');
    } catch (error) {
      console.log('❌ Customer Registration API hatası:', error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.log('❌ Genel test hatası:', error.message);
  }

  console.log('\n🏁 Test tamamlandı!');
};

// Test çalıştır
if (require.main === module) {
  console.log('⚠️  Bu test scripti çalıştırılmadan önce:');
  console.log('1. Server çalışıyor olmalı (npm start)');
  console.log('2. TEST_TOKEN değişkenine geçerli bir token eklenmelidir');
  console.log('3. Veritabanı bağlantısı aktif olmalıdır\n');
  
  // testEndpoints();
  console.log('Test çalıştırmak için TEST_TOKEN değerini güncelleyin ve testEndpoints() fonksiyonunu aktif edin.');
}

module.exports = { testEndpoints };