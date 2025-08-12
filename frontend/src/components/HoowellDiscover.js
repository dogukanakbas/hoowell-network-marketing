import React from 'react';
import { useNavigate } from 'react-router-dom';

const HoowellDiscover = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleWatchVideo = (videoUrl) => {
    window.open(videoUrl, '_blank');
  };

  const handleShareVideo = (videoTitle, videoUrl) => {
    const shareText = `🎥 ${videoTitle}\n\n${videoUrl}\n\n💧 HOOWELL - Alkali İyonizer Sistemleri`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundImage: 'url("/images/products/hoowell-discover-bg.jpg")',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#1a4d4d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box',
      position: 'relative'
    }}>

      <div style={{
        maxWidth: '1200px',
        width: '100%',
        height: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>

        {/* Sol Alt - Hybrid Alkali İyonizer Kartı */}
        <div className="video-card-left" style={{
          position: 'absolute',
          bottom: '20px',
          left: '5%',
          zIndex: 10,
          maxWidth: '220px',
          width: 'calc(45% - 10px)'
        }}>
          <div className="video-card" style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(40, 40, 40, 0.8) 50%, rgba(0, 0, 0, 0.85) 100%)',
            borderRadius: '12px',
            padding: '15px',
            border: '2px solid #FFD700',
            width: '100%',
            textAlign: 'center',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
            boxSizing: 'border-box'
          }}>

            {/* Video Başlığı */}
            <h3 className="video-title" style={{
              color: '#FFD700',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '12px',
              lineHeight: '1.2'
            }}>
              Hybrid Alkali İyonizer<br />DEMO VİDEOSU
            </h3>

            {/* Butonlar */}
            <div className="video-buttons" style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center'
            }}>
              <button
                className="video-button"
                onClick={() => handleWatchVideo('https://youtu.be/hC_3ix9sCJA')}
                style={{
                  backgroundColor: '#FFD700',
                  color: '#1a4d4d',
                  border: 'none',
                  borderRadius: '18px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#FFC700';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 3px 12px rgba(255, 215, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#FFD700';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(255, 215, 0, 0.3)';
                }}
              >
                🎬 İZLE
              </button>

              <button
                className="video-button"
                onClick={() => handleShareVideo('Hybrid Alkali İyonizer DEMO VİDEOSU', 'https://youtu.be/hC_3ix9sCJA')}
                style={{
                  backgroundColor: 'transparent',
                  color: '#FFD700',
                  border: '1px solid #FFD700',
                  borderRadius: '18px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(255, 215, 0, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#FFD700';
                  e.target.style.color = '#1a4d4d';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 3px 12px rgba(255, 215, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#FFD700';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(255, 215, 0, 0.2)';
                }}
              >
                📱 PAYLAŞ
              </button>
            </div>
          </div>
        </div>

        {/* Sağ Alt - Hoowell Franchise Kartı */}
        <div className="video-card-right" style={{
          position: 'absolute',
          bottom: '20px',
          right: '5%',
          zIndex: 10,
          maxWidth: '220px',
          width: 'calc(45% - 10px)'
        }}>
          <div className="video-card" style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(40, 40, 40, 0.8) 50%, rgba(0, 0, 0, 0.85) 100%)',
            borderRadius: '12px',
            padding: '15px',
            border: '2px solid #FFD700',
            width: '100%',
            textAlign: 'center',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
            boxSizing: 'border-box'
          }}>

            {/* Video Başlığı */}
            <h3 className="video-title" style={{
              color: '#FFD700',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '12px',
              lineHeight: '1.2'
            }}>
              Hoowell Franchise<br />SUNUM VİDEOSU
            </h3>

            {/* Butonlar */}
            <div className="video-buttons" style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center'
            }}>
              <button
                className="video-button"
                onClick={() => handleWatchVideo('https://youtu.be/JoN_w2RUyNw')}
                style={{
                  backgroundColor: '#FFD700',
                  color: '#1a4d4d',
                  border: 'none',
                  borderRadius: '18px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#FFC700';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 3px 12px rgba(255, 215, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#FFD700';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(255, 215, 0, 0.3)';
                }}
              >
                🎬 İZLE
              </button>

              <button
                className="video-button"
                onClick={() => handleShareVideo('Hoowell Franchise SUNUM VİDEOSU', 'https://youtu.be/JoN_w2RUyNw')}
                style={{
                  backgroundColor: 'transparent',
                  color: '#FFD700',
                  border: '1px solid #FFD700',
                  borderRadius: '18px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(255, 215, 0, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#FFD700';
                  e.target.style.color = '#1a4d4d';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 3px 12px rgba(255, 215, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#FFD700';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(255, 215, 0, 0.2)';
                }}
              >
                📱 PAYLAŞ
              </button>
            </div>
          </div>
        </div>

        {/* Geri Dön Butonu - Üst Sağ */}
        <button
          className="back-button"
          onClick={handleBackToLogin}
          style={{
            position: 'absolute',
            top: '30px',
            right: '30px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#FFD700',
            border: '2px solid #FFD700',
            borderRadius: '25px',
            padding: '12px 25px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#FFD700';
            e.target.style.color = '#1a4d4d';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            e.target.style.color = '#FFD700';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
          }}
        >
          ← Ana Sayfa
        </button>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        /* Ana container responsive ayarları */
        @media (max-width: 1024px) {
          div[style*="backgroundImage"] {
            background-size: contain !important;
            background-position: center !important;
            background-color: #1a4d4d !important;
          }
        }
        
        @media (max-width: 768px) {
          div[style*="backgroundImage"] {
            background-size: contain !important;
            background-position: center top !important;
            padding: 15px !important;
          }
          
          .video-card-left {
            bottom: 20px !important;
            left: 3% !important;
            width: calc(44% - 10px) !important;
            max-width: 200px !important;
          }
          
          .video-card-right {
            bottom: 20px !important;
            right: 3% !important;
            width: calc(44% - 10px) !important;
            max-width: 200px !important;
          }
          
          .back-button {
            top: 20px !important;
            right: 20px !important;
            padding: 10px 20px !important;
            font-size: 12px !important;
          }
        }
        
        @media (max-width: 480px) {
          div[style*="backgroundImage"] {
            background-size: contain !important;
            background-position: center top !important;
            padding: 10px !important;
            min-height: 100vh !important;
          }
          
          .video-card-left {
            bottom: 15px !important;
            left: 2% !important;
            width: calc(46% - 10px) !important;
            max-width: 180px !important;
          }
          
          .video-card-right {
            bottom: 15px !important;
            right: 2% !important;
            width: calc(46% - 10px) !important;
            max-width: 180px !important;
          }
          
          .video-card {
            padding: 10px !important;
          }
          
          .video-title {
            font-size: 11px !important;
            margin-bottom: 8px !important;
            line-height: 1.1 !important;
          }
          
          .video-buttons {
            flex-direction: column !important;
            gap: 5px !important;
          }
          
          .video-button {
            width: 100% !important;
            padding: 4px 8px !important;
            font-size: 9px !important;
            border-radius: 12px !important;
          }
          
          .back-button {
            top: 10px !important;
            right: 10px !important;
            padding: 8px 12px !important;
            font-size: 10px !important;
            border-radius: 15px !important;
          }
        }
        
        /* Çok küçük ekranlar için */
        @media (max-width: 360px) {
          .video-card-left, .video-card-right {
            width: calc(50% - 8px) !important;
            max-width: 160px !important;
          }
          
          .video-title {
            font-size: 10px !important;
          }
          
          .video-button {
            font-size: 8px !important;
            padding: 3px 6px !important;
          }
        }
        
        /* Landscape mode için özel ayarlar */
        @media (max-width: 768px) and (orientation: landscape) {
          div[style*="backgroundImage"] {
            background-size: cover !important;
            background-position: center !important;
          }
          
          .video-card-left, .video-card-right {
            bottom: 10px !important;
            width: 160px !important;
          }
          
          .back-button {
            top: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HoowellDiscover;