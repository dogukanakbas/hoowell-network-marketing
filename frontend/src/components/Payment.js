import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext'; // Şu an kullanılmıyor
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PayTRIframe from './PayTRIframe';

const Payment = () => {
  // const { user } = useAuth(); // Şu an kullanılmıyor
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState('education');
  const [paymentMethod, setPaymentMethod] = useState('iban'); // 'iban', 'paytr' veya 'treps'
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [payments, setPayments] = useState([]);
  const [settings, setSettings] = useState({});
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // PayTR iframe için state'ler
  const [showPayTRIframe, setShowPayTRIframe] = useState(false);
  const [paytrIframeToken, setPaytrIframeToken] = useState(null);
  const [currentMerchantOid, setCurrentMerchantOid] = useState(null);

  // TREPS için state'ler
  const [trepsPaymentId, setTrepsPaymentId] = useState(null);
  const [trepsPaymentStatus, setTrepsPaymentStatus] = useState(null);
  const [trepsIframeUrl, setTrepsIframeUrl] = useState(null);

  // Yeni kayıt sistemi için state
  const partnerRegistrationData = location.state;
  const isPartnerRegistration = partnerRegistrationData && partnerRegistrationData.skipReceipt;

  useEffect(() => {
    fetchPayments();
    fetchSettings();
    
    // URL parametrelerini kontrol et
    const urlParams = new URLSearchParams(location.search);
    const method = urlParams.get('method');
    const paymentId = urlParams.get('paymentId');
    const token = urlParams.get('token');
    const url = urlParams.get('url');
    
    if (method === 'treps') {
      setPaymentMethod('treps');
      
      if (paymentId) {
        setTrepsPaymentId(paymentId);
        // TREPS ödeme durumunu kontrol et
        checkTrepsPaymentStatus(paymentId);
      }
      
      if (token && url) {
        // Eski format - iframe göster
        setTrepsPaymentId(token);
        setTrepsIframeUrl(decodeURIComponent(url));
      }
    }
  }, [location.search]);

  // TREPS ödeme durumu periyodik kontrol
  useEffect(() => {
    let interval;
    
    if (trepsPaymentId && trepsPaymentStatus !== 'completed' && trepsPaymentStatus !== 'failed') {
      interval = setInterval(() => {
        checkTrepsPaymentStatus(trepsPaymentId);
      }, 10000); // 10 saniyede bir kontrol et
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [trepsPaymentId, trepsPaymentStatus]);

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

  // TREPS ödeme durumu kontrol
  const checkTrepsPaymentStatus = async (paymentId) => {
    try {
      const response = await axios.get(`/api/treps/payment-status/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setTrepsPaymentStatus(response.data.status);
        
        if (response.data.status === 'completed') {
          setMessage('✅ TREPS ödeme başarıyla tamamlandı!');
          // Başarılı ödeme sonrası yönlendirme
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      }
    } catch (error) {
      console.error('TREPS ödeme durumu kontrol hatası:', error);
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

  // IBAN ile ödeme (mevcut sistem)
  const handleIbanSubmit = async (e) => {
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

  // PayTR ile ödeme (iframe desteği ile)
  const handlePayTRSubmit = async (e) => {
    e.preventDefault();

    if (!userInfo.name || !userInfo.email || !userInfo.phone) {
      setMessage('Lütfen tüm bilgileri doldurun');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/paytr/create-payment', {
        payment_type: paymentType,
        user_info: userInfo
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        // Iframe'i aç
        setPaytrIframeToken(response.data.iframeToken);
        setCurrentMerchantOid(response.data.merchant_oid);
        setShowPayTRIframe(true);
        setMessage('');
      } else {
        setMessage('PayTR ödeme oluşturulamadı: ' + response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'PayTR ödeme oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  const amounts = calculateAmount();

  // İş ortağı kaydı için IBAN ödemesi
  const handlePartnerIbanPayment = async () => {
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

      setMessage('✅ IBAN ödeme kaydı başarıyla oluşturuldu! İş ortağı kaydı tamamlandı.');
    } catch (error) {
      setMessage('❌ Ödeme kaydı oluşturulamadı: ' + (error.response?.data?.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  // İş ortağı kaydı için PayTR ödemesi (iframe desteği ile)
  const handlePartnerPayTRPayment = async () => {
    if (!userInfo.name || !userInfo.email || !userInfo.phone) {
      setMessage('Lütfen tüm bilgileri doldurun');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/paytr/create-payment', {
        payment_type: 'franchise',
        user_info: {
          ...userInfo,
          name: userInfo.name || partnerRegistrationData.partnerInfo?.name,
          email: userInfo.email || partnerRegistrationData.partnerInfo?.email
        },
        partner_id: partnerRegistrationData.partnerId,
        custom_amount: partnerRegistrationData.amount
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        // Iframe'i aç
        setPaytrIframeToken(response.data.iframeToken);
        setCurrentMerchantOid(response.data.merchant_oid);
        setShowPayTRIframe(true);
        setMessage('');
      } else {
        setMessage('PayTR ödeme oluşturulamadı: ' + response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'PayTR ödeme oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  // PayTR iframe event handler'ları
  const handlePayTRSuccess = () => {
    setShowPayTRIframe(false);
    setMessage('✅ Ödeme başarıyla tamamlandı! Yönlendiriliyorsunuz...');
    setTimeout(() => {
      navigate('/payment/success?merchant_oid=' + currentMerchantOid);
    }, 2000);
  };

  const handlePayTRError = (error) => {
    setShowPayTRIframe(false);
    setMessage('❌ Ödeme işlemi başarısız: ' + error);
    setTimeout(() => {
      navigate('/payment/fail?error=' + encodeURIComponent(error));
    }, 3000);
  };

  const handlePayTRClose = () => {
    setShowPayTRIframe(false);
    setPaytrIframeToken(null);
    setCurrentMerchantOid(null);
  };

  return (
    <div>
      {/* PayTR Iframe Modal */}
      {showPayTRIframe && (
        <PayTRIframe
          iframeToken={paytrIframeToken}
          onSuccess={handlePayTRSuccess}
          onError={handlePayTRError}
          onClose={handlePayTRClose}
        />
      )}
      {isPartnerRegistration ? (
        // İş Ortağı Kayıt Ödeme Ekranı
        <div className="dashboard-card" style={{ marginBottom: '30px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
              💳 İş Ortağı Ödeme Yöntemi Seçin
            </h2>
            <p style={{ color: 'var(--text-light)' }}>
              {partnerRegistrationData.partnerInfo?.name} için ödeme işlemi
            </p>
          </div>

          {/* Ödeme Yöntemi Seçimi */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  value="iban"
                  checked={paymentMethod === 'iban'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: '8px' }}
                />
                🏦 IBAN ile Havale/EFT
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  value="paytr"
                  checked={paymentMethod === 'paytr'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: '8px' }}
                />
                💳 Kredi/Banka Kartı (PayTR)
              </label>
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

          {/* IBAN Ödeme Seçeneği */}
          {paymentMethod === 'iban' && (
            <div style={{ marginBottom: '25px' }}>
              <div style={{
                backgroundColor: 'var(--card-gray)',
                padding: '25px',
                borderRadius: '15px',
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
                  <strong>Alıcı:</strong> HOOWELL GLOBAL ALKALİ İYONİZER SİSTEMLERİ ANONİM ŞİRKETİ
                </div>
              </div>
            </div>
          )}

          {/* PayTR Ödeme Seçeneği */}
          {paymentMethod === 'paytr' && (
            <div style={{ marginBottom: '25px' }}>
              <div style={{
                backgroundColor: 'var(--card-gray)',
                padding: '25px',
                borderRadius: '15px'
              }}>
                <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px', textAlign: 'center' }}>
                  💳 PayTR Ödeme Bilgileri
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ad Soyad *</label>
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                      placeholder={partnerRegistrationData.partnerInfo?.name || "Adınız ve soyadınız"}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>E-posta *</label>
                    <input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      placeholder={partnerRegistrationData.partnerInfo?.email || "ornek@email.com"}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Telefon *</label>
                    <input
                      type="tel"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                      placeholder="5xxxxxxxxx"
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Adres</label>
                    <input
                      type="text"
                      value={userInfo.address}
                      onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                      placeholder="Adresiniz (opsiyonel)"
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                    />
                  </div>
                </div>

                <div style={{ 
                  backgroundColor: '#e3f2fd', 
                  padding: '15px', 
                  borderRadius: '8px', 
                  marginBottom: '20px',
                  border: '1px solid #2196f3'
                }}>
                  <h5 style={{ color: '#1565c0', marginBottom: '10px' }}>💳 PayTR Güvenli Ödeme</h5>
                  <ul style={{ color: '#1565c0', fontSize: '14px', marginBottom: '0' }}>
                    <li>Kredi kartı ve banka kartı ile güvenli ödeme</li>
                    <li>3D Secure ile korumalı işlem</li>
                    <li>Anında ödeme onayı</li>
                    <li>SSL sertifikası ile şifreli bağlantı</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

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

          {/* Aksiyon Butonları */}
          <div style={{ textAlign: 'center' }}>
            {paymentMethod === 'iban' ? (
              <button
                onClick={handlePartnerIbanPayment}
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
                {loading ? 'İşleniyor...' : message.includes('✅') ? 'Tamamlandı' : '🏦 IBAN Ödeme Kaydı Oluştur'}
              </button>
            ) : (
              <button
                onClick={handlePartnerPayTRPayment}
                disabled={loading || message.includes('✅')}
                style={{
                  padding: '15px 40px',
                  backgroundColor: loading || message.includes('✅') ? 'var(--card-gray)' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: loading || message.includes('✅') ? 'not-allowed' : 'pointer',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                }}
              >
                {loading ? 'PayTR\'ye Yönlendiriliyor...' : '💳 PayTR ile Güvenli Ödeme Yap'}
              </button>
            )}
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
            <strong>💡 Bilgi:</strong> {paymentMethod === 'iban' 
              ? 'IBAN ödemesi için dekont yükleme gerekmez. Müşteri IBAN\'a ödeme yaptıktan sonra admin panelinden onaylanacaktır.'
              : 'PayTR ile ödeme anında onaylanır ve iş ortağı kaydı otomatik tamamlanır.'
            }
          </div>
        </div>
      ) : (
        // Normal Ödeme Ekranı
        <div className="dashboard-card" style={{ marginBottom: '30px' }}>
          <h3>💳 Ödeme Yöntemi Seçin</h3>

          {/* Ödeme Yöntemi Seçimi */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  value="iban"
                  checked={paymentMethod === 'iban'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: '8px' }}
                />
                🏦 IBAN ile Havale/EFT
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  value="paytr"
                  checked={paymentMethod === 'paytr'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: '8px' }}
                />
                💳 Kredi/Banka Kartı (PayTR)
              </label>
            </div>
          </div>

          {/* Ödeme Türü Seçimi */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label>Ödeme Türü</label>
            <select
              className="form-control"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <option value="education">Eğitim Paketi - {amounts.totalAmount?.toLocaleString()} TL</option>
              <option value="device">Cihaz Paketi - {amounts.totalAmount?.toLocaleString()} TL</option>
            </select>
          </div>

          {/* Ödeme Detayları */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h4>Ödeme Detayları</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>Net Tutar: {amounts.tryAmount?.toLocaleString()} TL</div>
              <div>KDV (%{settings.vat_rate}): {amounts.vatAmount?.toLocaleString()} TL</div>
              <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#1a4a3a', gridColumn: '1 / -1' }}>
                Toplam: {amounts.totalAmount?.toLocaleString()} TL (KDV Dahil)
              </div>
            </div>
          </div>

          {/* IBAN Ödeme Formu */}
          {paymentMethod === 'iban' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h4>🏦 IBAN Bilgileri</h4>
                <p style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px', fontFamily: 'monospace' }}>
                  TR77 0011 1000 0000 0153 1671 66<br />
                  Alıcı: HOOWELL GLOBAL ALKALİ İYONİZER SİSTEMLERİ ANONİM ŞİRKETİ
                </p>
              </div>

              <form onSubmit={handleIbanSubmit}>
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

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', padding: '12px' }}
                >
                  {loading ? 'Gönderiliyor...' : '📄 Dekont Yükle ve Ödeme Kaydı Oluştur'}
                </button>
              </form>
            </div>
          )}

          {/* PayTR Ödeme Formu */}
          {paymentMethod === 'paytr' && (
            <div>
              <form onSubmit={handlePayTRSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div className="form-group">
                    <label>Ad Soyad *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                      required
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>
                  <div className="form-group">
                    <label>E-posta *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      required
                      placeholder="ornek@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefon *</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                      required
                      placeholder="5xxxxxxxxx"
                    />
                  </div>
                  <div className="form-group">
                    <label>Adres</label>
                    <input
                      type="text"
                      className="form-control"
                      value={userInfo.address}
                      onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                      placeholder="Adresiniz (opsiyonel)"
                    />
                  </div>
                </div>

                <div style={{ 
                  backgroundColor: '#e3f2fd', 
                  padding: '15px', 
                  borderRadius: '8px', 
                  marginBottom: '20px',
                  border: '1px solid #2196f3'
                }}>
                  <h5 style={{ color: '#1565c0', marginBottom: '10px' }}>💳 PayTR Güvenli Ödeme</h5>
                  <ul style={{ color: '#1565c0', fontSize: '14px', marginBottom: '0' }}>
                    <li>Kredi kartı ve banka kartı ile güvenli ödeme</li>
                    <li>3D Secure ile korumalı işlem</li>
                    <li>Anında ödeme onayı</li>
                    <li>SSL sertifikası ile şifreli bağlantı</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                  style={{ 
                    width: '100%', 
                    padding: '15px',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  {loading ? 'PayTR\'ye Yönlendiriliyor...' : '💳 PayTR ile Güvenli Ödeme Yap'}
                </button>
              </form>
            </div>
          )}

          {/* TREPS Ödeme İframe */}
          {paymentMethod === 'treps' && trepsIframeUrl && (
            <div style={{
              backgroundColor: '#e3f2fd',
              padding: '20px',
              borderRadius: '10px',
              marginTop: '20px',
              border: '1px solid #2196f3',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#1565c0', marginBottom: '15px' }}>
                🏦 TREPS ile Güvenli Ödeme
              </h4>
              <iframe
                src={trepsIframeUrl}
                width="100%"
                height="500px"
                frameBorder="0"
                allow="payment"
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: 'white'
                }}
              />
            </div>
          )}

          {/* TREPS Ödeme Durumu */}
          {paymentMethod === 'treps' && trepsPaymentId && !trepsIframeUrl && (
            <div style={{
              backgroundColor: '#e3f2fd',
              padding: '20px',
              borderRadius: '10px',
              marginTop: '20px',
              border: '1px solid #2196f3',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#1565c0', marginBottom: '15px' }}>
                🏦 TREPS Ödeme Durumu
              </h4>
              <div style={{ marginBottom: '15px' }}>
                <strong>Ödeme ID:</strong> {trepsPaymentId}
              </div>
              {trepsPaymentStatus && (
                <div style={{
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: trepsPaymentStatus === 'completed' ? '#d4edda' : '#fff3cd',
                  color: trepsPaymentStatus === 'completed' ? '#155724' : '#856404',
                  fontWeight: 'bold'
                }}>
                  {trepsPaymentStatus === 'completed' ? '✅ Ödeme Tamamlandı' :
                   trepsPaymentStatus === 'pending' ? '⏳ Ödeme Bekleniyor' :
                   trepsPaymentStatus === 'processing' ? '🔄 İşlem Devam Ediyor' :
                   trepsPaymentStatus === 'failed' ? '❌ Ödeme Başarısız' :
                   '📊 Durum Kontrol Ediliyor'}
                </div>
              )}
              <div style={{ marginTop: '15px', fontSize: '14px', color: '#1565c0' }}>
                <p>TREPS ödeme işleminiz devam ediyor. Durum güncellemeleri otomatik olarak kontrol edilecektir.</p>
              </div>
            </div>
          )}

          {/* Mesaj Alanı */}
          {message && (
            <div style={{
              padding: '15px',
              borderRadius: '8px',
              marginTop: '20px',
              backgroundColor: message.includes('oluşturuldu') || message.includes('yüklendi') || message.includes('✅') ? '#d4edda' : '#f8d7da',
              color: message.includes('oluşturuldu') || message.includes('yüklendi') || message.includes('✅') ? '#155724' : '#721c24'
            }}>
              {message}
            </div>
          )}
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