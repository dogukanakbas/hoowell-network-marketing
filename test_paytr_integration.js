/**
 * PayTR Entegrasyon Test Script'i
 * HOOWELL Payment System
 * 
 * Bu script PayTR entegrasyonunu test etmek için kullanılır
 */

const crypto = require('crypto');
const axios = require('axios');

// PayTR Test Konfigürasyonu
const PAYTR_CONFIG = {
  merchant_id: '605940',
  merchant_key: 'tMCPPznCxw8sb8b8',
  merchant_salt: 'bF1uwkXPAhDw5yok',
  test_mode: 1, // Test modu aktif
  debug_on: 1
};

// Test verileri
const testData = {
  merchant_oid: 'TEST' + Date.now(),
  email: 'test@hoowell.com',
  payment_amount: 100, // 1 TL (kuruş cinsinden)
  user_name: 'Test Kullanıcı',
  user_address: 'Test Adres',
  user_phone: '5555555555',
  user_ip: '85.34.78.112',
  merchant_ok_url: 'https://www.paytr.com/odeme/test-ok',
  merchant_fail_url: 'https://www.paytr.com/odeme/test-fail',
  user_basket: Buffer.from(JSON.stringify([
    ['Test Ürün', '1.00', 1]
  ])).toString('base64'),
  currency: 'TL',
  no_installment: 0,
  max_installment: 0,
  timeout_limit: 30
};

// Hash oluşturma fonksiyonu
function createPayTRHash(data) {
  const hashStr = `${PAYTR_CONFIG.merchant_id}${data.user_ip}${data.merchant_oid}${data.email}${data.payment_amount}${data.user_basket}${data.no_installment}${data.max_installment}${data.currency}${PAYTR_CONFIG.test_mode}`;
  
  console.log('Hash String:', hashStr);
  
  return crypto
    .createHmac('sha256', PAYTR_CONFIG.merchant_key)
    .update(hashStr + PAYTR_CONFIG.merchant_salt)
    .digest('base64');
}

// PayTR Token oluşturma testi
async function testPayTRToken() {
  try {
    console.log('🔍 PayTR Token Test Başlıyor...\n');
    
    const paytr_token = createPayTRHash(testData);
    console.log('PayTR Token:', paytr_token);
    
    const postData = {
      merchant_id: PAYTR_CONFIG.merchant_id,
      user_ip: testData.user_ip,
      merchant_oid: testData.merchant_oid,
      email: testData.email,
      payment_amount: testData.payment_amount,
      paytr_token: paytr_token,
      user_basket: testData.user_basket,
      debug_on: PAYTR_CONFIG.debug_on,
      no_installment: testData.no_installment,
      max_installment: testData.max_installment,
      user_name: testData.user_name,
      user_address: testData.user_address,
      user_phone: testData.user_phone,
      merchant_ok_url: testData.merchant_ok_url,
      merchant_fail_url: testData.merchant_fail_url,
      bildirim_url: 'https://hoowell.net/paytr_callback.php', // Production callback URL
      timeout_limit: testData.timeout_limit,
      currency: testData.currency,
      test_mode: PAYTR_CONFIG.test_mode
    };
    
    console.log('📤 PayTR API\'ye gönderilecek veri:');
    console.log(JSON.stringify(postData, null, 2));
    
    const response = await axios.post('https://www.paytr.com/odeme/api/get-token', postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformRequest: [(data) => {
        return Object.keys(data)
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
          .join('&');
      }]
    });
    
    console.log('\n📥 PayTR API Yanıtı:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.status === 'success') {
      console.log('\n✅ PayTR Token başarıyla oluşturuldu!');
      console.log('Token:', response.data.token);
      console.log('Ödeme URL:', `https://www.paytr.com/odeme/guvenli/${response.data.token}`);
    } else {
      console.log('\n❌ PayTR Token oluşturulamadı!');
      console.log('Hata:', response.data.reason);
    }
    
  } catch (error) {
    console.error('\n💥 PayTR Test Hatası:', error.message);
    if (error.response) {
      console.error('Response Data:', error.response.data);
    }
  }
}

// Callback hash doğrulama testi
function testCallbackHash() {
  console.log('\n🔍 Callback Hash Test...\n');
  
  const callbackData = {
    merchant_oid: testData.merchant_oid,
    status: 'success',
    total_amount: '100',
    hash: 'test_hash'
  };
  
  const hashStr = `${callbackData.merchant_oid}${PAYTR_CONFIG.merchant_salt}${callbackData.status}${callbackData.total_amount}`;
  const calculatedHash = crypto
    .createHmac('sha256', PAYTR_CONFIG.merchant_key)
    .update(hashStr)
    .digest('base64');
    
  console.log('Callback Hash String:', hashStr);
  console.log('Hesaplanan Hash:', calculatedHash);
  console.log('Hash doğrulama:', calculatedHash === callbackData.hash ? '✅ Başarılı' : '❌ Başarısız');
}

// Ana test fonksiyonu
async function runTests() {
  console.log('🚀 PayTR Entegrasyon Test Başlıyor...\n');
  console.log('Test Konfigürasyonu:');
  console.log('- Merchant ID:', PAYTR_CONFIG.merchant_id);
  console.log('- Test Mode:', PAYTR_CONFIG.test_mode ? 'Aktif' : 'Pasif');
  console.log('- Debug Mode:', PAYTR_CONFIG.debug_on ? 'Aktif' : 'Pasif');
  console.log('=' .repeat(50));
  
  await testPayTRToken();
  testCallbackHash();
  
  console.log('\n' + '=' .repeat(50));
  console.log('🏁 Test Tamamlandı!');
}

// Test'i çalıştır
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testPayTRToken,
  testCallbackHash,
  createPayTRHash
};
