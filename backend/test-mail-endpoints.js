// Test Mail Endpoints
// Bu dosya mail sistemini test etmek için kullanılır

const express = require('express');
const { 
  sendCustomerWelcomeEmail, 
  sendSellerNotificationEmail, 
  sendPartnerWelcomeEmail, 
  sendSponsorNotificationEmail,
  sendAccountingReportEmail
} = require('./services/mailService');

const app = express();

// Test endpoint'leri
app.get('/test/customer-welcome', async (req, res) => {
  try {
    const result = await sendCustomerWelcomeEmail({
      email: 'test@example.com',
      product_name: 'HİBRİT ALKALİ İYONİZER CİHAZI',
      sale_date: '08.01.2025',
      total_amount: 86400
    }, {
      first_name: 'Murat',
      last_name: 'Soylu',
      sponsor_id: 'P 2025 000 999',
      phone: '0545 678 93 45'
    });

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/test/seller-notification', async (req, res) => {
  try {
    const result = await sendSellerNotificationEmail({
      email: 'seller@example.com',
      first_name: 'Murat'
    }, {
      first_name: 'Ayşe',
      last_name: 'Şenyurt',
      phone: '0545 234 56 78',
      email: 'ayse@example.com',
      address: 'İstanbul, Türkiye',
      product_name: 'HİBRİT ALKALİ İYONİZER CİHAZI',
      total_amount: 86400,
      kkp_points: 2160
    });

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/test/partner-welcome', async (req, res) => {
  try {
    const result = await sendPartnerWelcomeEmail({
      email: 'partner@example.com',
      first_name: 'Ayşe',
      last_name: 'Şenyurt',
      sponsor_id: 'P 2025 000 045',
      temp_password: 'Ayşe2025'
    }, {
      first_name: 'Murat',
      last_name: 'Soylu',
      sponsor_id: 'P 2025 000 999',
      phone: '0545 678 93 45'
    });

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/test/sponsor-notification', async (req, res) => {
  try {
    const result = await sendSponsorNotificationEmail({
      email: 'sponsor@example.com',
      first_name: 'Murat'
    }, {
      first_name: 'Ayşe',
      last_name: 'Şenyurt',
      sponsor_id: 'P 2025 000 045',
      phone: '0545 234 56 78',
      email: 'ayse@example.com'
    });

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/test/accounting-report', async (req, res) => {
  try {
    const result = await sendAccountingReportEmail({
      sale_date: '08.01.2025',
      customer_id: 'C 2025 000 999',
      seller_id: 'P 2025 000 999',
      customer_name: 'Ayşe',
      customer_surname: 'Şenyurt',
      customer_phone: '0545 234 56 78',
      customer_email: 'ayse@example.com',
      customer_address: 'İstanbul, Türkiye',
      customer_district: 'Kadıköy',
      customer_city: 'İstanbul',
      product_name: 'HİBRİT ALKALİ İYONİZER CİHAZI',
      kkp_value: 2160,
      product_price: 72000,
      tax_rate: 20,
      sale_amount: 86400,
      quantity: 1,
      total_amount: 86400,
      payment_method: 'BANKA HAVALESİ',
      bank_name: 'Ziraat Bankası',
      payment_status: 'ÖDENDİ',
      seller_name: 'Murat Soylu',
      seller_sponsor: 'Ahmet Yılmaz',
      sponsor_id: 'P 2025 000 888'
    });

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test mail server running on port ${PORT}`);
  console.log('Test endpoints:');
  console.log('GET /test/customer-welcome');
  console.log('GET /test/seller-notification');
  console.log('GET /test/partner-welcome');
  console.log('GET /test/sponsor-notification');
  console.log('GET /test/accounting-report');
});

module.exports = app;
