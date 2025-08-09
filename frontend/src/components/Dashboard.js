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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Responsive state
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Modal state for fullscreen image
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Suppress unused variable warnings temporarily
  console.log('Dashboard state:', { loading, error });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ESC tuşu ile modal kapatma
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Body scroll'unu engelle
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Responsive breakpoints
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;
  // const isDesktop = windowWidth > 1024; // Temporarily commented out

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const statsResponse = await axios.get('/api/dashboard/stats');
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Dashboard verileri yüklenirken hata oluştu. Lütfen sayfayı yenileyin.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Paylaşım fonksiyonu
  const handleShare = (title, url) => {
    const shareText = `🎥 ${title}\n\n${url}\n\n💧 HOOWELL - Su Arıtma Sistemleri`;
    
    if (navigator.share) {
      // Web Share API destekleniyorsa (mobil cihazlar)
      navigator.share({
        title: title,
        text: shareText,
        url: url
      }).catch(console.error);
    } else {
      // Web Share API desteklenmiyorsa paylaşım seçenekleri göster
      const shareOptions = [
        {
          name: 'WhatsApp',
          url: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
          color: '#25D366'
        },
        {
          name: 'Telegram',
          url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          color: '#0088cc'
        },
        {
          name: 'Facebook',
          url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          color: '#1877f2'
        },
        {
          name: 'Twitter',
          url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
          color: '#1da1f2'
        },
        {
          name: 'LinkedIn',
          url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          color: '#0077b5'
        },
        {
          name: 'Kopyala',
          action: () => {
            navigator.clipboard.writeText(shareText).then(() => {
              alert('Link kopyalandı!');
            });
          },
          color: '#6c757d'
        }
      ];

      // Modal oluştur
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
      `;

      const modalContent = document.createElement('div');
      modalContent.style.cssText = `
        background: linear-gradient(135deg, #0e2323, #1a3333);
        border-radius: 20px;
        padding: 30px;
        max-width: 400px;
        width: 90%;
        border: 2px solid #FFD700;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      `;

      modalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 25px;">
          <h3 style="color: #FFD700; margin: 0 0 10px 0; font-size: 18px;">Paylaş</h3>
          <p style="color: #ccc; margin: 0; font-size: 14px;">${title}</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
          ${shareOptions.map(option => `
            <button onclick="${option.action ? 'this.onclick()' : `window.open('${option.url}', '_blank')`}" 
                    style="
                      background: ${option.color};
                      color: white;
                      border: none;
                      border-radius: 10px;
                      padding: 12px;
                      font-size: 14px;
                      font-weight: bold;
                      cursor: pointer;
                      transition: transform 0.2s;
                    "
                    onmouseover="this.style.transform='scale(1.05)'"
                    onmouseout="this.style.transform='scale(1)'"
                    ${option.action ? `onclick="(${option.action.toString()})()"` : ''}>
              ${option.name}
            </button>
          `).join('')}
        </div>
        <button onclick="document.body.removeChild(this.closest('.share-modal'))" 
                style="
                  background: #6c757d;
                  color: white;
                  border: none;
                  border-radius: 10px;
                  padding: 12px;
                  width: 100%;
                  margin-top: 15px;
                  font-size: 14px;
                  font-weight: bold;
                  cursor: pointer;
                ">
          Kapat
        </button>
      `;

      modal.appendChild(modalContent);
      modal.className = 'share-modal';
      
      // Modal'ı kapatma
      modal.onclick = (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      };

      document.body.appendChild(modal);
    }
  };

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
            {
              title: 'Hybrid Alkali İyonizer DEMO VİDEOSU',
              url: 'https://youtu.be/hC_3ix9sCJA'
            },
            {
              title: 'Hoowell Franchise SUNUM VİDEOSU',
              url: 'https://youtu.be/JoN_w2RUyNw'
            },
            {
              title: 'Hoowell Pazarlama Planı VİDEOSU',
              url: 'https://youtu.be/OUi-m4QBzgk'
            }
          ].map((video, index) => (
            <div key={index} style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 50%, #1a1a1a 100%)',
              borderRadius: '12px',
              padding: '15px',
              border: '2px solid #FFD700',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{ 
                color: '#FFD700', 
                fontSize: '11px', 
                marginBottom: '10px',
                lineHeight: '1.3',
                textAlign: 'center'
              }}>
                {video.title}
              </div>
              <button 
                onClick={() => handleShare(video.title, video.url)}
                style={{
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
          {/* Ana Promosyon Görseli - Responsive ve Tıklanabilir */}
          <div 
            onClick={() => setIsModalOpen(true)}
            style={{
              width: isMobile ? '100%' : isTablet ? '600px' : windowWidth > 1600 ? '900px' : windowWidth > 1400 ? '800px' : '700px',
              height: isMobile ? '200px' : isTablet ? '350px' : windowWidth > 1600 ? '520px' : windowWidth > 1400 ? '460px' : '400px',
              maxWidth: isMobile ? '350px' : 'none',
              backgroundImage: 'url(./anasayfa.jpeg)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              borderRadius: isMobile ? '12px' : '15px',
              border: `${isMobile ? '2px' : '3px'} solid #FFD700`,
              boxShadow: '0 15px 40px rgba(255, 215, 0, 0.3)',
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 20px 50px rgba(255, 215, 0, 0.4)';
                // Büyütme ikonunu göster
                const zoomIcon = e.target.querySelector('.zoom-icon');
                if (zoomIcon) zoomIcon.style.opacity = '1';
                // Tam ekran yazısını göster
                const fullscreenText = e.target.querySelector('.fullscreen-text');
                if (fullscreenText) fullscreenText.style.opacity = '1';
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 15px 40px rgba(255, 215, 0, 0.3)';
                // Büyütme ikonunu gizle
                const zoomIcon = e.target.querySelector('.zoom-icon');
                if (zoomIcon) zoomIcon.style.opacity = '0';
                // Tam ekran yazısını gizle
                const fullscreenText = e.target.querySelector('.fullscreen-text');
                if (fullscreenText) fullscreenText.style.opacity = '0';
              }
            }}
          >
            {/* Büyütme İkonu */}
            <div style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: '#FFD700',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              opacity: isMobile ? 1 : 0,
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(5px)',
              border: '2px solid rgba(255, 215, 0, 0.5)',
              cursor: 'pointer'
            }}
            className="zoom-icon"
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.9)';
              e.target.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
              e.target.style.color = '#FFD700';
            }}
            >
              🔍
            </div>

            {/* Tam Ekran Göster Yazısı */}
            <div style={{
              position: 'absolute',
              bottom: '15px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: '#FFD700',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              opacity: isMobile ? 1 : 0,
              transition: 'opacity 0.3s ease',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              whiteSpace: 'nowrap'
            }}
            className="fullscreen-text"
            >
              📱 Tam Ekran İçin Tıklayın
            </div>
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
              to="/muhasebe-takip-paneli"
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

      {/* Tam Ekran Modal */}
      {isModalOpen && (
        <div 
          className="modal-overlay"
          style={{ padding: '20px' }}
          onClick={() => setIsModalOpen(false)}
        >
          {/* Modal İçeriği */}
          <div 
            className="modal-content"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Kapatma Butonu */}
            <button
              className="modal-close-btn"
              onClick={() => setIsModalOpen(false)}
              title="Kapat (ESC)"
            >
              ✕
            </button>

            {/* Ana Görsel */}
            <img 
              src="./anasayfa.jpeg"
              alt="HOOWELL Ana Sayfa Görseli - Tam Ekran Görünüm"
              className="modal-image"
              onError={(e) => {
                // Fallback görsel yüklenemezse
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
              onLoad={(e) => {
                // Görsel yüklendiğinde animasyon ekle
                e.target.style.opacity = '0';
                setTimeout(() => {
                  e.target.style.transition = 'opacity 0.5s ease';
                  e.target.style.opacity = '1';
                }, 100);
              }}
            />

            {/* Fallback İçerik */}
            <div style={{
              display: 'none',
              width: isMobile ? '90vw' : '80vw',
              height: isMobile ? '50vh' : '60vh',
              maxWidth: '800px',
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              border: '3px solid #FFD700',
              borderRadius: '15px',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: '#FFD700',
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: isMobile ? '20px' : '40px'
            }}>
              <div style={{ fontSize: isMobile ? '40px' : '60px', marginBottom: '20px' }}>🏢</div>
              <div>HOOWELL GLOBAL</div>
              <div style={{ fontSize: isMobile ? '14px' : '18px', marginTop: '10px', opacity: 0.8 }}>
                Su Arıtma Sistemleri
              </div>
              <div style={{ fontSize: '12px', marginTop: '20px', opacity: 0.6 }}>
                Ana sayfa görseli yüklenemedi
              </div>
              <div style={{ 
                fontSize: '10px', 
                marginTop: '15px', 
                opacity: 0.5,
                lineHeight: '1.4'
              }}>
                • Network Marketing Sistemi<br/>
                • Eğitim ve Satış Platformu<br/>
                • Kariyer Gelişim Programı
              </div>
            </div>

            {/* Alt Bilgi */}
            <div style={{
              marginTop: '15px',
              color: '#FFD700',
              fontSize: isMobile ? '12px' : '14px',
              textAlign: 'center',
              opacity: 0.8,
              fontWeight: 'bold',
              lineHeight: '1.4'
            }}>
              {isMobile ? (
                <>📱 Parmağınızla yakınlaştırabilirsiniz</>
              ) : (
                <>
                  📱 Mobilde: Parmağınızla yakınlaştırabilirsiniz
                  <br />
                  🖥️ Masaüstünde: Mouse tekerleği ile yakınlaştırabilirsiniz
                </>
              )}
            </div>

            {/* Navigasyon İpuçları */}
            {!isMobile && (
              <div style={{
                position: 'absolute',
                bottom: '-60px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '20px',
                fontSize: '12px',
                color: 'rgba(255, 215, 0, 0.7)',
                whiteSpace: 'nowrap'
              }}>
                <span>🖱️ Tıklayarak kapat</span>
                <span>⌨️ ESC tuşu ile kapat</span>
                <span>🔍 Yakınlaştırma desteklenir</span>
              </div>
            )}

            {/* Mobil için alt ipuçları */}
            {isMobile && (
              <div style={{
                marginTop: '10px',
                fontSize: '10px',
                color: 'rgba(255, 215, 0, 0.6)',
                textAlign: 'center'
              }}>
                Kapatmak için boş alana dokunun
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;