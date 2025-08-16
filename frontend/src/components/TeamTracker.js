import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const TeamTracker = () => {
  const { user } = useAuth();
  const [teamData, setTeamData] = useState({
    team_members: [],
    team_stats: {
      total_members: 0,
      active_members: 0,
      total_team_sales: 0,
      monthly_team_sales: 0,
      franchise_percentage: 0
    }
  });
  const [activeTab, setActiveTab] = useState('takip'); // 'takip' veya 'kazanc'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Suppress unused variable warnings temporarily
  console.log('Team state:', { teamData, loading, error });

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/team/tracker', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTeamData(response.data);
    } catch (error) {
      console.error('Team data fetch error:', error);
      setError('Takım verileri yüklenirken hata oluştu. Lütfen sayfayı yenileyin.');
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcının kariyer seviyesine göre franchise yüzdesi
  const getFranchisePercentage = (level) => {
    const percentages = {
      silver: 2,
      gold: 4,
      star_leader: 6,
      super_star_leader: 8,
      presidents_team: 10
    };
    return percentages[level] || 0;
  };

  const getLevelName = (level) => {
    const names = {
      bronze: 'BRONZE',
      silver: 'SILVER',
      gold: 'GOLD',
      star_leader: 'STAR LİDER',
      super_star_leader: 'SÜPER STAR LİDER',
      presidents_team: 'BAŞKANLIK TAKIMI'
    };
    return names[level] || level?.toUpperCase();
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
        Takım verileri yükleniyor...
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

      {/* Tab Butonları */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '20px',
        paddingTop: '20px'
      }}>
        <button
          onClick={() => setActiveTab('takip')}
          style={{
            backgroundColor: activeTab === 'takip' ? '#FFD700' : 'rgba(0,0,0,0.7)',
            color: activeTab === 'takip' ? '#000' : '#FFD700',
            border: '2px solid #FFD700',
            borderRadius: '15px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          TAKİP TABLOSU
        </button>
        <button
          onClick={() => setActiveTab('kazanc')}
          style={{
            backgroundColor: activeTab === 'kazanc' ? '#FFD700' : 'rgba(0,0,0,0.7)',
            color: activeTab === 'kazanc' ? '#000' : '#FFD700',
            border: '2px solid #FFD700',
            borderRadius: '15px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          KAZANÇ TABLOSU
        </button>
      </div>

      {/* Ana Başlık */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px'
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
          TAKIM TAKİP TABLOSU
        </h1>
      </div>



      {/* Ana Container */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        border: '3px solid #FFD700'
      }}>
        
        {/* Takip Tablosu */}
        {activeTab === 'takip' && (
          <div style={{ overflowX: 'auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(10, 1fr)',
              gap: '2px',
              fontSize: '12px',
              minWidth: '1200px'
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
                İŞE BAŞLAMA<br />TARİHİ
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
                TOPLAM<br />KKP
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
                FRANCHAİSE<br />SATIŞI
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
                AKTİF<br />İŞ ORTAĞI
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
                KARİYER<br />SEVİYESİ
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
                AYLIK SATIŞ<br />KKP
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
                AKTİFLEŞEN<br />İŞ ORTAĞI
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
                AKTİFLİK<br />DURUMU
              </div>

              {/* Veri Satırları - Boş kutular */}
              {Array.from({ length: 8 }, (_, rowIndex) => (
                Array.from({ length: 10 }, (_, colIndex) => (
                  <div
                    key={`takip-${rowIndex}-${colIndex}`}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      padding: '15px 8px',
                      minHeight: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}
                  >
                    {/* Boş kutular - backend'den veri gelecek */}
                  </div>
                ))
              )).flat()}
            </div>
          </div>
        )}

        {/* Kazanç Tablosu */}
        {activeTab === 'kazanc' && (
          <div style={{ overflowX: 'auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '2px',
              fontSize: '12px',
              minWidth: '1000px'
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
                KARİYER<br />SEVİYESİ
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
                HAK EDİŞ<br />YÜZDESİ
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
                KAZANÇ<br />YÜZDESİ
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
                YAPILAN SATIŞ<br />CİROSU
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
                AYLIK FRANCHAİSE<br />GELİRİ
              </div>

              {/* Veri Satırları - Boş kutular */}
              {Array.from({ length: 8 }, (_, rowIndex) => (
                Array.from({ length: 7 }, (_, colIndex) => (
                  <div
                    key={`kazanc-${rowIndex}-${colIndex}`}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      padding: '15px 8px',
                      minHeight: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}
                  >
                    {/* Boş kutular - backend'den veri gelecek */}
                  </div>
                ))
              )).flat()}
            </div>

            {/* Toplam Kutuları */}
            <div style={{
              marginTop: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '2px',
              minWidth: '1000px'
            }}>
              {/* Boş kutular - İlk 5 kolon için */}
              {Array.from({ length: 5 }, (_, index) => (
                <div
                  key={`total-empty-${index}`}
                  style={{
                    backgroundColor: 'transparent',
                    padding: '15px 8px',
                    minHeight: '50px'
                  }}
                />
              ))}
              
              {/* YAPILAN SATIŞ CİROSU Toplam Kutusu */}
              <div style={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                borderRadius: '10px',
                padding: '15px 8px',
                color: '#FFD700',
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50px',
                border: '2px solid #FFD700'
              }}>
                TOPLAM<br />GELİR
              </div>
              
              {/* AYLIK FRANCHAİSE GELİRİ Toplam Kutusu */}
              <div style={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                borderRadius: '10px',
                padding: '15px 8px',
                color: '#FFD700',
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50px',
                border: '2px solid #FFD700'
              }}>
                
              </div>
            </div>
          </div>
        )}
      </div>


    </div>
  );
};

export default TeamTracker;