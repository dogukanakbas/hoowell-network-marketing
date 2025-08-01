import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const TeamTracker = () => {
  const { user } = useAuth();
  const [teamData, setTeamData] = useState([]);
  const [activeTab, setActiveTab] = useState('takip'); // 'takip' veya 'kazanc'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const response = await axios.get('/api/team/tracker', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTeamData(response.data);
    } catch (error) {
      console.error('Team data fetch error:', error);
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
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          borderRadius: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 5px 15px rgba(255, 215, 0, 0.4)',
          border: '2px solid rgba(255, 255, 255, 0.2)'
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

      {/* Kullanıcı Kariyer Bilgisi */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #8B008B, #DA70D6)',
          borderRadius: '15px',
          padding: '15px 30px',
          display: 'inline-block',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          <div>SİZİN KARİYERİNİZ: {getLevelName(user?.career_level || 'silver')}</div>
          <div>KAZANÇ YÜZDENİZ: % {getFranchisePercentage(user?.career_level || 'silver')}</div>
        </div>
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
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '2px',
              fontSize: '12px',
              minWidth: '1000px'
            }}>
              {/* Başlık Satırı */}
              <div style={{
                backgroundColor: '#B8860B',
                color: 'white',
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
                backgroundColor: '#B8860B',
                color: 'white',
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
                backgroundColor: '#B8860B',
                color: 'white',
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
                backgroundColor: '#B8860B',
                color: 'white',
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
                backgroundColor: '#B8860B',
                color: 'white',
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
                backgroundColor: '#B8860B',
                color: 'white',
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
                backgroundColor: '#B8860B',
                color: 'white',
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

            {/* Alt Bilgi Kutusu */}
            <div style={{
              marginTop: '20px',
              textAlign: 'center'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #8B008B, #DA70D6)',
                borderRadius: '15px',
                padding: '20px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Bu rapor her ay<br />
                Yenilenecek.<br />
                Kazanç oluşmazsa listeye<br />
                isim koymayacağız.
              </div>
              <div style={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                borderRadius: '10px',
                padding: '10px 20px',
                color: '#FFD700',
                fontSize: '14px',
                fontWeight: 'bold',
                marginTop: '10px',
                display: 'inline-block'
              }}>
                TOPLAM<br />GELİR
              </div>
            </div>
          </div>
        )}

        {/* Kazanç Tablosu */}
        {activeTab === 'kazanc' && (
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
                backgroundColor: '#B8860B',
                color: 'white',
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
                backgroundColor: '#B8860B',
                color: 'white',
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
                backgroundColor: '#B8860B',
                color: 'white',
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
                backgroundColor: '#B8860B',
                color: 'white',
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
                backgroundColor: '#B8860B',
                color: 'white',
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
                backgroundColor: '#B8860B',
                color: 'white',
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
                backgroundColor: '#B8860B',
                color: 'white',
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
                backgroundColor: '#B8860B',
                color: 'white',
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
                backgroundColor: '#B8860B',
                color: 'white',
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
                backgroundColor: '#B8860B',
                color: 'white',
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

            {/* Alt Bilgi Kutusu */}
            <div style={{
              marginTop: '20px',
              textAlign: 'center'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #8B008B, #DA70D6)',
                borderRadius: '15px',
                padding: '20px',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                Bu rapor anlık İŞLENECEK
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alt Sağ Logo */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 10
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          borderRadius: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 5px 15px rgba(255, 215, 0, 0.4)',
          border: '2px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#0e2323',
            textAlign: 'center',
            lineHeight: '1.1'
          }}>
            <div>HOOWELL</div>
            <div style={{ fontSize: '8px' }}>BİLGİ</div>
            <div style={{ fontSize: '8px' }}>BANKASI</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamTracker;