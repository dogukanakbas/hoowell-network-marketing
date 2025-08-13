import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

const Welcome = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!user?.education_deadline) return;

    const calculateTimeLeft = () => {
      const deadline = new Date(user.education_deadline);
      const now = new Date();
      const difference = deadline - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [user?.education_deadline]);

  const handleStartEducation = () => {
    // Welcome sayfasının gösterildiğini kaydet
    localStorage.setItem(`welcome_shown_${user.id}`, 'true');
    navigate('/education');
  };

  // Loading durumu
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0f2324',
        color: '#FFD700',
        fontSize: '18px'
      }}>
        Yükleniyor...
      </div>
    );
  }

  // Giriş yapmamış kullanıcıları login'e yönlendir
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Admin kullanıcıları dashboard'a yönlendir
  if (user.role === 'admin') {
    return <Navigate to="/" />;
  }

  // Eğitimi tamamlamış kullanıcıları dashboard'a yönlendir
  if (user.education_completed) {
    return <Navigate to="/" />;
  }

  // Education deadline'ı olmayan kullanıcıları direkt eğitime yönlendir (eski kullanıcılar)
  if (!user.education_deadline) {
    return <Navigate to="/education" />;
  }

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: '#0f2324',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      zIndex: 1000,
      boxSizing: 'border-box'
    }}>
      {/* Arka Plan Efektleri */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '80px',
        height: '80px',
        background: 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }}></div>

      <div style={{
        position: 'absolute',
        top: '20%',
        right: '15%',
        width: '60px',
        height: '60px',
        background: 'radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 4s ease-in-out infinite reverse'
      }}></div>

      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '20%',
        width: '100px',
        height: '100px',
        background: 'radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite'
      }}></div>

      {/* Ana İçerik Kartı */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '30px 40px',
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 215, 0, 0.2)',
        position: 'relative',
        zIndex: 2,
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Logo ve Başlık */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 5px 15px rgba(255, 215, 0, 0.3)',
            borderRadius: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <img
              src="/hoowell-logo.png"
              alt="HOOWELL Logo"
              style={{
                width: '70px',
                height: '70px',
                objectFit: 'contain'
              }}
              onError={(e) => {
                // Fallback logo eğer resim yüklenemezse
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{
              display: 'none',
              width: '70px',
              height: '70px',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              borderRadius: '10px',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#0e2323',
              fontFamily: 'Arial, sans-serif'
            }}>
              H
            </div>
          </div>

          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#FFD700',
            margin: '0 0 5px 0',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '1px'
          }}>
            HOOWELL
          </h1>


        </div>

        {/* Hoşgeldin Mesajı */}
        <h2 style={{
          fontSize: '22px',
          fontWeight: 'bold',
          color: '#FFD700',
          marginBottom: '15px',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
        }}>
          HOOWELL AİLESİNE HOŞGELDİNİZ !
        </h2>

        {/* Şirket Tanıtımı */}
        <div style={{
          backgroundColor: 'rgba(14, 35, 35, 0.1)',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px',
          border: '1px solid rgba(255, 215, 0, 0.2)'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#333',
            lineHeight: '1.6',
            margin: '0 0 10px 0',
            fontWeight: '500'
          }}>
            <strong>Hoowell firması bir Waterlove kuruluşudur.</strong> 15 yıllık tecrübemizle 120'den fazla marka için 500.000'den fazla cihaz ürettik.
          </p>
          <p style={{
            fontSize: '14px',
            color: '#0e2323',
            lineHeight: '1.6',
            margin: '0',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            🌟 ALKALİ İONİZER CİHAZI ile GENÇLEŞTİRİCİ SU TEKNOLOJİSİ 🌟
          </p>
        </div>

        {/* Bilgilendirme Listesi */}
        <div style={{
          textAlign: 'left',
          maxWidth: '600px',
          margin: '0 auto 25px',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginBottom: '12px',
            padding: '10px',
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 215, 0, 0.2)'
          }}>
            <span style={{
              color: '#FFD700',
              fontSize: '16px',
              marginRight: '10px',
              marginTop: '1px'
            }}>
              📚
            </span>
            <span style={{ color: '#333', fontWeight: '500' }}>
              TEMEL EĞİTİMLERİNİZİ BİTİRMENİZ İÇİN TAM 7 GÜN ZAMANINIZ VAR.
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginBottom: '12px',
            padding: '10px',
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 215, 0, 0.2)'
          }}>
            <span style={{
              color: '#FFD700',
              fontSize: '16px',
              marginRight: '10px',
              marginTop: '1px'
            }}>
              🎓
            </span>
            <span style={{ color: '#333', fontWeight: '500' }}>
              TEMEL EĞİTİMLERDEN MEZUN OLDUKTAN SONRA WEB OFİSİNİZ AÇILACAKTIR.
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 215, 0, 0.2)'
          }}>
            <span style={{
              color: '#FFD700',
              fontSize: '16px',
              marginRight: '10px',
              marginTop: '1px'
            }}>
              🎉
            </span>
            <span style={{ color: '#333', fontWeight: '500' }}>
              KEYİFLİ SEYİRLER DİLİYORUZ !
            </span>
          </div>
        </div>

        {/* Geri Sayım */}
        <div style={{
          background: 'linear-gradient(135deg, #0e2323, #1a4a3a)',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '25px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
        }}>
          <h3 style={{
            color: '#FFD700',
            fontSize: '16px',
            marginBottom: '15px',
            fontWeight: 'bold'
          }}>
            Eğitimleri Bitirmek İçin Kalan Süreniz
          </h3>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '10px',
              padding: '12px',
              minWidth: '70px',
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#FFD700',
                marginBottom: '3px'
              }}>
                {timeLeft.days}
              </div>
              <div style={{ color: '#fff', fontSize: '12px', fontWeight: '500' }}>
                GÜN
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '10px',
              padding: '12px',
              minWidth: '70px',
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#FFD700',
                marginBottom: '3px'
              }}>
                {timeLeft.hours}
              </div>
              <div style={{ color: '#fff', fontSize: '12px', fontWeight: '500' }}>
                SAAT
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '10px',
              padding: '12px',
              minWidth: '70px',
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#FFD700',
                marginBottom: '3px'
              }}>
                {timeLeft.minutes}
              </div>
              <div style={{ color: '#fff', fontSize: '12px', fontWeight: '500' }}>
                DAKİKA
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '10px',
              padding: '12px',
              minWidth: '70px',
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#FFD700',
                marginBottom: '3px'
              }}>
                {timeLeft.seconds}
              </div>
              <div style={{ color: '#fff', fontSize: '12px', fontWeight: '500' }}>
                SANİYE
              </div>
            </div>
          </div>
        </div>

        {/* Eğitim Başlat Butonu */}
        <button
          onClick={handleStartEducation}
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#0e2323',
            border: 'none',
            borderRadius: '50px',
            padding: '20px 50px',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(255, 215, 0, 0.4)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            minWidth: '250px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 15px 40px rgba(255, 215, 0, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 10px 30px rgba(255, 215, 0, 0.4)';
          }}
        >
          🎓 Eğitim Paneline Geç
        </button>
      </div>

      {/* CSS Animasyonları */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Welcome;