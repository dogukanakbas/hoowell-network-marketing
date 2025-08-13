import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const LeadershipPanel = () => {
  const { user } = useAuth();
  const [leadershipData, setLeadershipData] = useState({
    leadership_pool: {
      total_amount: 0,
      monthly_amount: 0,
      user_action_points: 0,
      total_action_points: 0,
      point_value: 0,
      estimated_earning: 0
    },
    presidency_pool: {
      total_amount: 0,
      monthly_amount: 0,
      user_action_points: 0,
      total_action_points: 0,
      point_value: 0,
      estimated_earning: 0
    },
    user_activities: {
      personal_sales: 0,
      activated_partners: 0,
      total_action_points: 0,
      target_points: 5,
      remaining_points: 5
    },
    access_level: 'bronze',
    has_presidency_access: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Suppress unused variable warnings temporarily
  console.log('Leadership state:', { loading, error });

  useEffect(() => {
    fetchLeadershipData();
  }, []);

  const fetchLeadershipData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/leadership/pools', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setLeadershipData(response.data);
    } catch (error) {
      console.error('Leadership data fetch error:', error);
      if (error.response?.status === 403) {
        setError('Bu özelliğe erişim yetkiniz yok. Gold seviye ve üzeri gereklidir.');
      } else {
        setError('Liderlik havuzu verileri yüklenirken hata oluştu. Lütfen sayfayı yenileyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcının erişim yetkisini kontrol et
  const hasAccess = () => {
    const allowedLevels = ['star_leader', 'super_star_leader', 'presidents_team'];
    return allowedLevels.includes(user?.career_level);
  };

  const hasPresidencyAccess = () => {
    return user?.career_level === 'presidents_team';
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
        Liderlik havuzu verileri yükleniyor...
      </div>
    );
  }

  // Erişim yetkisi yoksa ana içerik alanında kapak göster
  if (!hasAccess()) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f2324',
        padding: '20px',
        margin: '0 -20px',
        position: 'relative'
      }}>
        {/* Ana içerik alanında kapak görseli */}
        <div style={{
          minHeight: 'calc(100vh - 40px)',
          width: '100%',
          backgroundImage: 'url("/images/products/havuz_kapak.png")',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#1a4d4d',
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          
        }}>
          
          {/* Responsive Styles */}
          <style jsx>{`
            /* Tüm ekranlar için görsel optimizasyonu */
            div[style*="backgroundImage"] {
              image-rendering: -webkit-optimize-contrast !important;
              image-rendering: crisp-edges !important;
            }
            
            @media (max-width: 1024px) {
              div[style*="backgroundImage"] {
                background-size: cover !important;
                background-position: center center !important;
              }
            }
            
            @media (max-width: 768px) {
              div[style*="backgroundImage"] {
                background-size: cover !important;
                background-position: center center !important;
                border-radius: 10px !important;
              }
            }
            
            @media (max-width: 480px) {
              div[style*="minHeight: 'calc(100vh - 40px)'"] {
                min-height: calc(100vh - 60px) !important;
              }
            }
          `}</style>
        </div>
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
          LİDERLİK HAVUZLARI
        </h1>
      </div>

      {/* Ana Container */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        gap: '40px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        
        {/* Liderlik Havuzu */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '30px',
          width: '600px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          border: '3px solid #FFD700'
        }}>
          {/* Liderlik Havuzu Başlığı */}
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '15px',
            padding: '15px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <div style={{
              color: '#FFD700',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              LİDERLİK HAVUZU
            </div>
          </div>

          {/* Orta Kısım - Hedef ve Miktar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '30px'
          }}>
            {/* Sol - Havuz Miktarı */}
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '15px',
              padding: '20px',
              textAlign: 'center',
              minWidth: '200px'
            }}>
              <div style={{
                color: '#FFD700',
                fontSize: '14px',
                marginBottom: '10px'
              }}>
                LİDERLİK HAVUZLARI<br />
                Ağustos 2025
              </div>
              <div style={{
                color: '#FFD700',
                fontSize: '36px',
                fontWeight: 'bold'
              }}>
                {leadershipData.leadership_pool.monthly_amount.toFixed(3)} $
              </div>
            </div>

            {/* Orta - Hedef Göstergesi */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}>
              {/* Hedef Daire */}
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#DC143C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                marginBottom: '10px'
              }}>
                <div style={{
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}>
                  {leadershipData.user_activities.target_points}
                </div>
                
                {/* Ok işaretleri */}
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#FFD700',
                  fontSize: '20px'
                }}>
                  ↑
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#FFD700',
                  fontSize: '20px'
                }}>
                  ↓
                </div>
                <div style={{
                  position: 'absolute',
                  left: '-10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#FFD700',
                  fontSize: '20px'
                }}>
                  ←
                </div>
                <div style={{
                  position: 'absolute',
                  right: '-10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#FFD700',
                  fontSize: '20px'
                }}>
                  →
                </div>
              </div>
              
              <div style={{
                color: '#000',
                fontSize: '12px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                MIN
              </div>
            </div>

            {/* Sağ - Başkanlık Havuzu */}
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '15px',
              padding: '20px',
              textAlign: 'center',
              minWidth: '200px'
            }}>
              <div style={{
                color: '#FFD700',
                fontSize: '14px',
                marginBottom: '10px'
              }}>
                BAŞKANLIK HAVUZLARI<br />
                Ağustos 2025
              </div>
              <div style={{
                color: '#FFD700',
                fontSize: '36px',
                fontWeight: 'bold'
              }}>
                {leadershipData.presidency_pool.monthly_amount.toFixed(3)} $
              </div>
            </div>
          </div>

          {/* Aksiyon Puanı Takibi */}
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              color: '#FFD700',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '15px'
            }}>
              AKTİVASYON PUANI TAKİBİ
            </div>

            {/* Tablo */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '10px'
            }}>
              {/* Başlık Satırı */}
              <div style={{
                backgroundColor: '#B8860B',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                AKTİVİTE
              </div>
              <div style={{
                backgroundColor: '#B8860B',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                YAPILAN
              </div>
              <div style={{
                backgroundColor: '#B8860B',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                TOPLANAN PUAN
              </div>

              {/* Şahsi Satış */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                ŞAHSİ<br />SATIŞ
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {leadershipData.user_activities.personal_sales}
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {leadershipData.user_activities.personal_sales}
              </div>

              {/* Aktifleşen İş Ortağı */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                AKTİFLEŞEN<br />İŞ ORTAĞI
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {leadershipData.user_activities.activated_partners}
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {leadershipData.user_activities.activated_partners * 2}
              </div>
            </div>

            {/* Toplam ve Hedef */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '10px',
              marginTop: '10px'
            }}>
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                color: '#FFD700',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                TOPLAM PUAN
              </div>
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                color: '#FFD700',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                {leadershipData.user_activities.total_action_points}
              </div>
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                color: '#FFD700',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                {leadershipData.user_activities.total_action_points}
              </div>

              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                color: '#FFD700',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                HEDEF
              </div>
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                color: '#FFD700',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                {leadershipData.user_activities.target_points}
              </div>
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                color: '#FFD700',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                {leadershipData.user_activities.target_points}
              </div>

              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                color: '#FFD700',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                KALAN
              </div>
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                color: '#FFD700',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                {Math.max(0, leadershipData.user_activities.remaining_points)}
              </div>
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                color: '#FFD700',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                {Math.max(0, leadershipData.user_activities.remaining_points)}
              </div>
            </div>
          </div>
        </div>

        {/* Başkanlık Havuzu - Sadece Başkanlık Takımı için */}
        {hasPresidencyAccess() && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '30px',
            width: '600px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            border: '3px solid #FFD700'
          }}>
            {/* Başkanlık Havuzu Başlığı */}
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '15px',
              padding: '15px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{
                color: '#FFD700',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                BAŞKANLIK HAVUZU
              </div>
            </div>

            {/* Aynı yapı Başkanlık Havuzu için tekrarlanır */}
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{
                color: '#FFD700',
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '15px'
              }}>
                AKTİVASYON PUANI TAKİBİ
              </div>

              {/* Başkanlık için aynı tablo yapısı */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '10px'
              }}>
                {/* Başlık Satırı */}
                <div style={{
                  backgroundColor: '#B8860B',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  AKTİVİTE
                </div>
                <div style={{
                  backgroundColor: '#B8860B',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  YAPILAN
                </div>
                <div style={{
                  backgroundColor: '#B8860B',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  TOPLANAN PUAN
                </div>

                {/* Veriler aynı şekilde */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  ŞAHSİ<br />SATIŞ
                </div>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {leadershipData.user_activities.personal_sales}
                </div>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {leadershipData.user_activities.personal_sales}
                </div>

                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  AKTİFLEŞEN<br />İŞ ORTAĞI
                </div>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {leadershipData.user_activities.activated_partners}
                </div>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {leadershipData.user_activities.activated_partners * 2}
                </div>
              </div>

              {/* Toplam ve Hedef - Başkanlık */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '10px',
                marginTop: '10px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  color: '#FFD700',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  TOPLAM PUAN
                </div>
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  color: '#FFD700',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  {leadershipData.user_activities.total_action_points}
                </div>
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  color: '#FFD700',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  {leadershipData.user_activities.total_action_points}
                </div>

                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  color: '#FFD700',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  HEDEF
                </div>
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  color: '#FFD700',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  {leadershipData.user_activities.target_points}
                </div>
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  color: '#FFD700',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  {leadershipData.user_activities.target_points}
                </div>

                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  color: '#FFD700',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  KALAN
                </div>
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  color: '#FFD700',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  {Math.max(0, leadershipData.user_activities.remaining_points)}
                </div>
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  color: '#FFD700',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  {Math.max(0, leadershipData.user_activities.remaining_points)}
                </div>
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

export default LeadershipPanel;