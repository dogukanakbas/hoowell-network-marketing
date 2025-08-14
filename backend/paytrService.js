const crypto = require('crypto');
const axios = require('axios');

class PayTRService {
  constructor() {
    // PayTR Merchant Bilgileri (environment'a göre)
    this.merchantId = process.env.PAYTR_MERCHANT_ID || '605940';
    this.merchantKey = process.env.PAYTR_MERCHANT_KEY || 'tMCPPznCxw8sb8b8';
    this.merchantSalt = process.env.PAYTR_MERCHANT_SALT || 'bF1uwkXPAhDw5yok';
    this.testMode = process.env.NODE_ENV !== 'production';
    this.baseUrl = 'https://www.paytr.com/odeme/api/';
  }

  // PayTR token oluşturma
  createPaymentToken(paymentData) {
    const {
      merchant_oid,
      email,
      payment_amount,
      user_name,
      user_address,
      user_phone,
      user_ip,
      merchant_ok_url,
      merchant_fail_url,
      user_basket,
      debug_on = 1,
      test_mode = this.testMode ? 1 : 0,
      no_installment = 0,
      max_installment = 0,
      currency = 'TL',
      payment_type = 'card'
    } = paymentData;

    // PayTR için gerekli hash oluşturma (PayTR resmi dokümantasyonu)
    // Doğru sıra: merchant_id + user_ip + user_name + user_address + user_phone + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode + merchant_oid
    const hashStr = `${this.merchantId}${user_ip}${user_name}${user_address}${user_phone}${email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}${merchant_oid}`;
    console.log('PayTR Hash String:', hashStr);
    console.log('PayTR Merchant Key:', this.merchantKey);
    console.log('PayTR Merchant Salt:', this.merchantSalt);
    const paytr_token = this.createHash(hashStr);
    console.log('PayTR Token:', paytr_token);

    const postData = {
      merchant_id: this.merchantId,
      user_name,
      user_address,
      user_phone,
      user_ip,
      email,
      payment_amount,
      merchant_oid,
      user_basket,
      no_installment,
      max_installment,
      currency,
      test_mode,
      debug_on,
      merchant_ok_url,
      merchant_fail_url,
      payment_type,
      paytr_token
    };

    return postData;
  }

  // Hash oluşturma fonksiyonu
  createHash(data) {
    return crypto
      .createHmac('sha256', this.merchantKey)
      .update(data + this.merchantSalt)
      .digest('base64');
  }

  // PayTR'ye ödeme isteği gönderme
  async createPayment(paymentData) {
    try {
      const tokenData = this.createPaymentToken(paymentData);
      console.log('PayTR Token Data:', JSON.stringify(tokenData, null, 2));

      const response = await axios.post('https://www.paytr.com/odeme/api/get-token', tokenData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: [(data) => {
          return Object.keys(data)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
            .join('&');
        }]
      });

      console.log('PayTR API Response:', response.data);

      if (response.data.status === 'success') {
        return {
          success: true,
          token: response.data.token,
          paymentUrl: `https://www.paytr.com/odeme/guvenli/${response.data.token}`
        };
      } else {
        console.error('PayTR Error Details:', response.data);
        return {
          success: false,
          error: response.data.reason || 'PayTR token oluşturulamadı'
        };
      }
    } catch (error) {
      console.error('PayTR API Error:', error);
      return {
        success: false,
        error: 'PayTR bağlantı hatası'
      };
    }
  }

  // Callback doğrulama
  verifyCallback(callbackData) {
    const {
      merchant_oid,
      status,
      total_amount,
      hash
    } = callbackData;

    const hashStr = `${merchant_oid}${this.merchantSalt}${status}${total_amount}`;
    const calculatedHash = crypto
      .createHmac('sha256', this.merchantKey)
      .update(hashStr)
      .digest('base64');

    return calculatedHash === hash;
  }

  // Ödeme sepeti formatı
  formatUserBasket(items) {
    return items.map(item => [
      item.name,
      item.price,
      item.quantity
    ]);
  }
}

module.exports = new PayTRService();