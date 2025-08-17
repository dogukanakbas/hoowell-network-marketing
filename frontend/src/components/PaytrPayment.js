import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaytrPayment = ({ amount, orderId, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [paytrUrl, setPaytrUrl] = useState('');
  const [showIframe, setShowIframe] = useState(false);

  const createPaytrPayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/paytr/create-payment', {
        amount: amount,
        orderId: orderId,
        description: `HOOWELL Sipariş #${orderId}`
      });

      if (response.data.success) {
        setPaytrUrl(response.data.paytrUrl);
        setShowIframe(true);
        
        if (onSuccess) {
          onSuccess(response.data);
        }
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('PAYTR ödeme hatası:', error);
      
      if (onError) {
        onError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleIframeLoad = () => {
    // Iframe yüklendiğinde yapılacak işlemler
    console.log('PAYTR iframe yüklendi');
  };

  const handleIframeMessage = (event) => {
    // PAYTR'den gelen mesajları dinle
    if (event.origin !== 'https://www.paytr.com') return;
    
    if (event.data === 'success') {
      if (onSuccess) {
        onSuccess({ status: 'completed', method: 'paytr' });
      }
    } else if (event.data === 'error') {
      if (onError) {
        onError('PAYTR ödeme işlemi başarısız');
      }
    }
  };

  useEffect(() => {
    // Mesaj dinleyicisini ekle
    window.addEventListener('message', handleIframeMessage);
    
    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, []);

  if (showIframe && paytrUrl) {
    return (
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '15px',
        padding: '20px',
        border: '2px solid #e9ecef',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '15px'
          }}>
            💳
          </div>
          <h3 style={{
            color: '#0e2323',
            marginBottom: '10px',
            fontSize: '24px'
          }}>
            PAYTR ile Güvenli Ödeme
          </h3>
          <p style={{
            color: '#6c757d',
            fontSize: '14px',
            margin: 0
          }}>
            Kredi Kartı, Havale, EFT ile Öde
          </p>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '20px',
          border: '1px solid #dee2e6'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <span style={{ fontWeight: 'bold', color: '#0e2323' }}>
              Sipariş No:
            </span>
            <span style={{ color: '#6c757d' }}>
              #{orderId}
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <span style={{ fontWeight: 'bold', color: '#0e2323' }}>
              Tutar:
            </span>
            <span style={{ 
              color: '#28a745', 
              fontWeight: 'bold',
              fontSize: '18px'
            }}>
              {amount.toLocaleString('tr-TR')} ₺
            </span>
          </div>
        </div>

        <iframe
          src={paytrUrl}
          width="100%"
          height="500px"
          frameBorder="0"
          allow="payment"
          onLoad={handleIframeLoad}
          style={{
            borderRadius: '10px',
            border: '1px solid #dee2e6'
          }}
        />

        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e7f3ff',
          borderRadius: '10px',
          border: '1px solid #b3d9ff'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#0066cc',
            textAlign: 'center'
          }}>
            <strong>ℹ️ Bilgi:</strong> PAYTR ile güvenli ödeme yapabilirsiniz. İşlem tamamlandığında otomatik olarak yönlendirileceksiniz.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      borderRadius: '15px',
      padding: '30px',
      border: '2px solid #e9ecef',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '25px'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '15px'
        }}>
          💳
        </div>
        <h3 style={{
          color: '#0e2323',
          marginBottom: '10px',
          fontSize: '24px'
        }}>
          PAYTR ile Güvenli Ödeme
        </h3>
        <p style={{
          color: '#6c757d',
          fontSize: '14px',
          margin: 0
        }}>
          Kredi Kartı, Havale, EFT ile Öde
        </p>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px'
        }}>
          <span style={{ fontWeight: 'bold', color: '#0e2323' }}>
            Sipariş No:
          </span>
          <span style={{ color: '#6c757d' }}>
            #{orderId}
          </span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px'
        }}>
          <span style={{ fontWeight: 'bold', color: '#0e2323' }}>
            Tutar:
          </span>
          <span style={{ 
            color: '#28a745', 
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            {amount.toLocaleString('tr-TR')} ₺
          </span>
        </div>
      </div>

      <button
        onClick={createPaytrPayment}
        disabled={loading}
        style={{
          width: '100%',
          padding: '15px',
          backgroundColor: '#007bff',
          color: '#ffffff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.target.style.backgroundColor = '#0056b3';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.target.style.backgroundColor = '#007bff';
          }
        }}
      >
        {loading ? '⏳ İşlem Yapılıyor...' : '💳 PAYTR ile Öde'}
      </button>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e7f3ff',
        borderRadius: '10px',
        border: '1px solid #b3d9ff'
      }}>
        <div style={{
          fontSize: '12px',
          color: '#0066cc',
          textAlign: 'center'
        }}>
          <strong>ℹ️ Bilgi:</strong> PAYTR ile kredi kartı, havale ve EFT ile güvenli ödeme yapabilirsiniz.
        </div>
      </div>
    </div>
  );
};

export default PaytrPayment;
