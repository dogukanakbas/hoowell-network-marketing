import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('iban');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  // Partner bilgilerini location state'den al
  const partnerInfo = location.state?.partnerInfo || {};
  const partnerId = location.state?.partnerId || 'Bilinmiyor';

  const handlePaymentComplete = () => {
    setPaymentCompleted(true);
    // 3 saniye sonra admin paneline yönlendir
    setTimeout(() => {
      navigate('/admin/users');
    }, 3000);
  };

  if (paymentCompleted) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '40px 20px'
      }}>
        <div style={{
          fontSize: '80px',
          marginBottom: '20px',
          color: '#28a745'
        }}>
          ✅
        </div>
        <div style={{
          backgroundColor: 'var(--card-gray)',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          maxWidth: '600px'
        }}>
          <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px' }}>
            Ödeme Bilgileri İletildi
          </h2>
          <p style={{ color: 'var(--text-light)', fontSize: '16px', lineHeight: '1.5' }}>
            Partner bilgileri başarıyla kaydedildi ve ödeme bilgileri iletildi.
            Admin paneline yönlendiriliyorsunuz...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0' }}>
      {/* Başlık */}
      <div style={{
        backgroundColor: 'var(--card-gray)',
        borderRadius: '15px',
        padding: '30px',
        marginBottom: '30px',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
          Partner Ödeme Bilgileri
        </h1>
        <p style={{ color: 'var(--text-light)', fontSize: '16px' }}>
          Yeni kayıtlı partner için ödeme bilgilerini iletin
        </p>
      </div>

      {/* Partner Bilgileri */}
      <div style={{
        backgroundColor: 'var(--card-gray)',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '30px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px' }}>
          Partner Bilgileri
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <strong>Partner ID:</strong> {partnerId}
          </div>
          <div>
            <strong>E-posta:</strong> {partnerInfo.email || 'Bilinmiyor'}
          </div>
          <div>
            <strong>Partner Tipi:</strong> {partnerInfo.partner_type === 'individual' ? 'Bireysel' : 'Kurumsal'}
          </div>
          <div>
            <strong>Şifre:</strong> {partnerInfo.password || 'Otomatik oluşturuldu'}
          </div>
        </div>
      </div>

      {/* Ödeme Yöntemi Seçimi */}
      <div style={{
        backgroundColor: 'var(--card-gray)',
        borderRadius: '15px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: 'var(--primary-dark)', marginBottom: '25px' }}>
          Ödeme Yöntemi Seçin
        </h3>
        
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px 20px',
            border: paymentMethod === 'iban' ? '2px solid var(--primary-dark)' : '2px solid var(--border-color)',
            borderRadius: '10px',
            cursor: 'pointer',
            backgroundColor: paymentMethod === 'iban' ? 'rgba(26, 74, 58, 0.1)' : 'white',
            flex: 1
          }}>
            <input
              type="radio"
              name="paymentMethod"
              value="iban"
              checked={paymentMethod === 'iban'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            <div>
              <div style={{ fontWeight: 'bold', color: 'var(--text-dark)' }}>IBAN ile Ödeme</div>
              <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>Banka havalesi</div>
            </div>
          </label>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px 20px',
            border: '2px solid #ccc',
            borderRadius: '10px',
            cursor: 'not-allowed',
            backgroundColor: '#f5f5f5',
            flex: 1,
            opacity: 0.5
          }}>
            <input
              type="radio"
              name="paymentMethod"
              value="credit"
              disabled
              style={{ marginRight: '10px' }}
            />
            <div>
              <div style={{ fontWeight: 'bold', color: '#666' }}>Kredi Kartı</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Yakında aktif</div>
            </div>
          </label>
        </div>

        {/* IBAN Bilgileri */}
        {paymentMethod === 'iban' && (
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '25px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <h4 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>
              IBAN Bilgileri
            </h4>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '16px',
              border: '2px solid var(--primary-dark)'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>IBAN:</strong> TR77 0011 1000 0000 0153 1671 66
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Alıcı:</strong> HOOWELL NETWORK MARKETING LTD. ŞTİ.
              </div>
              <div>
                <strong>Tutar:</strong> 100 USD (Yaklaşık ₺4.000)
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '8px',
              padding: '15px',
              marginTop: '15px'
            }}>
              <h5 style={{ color: '#856404', marginBottom: '10px' }}>
                ⚠️ Partner'a İletilecek Bilgiler:
              </h5>
              <ul style={{ color: '#856404', margin: 0, paddingLeft: '20px' }}>
                <li>IBAN numarasını partner'a iletin</li>
                <li>Ödeme tutarını belirtin (100 USD)</li>
                <li>Partner ID'sini açıklama kısmına yazmasını söyleyin</li>
                <li>Ödeme dekontunu sisteme yüklemesini hatırlatın</li>
              </ul>
            </div>
          </div>
        )}

        {/* Ödeme Tamamlandı Butonu */}
        <button
          onClick={handlePaymentComplete}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: 'var(--primary-dark)',
            color: 'var(--white)',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Ödeme Bilgileri İletildi
        </button>
      </div>
    </div>
  );
};

export default AdminPayment;