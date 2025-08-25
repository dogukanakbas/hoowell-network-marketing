import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const merchant_oid = searchParams.get('merchant_oid');
    const paymentId = searchParams.get('paymentId');
    const method = searchParams.get('method');
    
    if (merchant_oid) {
      // PAYTR ödeme
      checkPaymentStatus(merchant_oid);
    } else if (paymentId && method === 'treps') {
      // TREPS ödeme
      checkTrepsPaymentStatus(paymentId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const checkPaymentStatus = async (merchant_oid) => {
    try {
      const response = await axios.get(`/api/paytr/payment-status/${merchant_oid}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPaymentInfo(response.data);
    } catch (error) {
      console.error('Payment status check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkTrepsPaymentStatus = async (paymentId) => {
    try {
      const response = await axios.get(`/api/treps/payment-status/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPaymentInfo(response.data);
    } catch (error) {
      console.error('TREPS payment status check error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f2324',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '500px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '20px' }}>⏳</div>
          <h2>Ödeme Durumu Kontrol Ediliyor...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f2324',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '600px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        {paymentInfo?.status === 'approved' ? (
          <>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
            <h1 style={{ color: '#28a745', marginBottom: '20px' }}>
              Ödeme Başarılı!
            </h1>
            <p style={{ fontSize: '18px', marginBottom: '30px', color: '#666' }}>
              PayTR ile ödemeniz başarıyla tamamlandı.
            </p>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '30px',
              textAlign: 'left'
            }}>
              <h4 style={{ marginBottom: '15px' }}>Ödeme Detayları:</h4>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div><strong>Tutar:</strong> {paymentInfo.amount?.toLocaleString()} TL</div>
                <div><strong>Ödeme Türü:</strong> {paymentInfo.payment_type === 'education' ? 'Eğitim Paketi' : 'Cihaz Paketi'}</div>
                <div><strong>Tarih:</strong> {new Date(paymentInfo.created_at).toLocaleString('tr-TR')}</div>
                <div><strong>Durum:</strong> <span style={{ color: '#28a745' }}>✅ Onaylandı</span></div>
              </div>
            </div>

            {paymentInfo.payment_type === 'education' && (
              <div style={{
                backgroundColor: '#d4edda',
                padding: '15px',
                borderRadius: '10px',
                marginBottom: '20px',
                color: '#155724'
              }}>
                🎓 Eğitim erişiminiz açılmıştır! Artık eğitim videolarını izleyebilirsiniz.
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>⏳</div>
            <h1 style={{ color: '#ffc107', marginBottom: '20px' }}>
              Ödeme İşleniyor
            </h1>
            <p style={{ fontSize: '18px', marginBottom: '30px', color: '#666' }}>
              Ödemeniz alındı ve işleme konuldu. Onay süreci tamamlandığında bilgilendirileceksiniz.
            </p>
          </>
        )}

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link 
            to="/dashboard" 
            style={{
              backgroundColor: '#FFD700',
              color: '#000',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            🏠 Ana Sayfaya Dön
          </Link>
          <Link 
            to="/payment" 
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            💳 Ödeme Geçmişi
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;