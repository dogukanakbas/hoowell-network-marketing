import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SponsorshipTracker = () => {
  const { user } = useAuth();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Suppress unused variable warnings temporarily
  console.log('Sponsorship state:', { user, loading, error });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/sponsorship/my-partners', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPartners(response.data);
    } catch (error) {
      console.error('Partners fetch error:', error);
      setError('Partner verileri yüklenirken hata oluştu. Lütfen sayfayı yenileyin.');
    } finally {
      setLoading(false);
    }
  };

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
        Partner verileri yükleniyor...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f2324',
      padding: '20px',
      margin: '0 -20px'
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
            width: '120px',
            height: '70px',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Ana Başlık */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        paddingTop: '20px'
      }}>
        <h1 style={{
          color: '#FFD700',
          fontSize: '48px',
          fontWeight: 'bold',
          margin: '0',
          textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
          letterSpacing: '2px',
          textDecoration: 'underline'
        }}>
          SPONSORLUK TAKİP TABLOSU
        </h1>
      </div>

      {/* Ana Container */}
      <div style={{
        width: '100%',
        margin: '0 auto',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        border: '3px solid #FFD700'
      }}>
        
        {/* Tablo */}
        <div style={{ width: '100%' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            gap: '1px',
            fontSize: '10px',
            width: '100%'
          }}>
            {/* Başlık Satırı */}
            <div style={{
              background: 'linear-gradient(135deg, #000000, #333333)',
              color: '#FFD700',
              padding: '15px 8px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px'
            }}>
              ID<br />NUMARASI
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #000000, #333333)',
              color: '#FFD700',
              padding: '15px 8px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px'
            }}>
              ADI<br />SOYADI
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #000000, #333333)',
              color: '#FFD700',
              padding: '15px 8px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px'
            }}>
              TELEFON<br />NUMARASI
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #000000, #333333)',
              color: '#FFD700',
              padding: '15px 8px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px'
            }}>
              TEMEL<br />EĞİTİMLER
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #000000, #333333)',
              color: '#FFD700',
              padding: '15px 8px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px'
            }}>
              1.ADIM<br />(750 $)
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #000000, #333333)',
              color: '#FFD700',
              padding: '15px 8px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px'
            }}>
              2.ADIM<br />(1.000 $)
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #000000, #333333)',
              color: '#FFD700',
              padding: '15px 8px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px'
            }}>
              3.ADIM<br />(1.250 $)
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #000000, #333333)',
              color: '#FFD700',
              padding: '15px 8px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px'
            }}>
              4.ADIM<br />(1.500 $)
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #000000, #333333)',
              color: '#FFD700',
              padding: '15px 8px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px'
            }}>
              5.ADIM<br />(1.500 $)
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #000000, #333333)',
              color: '#FFD700',
              padding: '15px 8px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px'
            }}>
              TOPLAM<br />KAZANÇ
            </div>

            {/* Veri Satırları - Gerçek veriler */}
            {partners.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                color: '#666',
                fontSize: '16px'
              }}>
                Henüz kaydettiğiniz partner bulunmamaktadır.
              </div>
            ) : (
              partners.map((partner, index) => (
                [
                  // ID Numarası
                  <div key={`${index}-0`} style={{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    padding: '15px 8px',
                    minHeight: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {partner.sponsor_id}
                  </div>,
                  
                  // Adı Soyadı
                  <div key={`${index}-1`} style={{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    padding: '15px 8px',
                    minHeight: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {partner.first_name} {partner.last_name}
                  </div>,
                  
                  // Telefon
                  <div key={`${index}-2`} style={{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    padding: '15px 8px',
                    minHeight: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}>
                    {partner.phone || '-'}
                  </div>,
                  
                  // Temel Eğitimler
                  <div key={`${index}-3`} style={{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    padding: '15px 8px',
                    minHeight: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: partner.education_completed ? '#28a745' : '#dc3545',
                    fontWeight: 'bold'
                  }}>
                    {partner.education_completed ? '✅ Tamamlandı' : '⏳ Temel Eğitim Devam Ediyor'}
                  </div>,
                  
                  // 1. Adım (750$)
                  <div key={`${index}-4`} style={{
                    backgroundColor: partner.step1_earnings > 0 ? '#d4edda' : 'white',
                    border: '1px solid #ddd',
                    padding: '15px 8px',
                    minHeight: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: partner.step1_earnings > 0 ? '#155724' : '#666'
                  }}>
                    ${partner.step1_earnings?.toFixed(2) || '0.00'}
                  </div>,
                  
                  // 2. Adım (1000$)
                  <div key={`${index}-5`} style={{
                    backgroundColor: partner.step2_earnings > 0 ? '#d4edda' : 'white',
                    border: '1px solid #ddd',
                    padding: '15px 8px',
                    minHeight: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: partner.step2_earnings > 0 ? '#155724' : '#666'
                  }}>
                    ${partner.step2_earnings?.toFixed(2) || '0.00'}
                  </div>,
                  
                  // 3. Adım (1250$)
                  <div key={`${index}-6`} style={{
                    backgroundColor: partner.step3_earnings > 0 ? '#d4edda' : 'white',
                    border: '1px solid #ddd',
                    padding: '15px 8px',
                    minHeight: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: partner.step3_earnings > 0 ? '#155724' : '#666'
                  }}>
                    ${partner.step3_earnings?.toFixed(2) || '0.00'}
                  </div>,
                  
                  // 4. Adım (1500$)
                  <div key={`${index}-7`} style={{
                    backgroundColor: partner.step4_earnings > 0 ? '#d4edda' : 'white',
                    border: '1px solid #ddd',
                    padding: '15px 8px',
                    minHeight: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: partner.step4_earnings > 0 ? '#155724' : '#666'
                  }}>
                    ${partner.step4_earnings?.toFixed(2) || '0.00'}
                  </div>,
                  
                  // 5. Adım (1500$)
                  <div key={`${index}-8`} style={{
                    backgroundColor: partner.step5_earnings > 0 ? '#d4edda' : 'white',
                    border: '1px solid #ddd',
                    padding: '15px 8px',
                    minHeight: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: partner.step5_earnings > 0 ? '#155724' : '#666'
                  }}>
                    ${partner.step5_earnings?.toFixed(2) || '0.00'}
                  </div>,
                  
                  // Toplam Kazanç
                  <div key={`${index}-9`} style={{
                    backgroundColor: '#fff3cd',
                    border: '2px solid #ffeaa7',
                    padding: '15px 8px',
                    minHeight: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#856404'
                  }}>
                    ${partner.total_earnings?.toFixed(2) || '0.00'}
                  </div>
                ]
              )).flat()
            )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default SponsorshipTracker;