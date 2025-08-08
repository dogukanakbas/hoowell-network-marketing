import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminSystemSettings = () => {
  const [loading, setLoading] = useState(true);
  const [productSettings, setProductSettings] = useState({
    urunAdi: '',
    urunKodu: '',
    usdFiyati: '',
    kkpPuani: '',
    kdvYuzdesi: '',
    satisFiyati: '',
    kdvFiyati: '',
    toplamFiyat: '',
    stokAdedi: ''
  });

  const [careerSettings, setCareerSettings] = useState({
    bronzeIsOrtagi: { kariyerSeviyesi: 'BRONZE İŞ ORTAĞI', baslangicTutar: '0.000', bitisTutar: '20.000', minimumIsOrtagi: '0', satisKomisyonu: '% 14', kariyerBonusu: '*****', takimKomisyonu: '*****', liderlikHavuzu: '*****', baskanlikHavuzu: '*****', karPaylasimi: '*****', globalSeyahat: '*****' },
    silverIsOrtagi: { kariyerSeviyesi: 'SILVER İŞ ORTAĞI', baslangicTutar: '20.001', bitisTutar: '50.000', minimumIsOrtagi: '1', satisKomisyonu: '% 15', kariyerBonusu: '400 $', takimKomisyonu: '% 2', liderlikHavuzu: '***', baskanlikHavuzu: '***', karPaylasimi: '***', globalSeyahat: '****' },
    goldIsOrtagi: { kariyerSeviyesi: 'GOLD İŞ ORTAĞI', baslangicTutar: '50.001', bitisTutar: '100.000', minimumIsOrtagi: '3', satisKomisyonu: '% 17', kariyerBonusu: '800 $', takimKomisyonu: '% 4', liderlikHavuzu: '****', baskanlikHavuzu: '****', karPaylasimi: 'EVET', globalSeyahat: 'EVET' },
    starLider: { kariyerSeviyesi: 'STAR LİDER', baslangicTutar: '100.001', bitisTutar: '175.000', minimumIsOrtagi: '7', satisKomisyonu: '% 18', kariyerBonusu: '1.200 $', takimKomisyonu: '% 6', liderlikHavuzu: 'EVET', baskanlikHavuzu: '***', karPaylasimi: 'EVET', globalSeyahat: 'EVET' },
    superStarLider: { kariyerSeviyesi: 'SÜPER STAR LİDER', baslangicTutar: '175.001', bitisTutar: '300.000', minimumIsOrtagi: '15', satisKomisyonu: '% 19', kariyerBonusu: '1.600 $', takimKomisyonu: '% 8', liderlikHavuzu: 'EVET', baskanlikHavuzu: '*****', karPaylasimi: 'EVET', globalSeyahat: 'EVET' },
    baskanlikTakimi: { kariyerSeviyesi: 'BAŞKANLIK TAKIMI', baslangicTutar: '300.001', bitisTutar: '400.000', minimumIsOrtagi: '25', satisKomisyonu: '% 20', kariyerBonusu: '*****', takimKomisyonu: '% 10', liderlikHavuzu: '*****', baskanlikHavuzu: 'EVET', karPaylasimi: 'EVET', globalSeyahat: 'EVET' },
    ulkeDistributor: { kariyerSeviyesi: 'ÜLKE DISTRIBUTOR', baslangicTutar: '400.001', bitisTutar: '*****', minimumIsOrtagi: '30', satisKomisyonu: '% 20', kariyerBonusu: '*****', takimKomisyonu: '****', liderlikHavuzu: '*****', baskanlikHavuzu: '*****', karPaylasimi: '****', globalSeyahat: 'EVET' },
    yonetimKurulu: { kariyerSeviyesi: 'YÖNETİM KURULU', baslangicTutar: '*****', bitisTutar: '*****', minimumIsOrtagi: '*****', satisKomisyonu: '% 20', kariyerBonusu: '*****', takimKomisyonu: '% 12', liderlikHavuzu: '*****', baskanlikHavuzu: '*****', karPaylasimi: '*****', globalSeyahat: 'EVET' }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // API'den ayarları çek
      setLoading(false);
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error);
      setLoading(false);
    }
  };

  const handleProductChange = (field, value) => {
    setProductSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCareerChange = (level, field, value) => {
    setCareerSettings(prev => ({
      ...prev,
      [level]: {
        ...prev[level],
        [field]: value
      }
    }));
  };

  const saveSettings = async () => {
    try {
      // API'ye ayarları kaydet
      alert('Ayarlar başarıyla kaydedildi!');
    } catch (error) {
      console.error('Ayarlar kaydedilirken hata:', error);
      alert('Ayarlar kaydedilirken hata oluştu!');
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
        Sistem ayarları yükleniyor...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0e2323 0%, #1a3333 50%, #0e2323 100%)',
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
          SİSTEM AYARLARI
        </h1>
      </div>

      {/* Tab Butonları */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <button style={{
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          color: '#000',
          border: '2px solid #FFD700',
          borderRadius: '15px',
          padding: '12px 30px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
        }}>
          ÜRÜN YÖNETİMİ
        </button>
        <button style={{
          background: 'linear-gradient(135deg, #2a2a2a, #404040)',
          color: '#FFD700',
          border: '2px solid #FFD700',
          borderRadius: '15px',
          padding: '12px 30px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
        }}>
          KARİYER YÖNETİMİ
        </button>
      </div>

      {/* Ürün Yönetimi Tablosu */}
      <div style={{
        background: 'linear-gradient(135deg, #1a4040 0%, #2a5555 50%, #1a4040 100%)',
        borderRadius: '20px',
        padding: '20px',
        border: '3px solid #FFD700',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        marginBottom: '30px'
      }}>
        {/* Tablo Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(9, 1fr)',
          gap: '2px',
          marginBottom: '10px'
        }}>
          {['ÜRÜNÜN ADI', 'ÜRÜNÜN KODU', 'USD FİYATI', 'KKP PUANI', 'KDV YÜZDESİ', 'SATIŞ FİYATI (₺)', 'KDV FİYATI', 'TOPLAM FİYAT', 'STOK ADEDİ'].map((header, index) => (
            <div key={index} style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
              color: '#000',
              padding: '10px 5px',
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: 'bold',
              borderRadius: '5px'
            }}>
              {header}
            </div>
          ))}
        </div>

        {/* Tablo Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(9, 1fr)',
          gap: '2px'
        }}>
          {Array.from({ length: 9 }, (_, colIndex) => (
            <input
              key={colIndex}
              type="text"
              style={{
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '5px',
                padding: '8px',
                textAlign: 'center',
                fontSize: '12px'
              }}
              placeholder="Değer girin"
            />
          ))}
        </div>
      </div>

      {/* Kaydet Butonu */}
      <div style={{
        textAlign: 'center',
        marginTop: '30px'
      }}>
        <button
          onClick={saveSettings}
          style={{
            background: 'linear-gradient(135deg, #28a745, #20c997)',
            color: 'white',
            border: 'none',
            borderRadius: '15px',
            padding: '15px 40px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}
        >
          AYARLARI KAYDET
        </button>
      </div>
    </div>
  );
};

export default AdminSystemSettings;