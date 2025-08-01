import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCareerManagement = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('urun');
  
  const careerLevels = [
    {
      level: 'BRONZE İŞ ORTAĞI',
      startAmount: '0.000',
      endAmount: '20.000',
      minPartners: '0',
      salesCommission: '% 14',
      careerBonus: '*****',
      teamCommission: '*****',
      leadershipPool: '****',
      presidencyPool: '****',
      profitShare: '*****',
      globalTravel: '*****'
    },
    {
      level: 'SILVER İŞ ORTAĞI',
      startAmount: '20.001',
      endAmount: '50.000',
      minPartners: '1',
      salesCommission: '% 15',
      careerBonus: '400 $',
      teamCommission: '% 2',
      leadershipPool: '***',
      presidencyPool: '***',
      profitShare: '***',
      globalTravel: '****'
    },
    {
      level: 'GOLD İŞ ORTAĞI',
      startAmount: '50.001',
      endAmount: '100.000',
      minPartners: '3',
      salesCommission: '% 17',
      careerBonus: '800 $',
      teamCommission: '% 4',
      leadershipPool: '****',
      presidencyPool: '****',
      profitShare: 'EVET',
      globalTravel: 'EVET'
    },
    {
      level: 'STAR LİDER',
      startAmount: '100.001',
      endAmount: '175.000',
      minPartners: '7',
      salesCommission: '% 18',
      careerBonus: '1.200 $',
      teamCommission: '% 6',
      leadershipPool: 'EVET',
      presidencyPool: '***',
      profitShare: 'EVET',
      globalTravel: 'EVET'
    },
    {
      level: 'SÜPER STAR LİDER',
      startAmount: '175.001',
      endAmount: '300.000',
      minPartners: '15',
      salesCommission: '% 19',
      careerBonus: '1.600 $',
      teamCommission: '% 8',
      leadershipPool: 'EVET',
      presidencyPool: '*****',
      profitShare: 'EVET',
      globalTravel: 'EVET'
    },
    {
      level: 'BAŞKANLIK TAKIMI',
      startAmount: '300.001',
      endAmount: '400.000',
      minPartners: '25',
      salesCommission: '% 20',
      careerBonus: '*****',
      teamCommission: '% 10',
      leadershipPool: '*****',
      presidencyPool: 'EVET',
      profitShare: 'EVET',
      globalTravel: 'EVET'
    },
    {
      level: 'ÜLKE DISTRIBUTOR',
      startAmount: '400.001',
      endAmount: '*****',
      minPartners: '30',
      salesCommission: '% 20',
      careerBonus: '*****',
      teamCommission: '****',
      leadershipPool: '*****',
      presidencyPool: '*****',
      profitShare: '****',
      globalTravel: 'EVET'
    },
    {
      level: 'YÖNETİM KURULU',
      startAmount: '*****',
      endAmount: '*****',
      minPartners: '*****',
      salesCommission: '% 20',
      careerBonus: '*****',
      teamCommission: '% 12',
      leadershipPool: '*****',
      presidencyPool: '*****',
      profitShare: '*****',
      globalTravel: 'EVET'
    }
  ];

  useEffect(() => {
    setLoading(false);
  }, []);

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
        Kariyer verileri yükleniyor...
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
      {/* Hoowell Logo - Sağ Üst */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
        borderRadius: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 5px 15px rgba(255, 215, 0, 0.4)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        zIndex: 10
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#0e2323',
          textAlign: 'center',
          lineHeight: '1.2'
        }}>
          <div>HOOWELL</div>
          <div style={{ fontSize: '8px' }}>INNOVATE YOUR LIFE</div>
        </div>
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
        <button
          onClick={() => setActiveTab('urun')}
          style={{
            background: activeTab === 'urun' 
              ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
              : 'linear-gradient(135deg, #2a2a2a, #404040)',
            color: activeTab === 'urun' ? '#000' : '#FFD700',
            border: '2px solid #FFD700',
            borderRadius: '15px',
            padding: '12px 30px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}
        >
          ÜRÜN YÖNETİMİ
        </button>
        <button
          onClick={() => setActiveTab('kariyer')}
          style={{
            background: activeTab === 'kariyer' 
              ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
              : 'linear-gradient(135deg, #2a2a2a, #404040)',
            color: activeTab === 'kariyer' ? '#000' : '#FFD700',
            border: '2px solid #FFD700',
            borderRadius: '15px',
            padding: '12px 30px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}
        >
          KARİYER YÖNETİMİ
        </button>
      </div>

      {/* Kariyer Yönetimi Tablosu */}
      {activeTab === 'kariyer' && (
        <div style={{
          background: 'linear-gradient(135deg, #1a4040 0%, #2a5555 50%, #1a4040 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '3px solid #FFD700',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          {/* Tablo Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(11, 1fr)',
            gap: '2px',
            marginBottom: '10px'
          }}>
            {['KARİYER SEVİYESİ', 'BAŞLANGIÇ TUTAR', 'BİTİŞ TUTAR', 'MİNİMUM İŞ ORTAĞI', 'SATIŞ KOMİSYONU', 'KARİYER BONUSU', 'TAKIM KOMİSYONU', 'LİDERLİK HAVUZU', 'BAŞKANLIK HAVUZU', 'KAR PAYLAŞIMI', 'GLOBAL SEYAHAT'].map((header, index) => (
              <div key={index} style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                color: '#000',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '9px',
                fontWeight: 'bold',
                borderRadius: '5px'
              }}>
                {header}
              </div>
            ))}
          </div>

          {/* Tablo Content */}
          {careerLevels.map((career, rowIndex) => (
            <div key={rowIndex} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(11, 1fr)',
              gap: '2px',
              marginBottom: '2px'
            }}>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '9px',
                fontWeight: 'bold',
                borderRadius: '3px'
              }}>
                {career.level}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {career.startAmount}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {career.endAmount}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {career.minPartners}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {career.salesCommission}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {career.careerBonus}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {career.teamCommission}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {career.leadershipPool}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {career.presidencyPool}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {career.profitShare}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {career.globalTravel}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Kaydet Butonu */}
      <div style={{
        textAlign: 'center',
        marginTop: '30px'
      }}>
        <button style={{
          background: 'linear-gradient(135deg, #28a745, #20c997)',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          padding: '15px 40px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
        }}>
          AYARLARI KAYDET
        </button>
      </div>
    </div>
  );
};

export default AdminCareerManagement;