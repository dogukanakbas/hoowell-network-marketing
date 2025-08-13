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
        background: '#0f2323',
        badgeColor: '#CD7F32',
        circleColor: '#575757', // Bronze gri rengi
        buttonColor: '#575757',
        cardColor: '#575757',
        cardGradient: 'linear-gradient(135deg, #575757, #404040)',
        hoverGradient: 'linear-gradient(135deg, #666666, #4a4a4a)',
        targetKKP: 15000, // Silver için hedef
        targetPartners: 1,
        nextLevel: 'SILVER İŞ ORTAĞI',
        bonusAmount: 0,
        title: 'BRONZE İŞ ORTAĞI'
      },
      silver: {
        background: '#0f2323',
        badgeColor: '#C0C0C0',
        circleColor: '#C0C0C0', // Silver rengi
        buttonColor: '#C0C0C0',
        cardColor: '#C0C0C0',
        cardGradient: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)',
        hoverGradient: 'linear-gradient(135deg, #D3D3D3, #B8B8B8)',
        targetKKP: 50000, // Gold için hedef
        targetPartners: 3,
        nextLevel: 'GOLD İŞ ORTAĞI',
        bonusAmount: 400,
        title: 'SILVER İŞ ORTAĞI'
      },
      gold: {
        background: '#0f2323',
        badgeColor: '#FFD700',
        circleColor: '#FFD700', // Gold rengi
        buttonColor: '#FFD700',
        cardColor: '#FFD700',
        cardGradient: 'linear-gradient(135deg, #FFD700, #FFC107)',
        hoverGradient: 'linear-gradient(135deg, #FFED4E, #FFD54F)',
        targetKKP: 100000, // Star Leader için hedef
        targetPartners: 7,
        nextLevel: 'STAR LİDER',
        bonusAmount: 800,
        title: 'GOLD İŞ ORTAĞI'
      },
      star_leader: {
        background: '#0f2323',
        badgeColor: '#FF6B35',
        circleColor: '#FF6B35', // Turuncu rengi
        buttonColor: '#FF6B35',
        cardColor: '#FF6B35',
        cardGradient: 'linear-gradient(135deg, #FF6B35, #E55A2B)',
        hoverGradient: 'linear-gradient(135deg, #FF7F50, #FF6347)',
        targetKKP: 175000, // Super Star için hedef
        targetPartners: 15,
        nextLevel: 'SÜPER STAR LİDER',
        bonusAmount: 1200,
        title: 'STAR LİDER'
      },
      super_star_leader: {
        background: '#0f2323',
        badgeColor: '#8A2BE2',
        circleColor: '#8A2BE2', // Mor rengi
        buttonColor: '#8A2BE2',
        cardColor: '#8A2BE2',
        cardGradient: 'linear-gradient(135deg, #8A2BE2, #7B68EE)',
        hoverGradient: 'linear-gradient(135deg, #9370DB, #8B7EC8)',
        targetKKP: 300000, // Presidents için hedef
        targetPartners: 25,
        nextLevel: 'BAŞKANLIK TAKIMI',
        bonusAmount: 1600,
        title: 'SÜPER STAR LİDER'
      },
      presidents_team: {
        background: '#0f2323',
        badgeColor: '#DC143C',
        circleColor: '#DC143C', // Kırmızı rengi
        buttonColor: '#DC143C',
        cardColor: '#DC143C',
        cardGradient: 'linear-gradient(135deg, #DC143C, #B91C1C)',
        hoverGradient: 'linear-gradient(135deg, #E53E3E, #C53030)',
        targetKKP: 400000, // Country için hedef
        targetPartners: 30,
        nextLevel: 'ÜLKE DISTRIBÜTÖRÜ',
        bonusAmount: 2000,
        title: 'BAŞKANLIK TAKIMI'
      },
      country_distributor: {
        background: '#0f2323',
        badgeColor: '#4B0082',
        circleColor: '#4B0082', // İndigo rengi
        buttonColor: '#4B0082',
        cardColor: '#4B0082',
        cardGradient: 'linear-gradient(135deg, #4B0082, #6A0DAD)',
        hoverGradient: 'linear-gradient(135deg, #5B1A8B, #7B68EE)',
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
      flexDirection: 'column',
      alignItems: 'center'
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
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1400px',
        gap: '40px'
      }}>
        {/* Üst Kısım - Logo ve Seviye */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          marginTop: '60px'
        }}>
          {/* Büyük Seviye Rozeti */}
          <div style={{
            width: '200px',
            height: '200px',
            background: 'transparent',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {careerData.current_level?.toLowerCase() === 'bronze' ? (
              <img
                src="/images/products/bronze_logo.jpeg"
                alt="Bronze Logo"
                style={{
                  width: '180px',
                  height: '180px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  filter: 'drop-shadow(5px 5px 10px rgba(0,0,0,0.8))',
                  border: '4px solid #FFD700'
                }}
              />
            ) : careerData.current_level?.toLowerCase() === 'silver' ? (
              <img
                src="/images/products/silver_logo.jpeg"
                alt="Silver Logo"
                style={{
                  width: '180px',
                  height: '180px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  filter: 'drop-shadow(5px 5px 10px rgba(0,0,0,0.8))',
                  border: '4px solid #FFD700'
                }}
              />
            ) : careerData.current_level?.toLowerCase() === 'gold' ? (
              <img
                src="/images/products/gold_logo.jpeg"
                alt="Gold Logo"
                style={{
                  width: '180px',
                  height: '180px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  filter: 'drop-shadow(5px 5px 10px rgba(0,0,0,0.8))',
                  border: '4px solid #FFD700'
                }}
              />
            ) : careerData.current_level?.toLowerCase() === 'star_leader' ? (
              <img
                src="/images/products/starlider_logo.jpeg"
                alt="Star Leader Logo"
                style={{
                  width: '180px',
                  height: '180px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  filter: 'drop-shadow(5px 5px 10px rgba(0,0,0,0.8))',
                  border: '4px solid #FFD700'
                }}
              />
            ) : careerData.current_level?.toLowerCase() === 'super_star_leader' ? (
              <img
                src="/images/products/superstar_logo.jpeg"
                alt="Super Star Leader Logo"
                style={{
                  width: '180px',
                  height: '180px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  filter: 'drop-shadow(5px 5px 10px rgba(0,0,0,0.8))',
                  border: '4px solid #FFD700'
                }}
              />
            ) : careerData.current_level?.toLowerCase() === 'presidents_team' ? (
              <img
                src="/images/products/baskanlar_logo.jpeg"
                alt="Başkanlar Logo"
                style={{
                  width: '180px',
                  height: '180px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  filter: 'drop-shadow(5px 5px 10px rgba(0,0,0,0.8))',
                  border: '4px solid #FFD700'
                }}
              />
            ) : (
              <div style={{
                fontSize: '100px',
                filter: 'drop-shadow(5px 5px 10px rgba(0,0,0,0.8))',
                border: '4px solid #FFD700',
                borderRadius: '50%',
                width: '180px',
                height: '180px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {careerData.current_level === 'country_distributor' ? '🌍' : '🥉'}
              </div>
            )}
          </div>

          {/* Büyük Seviye Başlığı */}
          <h1 style={{
            color: '#FFD700',
            fontSize: '48px',
            fontWeight: 'bold',
            margin: '0',
            textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
            letterSpacing: '3px',
            textAlign: 'center',
            textDecoration: 'underline'
          }}>
            {design.title}
          </h1>
        </div>

        {/* Alt Kısım - Tablolar ve Daire Grafiği */}
        {careerData.current_level !== 'country_distributor' && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            width: '100%',
            gap: '60px',
            flexWrap: window.innerWidth <= 1024 ? 'wrap' : 'nowrap'
          }}>
            {/* Sol Taraf - Tablolar */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',
              minWidth: window.innerWidth <= 768 ? '100%' : '600px'
            }}>
              {/* Hedef Başlığı */}
              <h2 style={{
                color: '#FFD700',
                fontSize: '32px',
                fontWeight: 'bold',
                margin: '0',
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                textAlign: 'center'
              }}>
                {design.nextLevel} OLMAK İÇİN HEDEFLER
              </h2>

              {/* KKP Tablosu */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                {/* KKP Başlıkları */}
                <div style={{
                  display: 'flex',
                  gap: window.innerWidth <= 768 ? '10px' : '15px',
                  justifyContent: 'center',
                  flexWrap: window.innerWidth <= 768 ? 'wrap' : 'nowrap'
                }}>
                  <div
                    style={{
                      background: design.cardGradient,
                      borderRadius: '10px',
                      padding: '15px 25px',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      textAlign: 'center',
                      width: '160px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      border: '2px solid #FFD700'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = design.hoverGradient;
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = design.cardGradient;
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                    }}
                  >
                    HEDEF
                  </div>
                  <div
                    style={{
                      background: design.cardGradient,
                      borderRadius: '10px',
                      padding: '15px 25px',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      textAlign: 'center',
                      width: '160px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      border: '2px solid #FFD700'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = design.hoverGradient;
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = design.cardGradient;
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                    }}
                  >
                    YAPILAN CİRO
                  </div>
                  <div
                    style={{
                      background: design.cardGradient,
                      borderRadius: '10px',
                      padding: '15px 25px',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      textAlign: 'center',
                      width: '160px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      border: '2px solid #FFD700'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = design.hoverGradient;
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = design.cardGradient;
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                    }}
                  >
                    KALAN CİRO
                  </div>
                </div>

                {/* KKP Değerleri */}
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    border: '3px solid #FFD700',
                    borderRadius: '10px',
                    padding: '15px 25px',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    textAlign: 'center',
                    width: '160px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(255,215,0,0.3)'
                  }}>
                    {design.targetKKP.toLocaleString()} KKP
                  </div>
                  <div style={{
                    backgroundColor: 'white',
                    border: '3px solid #FFD700',
                    borderRadius: '10px',
                    padding: '15px 25px',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    textAlign: 'center',
                    width: '160px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(255,215,0,0.3)'
                  }}>
                    {careerData.total_kkp.toLocaleString()} KKP
                  </div>
                  <div style={{
                    backgroundColor: 'white',
                    border: '3px solid #FFD700',
                    borderRadius: '10px',
                    padding: '15px 25px',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    textAlign: 'center',
                    width: '160px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(255,215,0,0.3)'
                  }}>
                    {remainingKKP.toLocaleString()} KKP
                  </div>
                </div>
              </div>

              {/* İş Ortağı Tablosu */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                {/* İş Ortağı Hedefi Başlığı */}
                <h3 style={{
                  color: '#FFD700',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '0',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                  textAlign: 'center'
                }}>
                  İŞ ORTAĞI HEDEFİ
                </h3>

                {/* İş Ortağı Başlıkları */}
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  justifyContent: 'center'
                }}>
                  <div
                    style={{
                      background: design.cardGradient,
                      borderRadius: '10px',
                      padding: '15px 25px',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      textAlign: 'center',
                      width: '160px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      border: '2px solid #FFD700'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = design.hoverGradient;
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = design.cardGradient;
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                    }}
                  >
                    HEDEF
                  </div>
                  <div
                    style={{
                      background: design.cardGradient,
                      borderRadius: '10px',
                      padding: '15px 25px',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      textAlign: 'center',
                      width: '160px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      border: '2px solid #FFD700'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = design.hoverGradient;
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = design.cardGradient;
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                    }}
                  >
                    AKTİF ORTAK
                  </div>
                  <div
                    style={{
                      background: design.cardGradient,
                      borderRadius: '10px',
                      padding: '15px 25px',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      textAlign: 'center',
                      width: '160px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      border: '2px solid #FFD700'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = design.hoverGradient;
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = design.cardGradient;
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                    }}
                  >
                    EKSİK ORTAK
                  </div>
                </div>

                {/* İş Ortağı Değerleri */}
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    border: '3px solid #FFD700',
                    borderRadius: '10px',
                    padding: '15px 25px',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    textAlign: 'center',
                    width: '160px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(255,215,0,0.3)'
                  }}>
                    {design.targetPartners}
                  </div>
                  <div style={{
                    backgroundColor: 'white',
                    border: '3px solid #FFD700',
                    borderRadius: '10px',
                    padding: '15px 25px',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    textAlign: 'center',
                    width: '160px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(255,215,0,0.3)'
                  }}>
                    {careerData.active_partners}
                  </div>
                  <div style={{
                    backgroundColor: remainingPartners === 0 ? '#28a745' : 'white',
                    border: '3px solid #FFD700',
                    borderRadius: '10px',
                    padding: '15px 25px',
                    color: remainingPartners === 0 ? 'white' : '#000',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    textAlign: 'center',
                    width: '160px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(255,215,0,0.3)'
                  }}>
                    {remainingPartners === 0 ? 'TAMAMLANDI' : remainingPartners}
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ Taraf - Daire Grafiği */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: window.innerWidth <= 768 ? '100%' : '350px',
              marginTop: window.innerWidth <= 768 ? '40px' : '0'
            }}>
              <div style={{
                width: window.innerWidth <= 768 ? '280px' : '350px',
                height: window.innerWidth <= 768 ? '280px' : '350px',
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
                  width: window.innerWidth <= 768 ? '220px' : '280px',
                  height: window.innerWidth <= 768 ? '220px' : '280px',
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
                  boxShadow: `0 0 40px ${design.circleColor}66`,
                  border: '4px solid #FFD700'
                }}>
                  <div style={{
                    fontSize: window.innerWidth <= 768 ? '36px' : '48px',
                    marginBottom: '12px'
                  }}>
                    {design.targetKKP.toLocaleString()}
                  </div>
                  <div style={{
                    fontSize: window.innerWidth <= 768 ? '18px' : '24px',
                    marginBottom: '8px'
                  }}>
                    PUAN
                  </div>
                  <div style={{
                    fontSize: window.innerWidth <= 768 ? '14px' : '18px',
                    opacity: 0.9
                  }}>
                    {design.title.split(' ')[0]} İŞ ORTAĞI
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mesajlar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '40px'
        }}>
          {/* Bronze Mesajı */}
          {careerData.current_level === 'bronze' && (
            <div style={{
              color: '#FFD700',
              fontSize: '20px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              textAlign: 'center',
              maxWidth: '800px',
              background: 'rgba(0,0,0,0.6)',
              padding: '30px',
              borderRadius: '15px',
              border: '2px solid #FFD700'
            }}>
              <p style={{ marginBottom: '15px' }}>
                🎉 Tebrikler! İlk satışınızı gerçekleştirdiğiniz için BRONZE İŞ ORTAĞI oldunuz!
              </p>
              <p style={{ fontSize: '18px', opacity: 0.9 }}>
                Şimdi SILVER İŞ ORTAĞI olmak için 15.000 KKP toplayın ve 1 aktif iş ortağı bulun.
              </p>
            </div>
          )}

          {/* Country Distributor Mesajı */}
          {careerData.current_level === 'country_distributor' && (
            <div style={{
              color: '#FFD700',
              fontSize: '24px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              textAlign: 'center',
              background: 'rgba(0,0,0,0.6)',
              padding: '30px',
              borderRadius: '15px',
              border: '2px solid #FFD700'
            }}>
              Tebrikler, Lütfen yaşamak ve yönetmek istediğiniz ülkenizi seçiniz !
            </div>
          )}
        </div>
        {/* Bonus Kartı - Sol Alt Köşe */}
        {design.bonusAmount > 0 && (
          <div style={{
            position: 'fixed',
            bottom: '30px',
            left: '30px',
            zIndex: 20
          }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.9)',
              borderRadius: '20px',
              padding: '25px',
              border: '3px solid #FFD700',
              textAlign: 'center',
              minWidth: '200px',
              boxShadow: '0 10px 30px rgba(255,215,0,0.4)'
            }}>
              <div style={{
                fontSize: '52px',
                marginBottom: '15px'
              }}>
                🏆
              </div>
              <div style={{
                color: '#FFD700',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                TEBRİKLER
              </div>
              <div style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                {design.bonusAmount} $
              </div>
              <div style={{
                color: '#FFD700',
                fontSize: '14px',
                lineHeight: '1.3'
              }}>
                KARİYER ATLAMA<br />ÖDÜLÜ<br />KAZANDINIZ !
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerTracker;