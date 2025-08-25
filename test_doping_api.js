const axios = require('axios');

// Test doping promotion API
const testDopingAPI = async () => {
  try {
    console.log('🔍 Doping Promotion API Test');
    
    // Test with a sample user (you need to replace with actual token)
    const response = await axios.get('http://localhost:5001/api/doping-promotion/progress', {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
      }
    });
    
    console.log('✅ API Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Check etap1.tamamlandi
    console.log('\n🔍 Etap 1 Durumu:');
    console.log('etap1.tamamlandi:', response.data.etap1.tamamlandi);
    console.log('etap1.yapilan_satis:', response.data.etap1.yapilan_satis);
    console.log('etap1.yapilan_ortak:', response.data.etap1.yapilan_ortak);
    
    // Check etap2
    console.log('\n🔍 Etap 2 Durumu:');
    console.log('etap2.tamamlandi:', response.data.etap2.tamamlandi);
    console.log('etap2.aktif:', response.data.etap2.aktif);
    console.log('etap2.beklemekte:', response.data.etap2.beklemekte);
    
  } catch (error) {
    console.error('❌ API Error:', error.response?.data || error.message);
  }
};

testDopingAPI();
