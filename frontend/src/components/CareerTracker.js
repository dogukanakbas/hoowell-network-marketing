import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CareerTracker = () => {
  const { user } = useAuth();
  const [careerData, setCareerData] = useState({
    current_level: 'bronze',
    total_kkp: 0,
    active_partners: 0,
    target_kkp: 15000,
    target_partners: 1
  });
  const [careerBonuses, setCareerBonuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareerData();
    fetchCareerBonuses();
  }, []);

  const fetchCareerData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/career/progress', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCareerData(response.data);

      // Check if level was upgraded
      if (response.data.level_upgraded) {
        // Refresh bonuses after level upgrade
        setTimeout(() => {
          fetchCareerBonuses();
        }, 1000);
      }
    } catch (error) {
      console.error('Career data fetch error:', error);
      // Hata durumunda kullanıcı verilerini kullan
      if (user) {
        setCareerData({
          current_level: user.career_level || 'bronze',
          total_kkp: user.total_kkp || 0,
          active_partners: user.active_partners || 0,
          target_kkp: 15000,
          target_partners: 1
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCareerBonuses = async () => {
    try {
      const response = await axios.get('/api/career/bonuses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCareerBonuses(response.data);
    } catch (error) {
      console.error('Career bonuses fetch error:', error);
      setCareerBonuses([]);
    }
  };

  // Seviye bazlı tasarım konfigürasyonu - Görüntülerdeki tasarıma göre
  const getLevelDesign = (level) => {
    const designs = {
      bronze: {
        background: 'linear-gradient(135deg, #0e2323 0%, #1a3333 50%, #0e2323 100%)',
        badgeColor: '#CD7F32',
        circleColor: '#8B4513', // Bronze rengi
        buttonColor: '#8B4513',
        cardColor: '#8B4513',
        targetKKP: 15000, // Silver için hedef
        targetPartners: 1,
        nextLevel: 'SILVER İŞ ORTAĞI',
        bonusAmount: 0,
        title: 'BRONZE İŞ ORTAĞI'
      },
      silver: {
        background: 'linear-gradient(135deg, #0e2323 0%, #1a3333 50%, #0e2323 100%)',
        badgeColor: '#C0C0C0',
        circleColor: '#FFD700', // Altın rengi
        buttonColor: '#FFD700',
        cardColor: '#FFD700',
        targetKKP: 50000, // Gold için hedef
        targetPartners: 3,
        nextLevel: 'GOLD İŞ ORTAĞI',
        bonusAmount: 400,
        title: 'SILVER İŞ ORTAĞI'
      },
      gold: {
        background: 'linear-gradient(135deg, #0e2323 0%, #1a3333 50%, #0e2323 100%)',
        badgeColor: '#FFD700',
        circleColor: '#4A90E2', // Mavi rengi
        buttonColor: '#4A90E2',
        cardColor: '#4A90E2',
        targetKKP: 100000, // Star Leader için hedef
        targetPartners: 7,
        nextLevel: 'STAR LİDER',
        bonusAmount: 800,
        title: 'GOLD İŞ ORTAĞI'
      },
      star_leader: {
        background: 'linear-gradient(135deg, #0e2323 0%, #1a3333 50%, #0e2323 100%)',
        badgeColor: '#4A90E2',
        circleColor: '#28a745', // Yeşil rengi
        buttonColor: '#28a745',
        cardColor: '#28a745',
        targetKKP: 175000, // Super Star için hedef
        targetPartners: 15,
        nextLevel: 'SÜPER STAR LİDER',
        bonusAmount: 1200,
        title: 'STAR LİDER'
      },
      super_star_leader: {
        background: 'linear-gradient(135deg, #0e2323 0%, #1a3333 50%, #0e2323 100%)',
        badgeColor: '#8A2BE2',
        circleColor: '#8A2BE2', // Mor rengi
        buttonColor: '#8A2BE2',
        cardColor: '#8A2BE2',
        targetKKP: 300000, // Presidents için hedef
        targetPartners: 25,
        nextLevel: 'BAŞKANLIK TAKIMI',
        bonusAmount: 1600,
        title: 'SÜPER STAR LİDER'
      },
      presidents_team: {
        background: 'linear-gradient(135deg, #0e2323 0%, #1a3333 50%, #0e2323 100%)',
        badgeColor: '#DC143C',
        circleColor: '#E91E63', // Pembe rengi
        buttonColor: '#E91E63',
        cardColor: '#E91E63',
        targetKKP: 400000, // Country için hedef
        targetPartners: 30,
        nextLevel: 'ÜLKE DISTRIBÜTÖRÜ',
        bonusAmount: 2000,
        title: 'BAŞKANLIK TAKIMI'
      },
      country_distributor: {
        background: 'linear-gradient(135deg, #0e2323 0%, #1a3333 50%, #0e2323 100%)',
        badgeColor: '#4B0082',
        circleColor: '#FFD700', // Altın rengi
        buttonColor: '#FFD700',
        cardColor: '#FFD700',
        targetKKP: 400000,
        targetPartners: 30,
        nextLevel: null,
        bonusAmount: 2500,
        title: 'ÜLKE DISTRIBÜTÖRÜ'
      }
    };
    return designs[level] || designs.bronze;
  };

  const design = getLevelDesign(careerData.current_level);
  const kkpProgress = design.targetKKP > 0 ? Math.min((careerData.total_kkp / design.targetKKP) * 100, 100) : 100;
  const remainingKKP = Math.max(design.targetKKP - careerData.total_kkp, 0);
  const remainingPartners = Math.max(design.targetPartners - careerData.active_partners, 0);

  return (
    <div style={{
      minHeight: '100vh',
      background: design.background,
      padding: '20px',
      margin: '0 -20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
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

      {/* Loading State */}
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#FFD700',
          fontSize: '24px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
        }}>
          Kariyer bilgileri yükleniyor...
        </div>
      )}

      {/* Ana İçerik */}
      <div style={{
        display: loading ? 'none' : 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1200px',
        gap: '40px'
      }}>
        {/* Sol Taraf - Bonus Kartı */}
        {design.bonusAmount > 0 && (
          <div style={{
            width: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '20px',
              padding: '20px',
              border: '2px solid #FFD700',
              textAlign: 'center',
              minWidth: '180px'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '10px'
              }}>
                🏆
              </div>
              <div style={{
                color: '#FFD700',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '5px'
              }}>
                TEBRİKLER
              </div>
              <div style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '5px'
              }}>
                {design.bonusAmount} $
              </div>
              <div style={{
                color: '#FFD700',
                fontSize: '12px'
              }}>
                KARİYER ATLAMA<br />ÖDÜLÜ<br />KAZANDINIZ !
              </div>
            </div>
          </div>
        )}

        {/* Orta Kısım - Ana İçerik */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '30px'
        }}>
          {/* Seviye Rozeti */}
          <div style={{
            width: '120px',
            height: '120px',
            background: `radial-gradient(circle, ${design.badgeColor} 0%, ${design.badgeColor}AA 70%, transparent 100%)`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 10px 30px ${design.badgeColor}66`,
            border: `3px solid ${design.badgeColor}`,
            position: 'relative'
          }}>
            <div style={{
              fontSize: '48px',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
            }}>
              {careerData.current_level === 'country_distributor' ? '🌍' :
               careerData.current_level === 'presidents_team' ? '👑' :
               careerData.current_level === 'super_star_leader' ? '⭐' :
               careerData.current_level === 'star_leader' ? '🌟' :
               careerData.current_level === 'gold' ? '🥇' :
               careerData.current_level === 'silver' ? '🥈' : '🥉'}
            </div>
            
            {/* Seviye Yıldızları */}
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              display: 'flex',
              gap: '2px'
            }}>
              {Array.from({ length: Math.min(careerData.current_level === 'bronze' ? 1 : 
                                            careerData.current_level === 'silver' ? 2 :
                                            careerData.current_level === 'gold' ? 3 :
                                            careerData.current_level === 'star_leader' ? 4 :
                                            careerData.current_level === 'super_star_leader' ? 5 :
                                            careerData.current_level === 'presidents_team' ? 6 : 7, 7) }, (_, i) => (
                <div key={i} style={{ fontSize: '12px', color: '#FFD700' }}>⭐</div>
              ))}
            </div>
          </div>

          {/* Seviye Başlığı */}
          <h1 style={{
            color: '#FFD700',
            fontSize: '36px',
            fontWeight: 'bold',
            margin: '0',
            textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
            letterSpacing: '2px',
            textAlign: 'center'
          }}>
            {design.title}
          </h1>

          {/* Hedefler - Sadece Country Distributor hariç */}
          {careerData.current_level !== 'country_distributor' && (
            <>
              {/* Hedef Başlığı */}
              <h2 style={{
                color: '#FFD700',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0',
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                textAlign: 'center'
              }}>
                {design.nextLevel} OLMAK İÇİN HEDEFLER
              </h2>

              {/* KKP Hedefleri */}
              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  backgroundColor: design.cardColor,
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textAlign: 'center',
                  minWidth: '100px'
                }}>
                  HEDEF
                </div>
                <div style={{
                  backgroundColor: design.cardColor,
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textAlign: 'center',
                  minWidth: '100px'
                }}>
                  YAPILAN CİRO
                </div>
                <div style={{
                  backgroundColor: design.cardColor,
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textAlign: 'center',
                  minWidth: '100px'
                }}>
                  KALAN CİRO
                </div>
              </div>

              {/* KKP Değerleri */}
              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  backgroundColor: 'white',
                  border: '2px solid #ccc',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textAlign: 'center',
                  minWidth: '100px'
                }}>
                  {design.targetKKP.toLocaleString()} KKP
                </div>
                <div style={{
                  backgroundColor: 'white',
                  border: '2px solid #ccc',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textAlign: 'center',
                  minWidth: '100px'
                }}>
                  {careerData.total_kkp.toLocaleString()} KKP
                </div>
                <div style={{
                  backgroundColor: 'white',
                  border: '2px solid #ccc',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textAlign: 'center',
                  minWidth: '100px'
                }}>
                  {remainingKKP.toLocaleString()} KKP
                </div>
              </div>

              {/* İş Ortağı Hedefi Başlığı */}
              <h3 style={{
                color: '#FFD700',
                fontSize: '20px',
                fontWeight: 'bold',
                margin: '20px 0 10px 0',
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                textAlign: 'center'
              }}>
                İŞ ORTAĞI HEDEFİ
              </h3>

              {/* İş Ortağı Başlıkları */}
              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  backgroundColor: design.cardColor,
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textAlign: 'center',
                  minWidth: '100px'
                }}>
                  HEDEF
                </div>
                <div style={{
                  backgroundColor: design.cardColor,
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textAlign: 'center',
                  minWidth: '100px'
                }}>
                  AKTİF ORTAK
                </div>
                <div style={{
                  backgroundColor: design.cardColor,
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textAlign: 'center',
                  minWidth: '100px'
                }}>
                  EKSİK ORTAK
                </div>
              </div>

              {/* İş Ortağı Değerleri */}
              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  backgroundColor: 'white',
                  border: '2px solid #ccc',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textAlign: 'center',
                  minWidth: '100px'
                }}>
                  {design.targetPartners}
                </div>
                <div style={{
                  backgroundColor: 'white',
                  border: '2px solid #ccc',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textAlign: 'center',
                  minWidth: '100px'
                }}>
                  {careerData.active_partners}
                </div>
                <div style={{
                  backgroundColor: remainingPartners === 0 ? '#28a745' : 'white',
                  border: '2px solid #ccc',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: remainingPartners === 0 ? 'white' : '#000',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textAlign: 'center',
                  minWidth: '100px'
                }}>
                  {remainingPartners === 0 ? 'TAMAMLANDI' : remainingPartners}
                </div>
              </div>
            </>
          )}

          {/* Bronze Mesajı */}
          {careerData.current_level === 'bronze' && (
            <div style={{
              color: '#FFD700',
              fontSize: '18px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              textAlign: 'center',
              maxWidth: '600px'
            }}>
              <p style={{ marginBottom: '15px' }}>
                🎉 Tebrikler! İlk satışınızı gerçekleştirdiğiniz için BRONZE İŞ ORTAĞI oldunuz!
              </p>
              <p style={{ fontSize: '16px', opacity: 0.9 }}>
                Şimdi SILVER İŞ ORTAĞI olmak için 15.000 KKP toplayın ve 1 aktif iş ortağı bulun.
              </p>
            </div>
          )}

          {/* Country Distributor Mesajı */}
          {careerData.current_level === 'country_distributor' && (
            <p style={{
              color: '#FFD700',
              fontSize: '20px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              textAlign: 'center'
            }}>
              Tebrikler, Lütfen yaşamak ve yönetmek istediğiniz ülkenizi seçiniz !
            </p>
          )}
        </div>

        {/* Sağ Taraf - Circular Progress */}
        <div style={{
          width: '200px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Arka plan daire */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: '#DC143C'
            }} />

            {/* İlerleme dairesi */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `conic-gradient(${design.circleColor} 0deg ${(kkpProgress / 100) * 360}deg, transparent ${(kkpProgress / 100) * 360}deg 360deg)`,
              transition: 'background 0.5s ease'
            }} />

            {/* İç daire */}
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              backgroundColor: design.circleColor,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              zIndex: 2,
              boxShadow: `0 0 30px ${design.circleColor}66`
            }}>
              <div style={{ fontSize: '28px', marginBottom: '5px' }}>
                {design.targetKKP.toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', marginBottom: '2px' }}>
                PUAN
              </div>
              <div style={{ fontSize: '10px', opacity: 0.9 }}>
                {design.title.split(' ')[0]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerTracker;