import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const PartnerRegistration = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('individual');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [individualForm, setIndividualForm] = useState({
    first_name: '',
    last_name: '',
    tc_no: '',
    email: '',
    phone: '',
    delivery_address: '',
    billing_address: '',
    referrer_sponsor_id: ''
  });

  const [corporateForm, setCorporateForm] = useState({
    company_name: '',
    billing_address: '',
    tax_office: '',
    tax_no: '',
    authorized_person: '',
    delivery_address: '',
    email: '',
    phone: '',
    referrer_sponsor_id: ''
  });

  const handleIndividualSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/partner/register', {
        ...individualForm,
        partner_type: 'individual'
      });

      setMessage(`✅ Bireysel İş Ortağı başarıyla kaydedildi!
📋 Sponsor ID: ${response.data.sponsor_id}
🔑 Şifre: ${response.data.password}
📧 Giriş Email: ${individualForm.email}`);
      
      setIndividualForm({
        first_name: '',
        last_name: '',
        tc_no: '',
        email: '',
        phone: '',
        delivery_address: '',
        billing_address: '',
        referrer_sponsor_id: ''
      });
    } catch (error) {
      setMessage('❌ Kayıt hatası: ' + (error.response?.data?.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  const handleCorporateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/partner/register', {
        ...corporateForm,
        partner_type: 'corporate'
      });

      setMessage(`✅ Kurumsal İş Ortağı başarıyla kaydedildi!
📋 Sponsor ID: ${response.data.sponsor_id}
🔑 Şifre: ${response.data.password}
📧 Giriş Email: ${corporateForm.email}`);
      
      setCorporateForm({
        company_name: '',
        billing_address: '',
        tax_office: '',
        tax_no: '',
        authorized_person: '',
        delivery_address: '',
        email: '',
        phone: '',
        referrer_sponsor_id: ''
      });
    } catch (error) {
      setMessage('❌ Kayıt hatası: ' + (error.response?.data?.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  // Eğitim tamamlanmamışsa erişim engelle
  if (!user.education_completed) {
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
          opacity: 0.3
        }}>
          🎓
        </div>
        <div style={{
          backgroundColor: 'var(--card-gray)',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          maxWidth: '600px'
        }}>
          <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px' }}>
            Eğitim Tamamlama Gerekli
          </h2>
          <p style={{ color: 'var(--text-light)', fontSize: '16px', lineHeight: '1.5' }}>
            İş Ortağı Kayıt Paneli'ne erişmek için önce eğitimlerinizi tamamlamanız gerekmektedir.
          </p>
          <a href="/education" style={{
            display: 'inline-block',
            marginTop: '20px',
            padding: '12px 30px',
            backgroundColor: 'var(--primary-dark)',
            color: 'var(--white)',
            textDecoration: 'none',
            borderRadius: '10px',
            fontWeight: 'bold'
          }}>
            Eğitimlere Git
          </a>
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
          İş Ortağı Kayıt Paneli
        </h1>
        <p style={{ color: 'var(--text-light)', fontSize: '16px' }}>
          Yeni iş ortakları kaydedin ve sponsor ID'lerini oluşturun
        </p>
      </div>

      {/* Tab Seçimi */}
      <div style={{
        display: 'flex',
        marginBottom: '30px',
        backgroundColor: 'var(--card-gray)',
        borderRadius: '15px',
        padding: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={() => setActiveTab('individual')}
          style={{
            flex: 1,
            padding: '15px 20px',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s',
            backgroundColor: activeTab === 'individual' ? 'var(--primary-dark)' : 'transparent',
            color: activeTab === 'individual' ? 'var(--white)' : 'var(--text-dark)'
          }}
        >
          Bireysel İş Ortağı
        </button>
        <button
          onClick={() => setActiveTab('corporate')}
          style={{
            flex: 1,
            padding: '15px 20px',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s',
            backgroundColor: activeTab === 'corporate' ? 'var(--primary-dark)' : 'transparent',
            color: activeTab === 'corporate' ? 'var(--white)' : 'var(--text-dark)'
          }}
        >
          Kurumsal İş Ortağı
        </button>
      </div>

      {/* Mesaj Alanı */}
      {message && (
        <div style={{
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '30px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          whiteSpace: 'pre-line',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          {message}
        </div>
      )}

      {/* Bireysel Form */}
      {activeTab === 'individual' && (
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: 'var(--primary-dark)', marginBottom: '25px' }}>
            Bireysel İş Ortağı Kayıt Formu
          </h3>
          
          <form onSubmit={handleIndividualSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                  İsim *
                </label>
                <input
                  type="text"
                  required
                  value={individualForm.first_name}
                  onChange={(e) => setIndividualForm({...individualForm, first_name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                  Soyisim *
                </label>
                <input
                  type="text"
                  required
                  value={individualForm.last_name}
                  onChange={(e) => setIndividualForm({...individualForm, last_name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                  TC Kimlik No *
                </label>
                <input
                  type="text"
                  required
                  maxLength="11"
                  value={individualForm.tc_no}
                  onChange={(e) => setIndividualForm({...individualForm, tc_no: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                  E-mail *
                </label>
                <input
                  type="email"
                  required
                  value={individualForm.email}
                  onChange={(e) => setIndividualForm({...individualForm, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                  Telefon *
                </label>
                <input
                  type="tel"
                  required
                  value={individualForm.phone}
                  onChange={(e) => setIndividualForm({...individualForm, phone: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                  Sponsor ID
                </label>
                <input
                  type="text"
                  value={individualForm.referrer_sponsor_id}
                  onChange={(e) => setIndividualForm({...individualForm, referrer_sponsor_id: e.target.value})}
                  placeholder="Opsiyonel"
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                Teslimat Adresi *
              </label>
              <textarea
                required
                rows="3"
                value={individualForm.delivery_address}
                onChange={(e) => setIndividualForm({...individualForm, delivery_address: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid var(--border-color)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                Fatura Adresi *
              </label>
              <textarea
                required
                rows="3"
                value={individualForm.billing_address}
                onChange={(e) => setIndividualForm({...individualForm, billing_address: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid var(--border-color)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: 'var(--primary-dark)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Kaydediliyor...' : 'Bireysel İş Ortağı Kaydet'}
            </button>
          </form>
        </div>
      )}

      {/* Kurumsal Form */}
      {activeTab === 'corporate' && (
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: 'var(--primary-dark)', marginBottom: '25px' }}>
            Kurumsal İş Ortağı Kayıt Formu
          </h3>
          
          <form onSubmit={handleCorporateSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                  Firma İsmi *
                </label>
                <input
                  type="text"
                  required
                  value={corporateForm.company_name}
                  onChange={(e) => setCorporateForm({...corporateForm, company_name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                  Yetkili Kişi Ad-Soyad *
                </label>
                <input
                  type="text"
                  required
                  value={corporateForm.authorized_person}
                  onChange={(e) => setCorporateForm({...corporateForm, authorized_person: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                  Vergi Dairesi *
                </label>
                <input
                  type="text"
                  required
                  value={corporateForm.tax_office}
                  onChange={(e) => setCorporateForm({...corporateForm, tax_office: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                  Vergi No *
                </label>
                <input
                  type="text"
                  required
                  value={corporateForm.tax_no}
                  onChange={(e) => setCorporateForm({...corporateForm, tax_no: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                  E-mail *
                </label>
                <input
                  type="email"
                  required
                  value={corporateForm.email}
                  onChange={(e) => setCorporateForm({...corporateForm, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                  Telefon *
                </label>
                <input
                  type="tel"
                  required
                  value={corporateForm.phone}
                  onChange={(e) => setCorporateForm({...corporateForm, phone: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                Sponsor ID
              </label>
              <input
                type="text"
                value={corporateForm.referrer_sponsor_id}
                onChange={(e) => setCorporateForm({...corporateForm, referrer_sponsor_id: e.target.value})}
                placeholder="Opsiyonel"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid var(--border-color)',
                  borderRadius: '10px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                Fatura Adresi *
              </label>
              <textarea
                required
                rows="3"
                value={corporateForm.billing_address}
                onChange={(e) => setCorporateForm({...corporateForm, billing_address: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid var(--border-color)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                Teslimat Adresi *
              </label>
              <textarea
                required
                rows="3"
                value={corporateForm.delivery_address}
                onChange={(e) => setCorporateForm({...corporateForm, delivery_address: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid var(--border-color)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: 'var(--primary-dark)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Kaydediliyor...' : 'Kurumsal İş Ortağı Kaydet'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PartnerRegistration;