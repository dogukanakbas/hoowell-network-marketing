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
      margin: '0 -20px',
      padding: '20px',
      position: 'relative'
    }}>
      {/* HOOWELL Logo - Üst Merkez */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '15px',
          boxShadow: '0 10px 30px rgba(255, 215, 0, 0.4)',
          border: '3px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#0e2323',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: '#FFD700', fontSize: '28px', fontWeight: 'bold' }}>H</span>
          </div>
        </div>
        <div style={{
          color: '#FFD700',
          fontSize: '32px',
          fontWeight: 'bold',
          textAlign: 'center',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          marginBottom: '5px'
        }}>
          HOOWELL
        </div>
        <div style={{
          color: '#FFD700',
          fontSize: '14px',
          textAlign: 'center',
          opacity: 0.8
        }}>
          INNOVATE YOUR LIFE
        </div>
      </div>

      {/* Ana Container */}
      <div style={{
        display: 'flex',
        gap: '30px',
        maxWidth: '1400px',
        margin: '0 auto',
        alignItems: 'flex-start'
      }}>
        {/* Sol Panel - Video ve Haberler */}
        <div style={{
          width: '280px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
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
          gap: '25px'
        }}>
          {/* Ana Promosyon Görseli - Daha Küçük ve Düzenli */}
          <div style={{
            width: '500px',
            height: '280px',
            backgroundImage: 'url(./anasayfa.jpeg)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            borderRadius: '15px',
            border: '3px solid #FFD700',
            boxShadow: '0 15px 40px rgba(255, 215, 0, 0.3)',
            backgroundColor: 'rgba(255, 215, 0, 0.1)'
          }}>
          </div>

          {/* Alt Butonlar - Daha Kompakt */}
          <div style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {/* Müşteri Kayıt Paneli */}
            <Link 
              to="/customer-registration"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                borderRadius: '12px',
                padding: '12px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
                minWidth: '150px',
                textDecoration: 'none',
                transition: 'all 0.3s',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 12px 35px rgba(255, 215, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.3)';
              }}
            >
              <div style={{ color: '#0e2323', fontSize: '14px', fontWeight: 'bold' }}>
                MÜŞTERİ KAYIT PANELİ
              </div>
            </Link>

            {/* Hoşgeldin Promosyonu */}
            <div style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
              borderRadius: '12px',
              padding: '12px 20px',
              textAlign: 'center',
              boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
              minWidth: '150px',
              position: 'relative',
              border: '2px solid rgba(255, 255, 255, 0.2)'
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
                borderRadius: '12px',
                padding: '12px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
                minWidth: '150px',
                textDecoration: 'none',
                transition: 'all 0.3s',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 12px 35px rgba(255, 215, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.3)';
              }}
            >
              <div style={{ color: '#0e2323', fontSize: '14px', fontWeight: 'bold' }}>
                İŞ ORTAĞI KAYIT PANELİ
              </div>
            </Link>
          </div>
        </div>

        {/* Sağ Panel - Havuzlar ve Komisyonlar */}
        <div style={{
          width: '280px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
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
              {stats.totalCommission || '0.00'} $
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
              {stats.liderlikHavuzu || '0.000'} $
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
              0.000 $
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
              0.000 $
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;