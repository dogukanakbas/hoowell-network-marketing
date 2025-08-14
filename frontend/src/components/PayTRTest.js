import React, { useState } from 'react';
import axios from 'axios';
import PayTRIframe from './PayTRIframe';

const PayTRTest = () => {
  const [showIframe, setShowIframe] = useState(false);
  const [iframeToken, setIframeToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const testPayTR = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/paytr/create-payment', {
        payment_type: 'education',
        user_info: {
          name: 'Test Kullanıcı',
          email: 'test@example.com',
          phone: '5555555555',
          address: 'Test Adres'
        }
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setIframeToken(response.data.iframeToken);
        setShowIframe(true);
        setMessage('PayTR iframe açılıyor...');
      } else {
        setMessage('Hata: ' + response.data.message);
      }
    } catch (error) {
      setMessage('Hata: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowIframe(false);
    setMessage('✅ Ödeme başarılı!');
  };

  const handleError = (error) => {
    setShowIframe(false);
    setMessage('❌ Ödeme hatası: ' + error);
  };

  const handleClose = () => {
    setShowIframe(false);
    setMessage('Ödeme iptal edildi');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>PayTR Iframe Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={testPayTR}
          disabled={loading}
          style={{
            padding: '15px 30px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Yükleniyor...' : 'PayTR Test Et'}
        </button>
      </div>

      {message && (
        <div style={{
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          backgroundColor: message.includes('✅') ? '#d4edda' : 
                          message.includes('❌') ? '#f8d7da' : '#d1ecf1',
          color: message.includes('✅') ? '#155724' : 
                 message.includes('❌') ? '#721c24' : '#0c5460'
        }}>
          {message}
        </div>
      )}

      {showIframe && (
        <PayTRIframe
          iframeToken={iframeToken}
          onSuccess={handleSuccess}
          onError={handleError}
          onClose={handleClose}
        />
      )}

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h4>Test Bilgileri:</h4>
        <ul>
          <li><strong>Test Kartı:</strong> 4355 0841 0000 0001</li>
          <li><strong>Son Kullanma:</strong> 12/26</li>
          <li><strong>CVV:</strong> 000</li>
          <li><strong>3D Secure Şifre:</strong> 123456</li>
        </ul>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Bu test kartı bilgileri PayTR test ortamında kullanılabilir.
        </p>
      </div>
    </div>
  );
};

export default PayTRTest;