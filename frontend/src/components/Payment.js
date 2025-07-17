import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Payment = () => {
  const { user } = useAuth();
  const [paymentType, setPaymentType] = useState('education');
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [payments, setPayments] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetchPayments();
    fetchSettings();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/api/payments/my');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/settings');
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

  return (
    <div>
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