import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MuhasebeTakipPaneli = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bireysel'); // 'bireysel' veya 'sirket'
  const [accountingData, setAccountingData] = useState({
    bireysel: [],
    sirket: []
  });
  
  // Muhasebe bilgileri kayıt durumu
  const [accountingInfo, setAccountingInfo] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    account_type: 'individual',
    iban: '',
    bank_name: '',
    account_holder_name: '',
    company_name: '',
    tax_number: ''
  });
  
  // Dosya yükleme state
  const [files, setFiles] = useState({
    tc_identity_front: null,
    tax_plate: null
  });
  
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    checkAccountingInfo();
  }, []);

  const checkAccountingInfo = async () => {
    try {
      const response = await axios.get('/api/accounting/info', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success && response.data.accountingInfo) {
        setAccountingInfo(response.data.accountingInfo);
        if (response.data.accountingInfo.is_approved) {
          // Onaylanmışsa muhasebe verilerini getir
          fetchAccountingData();
        } else {
          setLoading(false);
        }
      } else {
        // Kayıt yok, form göster
        setShowRegistrationForm(true);
        setLoading(false);
      }
    } catch (error) {
      console.error('Muhasebe bilgileri kontrol hatası:', error);
      setShowRegistrationForm(true);
      setLoading(false);
    }
  };

  const fetchAccountingData = async () => {
    try {
      const response = await axios.get('/api/accounting/data', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setAccountingData(response.data.data);
      }
    } catch (error) {
      console.error('Muhasebe verileri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır.');
        return;
      }
      
      // Dosya tipi kontrolü
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Sadece JPG, PNG ve PDF dosyaları yüklenebilir.');
        return;
      }
      
      setFiles(prev => ({
        ...prev,
        [fileType]: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const submitData = new FormData();
      
      // Form verilerini ekle
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Dosyaları ekle
      if (formData.account_type === 'individual' && files.tc_identity_front) {
        submitData.append('tc_identity_front', files.tc_identity_front);
      }
      
      if (formData.account_type === 'company' && files.tax_plate) {
        submitData.append('tax_plate', files.tax_plate);
      }

      const response = await axios.post('/api/accounting/register', submitData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        alert('Muhasebe bilgileriniz başarıyla kaydedildi! Onay sürecinden sonra panele erişebileceksiniz.');
        setAccountingInfo(response.data.accountingInfo);
        setShowRegistrationForm(false);
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setUploading(false);
    }
  };

  const renderRegistrationForm = () => (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #0e2323 0%, #1a4d4d 25%, #2a5555 50%, #1a4d4d 75%, #0e2323 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box',
      position: 'relative',
      margin: '0 -20px'
    }}>


      {/* Form Container */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '25px',
        padding: '40px',
        maxWidth: '800px',
        width: '100%',
        border: '4px solid #FFD700',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)'
      }}>
        
        {/* Başlık */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{
            color: '#FFD700',
            fontSize: '36px',
            marginBottom: '10px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontWeight: 'bold'
          }}>
            MUHASEBE TAKİP PANELİ
          </h1>
          <p style={{
            color: '#0e2323',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            BİZİMLE NASIL ÇALIŞACAKSINIZ?
          </p>
          <p style={{
            color: '#856404',
            fontSize: '16px',
            marginTop: '10px',
            lineHeight: '1.5'
          }}>
            Değerli Hoowell İş ortakları sizlere PRİM ÖDEYEBİLMEMİZ için KANUNEN<br />
            İKİ farklı yöntem bulunmaktadır.
          </p>
        </div>

        {/* Bilgilendirme */}
        <div style={{
          backgroundColor: '#fff3cd',
          border: '2px solid #ffeaa7',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '30px',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          <div style={{ marginBottom: '15px', color: '#856404' }}>
            <strong>1. ŞİRKETİ olmayan İş Ortaklarının oluşan kazançları ödenirken KAYNAĞINDA STOPAJ KESİNTİSİ (%20) yapılarak ödeme yapılır. Kesilen %20'lik meblağ kişinin TC KİMLİK numarası ile her ay devlete yatırılır.</strong>
          </div>
          <div style={{ color: '#856404' }}>
            <strong>2. Şahıs, Limited ya da Anonim Şirketlerin sahipleri kazanılan meblağın üzerine %20 KDV ekleyerek fatura keserler ve kendi vergilerini şirketin bünyesinde ödemekten kendileri sorumludur.</strong>
          </div>
        </div>

        {/* Uyarı */}
        <div style={{
          backgroundColor: '#f8d7da',
          border: '2px solid #f5c6cb',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#721c24',
            fontSize: '16px',
            fontWeight: 'bold',
            margin: 0
          }}>
            Bu konudaki TERCİHİNİZİ YAPIN aşağıda belirtilen EVRAKLARIN GÖRÜNTÜLERİNİ web ofisimize YÜKLEMENİZ gerekmektedir.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Hesap Türü Seçimi */}
          <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '30px',
            justifyContent: 'center'
          }}>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, account_type: 'individual' }))}
              style={{
                padding: '15px 30px',
                borderRadius: '15px',
                border: '3px solid #FFD700',
                background: formData.account_type === 'individual' 
                  ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
                  : 'white',
                color: formData.account_type === 'individual' ? '#000' : '#FFD700',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              BİREYSEL
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, account_type: 'company' }))}
              style={{
                padding: '15px 30px',
                borderRadius: '15px',
                border: '3px solid #FFD700',
                background: formData.account_type === 'company' 
                  ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
                  : 'white',
                color: formData.account_type === 'company' ? '#000' : '#FFD700',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ŞİRKET
            </button>
          </div>

          {/* Ortak Alanlar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#0e2323',
                fontWeight: 'bold'
              }}>
                IBAN Numarası *
              </label>
              <input
                type="text"
                name="iban"
                value={formData.iban}
                onChange={handleInputChange}
                placeholder="TR00 0000 0000 0000 0000 0000 00"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '10px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#0e2323',
                fontWeight: 'bold'
              }}>
                Banka Adı
              </label>
              <input
                type="text"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleInputChange}
                placeholder="Banka adını giriniz"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '10px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#0e2323',
              fontWeight: 'bold'
            }}>
              Hesap Sahibi Adı *
            </label>
            <input
              type="text"
              name="account_holder_name"
              value={formData.account_holder_name}
              onChange={handleInputChange}
              placeholder="Hesap sahibinin tam adını giriniz"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '10px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Şirket Alanları */}
          {formData.account_type === 'company' && (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '20px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#0e2323',
                    fontWeight: 'bold'
                  }}>
                    Şirket Adı *
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    placeholder="Şirket adını giriniz"
                    required={formData.account_type === 'company'}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '10px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#0e2323',
                    fontWeight: 'bold'
                  }}>
                    Vergi Numarası *
                  </label>
                  <input
                    type="text"
                    name="tax_number"
                    value={formData.tax_number}
                    onChange={handleInputChange}
                    placeholder="Vergi numarasını giriniz"
                    required={formData.account_type === 'company'}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '10px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Dosya Yükleme */}
          <div style={{
            backgroundColor: '#e9ecef',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h3 style={{
              color: '#0e2323',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              Gerekli Belgeler
            </h3>
            
            {formData.account_type === 'individual' ? (
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#0e2323',
                  fontWeight: 'bold'
                }}>
                  TC Kimlik Belgesi (Ön Yüz) *
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, 'tc_identity_front')}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: '10px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
                  }}
                />
                {files.tc_identity_front && (
                  <p style={{ color: '#28a745', fontSize: '12px', marginTop: '5px' }}>
                    ✓ {files.tc_identity_front.name}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#0e2323',
                  fontWeight: 'bold'
                }}>
                  Vergi Levhası *
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, 'tax_plate')}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: '10px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
                  }}
                />
                {files.tax_plate && (
                  <p style={{ color: '#28a745', fontSize: '12px', marginTop: '5px' }}>
                    ✓ {files.tax_plate.name}
                  </p>
                )}
              </div>
            )}
            
            <p style={{
              color: '#6c757d',
              fontSize: '12px',
              marginTop: '10px',
              textAlign: 'center'
            }}>
              Maksimum dosya boyutu: 5MB | Desteklenen formatlar: JPG, PNG, PDF
            </p>
          </div>

          {/* Submit Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="submit"
              disabled={uploading}
              style={{
                padding: '15px 40px',
                borderRadius: '15px',
                border: 'none',
                background: uploading 
                  ? '#6c757d' 
                  : 'linear-gradient(135deg, #28a745, #20c997)',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: uploading ? 'not-allowed' : 'pointer',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              {uploading ? 'Kaydediliyor...' : 'Bilgileri Kaydet'}
            </button>
          </div>
        </form>

        {/* Not */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#d1ecf1',
          border: '1px solid #bee5eb',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#0c5460',
            fontSize: '14px',
            margin: 0,
            fontWeight: 'bold'
          }}>
            NOT: İstediğiniz zaman vergi çeşidinizi Hoowell MÜŞTERİ HİZMETLERİNE başvurarak değiştirebilirsiniz.
          </p>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="background: 'linear-gradient"] {
            padding: 15px !important;
          }
          
          div[style*="maxWidth: '800px'"] {
            padding: 30px 20px !important;
            margin: 10px !important;
          }
          
          h1 {
            font-size: 28px !important;
            line-height: 1.2 !important;
          }
          
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
            gap: 15px !important;
          }
          
          div[style*="display: 'flex'"][style*="gap: '20px'"] {
            flex-direction: column !important;
            gap: 15px !important;
          }
          
          button[style*="padding: '15px 30px'"] {
            padding: 12px 25px !important;
            font-size: 14px !important;
          }
          
          input, select, textarea {
            font-size: 16px !important;
            padding: 15px !important;
          }
        }
        
        @media (max-width: 480px) {
          div[style*="maxWidth: '800px'"] {
            padding: 20px 15px !important;
            margin: 5px !important;
          }
          
          h1 {
            font-size: 24px !important;
          }
          
          p[style*="fontSize: '18px'"] {
            font-size: 16px !important;
          }
          
          p[style*="fontSize: '16px'"] {
            font-size: 14px !important;
          }
          
          div[style*="padding: '20px'"] {
            padding: 15px !important;
          }
          
          button[style*="padding: '15px 40px'"] {
            padding: 12px 20px !important;
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );

  const renderPendingApproval = () => (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0e2323 0%, #1a3333 50%, #0e2323 100%)',
      padding: '20px',
      margin: '0 -20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '25px',
        padding: '50px',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%',
        border: '4px solid #FFD700',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          fontSize: '80px',
          marginBottom: '20px'
        }}>
          ⏳
        </div>
        
        <h2 style={{
          color: '#FFD700',
          fontSize: '32px',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          ONAY BEKLENİYOR
        </h2>
        
        <div style={{
          backgroundColor: '#fff3cd',
          border: '2px solid #ffeaa7',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '20px'
        }}>
          <p style={{
            color: '#856404',
            fontSize: '18px',
            lineHeight: '1.6',
            margin: 0
          }}>
            Muhasebe bilgileriniz başarıyla kaydedildi.<br />
            Belgeleriniz incelendikten sonra muhasebe paneline erişim sağlayabileceksiniz.
          </p>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '15px',
          padding: '20px'
        }}>
          <h4 style={{
            color: '#0e2323',
            marginBottom: '10px'
          }}>
            Kayıtlı Bilgiler:
          </h4>
          <p style={{ color: '#6c757d', margin: '5px 0' }}>
            <strong>Hesap Türü:</strong> {accountingInfo?.account_type === 'individual' ? 'Bireysel' : 'Şirket'}
          </p>
          <p style={{ color: '#6c757d', margin: '5px 0' }}>
            <strong>IBAN:</strong> {accountingInfo?.iban}
          </p>
          <p style={{ color: '#6c757d', margin: '5px 0' }}>
            <strong>Hesap Sahibi:</strong> {accountingInfo?.account_holder_name}
          </p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '18px',
        color: '#FFD700',
        backgroundColor: '#0e2323'
      }}>
        Muhasebe verileri yükleniyor...
      </div>
    );
  }

  // Kayıt formu göster
  if (showRegistrationForm) {
    return renderRegistrationForm();
  }

  // Onay bekliyor
  if (accountingInfo && !accountingInfo.is_approved) {
    return renderPendingApproval();
  }

  const renderBireyselPanel = () => (
    <div style={{ width: '100%' }}>
      {/* Bireysel Panel Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a4040 0%, #2a5555 50%, #1a4040 100%)',
        borderRadius: '15px 15px 0 0',
        padding: '15px',
        border: '2px solid #FFD700',
        borderBottom: 'none'
      }}>
        <div style={{
          display: 'flex',
          backgroundColor: '#2a2a2a',
          borderRadius: '10px',
          overflow: 'hidden',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>KAZANÇ TÜRÜ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>ADI SOYADI</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>SATIŞ TARİHİ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>HAK EDİŞ TARİHİ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>ÖDEME TARİHİ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>KAZANÇ (USD)</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>STOPAJLI KAZANÇ %20</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>T. KURU</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>NET KAZANÇ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700' }}>ÖDEME DURUMU</div>
        </div>
      </div>

      {/* Bireysel Panel Content */}
      <div style={{
        background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
        borderRadius: '0 0 15px 15px',
        border: '2px solid #FFD700',
        borderTop: 'none',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        {accountingData.bireysel && accountingData.bireysel.length > 0 ? (
          accountingData.bireysel.map((row, index) => (
            <div key={row.id} style={{
              display: 'flex',
              backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
              fontSize: '11px',
              borderBottom: '1px solid rgba(255,215,0,0.2)'
            }}>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.earning_type}</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.related_person || '-----'}</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.sale_date}</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.earn_date}</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.payment_date}</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.amount_usd} $</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.stopaj_amount} $</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.exchange_rate} ₺</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.net_amount_tl.toLocaleString()} ₺</div>
              <div style={{ 
                flex: 1, 
                padding: '8px', 
                textAlign: 'center', 
                color: row.payment_status === 'ÖDENDİ' ? '#28a745' : '#ffc107',
                fontWeight: 'bold'
              }}>{row.payment_status}</div>
            </div>
          ))
        ) : (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#fff',
            fontSize: '14px'
          }}>
            Henüz bireysel kazanç kaydı bulunmamaktadır.
          </div>
        )}
      </div>
    </div>
  );

  const renderSirketPanel = () => (
    <div style={{ width: '100%' }}>
      {/* Şirket Panel Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a4040 0%, #2a5555 50%, #1a4040 100%)',
        borderRadius: '15px 15px 0 0',
        padding: '15px',
        border: '2px solid #FFD700',
        borderBottom: 'none'
      }}>
        <div style={{
          display: 'flex',
          backgroundColor: '#2a2a2a',
          borderRadius: '10px',
          overflow: 'hidden',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>KAZANÇ TÜRÜ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>ADI SOYADI</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>SATIŞ TARİHİ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>HAK EDİŞ TARİHİ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>ÖDEME TARİHİ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>KAZANÇ (USD)</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>%20 KDV'Lİ KAZANÇ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>T. KURU</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>NET KAZANÇ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700' }}>ÖDEME DURUMU</div>
        </div>
      </div>

      {/* Şirket Panel Content */}
      <div style={{
        background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
        borderRadius: '0 0 15px 15px',
        border: '2px solid #FFD700',
        borderTop: 'none',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        {accountingData.sirket && accountingData.sirket.length > 0 ? (
          accountingData.sirket.map((row, index) => (
            <div key={row.id} style={{
              display: 'flex',
              backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
              fontSize: '11px',
              borderBottom: '1px solid rgba(255,215,0,0.2)'
            }}>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.earning_type}</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.related_person || '-----'}</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.sale_date}</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.earn_date}</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.payment_date}</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.amount_usd} $</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.taxed_amount} $</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.exchange_rate} ₺</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.net_amount_tl.toLocaleString()} ₺</div>
              <div style={{ 
                flex: 1, 
                padding: '8px', 
                textAlign: 'center', 
                color: row.payment_status === 'ÖDENDİ' ? '#28a745' : '#ffc107',
                fontWeight: 'bold'
              }}>{row.payment_status}</div>
            </div>
          ))
        ) : (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#fff',
            fontSize: '14px'
          }}>
            Henüz şirket kazanç kaydı bulunmamaktadır.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0e2323 0%, #1a3333 50%, #0e2323 100%)',
      padding: '20px',
      margin: '0 -20px',
      position: 'relative'
    }}>
      {/* HOOWELL Logo - Sağ Üst */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 10
      }}>
        <img 
          src="/hoowell-logo.png" 
          alt="HOOWELL Logo"
          style={{
            width: '90px',
            height: '50px',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Başlık */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        paddingTop: '20px'
      }}>
        <h1 style={{
          color: '#FFD700',
          fontSize: '42px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
          letterSpacing: '2px'
        }}>
          MUHASEBE TAKİP PANELİ
        </h1>
      </div>

      {/* Tab Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px',
        gap: '20px'
      }}>
        <button
          onClick={() => setActiveTab('bireysel')}
          style={{
            padding: '15px 40px',
            borderRadius: '15px',
            border: '3px solid #FFD700',
            background: activeTab === 'bireysel' 
              ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
              : 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
            color: activeTab === 'bireysel' ? '#000' : '#FFD700',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          BİREYSEL
        </button>
        <button
          onClick={() => setActiveTab('sirket')}
          style={{
            padding: '15px 40px',
            borderRadius: '15px',
            border: '3px solid #FFD700',
            background: activeTab === 'sirket' 
              ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
              : 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
            color: activeTab === 'sirket' ? '#000' : '#FFD700',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          ŞİRKET
        </button>
      </div>

      {/* Panel Content */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '0 20px'
      }}>
        {activeTab === 'bireysel' ? renderBireyselPanel() : renderSirketPanel()}
      </div>

      {/* Vergi Bilgilendirme */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: 'linear-gradient(135deg, #1a4040 0%, #2a5555 50%, #1a4040 100%)',
        borderRadius: '15px',
        border: '2px solid #FFD700',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        maxWidth: '1000px',
        margin: '30px auto 0 auto'
      }}>
        <div style={{
          color: '#FFD700',
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          VERGİ YÜKÜMLÜLÜĞÜ BİLGİLENDİRME
        </div>
        <div style={{
          color: '#ffffff',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#FFD700' }}>BİREYSEL:</strong> Şirketi olmayan İş Ortaklarının kazançları ödenirken <strong style={{ color: '#FFD700' }}>%20 stopaj kesintisi</strong> yapılarak ödenir. Kesilen %20'lik meblağ TC kimlik numarası ile her ay devlete yatırılır.
          </div>
          <div>
            <strong style={{ color: '#FFD700' }}>ŞİRKET:</strong> Şahıs, Limited veya Anonim Şirket sahipleri kazanılan meblağın üzerine <strong style={{ color: '#FFD700' }}>%20 KDV</strong> ekleyerek fatura keserler ve kendi vergilerini şirket bünyesinde ödemekten sorumludur.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuhasebeTakipPaneli;