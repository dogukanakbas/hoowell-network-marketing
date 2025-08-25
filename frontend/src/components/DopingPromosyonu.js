import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const DopingPromosyonu = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Suppress unused variable warnings temporarily
  console.log('Doping state:', { user, loading, error });
  const [dopingData, setDopingData] = useState({
    etap1: {
      baslangic_tarihi: '26.07.2025',
      bitis_tarihi: '25.09.2025',
      hedef_satis: 40,
      yapilan_satis: 0,
      kalan_satis: 40,
      hedef_ortak: 7,
      yapilan_ortak: 0,
      kalan_ortak: 7,
      kazanilacak_puan: 0,
      tamamlandi: false,
      aktif: false,
      kalan_gun: 0
    },
    etap2: {
      baslangic_tarihi: '26.09.2025',
      bitis_tarihi: '25.11.2025',
      hedef_satis: 80,
      yapilan_satis: 0,
      kalan_satis: 80,
      hedef_ortak: 15,
      yapilan_ortak: 0,
      kalan_ortak: 15,
      kazanilacak_puan: 0,
      tamamlandi: false,
      aktif: false,
      kalan_gun: 0
    },
    days_since_registration: 0,
    current_stage: 1,
    current_multiplier: 1,
    total_sales: 0,
    total_partners: 0,
    personal_sales: 0,
    team_sales: 0,
    registration_date: ''
  });

  useEffect(() => {
    fetchDopingData();
  }, []);

  const fetchDopingData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/doping-promotion/progress', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data) {
        console.log('🔍 Frontend Doping Data:', response.data);
        console.log('🔍 Etap1 Tamamlandı:', response.data.etap1.tamamlandi);
        console.log('🔍 Etap2 Beklemekte:', !response.data.etap1.tamamlandi);
        setDopingData(response.data);
      }
    } catch (error) {
      console.error('Doping promotion data fetch error:', error);
      setError('Doping promosyonu verileri yüklenirken hata oluştu. Lütfen sayfayı yenileyin.');
    } finally {
      setLoading(false);
    }
  };

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
          KARİYER DOPİNG PROMOSYONU
        </h1>
        
        {/* Durum Göstergesi */}
        <div style={{
          marginTop: '20px',
          padding: '15px 30px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '15px',
          border: '2px solid #FFD700',
          display: 'inline-block'
        }}>
          <div style={{
            color: '#FFD700',
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '5px'
          }}>
            MEVCUT DURUM
          </div>
          <div style={{
            color: 'white',
            fontSize: '16px'
          }}>
            Kayıt Sonrası: <strong style={{ color: '#FFD700' }}>{dopingData.days_since_registration} Gün</strong>
          </div>
          <div style={{
            color: 'white',
            fontSize: '16px'
          }}>
            Aktif Etap: <strong style={{ color: '#FFD700' }}>
              {dopingData.current_stage === 1 ? '1. ETAP (İlk 60 Gün)' : 
               dopingData.current_stage === 2 ? '2. ETAP (61-120 Gün)' : 
               'Promosyon Süresi Doldu'}
            </strong>
          </div>
        </div>
      </div>

      {/* İki Etap Container */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '40px',
        maxWidth: '1400px',
        margin: '0 auto',
        flexWrap: 'wrap'
      }}>
        {/* 1. ETAP */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '20px',
          padding: '30px',
          width: '600px',
          border: '3px solid #FFD700',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
        }}>
          {/* Etap Başlığı */}
          <div style={{
            backgroundColor: '#333',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <h2 style={{
              color: '#FFD700',
              fontSize: '24px',
              fontWeight: 'bold',
              margin: '0',
              marginBottom: '10px'
            }}>
              1.ETAP
            </h2>
            <div style={{ color: 'white', fontSize: '16px', marginBottom: '5px' }}>
              Başlangıç Tarihi: {dopingData.etap1.baslangic_tarihi}
            </div>
            <div style={{ color: 'white', fontSize: '16px' }}>
              Bitiş Tarihi: {dopingData.etap1.bitis_tarihi}
            </div>
          </div>



          {/* Toplam Satış Tablosu */}
          <div style={{
            backgroundColor: '#666',
            borderRadius: '10px',
            padding: '10px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            <div style={{
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              TOPLAM TAKIM SATIŞI (Şahsi + Takım)
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <div style={{
              backgroundColor: '#B8860B',
              borderRadius: '8px',
              padding: '15px',
              flex: 1,
              textAlign: 'center'
            }}>
              <div style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                HEDEF
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '5px',
                padding: '10px',
                color: 'black',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {dopingData.etap1.hedef_satis}
              </div>
            </div>
            <div style={{
              backgroundColor: '#B8860B',
              borderRadius: '8px',
              padding: '15px',
              flex: 1,
              textAlign: 'center'
            }}>
              <div style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                TOPLAM YAPILAN
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '5px',
                padding: '10px',
                color: 'black',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {dopingData.etap1.yapilan_satis}
              </div>
            </div>
            <div style={{
              backgroundColor: '#B8860B',
              borderRadius: '8px',
              padding: '15px',
              flex: 1,
              textAlign: 'center'
            }}>
              <div style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                KALAN
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '5px',
                padding: '10px',
                color: 'black',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {dopingData.etap1.kalan_satis}
              </div>
            </div>
          </div>

          {/* Şahsi İş Ortağı Butonu */}
          <div style={{
            backgroundColor: '#666',
            borderRadius: '10px',
            padding: '10px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            <div style={{
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              ŞAHSİ İŞ ORTAĞI
            </div>
          </div>

          {/* İş Ortağı Tablosu */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '30px'
          }}>
            <div style={{
              backgroundColor: '#B8860B',
              borderRadius: '8px',
              padding: '15px',
              flex: 1,
              textAlign: 'center'
            }}>
              <div style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                HEDEF
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '5px',
                padding: '10px',
                color: 'black',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {dopingData.etap1.hedef_ortak}
              </div>
            </div>
            <div style={{
              backgroundColor: '#B8860B',
              borderRadius: '8px',
              padding: '15px',
              flex: 1,
              textAlign: 'center'
            }}>
              <div style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                YAPILAN
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '5px',
                padding: '10px',
                color: 'black',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {dopingData.etap1.yapilan_ortak}
              </div>
            </div>
            <div style={{
              backgroundColor: '#B8860B',
              borderRadius: '8px',
              padding: '15px',
              flex: 1,
              textAlign: 'center'
            }}>
              <div style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                KALAN
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '5px',
                padding: '10px',
                color: 'black',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {dopingData.etap1.kalan_ortak}
              </div>
            </div>
          </div>

          {/* Etap Durumu */}
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: dopingData.etap1.tamamlandi ? '#28a745' : '#dc3545',
            borderRadius: '10px'
          }}>
            <div style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              {dopingData.etap1.tamamlandi ? '✅ ETAP TAMAMLANDI' : '⏳ ETAP DEVAM EDİYOR'}
            </div>
            <div style={{
              color: 'white',
              fontSize: '14px'
            }}>
              {dopingData.etap1.tamamlandi 
                ? 'KKP\'leriniz 2 ile çarpılıyor!' 
                : `${dopingData.etap1.kalan_satis} satış ve ${dopingData.etap1.kalan_ortak} ortak kaldı`
              }
            </div>
          </div>

          {/* Hediye Kazanılacak Extra Puan */}
          <div style={{
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              color: '#FFD700',
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              HEDİYE KAZANILACAK<br />EXTRA PUAN
            </div>
            <div style={{
              color: '#FFD700',
              fontSize: '36px',
              fontWeight: 'bold'
            }}>
              {dopingData.etap1.kazanilacak_puan.toFixed(3)} KKP
            </div>
            {dopingData.etap1.tamamlandi && (
              <div style={{
                color: '#28a745',
                fontSize: '14px',
                fontWeight: 'bold',
                marginTop: '10px'
              }}>
                🎉 2X ÇARPAN AKTİF!
              </div>
            )}
          </div>
        </div>

        {/* 2. ETAP */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '20px',
          padding: '30px',
          width: '600px',
          border: '3px solid #FFD700',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          opacity: (!dopingData.etap1.tamamlandi) ? 0.6 : 1
        }}>
          {/* Etap Başlığı */}
          <div style={{
            backgroundColor: '#333',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <h2 style={{
              color: (!dopingData.etap1.tamamlandi) ? '#FFA500' : '#FFD700',
              fontSize: '24px',
              fontWeight: 'bold',
              margin: '0',
              marginBottom: '10px'
            }}>
              {(!dopingData.etap1.tamamlandi) ? '2.ETAP (BEKLEMEDE)' : '2.ETAP'}
            </h2>
            <div style={{ color: 'white', fontSize: '16px', marginBottom: '5px' }}>
              Başlangıç Tarihi: {dopingData.etap2.baslangic_tarihi}
            </div>
            <div style={{ color: 'white', fontSize: '16px' }}>
              Bitiş Tarihi: {dopingData.etap2.bitis_tarihi}
            </div>
          </div>



          {/* Toplam Satış Tablosu */}
          <div style={{
            backgroundColor: '#666',
            borderRadius: '10px',
            padding: '10px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            <div style={{
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              TOPLAM TAKIM SATIŞI (Şahsi + Takım)
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <div style={{
              backgroundColor: '#B8860B',
              borderRadius: '8px',
              padding: '15px',
              flex: 1,
              textAlign: 'center'
            }}>
              <div style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                HEDEF
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '5px',
                padding: '10px',
                color: 'black',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {dopingData.etap2.hedef_satis}
              </div>
            </div>
            <div style={{
              backgroundColor: '#B8860B',
              borderRadius: '8px',
              padding: '15px',
              flex: 1,
              textAlign: 'center'
            }}>
              <div style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                TOPLAM YAPILAN
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '5px',
                padding: '10px',
                color: 'black',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {(!dopingData.etap1.tamamlandi) ? 0 : dopingData.etap2.yapilan_satis}
              </div>
            </div>
            <div style={{
              backgroundColor: '#B8860B',
              borderRadius: '8px',
              padding: '15px',
              flex: 1,
              textAlign: 'center'
            }}>
              <div style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                KALAN
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '5px',
                padding: '10px',
                color: 'black',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {(!dopingData.etap1.tamamlandi) ? 80 : dopingData.etap2.kalan_satis}
              </div>
            </div>
          </div>

          {/* Şahsi İş Ortağı Butonu */}
          <div style={{
            backgroundColor: '#666',
            borderRadius: '10px',
            padding: '10px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            <div style={{
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              ŞAHSİ İŞ ORTAĞI
            </div>
          </div>

          {/* İş Ortağı Tablosu */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '30px'
          }}>
            <div style={{
              backgroundColor: '#B8860B',
              borderRadius: '8px',
              padding: '15px',
              flex: 1,
              textAlign: 'center'
            }}>
              <div style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                HEDEF
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '5px',
                padding: '10px',
                color: 'black',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {dopingData.etap2.hedef_ortak}
              </div>
            </div>
            <div style={{
              backgroundColor: '#B8860B',
              borderRadius: '8px',
              padding: '15px',
              flex: 1,
              textAlign: 'center'
            }}>
              <div style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                YAPILAN
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '5px',
                padding: '10px',
                color: 'black',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {(!dopingData.etap1.tamamlandi) ? 0 : dopingData.etap2.yapilan_ortak}
              </div>
            </div>
            <div style={{
              backgroundColor: '#B8860B',
              borderRadius: '8px',
              padding: '15px',
              flex: 1,
              textAlign: 'center'
            }}>
              <div style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                KALAN
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '5px',
                padding: '10px',
                color: 'black',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {(!dopingData.etap1.tamamlandi) ? 15 : dopingData.etap2.kalan_ortak}
              </div>
            </div>
          </div>

          {/* Etap Durumu */}
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: (!dopingData.etap1.tamamlandi) ? '#FFA500' : (dopingData.etap2.tamamlandi ? '#28a745' : '#dc3545'),
            borderRadius: '10px'
          }}>
            <div style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              {(!dopingData.etap1.tamamlandi) ? '⏸️ ETAP BEKLEMEDE' : (dopingData.etap2.tamamlandi ? '✅ ETAP TAMAMLANDI' : '⏳ ETAP DEVAM EDİYOR')}
            </div>
            <div style={{
              color: 'white',
              fontSize: '14px'
            }}>
              {(!dopingData.etap1.tamamlandi) 
                ? '1. Etap tamamlanması bekleniyor' 
                : (dopingData.etap2.tamamlandi 
                  ? 'KKP\'leriniz 2 ile çarpılıyor!' 
                  : `${dopingData.etap2.kalan_satis} satış ve ${dopingData.etap2.kalan_ortak} ortak kaldı`)
              }
            </div>
          </div>

          {/* Hediye Kazanılacak Extra Puan */}
          <div style={{
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              color: '#FFD700',
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              HEDİYE KAZANILACAK<br />EXTRA PUAN
            </div>
            <div style={{
              color: '#FFD700',
              fontSize: '36px',
              fontWeight: 'bold'
            }}>
              {(!dopingData.etap1.tamamlandi) ? '0.000' : dopingData.etap2.kazanilacak_puan.toFixed(3)} KKP
            </div>
            {dopingData.etap2.tamamlandi && (
              <div style={{
                color: '#28a745',
                fontSize: '14px',
                fontWeight: 'bold',
                marginTop: '10px'
              }}>
                🎉 2X ÇARPAN AKTİF!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alt Bilgi Metni */}
      <div style={{
        maxWidth: '1200px',
        margin: '40px auto 0',
        padding: '30px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '20px',
        border: '2px solid #FFD700'
      }}>
        <div style={{
          color: '#FFD700',
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          KARİYER DOPİNG PROMOSYONU AÇIKLAMASI
        </div>
        <div style={{
          color: 'white',
          fontSize: '16px',
          lineHeight: '1.6',
          textAlign: 'justify'
        }}>
          <p style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#FFD700' }}>AMAÇ:</strong> Hoowell ile çok HIZLI BAŞLANGIÇ yapan kişileri ödüllendirmek.
          </p>
          <p style={{ marginBottom: '15px' }}>
            Her iş ortağının işe başladıktan sonra <strong style={{ color: '#FFD700' }}>2 adet KARİYER PUANLARINI KATLAMA</strong> fırsatı vardır.
          </p>
          <p style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#FFD700' }}>1.ADIM:</strong> İLK 60 GÜN içinde TAKIMINA en az 7 AKTİF İŞ ORTAĞI bulan ve en az 40 adet Hoowell Hybrid Alkali İyonizer cihazını TAKIMI ile beraber satan kişilerin ilk 60 günde yaptıkları KARİYER PUANLARI 2 ile çarpılır.
          </p>
          <p style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#FFD700' }}>2.ADIM:</strong> İLK 120 GÜN içinde TAKIMINA en az 15 AKTİF İŞ ORTAĞI bulan ve 61. Gün ila 120.gün arasında en az 80 adet Hoowell Hybrid Alkali İyonizer cihazını TAKIMI ile beraber satan kişilerin 61. Gün ila 120.gün arasında yaptıkları KARİYER PUANLARI 2 ile çarpılır.
          </p>
          <p style={{ marginBottom: '15px' }}>
            Her 2 adım birbirinden bağımsız olarak işler. 1.ADIMI kaçıran biri 2. ADIMI yakaladığı takdirde puanlarını ikiye katlar.
          </p>
          <p style={{ marginBottom: '0' }}>
            Bu istisnai durumdur ve doğal olarak bazı kariyerler çok hızlı geçilir. Bu LİDERİ şirketimize getiren kişinin ORTAK BULMA gelirlerinde hiçbir kayıp oluşmaz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DopingPromosyonu;