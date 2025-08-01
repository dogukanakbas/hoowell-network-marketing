import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext'; // Şu an kullanılmıyor
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  // const { user } = useAuth(); // Şu an kullanılmıyor
  const location = useLocation();
  const [paymentType, setPaymentType] = useState('education');
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [payments, setPayments] = useState([]);
  const [settings, setSettings] = useState({});

  // Yeni kayıt sistemi için state
  const partnerRegistrationData = location.state;
  const isPartnerRegistration = partnerRegistrationData && partnerRegistrationData.skipReceipt;

  useEffect(() => {
    fetchPayments();
    fetchSettings();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/api/payments/my', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const calculateAmount = () => {
    const usdRate = parseFloat(settings.usd_to_try_rate || 40);
    const vatRate = parseFloat(settings.vat_rate || 20);
    
    let usdAmount;
    if (paymentType === 'education') {
      usdAmount = parseFloat(settings.education_price_usd || 100);
    } else {
      usdAmount = parseFloat(settings.device_price_usd || 1800);
    }

    const tryAmount = usdAmount * usdRate;
    const vatAmount = tryAmount * (vatRate / 100);
    const totalAmount = tryAmount + vatAmount;

    return {
      usdAmount,
      tryAmount,
      vatAmount,
      totalAmount
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!receipt) {
      setMessage('Lütfen dekont dosyasını seçin');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('payment_type', paymentType);
      formData.append('receipt', receipt);

      // eslint-disable-next-line no-unused-vars
      const response = await axios.post('/api/payments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Ödeme makbuzu yüklendi! Eğitimlere erişiminiz açılmıştır. Ödemeniz kontrol edildikten sonra onaylanacaktır.');
      setReceipt(null);
      fetchPayments();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Ödeme kaydı oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  const amounts = calculateAmount();

  // İş ortağı kaydı için özel submit fonksiyonu
  const handlePartnerPaymentSubmit = async () => {
    setLoading(true);
    setMessage('');

    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post('/api/payments', {
        payment_type: 'franchise',
        partner_id: partnerRegistrationData.partnerId,
        total_amount: partnerRegistrationData.amount,
        skip_receipt: true
      });

      setMessage('✅ Ödeme kaydı başarıyla oluşturuldu! İş ortağı kaydı tamamlandı.');
    } catch (error) {
      setMessage('❌ Ödeme kaydı oluşturulamadı: ' + (error.response?.data?.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isPartnerRegistration ? (
        // İş Ortağı Kayıt Ödeme Ekranı
        <div className="dashboard-card" style={{ marginBottom: '30px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
              💳 İş Ortağı Ödeme Kaydı
            </h2>
            <p style={{ color: 'var(--text-light)' }}>
              {partnerRegistrationData.partnerInfo?.name} için ödeme kaydı oluşturuluyor
            </p>
          </div>

          {/* IBAN Bilgileri */}
          <div style={{ 
            backgroundColor: 'var(--card-gray)', 
            padding: '25px', 
            borderRadius: '15px', 
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>
              🏦 IBAN Bilgileri
            </h3>
            <div style={{ 
              backgroundColor: 'var(--white)', 
              padding: '20px', 
              borderRadius: '10px',
              fontFamily: 'monospace',
              fontSize: '18px',
              fontWeight: 'bold',
              letterSpacing: '2px',
              marginBottom: '10px'
            }}>
              TR77 0011 1000 0000 0153 1671 66
            </div>
            <div style={{ fontSize: '16px', color: 'var(--text-dark)' }}>
              <strong>Alıcı:</strong> HOOWELL GLOBAL SU ARITMA SİSTEMLERİ ANONİM ŞİRKETİ
            </div>
          </div>

          {/* Ödeme Tutarı */}
          <div style={{ 
            backgroundColor: 'var(--white)', 
            padding: '25px', 
            borderRadius: '15px', 
            marginBottom: '25px',
            textAlign: 'center',
            border: '2px solid var(--accent-gold)'
          }}>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>
              💰 Ödenecek Tutar
            </h3>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
              {partnerRegistrationData.amount?.toLocaleString()} ₺
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '5px' }}>
              Franchise Satış Paketi (KDV Dahil)
            </div>
          </div>

          {/* Müşteri Bilgileri */}
          <div style={{ 
            backgroundColor: 'var(--card-gray)', 
            padding: '20px', 
            borderRadius: '15px', 
            marginBottom: '25px'
          }}>
            <h4 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>
              👤 Müşteri Bilgileri
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
              <div><strong>İsim:</strong> {partnerRegistrationData.partnerInfo?.name}</div>
              <div><strong>E-mail:</strong> {partnerRegistrationData.partnerInfo?.email}</div>
              <div><strong>Kayıt Türü:</strong> {partnerRegistrationData.partnerInfo?.type === 'individual' ? 'Bireysel' : 'Kurumsal'}</div>
              <div><strong>Partner ID:</strong> {partnerRegistrationData.partnerId}</div>
            </div>
          </div>

          {/* Mesaj Alanı */}
          {message && (
            <div style={{ 
              padding: '15px', 
              borderRadius: '10px', 
              marginBottom: '20px',
              backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
              color: message.includes('✅') ? '#155724' : '#721c24',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}

          {/* Aksiyon Butonu */}
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={handlePartnerPaymentSubmit}
              disabled={loading || message.includes('✅')}
              style={{
                padding: '15px 40px',
                backgroundColor: loading || message.includes('✅') ? 'var(--card-gray)' : 'var(--primary-dark)',
                color: loading || message.includes('✅') ? 'var(--text-light)' : 'var(--white)',
                border: 'none',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: loading || message.includes('✅') ? 'not-allowed' : 'pointer',
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
              }}
            >
              {loading ? 'İşleniyor...' : message.includes('✅') ? 'Tamamlandı' : 'Ödeme Kaydı Oluştur'}
            </button>
          </div>

          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#e3f2fd', 
            borderRadius: '10px',
            fontSize: '14px',
            color: '#1565c0',
            textAlign: 'center'
          }}>
            <strong>💡 Bilgi:</strong> Bu işlem sadece ödeme kaydı oluşturur. Dekont yükleme gerekmez.
            <br/>Müşteri IBAN'a ödeme yaptıktan sonra admin panelinden onaylanacaktır.
          </div>
        </div>
      ) : (
        // Normal Ödeme Ekranı
        <div className="dashboard-card" style={{ marginBottom: '30px' }}>
          <h3>Ödeme Bilgileri</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <h4>IBAN Bilgileri</h4>
            <p style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px', fontFamily: 'monospace' }}>
              TR77 0011 1000 0000 0153 1671 66<br/>
              Alıcı: HOOWELL NETWORK MARKETING LTD. ŞTİ.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Ödeme Türü</label>
              <select 
                className="form-control"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
              >
                <option value="education">Eğitim Paketi - ${amounts.usdAmount}</option>
                <option value="device">Cihaz Paketi - ${amounts.usdAmount}</option>
              </select>
            </div>

            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <h4>Ödeme Detayları</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>USD Tutarı: ${amounts.usdAmount}</div>
                <div>TL Tutarı: ₺{amounts.tryAmount?.toLocaleString()}</div>
                <div>KDV (%{settings.vat_rate}): ₺{amounts.vatAmount?.toLocaleString()}</div>
                <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#1a4a3a' }}>
                  Toplam: ₺{amounts.totalAmount?.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Dekont Dosyası</label>
              <input
                type="file"
                className="form-control"
                accept="image/*,.pdf"
                onChange={(e) => setReceipt(e.target.files[0])}
                required
              />
              <small style={{ color: '#666' }}>
                Desteklenen formatlar: JPG, PNG, PDF
              </small>
            </div>

            {message && (
              <div style={{ 
                padding: '10px', 
                borderRadius: '5px', 
                marginBottom: '20px',
                backgroundColor: message.includes('oluşturuldu') ? '#d4edda' : '#f8d7da',
                color: message.includes('oluşturuldu') ? '#155724' : '#721c24'
              }}>
                {message}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Gönderiliyor...' : 'Ödeme Kaydı Oluştur'}
            </button>
          </form>
        </div>
      )}

      {/* Payment History */}
      <div className="dashboard-card">
        <h3>Ödeme Geçmişi</h3>
        
        {payments.length === 0 ? (
          <p>Henüz ödeme kaydınız bulunmamaktadır.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Tür</th>
                <th>Tutar</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{new Date(payment.created_at).toLocaleDateString('tr-TR')}</td>
                  <td>{payment.payment_type === 'education' ? 'Eğitim' : 'Cihaz'}</td>
                  <td>₺{payment.total_amount?.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status-${payment.status}`}>
                      {payment.status === 'pending' ? 'Bekliyor' : 
                       payment.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Payment;