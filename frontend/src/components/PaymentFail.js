import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const PaymentFail = () => {
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get('error') || 'Ödeme işlemi tamamlanamadı';

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
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>❌</div>
        
        <h1 style={{ color: '#dc3545', marginBottom: '20px' }}>
          Ödeme Başarısız
        </h1>
        
        <p style={{ fontSize: '18px', marginBottom: '30px', color: '#666' }}>
          {errorMessage}
        </p>

        <div style={{
          backgroundColor: '#f8d7da',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '30px',
          color: '#721c24'
        }}>
          <h4 style={{ marginBottom: '15px' }}>Olası Nedenler:</h4>
          <ul style={{ textAlign: 'left', marginBottom: '0' }}>
            <li>Kart limitiniz yetersiz olabilir</li>
            <li>Kart bilgileriniz hatalı girilmiş olabilir</li>
            <li>3D Secure doğrulaması tamamlanmamış olabilir</li>
            <li>Banka tarafından işlem reddedilmiş olabilir</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: '#d1ecf1',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '30px',
          color: '#0c5460'
        }}>
          💡 <strong>Alternatif:</strong> IBAN ile havale/EFT yaparak da ödemenizi gerçekleştirebilirsiniz.
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {(searchParams.get('payment_type') === 'franchise' || searchParams.get('method') === 'treps') ? (
            // İş ortağı kaydı için kaydı tamamla butonu
            <Link 
              to="/partner-registration?step=7&payment=failed" 
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              ✅ Kaydı Tamamla
            </Link>
          ) : (
            // Müşteri kaydı için tekrar dene
            <Link 
              to="/payment" 
              style={{
                backgroundColor: '#FFD700',
                color: '#000',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              🔄 Tekrar Dene
            </Link>
          )}
          <Link 
            to="/" 
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            🏠 Ana Sayfaya Dön
          </Link>
        </div>

        <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
          Sorun devam ederse lütfen destek ekibimizle iletişime geçin.
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;