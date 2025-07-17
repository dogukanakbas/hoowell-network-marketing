import React from 'react';
import { useAuth } from '../context/AuthContext';

const PaymentBlockedWarning = () => {
  const { user } = useAuth();

  if (!user?.payment_blocked) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        maxWidth: '500px',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          fontSize: '60px',
          color: '#dc3545',
          marginBottom: '20px'
        }}>
          ⚠️
        </div>
        
        <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>
          Ödeme Gerekli
        </h2>
        
        <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
          Yüklediğiniz ödeme makbuzu kontrol edildi ve geçersiz bulundu. 
          Eğitimlere devam edebilmek için lütfen geçerli bir ödeme makbuzu yükleyiniz.
        </p>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          fontSize: '14px',
          color: '#6c757d'
        }}>
          <strong>Not:</strong> Ödeme makbuzunuz onaylandıktan sonra bu uyarı otomatik olarak kalkacaktır.
        </div>
        
        <button 
          onClick={() => window.location.href = '/payment'}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Ödeme Yap
        </button>
        
        <button 
          onClick={() => window.location.href = '/dashboard'}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Ana Sayfa
        </button>
      </div>
    </div>
  );
};

export default PaymentBlockedWarning;