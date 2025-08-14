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

  // PayTR token oluşturma (PHP örneğine uygun)
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
      timeout_limit = 30
    } = paymentData;

    // Bildirim URL'si - PayTR'nin ödeme sonucunu bildireceği endpoint
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? (process.env.BACKEND_URL || 'https://hoowell.net') 
      : 'http://localhost:5001';
    const bildirim_url = `${baseUrl}/api/paytr/callback`;

    // PayTR hash string (PHP örneğindeki sıra)
    const hashStr = `${this.merchantId}${user_ip}${merchant_oid}${email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}`;
    console.log('PayTR Hash String:', hashStr);
    
    const paytr_token = this.createHash(hashStr);
    console.log('PayTR Token:', paytr_token);

    const postData = {
      merchant_id: this.merchantId,
      user_ip,
      merchant_oid,
      email,
      payment_amount,
      paytr_token,
      user_basket,
      debug_on,
      no_installment,
      max_installment,
      user_name,
      user_address,
      user_phone,
      merchant_ok_url,
      merchant_fail_url,
      bildirim_url, // ÖNEMLİ: PayTR'nin ödeme sonucunu bildireceği URL
      timeout_limit,
      currency,
      test_mode
    };

    console.log('PayTR Bildirim URL:', bildirim_url);

    return postData;
  }

  // Hash oluşturma fonksiyonu (PayTR dokümantasyonuna uygun)
  createHash(data) {
    return crypto
      .createHmac('sha256', this.merchantKey)
      .update(data + this.merchantSalt)
      .digest('base64');
  }

  // PayTR'ye ödeme isteği gönderme (iframe desteği ile)
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
          paymentUrl: `https://www.paytr.com/odeme/guvenli/${response.data.token}`,
          iframeUrl: `https://www.paytr.com/odeme/guvenli/${response.data.token}`,
          iframeToken: response.data.token
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

  // Base64 encode için helper
  base64Encode(str) {
    return Buffer.from(str, 'utf8').toString('base64');
  }
}

module.exports = new PayTRService();