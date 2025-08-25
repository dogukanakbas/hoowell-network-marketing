# TREPS ÖDEME AKIŞI RAPORU

## 🔄 ÖDEME SÜRECİ

### 1. FRONTEND'DEN BACKEND'E İSTEK
```javascript
// CustomerRegistration.js
const response = await axios.post('/api/treps/create-payment', {
  amount: selectedProduct?.total || 0,
  orderId: `CUST_${Date.now()}`,
  description: `HOOWELL Müşteri Kaydı - ${formData.first_name} ${formData.last_name}`,
  customerName: `${formData.first_name} ${formData.last_name}`,
  customerEmail: formData.email,
  customerPhone: formData.phone,
  customerCity: formData.city,
  customerAddress: formData.delivery_address,
  customerZipCode: '34000',
  productName: selectedProduct?.name || 'HOOWELL Ürün',
  productId: selectedProduct?.id || 'HOOWELL-PRODUCT'
});
```

### 2. BACKEND'DEN TREPS'E İSTEK
```javascript
// backend/routes/treps.js
const response = await axios.post(`${TREPS_CONFIG.baseUrl}/api/payment/hostedpage`, paymentData, {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});
```

### 3. TREPS'ten DÖNEN YANIT
```json
{
  "status": true,
  "message": null,
  "data": {
    "url": "https://pohp.treps.tr/iframe/HST-2-e4DRw9i2T5NzPd7t1BSy83FjXn61YpJb5r2AKk74",
    "token": "HST-2-e4DRw9i2T5NzPd7t1BSy83FjXn61YpJb5r2AKk74",
    "expire_date": "2025-07-01T02:59:59"
  }
}
```

### 4. BACKEND'DEN FRONTEND'E YANIT
```json
{
  "success": true,
  "url": "https://pohp.treps.tr/iframe/HST-2-e4DRw9i2T5NzPd7t1BSy83FjXn61YpJb5r2AKk74",
  "token": "HST-2-e4DRw9i2T5NzPd7t1BSy83FjXn61YpJb5r2AKk74",
  "paymentId": "HST-2-e4DRw9i2T5NzPd7t1BSy83FjXn61YpJb5r2AKk74",
  "expire_date": "2025-07-01T02:59:59",
  "message": "TREPS IFRAME ödeme oluşturuldu"
}
```

### 5. FRONTEND'DE YÖNLENDİRME
```javascript
// CustomerRegistration.js
if (response.data.success) {
  // TREPS iframe URL'ine doğrudan yönlendir
  window.location.href = response.data.url;
}
```

## 🎯 ÖNEMLİ NOKTALAR

### ✅ DOĞRU YÖNLENDİRME
- **Eski:** `/payment?method=treps&paymentId=${response.data.paymentId}`
- **Yeni:** `response.data.url` (doğrudan TREPS iframe URL'i)

### 📋 DÖNEN VERİLER
- **url:** TREPS iframe sayfasının URL'i
- **token:** Ödeme token'ı (paymentId olarak kullanılıyor)
- **expire_date:** Ödeme linkinin son geçerlilik tarihi
- **success:** İşlem başarı durumu

### 🔄 AKIŞ ÖZETİ
1. Kullanıcı "TREPS ile Güvenli Ödeme Yap" butonuna tıklar
2. Frontend backend'e ödeme isteği gönderir
3. Backend TREPS'e iframe ödeme isteği gönderir
4. TREPS iframe URL'i döner
5. Frontend kullanıcıyı TREPS iframe sayfasına yönlendirir
6. Kullanıcı iframe içinde ödeme yapar
7. Başarılı ödeme sonrası return_url'e yönlendirilir

## 🚀 SONUÇ
Artık kullanıcılar doğrudan TREPS iframe sayfasına yönlendiriliyor ve ödeme yapabiliyorlar!
