const axios = require('axios');

// Yeni TREPS konfigürasyonu
const TREPS_CONFIG = {
  baseUrl: 'https://api.treps.io',
  username: 'apiuser',
  password: '9b{J_7Yo5i/D',
  merchantId: 35
};

// Test fonksiyonu
async function testTrepsConnection() {
  console.log('=== TREPS YENİ BİLGİLERLE TEST ===');
  console.log('API URL:', TREPS_CONFIG.baseUrl);
  console.log('Username:', TREPS_CONFIG.username);
  console.log('Merchant ID:', TREPS_CONFIG.merchantId);
  console.log('');

  try {
    // 1. Authentication test
    console.log('1. Authentication test ediliyor...');
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
    console.log('');

    if (authResponse.data && authResponse.data.data && authResponse.data.data.access_token) {
      const token = authResponse.data.data.access_token;
      console.log('Token alındı:', token.substring(0, 20) + '...');
      console.log('');

      // 2. IFRAME ödeme test
      console.log('2. IFRAME ödeme test ediliyor...');
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
        iframe_web_uri: 'https://panel.hoowell.net',
        lang: 'tr',
        // Müşteri bilgileri
        buyer: {
          customer_id: `CUST-${Date.now()}`,
          name: 'Test',
          surname: 'Müşteri',
          email: 'test@hoowell.net',
          phone_number: '5551234567',
          country: 'TUR',
          city: 'İstanbul',
          address: 'Test Adres',
          zip_code: '34000'
        },
        // Ürün bilgileri
        products: [
          {
            product_id: 'TEST-PRODUCT',
            category: 'Alkali İyonizer',
            name: 'HOOWELL Test Ürün',
            price: 100.00,
            quantity: 1,
            description: 'HOOWELL Test Ürünü'
          }
        ],
        // Fatura adresi
        billing_address: {
          name: 'Test Müşteri',
          city: 'İstanbul',
          country: 'Türkiye',
          address: 'Test Fatura Adresi',
          zip_code: '34000'
        },
        // Teslimat adresi
        shipping_address: {
          name: 'Test Müşteri',
          city: 'İstanbul',
          country: 'Türkiye',
          address: 'Test Teslimat Adresi',
          zip_code: '34000'
        },
        // CSS Variables
        css_variables: {
          text_color: "#1f2937",
          text_font_weight: "500",
          font_family: "Segoe UI, Roboto, sans-serif",
          font_size: "16px",
          input_bg: "#ffffff",
          input_border: "1px solid #d1d5db",
          input_radius: "8px",
          input_padding: "12px",
          input_color: "#111827",
          input_font_weight: "400",
          button_background_color: "#10b981",
          button_background_color_hover: "#059669",
          button_color: "#ffffff",
          button_color_hover: "#ffffff",
          button_padding: "12px 24px",
          button_border: "none",
          button_border_hover: "none",
          button_width: "100%",
          button_max_width: "300px",
          button_transition: "all 0.3s ease",
          button_container_text_align: "center",
          button_container_margin_top: "24px",
          label_margin: "0 0 8px 0",
          installment_border_color: "#e5e7eb",
          installment_selected_border_color: "#10b981",
          installment_selected_background_color: "#ecfdf5",
          hide_installments: "0",
          hide_pay_button: "0",
          hide_labels: "0"
        }
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
      console.log('Payment Response:', JSON.stringify(paymentResponse.data, null, 2));
      console.log('');

      if (paymentResponse.data && paymentResponse.data.data && paymentResponse.data.data.url) {
        console.log('🎉 TREPS entegrasyonu başarılı!');
        console.log('IFRAME URL:', paymentResponse.data.data.url);
        console.log('Token:', paymentResponse.data.data.token);
      }
    }

  } catch (error) {
    console.error('❌ TREPS test hatası:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Test çalıştır
testTrepsConnection();
