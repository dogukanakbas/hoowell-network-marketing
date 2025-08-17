import React, { useState } from 'react';
import PaytrPayment from './PaytrPayment';
import TrepsPayment from './TrepsPayment';

const PaymentOptions = ({ amount, orderId, onSuccess, onError }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleSuccess = (data) => {
    if (onSuccess) {
      onSuccess(data);
    }
  };

  const handleError = (error) => {
    if (onError) {
      onError(error);
    }
  };

  const resetSelection = () => {
    setSelectedMethod(null);
  };

  if (selectedMethod) {
    return (
      <div>
        <div style={{
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <button
            onClick={resetSelection}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Geri Dön
          </button>
        </div>
        
        {selectedMethod === 'paytr' && (
          <PaytrPayment
            amount={amount}
            orderId={orderId}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        )}
        
        {selectedMethod === 'treps' && (
          <TrepsPayment
            amount={amount}
            orderId={orderId}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{
          color: '#0e2323',
          marginBottom: '10px',
          fontSize: '28px'
        }}>
          Ödeme Yöntemi Seçin
        </h2>
        <p style={{
          color: '#6c757d',
          fontSize: '16px'
        }}>
          Toplam Tutar: <strong>{amount.toLocaleString('tr-TR')} ₺</strong>
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* PAYTR Seçeneği */}
        <div
          onClick={() => setSelectedMethod('paytr')}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '15px',
            padding: '25px',
            border: '2px solid #e9ecef',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#007bff';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(0, 123, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = '#e9ecef';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <div style={{
            fontSize: '48px',
            marginBottom: '15px'
          }}>
            💳
          </div>
          <h3 style={{
            color: '#0e2323',
            marginBottom: '10px',
            fontSize: '20px'
          }}>
            PAYTR ile Öde
          </h3>
          <p style={{
            color: '#6c757d',
            fontSize: '14px',
            margin: '0 0 15px 0'
          }}>
            Kredi Kartı, Havale, EFT
          </p>
          <div style={{
            backgroundColor: '#e7f3ff',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '12px',
            color: '#0066cc'
          }}>
            ⚡ Hızlı ve Güvenli
          </div>
        </div>

        {/* TREPS Seçeneği */}
        <div
          onClick={() => setSelectedMethod('treps')}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '15px',
            padding: '25px',
            border: '2px solid #e9ecef',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#28a745';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = '#e9ecef';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <div style={{
            fontSize: '48px',
            marginBottom: '15px'
          }}>
            🏦
          </div>
          <h3 style={{
            color: '#0e2323',
            marginBottom: '10px',
            fontSize: '20px'
          }}>
            TREPS ile Öde
          </h3>
          <p style={{
            color: '#6c757d',
            fontSize: '14px',
            margin: '0 0 15px 0'
          }}>
            Banka Altyapısı
          </p>
          <div style={{
            backgroundColor: '#d4edda',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '12px',
            color: '#155724'
          }}>
            🛡️ Maksimum Güvenlik
          </div>
        </div>
      </div>

      {/* Bilgi Kutusu */}
      <div style={{
        backgroundColor: '#fff3cd',
        borderRadius: '10px',
        padding: '20px',
        border: '1px solid #ffeaa7'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <span style={{
            fontSize: '20px',
            marginRight: '10px'
          }}>
            ℹ️
          </span>
          <h4 style={{
            color: '#856404',
            margin: 0,
            fontSize: '16px'
          }}>
            Ödeme Yöntemi Hakkında
          </h4>
        </div>
        <div style={{
          color: '#856404',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          <p style={{ margin: '0 0 10px 0' }}>
            <strong>PAYTR:</strong> Kredi kartı, havale ve EFT ile hızlı ödeme
          </p>
          <p style={{ margin: 0 }}>
            <strong>TREPS:</strong> TCMB güvencesi ile banka altyapısı üzerinden güvenli ödeme
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;
