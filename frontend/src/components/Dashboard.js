import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    liderlikHavuzu: 0,
    baskanlikHavuzu: 0,
    karPaylasimHavuzu: 0,
    totalCommission: 0,
    monthlyEarnings: 0,
    pendingCommissions: 0
  });

  // Responsive state
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive breakpoints
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;
  const isDesktop = windowWidth > 1024;

  const fetchDashboardData = useCallback(async () => {
    try {
      const statsResponse = await axios.get('/api/dashboard/stats');
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0e2323 0%, #1a3333 50%, #0e2323 100%)',
      margin: isMobile ? '0 -15px' : '0 -20px',
      padding: isMobile ? '15px' : '20px',
      position: 'relative'
    }}>
      {/* HOOWELL Logo - Üst Merkez */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: isMobile ? '15px' : isTablet ? '20px' : '30px'
      }}>
        <div style={{
          width: isMobile ? '120px' : isTablet ? '150px' : '180px',
          height: isMobile ? '80px' : isTablet ? '100px' : '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: isMobile ? '10px' : '15px',
          borderRadius: '15px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '10px'
        }}>
          <img 
            src="/hoowell-logo.png" 
            alt="HOOWELL Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}
          />
        </div>
        <div style={{
          color: '#FFD700',
          fontSize: isMobile ? '12px' : '14px',
          textAlign: 'center',
          opacity: 0.8,
          fontWeight: '500'
        }}>
          INNOVATE YOUR LIFE
        </div>
      </div>

      {/* Ana Container */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '20px' : isTablet ? '20px' : '30px',
        maxWidth: '1400px',
        margin: '0 auto',
        alignItems: isMobile ? 'center' : 'flex-start'
      }}>
        {/* Sol Panel - Video ve Haberler */}
        <div style={{
          width: isMobile ? '100%' : isTablet ? '250px' : '280px',
          maxWidth: isMobile ? '400px' : 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '15px' : '20px',
          order: isMobile ? 2 : 0
        }}>
          {/* Haftalık Çalışma Takvimi */}
          <div style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
            borderRadius: '15px',
            padding: '15px',
            textAlign: 'center',
            color: '#000',
            fontWeight: 'bold',
            boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)'
          }}>
            <div style={{ fontSize: '14px' }}>HAFTALIK ÇALIŞMA TAKVİMİ</div>
          </div>

          {/* Hoowell'den Haberler */}
          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
            borderRadius: '15px',
            padding: '15px',
            textAlign: 'center',
            color: '#FFD700',
            fontWeight: 'bold',
            border: '2px solid #FFD700',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ fontSize: '14px' }}>Hoowell'den HABERLER</div>
          </div>

          {/* Video Kartları */}
          {[
            'Hybrid Alkali İyonizer DEMO VİDEOSU',
            'Hoowell Franchise SUNUM VİDEOSU', 
            'Hoowell Pazarlama Planı VİDEOSU'
          ].map((title, index) => (
            <div key={index} style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 50%, #1a1a1a 100%)',
              borderRadius: '12px',
              padding: '15px',
              border: '2px solid #FFD700',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{ 
                color: '#FFD700', 
                fontSize: '11px', 
                marginBottom: '10px',
                lineHeight: '1.3'
              }}>
                {title}
              </div>
              <button style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0px)'}
              >
                Paylaş
              </button>
            </div>
          ))}
        </div>

        {/* Orta Panel - Ana İçerik */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: isMobile ? '20px' : '25px',
          order: isMobile ? 1 : 0
        }}>
          {/* Ana Promosyon Görseli - Responsive */}
          <div style={{
            width: isMobile ? '100%' : isTablet ? '400px' : '500px',
            height: isMobile ? '200px' : isTablet ? '220px' : '280px',
            maxWidth: isMobile ? '350px' : 'none',
            backgroundImage: 'url(./anasayfa.jpeg)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            borderRadius: isMobile ? '12px' : '15px',
            border: `${isMobile ? '2px' : '3px'} solid #FFD700`,
            boxShadow: '0 15px 40px rgba(255, 215, 0, 0.3)',
            backgroundColor: 'rgba(255, 215, 0, 0.1)'
          }}>
          </div>

          {/* Alt Butonlar - Responsive */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '12px' : '15px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            width: isMobile ? '100%' : 'auto',
            maxWidth: isMobile ? '350px' : 'none'
          }}>
            {/* Müşteri Kayıt Paneli */}
            <Link 
              to="/customer-registration"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                borderRadius: isMobile ? '10px' : '12px',
                padding: isMobile ? '15px 20px' : '12px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
                minWidth: isMobile ? '100%' : '150px',
                textDecoration: 'none',
                transition: 'all 0.3s',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: isMobile ? '50px' : 'auto'
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(255, 215, 0, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.target.style.transform = 'translateY(0px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.3)';
                }
              }}
            >
              <div style={{ 
                color: '#0e2323', 
                fontSize: isMobile ? '16px' : '14px', 
                fontWeight: 'bold' 
              }}>
                MÜŞTERİ KAYIT PANELİ
              </div>
            </Link>

            {/* Hoşgeldin Promosyonu */}
            <div style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
              borderRadius: isMobile ? '10px' : '12px',
              padding: isMobile ? '15px 20px' : '12px 20px',
              textAlign: 'center',
              boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
              minWidth: isMobile ? '100%' : '150px',
              position: 'relative',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              minHeight: isMobile ? '50px' : 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ color: '#0e2323', fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>
                HOŞGELDİK PROMOSYONU KALAN
              </div>
              <div style={{ color: '#0e2323', fontSize: '11px', fontWeight: 'bold', marginBottom: '5px' }}>
                CİHAZ ADEDİ
              </div>
              <div style={{ color: '#0e2323', fontSize: '24px', fontWeight: 'bold' }}>
                399
              </div>
            </div>

            {/* İş Ortağı Kayıt Paneli */}
            <Link 
              to="/partner-registration"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                borderRadius: isMobile ? '10px' : '12px',
                padding: isMobile ? '15px 20px' : '12px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
                minWidth: isMobile ? '100%' : '150px',
                textDecoration: 'none',
                transition: 'all 0.3s',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: isMobile ? '50px' : 'auto'
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(255, 215, 0, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.target.style.transform = 'translateY(0px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.3)';
                }
              }}
            >
              <div style={{ 
                color: '#0e2323', 
                fontSize: isMobile ? '16px' : '14px', 
                fontWeight: 'bold' 
              }}>
                İŞ ORTAĞI KAYIT PANELİ
              </div>
            </Link>
          </div>
        </div>

        {/* Sağ Panel - Havuzlar ve Komisyonlar */}
        <div style={{
          width: isMobile ? '100%' : isTablet ? '250px' : '280px',
          maxWidth: isMobile ? '400px' : 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '15px' : '20px',
          order: isMobile ? 3 : 0
        }}>
          {/* Toplam Komisyon Kazancı */}
          <div style={{
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 50%, #28a745 100%)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            border: '2px solid #FFD700',
            boxShadow: '0 8px 25px rgba(40, 167, 69, 0.3)'
          }}>
            <h3 style={{ 
              color: '#fff', 
              fontSize: '14px', 
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>
              TOPLAM KOMİSYON KAZANCI
            </h3>
            <div style={{ color: '#fff', fontSize: '11px', marginBottom: '8px', opacity: 0.9 }}>
              Bu Ay
            </div>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#fff'
            }}>
              {((stats.totalCommission || 0) * 40).toLocaleString()} TL
            </div>
            <Link 
              to="/sponsorluk-takip"
              style={{
                display: 'inline-block',
                marginTop: '10px',
                padding: '6px 12px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              Detayları Gör
            </Link>
          </div>

          {/* Liderlik Havuzları */}
          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            border: '2px solid #FFD700',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ 
              color: '#FFD700', 
              fontSize: '14px', 
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>
              LİDERLİK HAVUZLARI
            </h3>
            <div style={{ color: '#FFD700', fontSize: '11px', marginBottom: '8px', opacity: 0.8 }}>
              Ağustos 2025
            </div>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#FFD700'
            }}>
              {((stats.liderlikHavuzu || 0) * 40).toLocaleString()} TL
            </div>
          </div>

          {/* Başkanlık Havuzları */}
          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            border: '2px solid #FFD700',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ 
              color: '#FFD700', 
              fontSize: '14px', 
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>
              BAŞKANLIK HAVUZLARI
            </h3>
            <div style={{ color: '#FFD700', fontSize: '11px', marginBottom: '8px', opacity: 0.8 }}>
              Ağustos 2025
            </div>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#FFD700'
            }}>
              0 TL
            </div>
          </div>

          {/* Kar Paylaşımı */}
          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            border: '2px solid #FFD700',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ 
              color: '#FFD700', 
              fontSize: '14px', 
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>
              KAR PAYLAŞIMI
            </h3>
            <div style={{ color: '#FFD700', fontSize: '10px', marginBottom: '4px', opacity: 0.8 }}>
              Başlangıç Tarihi : 01.01.2026
            </div>
            <div style={{ color: '#FFD700', fontSize: '10px', marginBottom: '8px', opacity: 0.8 }}>
              Bitiş Tarihi : 31.12.2026
            </div>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#FFD700'
            }}>
              0 TL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;