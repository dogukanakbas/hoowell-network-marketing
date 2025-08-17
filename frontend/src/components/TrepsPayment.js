import React, { useState } from 'react';
import axios from 'axios';

const TrepsPayment = ({ amount, orderId, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [iframeUrl, setIframeUrl] = useState('');
  const [showIframe, setShowIframe] = useState(false);

  const createPayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/treps/create-payment', {
        amount: amount,
        orderId: orderId,
        description: `HOOWELL Sipariş #${orderId}`,
        customerName: 'HOOWELL Müşteri',
        customerEmail: 'musteri@hoowell.com',
        customerPhone: '5551234567',
        customerCity: 'İstanbul',
        customerAddress: 'HOOWELL Adresi',
        customerZipCode: '34000',
        productName: 'HOOWELL Su Arıtma Sistemi',
        productId: 'HOOWELL-PRODUCT'
      });

      if (response.data.success) {
        setPaymentId(response.data.token);
        setPaymentStatus('created');
        
        // IFRAME URL'ini göster
        setIframeUrl(response.data.url);
        setShowIframe(true);
        
        if (onSuccess) {
          onSuccess(response.data);
        }
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('TREPS ödeme hatası:', error);
      setPaymentStatus('error');
      
      if (onError) {
        onError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (id) => {
    try {
      const response = await axios.get(`/api/treps/payment-status/${id}`);
      
      if (response.data.success) {
        setPaymentStatus(response.data.status);
        
        if (response.data.status === 'completed') {
          if (onSuccess) {
            onSuccess(response.data);
          }
        }
      }
    } catch (error) {
      console.error('Ödeme durumu kontrol hatası:', error);
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'created':
        return 'Ödeme oluşturuldu, işlem bekleniyor...';
      case 'pending':
        return 'Ödeme bekleniyor...';
      case 'processing':
        return 'Ödeme işleniyor...';
      case 'completed':
        return 'Ödeme başarıyla tamamlandı! ✅';
      case 'failed':
        return 'Ödeme başarısız! ❌';
      case 'error':
        return 'Bir hata oluştu! ❌';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'completed':
        return '#28a745';
      case 'failed':
      case 'error':
        return '#dc3545';
      case 'pending':
      case 'processing':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  if (showIframe && iframeUrl) {
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
            🏦
          </div>
          <h3 style={{
            color: '#0e2323',
            marginBottom: '10px',
            fontSize: '24px'
          }}>
            TREPS ile Güvenli Ödeme
          </h3>
          <p style={{
            color: '#6c757d',
            fontSize: '14px',
            margin: 0
          }}>
            TCMB güvencesi ile banka altyapısı
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
          src={iframeUrl}
          width="100%"
          height="500px"
          frameBorder="0"
          allow="payment"
          style={{
            borderRadius: '10px',
            border: '1px solid #dee2e6'
          }}
        />

        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '10px',
          border: '1px solid #2196f3'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#1565c0',
            textAlign: 'center'
          }}>
            <strong>ℹ️ Bilgi:</strong> TREPS ile güvenli ödeme yapabilirsiniz. İşlem tamamlandığında otomatik olarak yönlendirileceksiniz.
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
          🏦
        </div>
        <h3 style={{
          color: '#0e2323',
          marginBottom: '10px',
          fontSize: '24px'
        }}>
          TREPS ile Güvenli Ödeme
        </h3>
        <p style={{
          color: '#6c757d',
          fontSize: '14px',
          margin: 0
        }}>
          Türkiye Elektronik Para ve Ödeme Sistemleri
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

      {paymentStatus && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          padding: '15px',
          marginBottom: '20px',
          border: `2px solid ${getStatusColor()}`,
          textAlign: 'center'
        }}>
          <div style={{
            color: getStatusColor(),
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            {getStatusMessage()}
          </div>
        </div>
      )}

      {!paymentStatus && (
        <button
          onClick={createPayment}
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
          {loading ? '⏳ İşlem Yapılıyor...' : '🏦 TREPS ile Öde'}
        </button>
      )}

      {paymentId && (
        <div style={{
          backgroundColor: '#e7f3ff',
          borderRadius: '10px',
          padding: '15px',
          marginTop: '20px',
          border: '1px solid #b3d9ff'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#0066cc',
            textAlign: 'center'
          }}>
            <strong>Ödeme ID:</strong> {paymentId}
          </div>
        </div>
      )}

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        borderRadius: '10px',
        border: '1px solid #ffeaa7'
      }}>
        <div style={{
          fontSize: '12px',
          color: '#856404',
          textAlign: 'center'
        }}>
          <strong>ℹ️ Bilgi:</strong> TREPS ödemeleri güvenli banka altyapısı kullanır ve anında işlenir.
        </div>
      </div>
    </div>
  );
};

export default TrepsPayment;
