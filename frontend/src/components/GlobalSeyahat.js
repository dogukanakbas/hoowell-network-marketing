import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GlobalSeyahat = () => {
  const [loading, setLoading] = useState(true);
  const [travelData, setTravelData] = useState({
    startDate: 'EYLÜL 2025',
    endDate: 'AĞUSTOS 2026',
    sales1: { target: 40000, current: 0, remaining: 40000 },
    sales2: { target: 65000, current: 0, remaining: 65000 },
    partnership: { target: 5, current: 0, remaining: 5 }
  });

  useEffect(() => {
    fetchTravelData();
  }, []);

  const fetchTravelData = async () => {
    try {
      const response = await axios.get('/api/global-travel/data', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTravelData(response.data);
    } catch (error) {
      console.error('Global travel data fetch error:', error);
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
        Global seyahat verileri yükleniyor...
      </div>
    );
  }

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
        width: '100px',
        height: '60px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
        padding: '5px',
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
          marginBottom: '10px',
          textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
          letterSpacing: '2px'
        }}>
          ÖDÜL SEYAHAT PROMOSYONU
        </h1>
        <div style={{
          color: '#FFD700',
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          12 AYLIK
        </div>
      </div>



      {/* Ana İçerik */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '30px'
      }}>
        {/* Tarih ve Logo Bölümü */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '40px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {/* Tarih Bilgisi */}
          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
            borderRadius: '20px',
            padding: '20px 30px',
            textAlign: 'center',
            color: '#FFD700',
            fontWeight: 'bold',
            border: '3px solid #FFD700',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '5px' }}>Başlangıç Tarihi</div>
            <div style={{ fontSize: '20px', marginBottom: '15px' }}>{travelData.startDate}</div>
            <div style={{ fontSize: '14px', marginBottom: '5px' }}>Bitiş Tarihi</div>
            <div style={{ fontSize: '20px' }}>{travelData.endDate}</div>
          </div>

          {/* Logo */}
          <div style={{
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, #dc3545, #c82333)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '40px',
            fontWeight: 'bold',
            boxShadow: '0 10px 30px rgba(220, 53, 69, 0.4)'
          }}>
            ✈️
          </div>
        </div>

        {/* Hedef Kartları - Yan Yana */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}>
          {/* 1. Satış Hedefi */}
          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
            borderRadius: '20px',
            padding: '20px',
            border: '3px solid #FFD700',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            minWidth: '280px'
          }}>
            {/* Başlık */}
            <div style={{
              textAlign: 'center',
              color: '#FFD700',
              fontWeight: 'bold',
              fontSize: '18px',
              marginBottom: '20px',
              padding: '10px',
              background: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '10px'
            }}>
              SATIŞ
            </div>

            {/* Hedef Başlıkları */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '10px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '11px',
                textAlign: 'center',
                flex: 1
              }}>
                HEDEF
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '11px',
                textAlign: 'center',
                flex: 1
              }}>
                YAPILAN
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '11px',
                textAlign: 'center',
                flex: 1
              }}>
                KALAN
              </div>
            </div>

            {/* Değerler */}
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #ddd',
                borderRadius: '8px',
                padding: '12px 8px',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                flex: 1,
                color: '#333'
              }}>
                40.000
              </div>
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #ddd',
                borderRadius: '8px',
                padding: '12px 8px',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                flex: 1,
                color: '#666'
              }}>
                {(travelData.sales1?.current || 0).toLocaleString()}
              </div>
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #ddd',
                borderRadius: '8px',
                padding: '12px 8px',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                flex: 1,
                color: '#666'
              }}>
                {(travelData.sales1?.remaining || 40000).toLocaleString()}
              </div>
            </div>
          </div>

          {/* 2. Kişi Hedefi */}
          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
            borderRadius: '20px',
            padding: '20px',
            border: '3px solid #FFD700',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            minWidth: '280px'
          }}>
            {/* Başlık */}
            <div style={{
              textAlign: 'center',
              color: '#FFD700',
              fontWeight: 'bold',
              fontSize: '18px',
              marginBottom: '20px',
              padding: '10px',
              background: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '10px'
            }}>
              2. KİŞİ
            </div>

            {/* Hedef Başlıkları */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '10px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '11px',
                textAlign: 'center',
                flex: 1
              }}>
                SATIŞ HEDEFİ
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '11px',
                textAlign: 'center',
                flex: 1
              }}>
                YAPILAN
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '11px',
                textAlign: 'center',
                flex: 1
              }}>
                KALAN
              </div>
            </div>

            {/* Değerler */}
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #ddd',
                borderRadius: '8px',
                padding: '12px 8px',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                flex: 1,
                color: '#333'
              }}>
                65.000
              </div>
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #ddd',
                borderRadius: '8px',
                padding: '12px 8px',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                flex: 1,
                color: '#666'
              }}>
                {(travelData.sales2?.current || 0).toLocaleString()}
              </div>
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #ddd',
                borderRadius: '8px',
                padding: '12px 8px',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                flex: 1,
                color: '#666'
              }}>
                {(travelData.sales2?.remaining || 65000).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Ortaklık Hedefi - Tek Kart */}
        <div style={{
          background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '3px solid #FFD700',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          maxWidth: '400px',
          width: '100%'
        }}>
          {/* Başlık */}
          <div style={{
            textAlign: 'center',
            color: '#FFD700',
            fontWeight: 'bold',
            fontSize: '18px',
            marginBottom: '20px',
            padding: '10px',
            background: 'rgba(255, 215, 0, 0.1)',
            borderRadius: '10px'
          }}>
            ŞAHSİ İŞ ORTAĞI
          </div>

          {/* Hedef Başlıkları */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '10px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '11px',
              textAlign: 'center',
              flex: 1
            }}>
              HEDEF
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '11px',
              textAlign: 'center',
              flex: 1
            }}>
              YAPILAN
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '11px',
              textAlign: 'center',
              flex: 1
            }}>
              KALAN
            </div>
          </div>

          {/* Değerler */}
          <div style={{
            display: 'flex',
            gap: '8px'
          }}>
            <div style={{
              backgroundColor: 'white',
              border: '2px solid #ddd',
              borderRadius: '8px',
              padding: '15px 8px',
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              flex: 1,
              color: '#333'
            }}>
              5
            </div>
            <div style={{
              backgroundColor: 'white',
              border: '2px solid #ddd',
              borderRadius: '8px',
              padding: '15px 8px',
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              flex: 1,
              color: '#666'
            }}>
              {travelData.partnership?.current || 0}
            </div>
            <div style={{
              backgroundColor: 'white',
              border: '2px solid #ddd',
              borderRadius: '8px',
              padding: '15px 8px',
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              flex: 1,
              color: '#666'
            }}>
              {travelData.partnership?.remaining || 5}
            </div>
          </div>
        </div>

      </div>
    </div>

  );
};

export default GlobalSeyahat;