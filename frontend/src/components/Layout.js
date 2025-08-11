import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PaymentBlockedWarning from './PaymentBlockedWarning';

const Layout = () => {
  const { user, logout, loading, refreshUser } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Ekran boyutu kontrolü
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      // Desktop'ta sidebar her zaman açık, mobilde kapalı
      if (!mobile) {
        setSidebarOpen(false); // Desktop'ta state false ama CSS ile görünür
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Sayfa değiştiğinde mobil menüyü kapat
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Mobil menü toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Overlay'e tıklandığında menüyü kapat
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Sayfa yüklendiğinde user bilgilerini yenile
  React.useEffect(() => {
    if (user) {
      refreshUser();
    }
  }, [user, refreshUser]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        Yükleniyor...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Yeni kullanıcılar için hoşgeldin ekranı kontrolü
  const welcomeShown = localStorage.getItem(`welcome_shown_${user.id}`);
  if (user.role === 'partner' && !user.education_completed && !welcomeShown && location.pathname !== '/welcome') {
    return <Navigate to="/welcome" />;
  }

  // Partner kullanıcıları için eğitim kontrolü
  if (user.role === 'partner' && !user.education_completed && location.pathname === '/' && welcomeShown) {
    return <Navigate to="/education" />;
  }

  // Menu öğelerini kullanıcı durumuna göre filtrele
  const allMenuItems = [
    { path: '/', label: 'Ana Sayfa', requiresEducation: true },
    { path: '/franchise-agi', label: 'Organizasyon Yapısı', requiresEducation: true },
    { path: '/kariyerim', label: 'Kariyer Durumu', requiresEducation: true },
    { path: '/doping-promosyonu', label: 'Doping Promosyonu', requiresEducation: true },
    { path: '/satislarim', label: 'Şahsi Satışlar', requiresEducation: true },
    { path: '/memnun-musteri-takip', label: 'Memnun Müşteriler', requiresEducation: true },
    { path: '/sponsorluk-takip', label: 'Sponsorluk Takibi', requiresEducation: true },
    { path: '/takim-takip', label: 'Takım Takip Paneli', requiresEducation: true },
    { path: '/liderlik-baskanlik-takip', label: 'Liderlik Havuzları', requiresEducation: true },
    { path: '/kar-paylasimi-promosyon', label: 'Kar Paylaşımı', requiresEducation: true },
    { path: '/global-seyahat-promosyonu', label: 'Global Seyahatler', requiresEducation: true },
    { path: '/muhasebe-takip-paneli', label: 'Muhasebe Takibi', requiresEducation: true },
    { path: '/bilgi-bankasi', label: 'Bilgi Bankası', requiresEducation: true },
    { path: '/kisisel-yonetim', label: 'Kişisel Yönetim', requiresEducation: true }
  ];

  // Partner kullanıcıları için menu filtreleme
  const menuItems = user.role === 'admin'
    ? allMenuItems
    : allMenuItems.filter(item =>
      !item.requiresEducation || user.education_completed
    );

  // Admin menü öğeleri
  const adminMenuItems = [
    { path: '/admin/users', label: 'Şirket Yönetimi' },
    { path: '/admin/reports', label: 'Aylık Satışlar' },
    { path: '/admin/payments', label: 'Ödeme Detayları' },
    { path: '/admin/settings', label: 'Sistem Ayarları' },
    { path: '/admin/questions', label: 'Soru Yönetimi' }
  ];

  return (
    <div className="App">
      {/* Mobile Menu Toggle Button */}
      {isMobile && (
        <button
          className="mobile-menu-toggle"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          ☰
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && (
        <div
          className={`mobile-overlay ${sidebarOpen ? 'active' : ''}`}
          onClick={closeSidebar}
        />
      )}

      <div className={`sidebar ${isMobile && sidebarOpen ? 'open' : ''}`}>
        {/* Ana Menü Çerçevesi */}
        <div style={{
          border: '3px solid var(--accent-gold)',
          borderRadius: '20px',
          padding: '15px',
          backgroundColor: '#0e2323',
          margin: '5px',
          boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)'
        }}>

          {/* Kullanıcı Bilgileri */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#0e2323',
            borderRadius: '25px',
            border: '2px solid var(--accent-gold)',
            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.2)'
          }}>
            <div style={{
              width: '45px',
              height: '45px',
              backgroundColor: 'var(--accent-gold)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#0e2323',
              border: '2px solid #ffffff'
            }}>
              🏠
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: 'bold',
                color: '#ffffff',
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {user.first_name?.toUpperCase()} {user.last_name?.toUpperCase()}
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--accent-gold)',
                marginTop: '2px',
                fontWeight: 'bold'
              }}>
                {user.career_level?.toUpperCase()} İŞ ORTAĞI
              </div>
              <div style={{
                fontSize: '10px',
                color: '#cccccc',
                marginTop: '1px'
              }}>
                {user.sponsor_id || '2025000034'}
              </div>
            </div>
          </div>

          {/* Arama Kutusu */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Ara..."
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid var(--accent-gold)',
                borderRadius: '25px',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                color: '#0e2323',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.3)';
                e.target.style.borderColor = '#e6c200';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
                e.target.style.borderColor = 'var(--accent-gold)';
              }}
            />
          </div>

          {/* Menü Butonları */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {menuItems.map((item, index) => {
              // Fotoğraftaki gibi bazı butonlar altın sarısı, bazıları koyu renkli
              const isGoldButton = [
                'Muhasebe Takibi',
                'Bilgi Bankası',
                'Kişisel Yönetim'
              ].includes(item.label);

              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => isMobile && closeSidebar()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: isMobile ? '16px 20px' : '12px 20px',
                    background: isActive
                      ? 'var(--accent-gold)'
                      : isGoldButton
                        ? 'linear-gradient(135deg, #1a4040 0%, #2a5555 50%, #1a4040 100%)'
                        : 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 50%, #000000 100%)',
                    color: isActive
                      ? '#0e2323'
                      : isGoldButton
                        ? '#ffffff'
                        : '#ffffff',
                    textDecoration: 'none',
                    borderRadius: '25px',
                    textAlign: 'center',
                    fontSize: isMobile ? '15px' : '13px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    border: isActive
                      ? '2px solid var(--accent-gold)'
                      : isGoldButton
                        ? '2px solid #1a4040'
                        : '2px solid var(--accent-gold)',
                    minHeight: isMobile ? '50px' : '45px',
                    boxShadow: isActive
                      ? '0 4px 15px rgba(255, 215, 0, 0.4)'
                      : isGoldButton
                        ? '0 4px 15px rgba(26, 64, 64, 0.6)'
                        : '0 2px 8px rgba(0,0,0,0.2)',
                    transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
                    letterSpacing: '0.5px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      if (isGoldButton) {
                        e.target.style.background = 'linear-gradient(135deg, #2a5555 0%, #3a6666 50%, #2a5555 100%)';
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(26, 64, 64, 0.8)';
                      } else {
                        e.target.style.background = 'linear-gradient(135deg, #3c3c3c 0%, #2a2a2a 50%, #1a1a1a 100%)';
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.2)';
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      if (isGoldButton) {
                        e.target.style.background = 'linear-gradient(135deg, #1a4040 0%, #2a5555 50%, #1a4040 100%)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(26, 64, 64, 0.6)';
                      } else {
                        e.target.style.background = 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 50%, #000000 100%)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                      }
                    }
                  }}
                >
                  {item.label}
                </Link>
              );
            })}

            {user.role === 'admin' && (
              <>
                <div style={{
                  margin: '20px 0 15px 0',
                  textAlign: 'center',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'var(--accent-gold)',
                  backgroundColor: '#0e2323',
                  padding: '12px',
                  borderRadius: '15px',
                  border: '2px solid var(--accent-gold)',
                  letterSpacing: '1px'
                }}>
                  ADMİN PANELİ
                </div>
                {adminMenuItems.map((item) => {
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => isMobile && closeSidebar()}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: isMobile ? '16px 20px' : '12px 20px',
                        backgroundColor: isActive ? 'var(--accent-gold)' : '#1a4040',
                        color: isActive ? '#0e2323' : '#ffffff',
                        textDecoration: 'none',
                        borderRadius: '25px',
                        textAlign: 'center',
                        fontSize: isMobile ? '15px' : '13px',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        border: '2px solid var(--accent-gold)',
                        minHeight: isMobile ? '50px' : '45px',
                        boxShadow: isActive
                          ? '0 4px 15px rgba(255, 215, 0, 0.4)'
                          : '0 2px 8px rgba(0,0,0,0.2)',
                        transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
                        letterSpacing: '0.5px',
                        marginBottom: '8px'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.target.style.backgroundColor = '#2a5555';
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.target.style.backgroundColor = '#1a4040';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </>
            )}

            {/* Ödeme Yap butonu kaldırıldı - Yeni kullanıcılar için */}

            {user.payment_confirmed && !user.education_completed && (
              <Link
                to="/education"
                onClick={() => isMobile && closeSidebar()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: isMobile ? '18px 20px' : '15px 20px',
                  backgroundColor: 'var(--accent-gold)',
                  color: 'var(--primary-dark)',
                  textDecoration: 'none',
                  borderRadius: '15px',
                  textAlign: 'center',
                  fontSize: isMobile ? '16px' : '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  marginTop: '10px',
                  minHeight: isMobile ? '50px' : 'auto'
                }}
              >
                Eğitimler
              </Link>
            )}

            {/* Çıkış Butonu */}
            <button
              onClick={() => {
                if (loggingOut) return; // Çift tıklama önleme
                setLoggingOut(true);
                if (isMobile) closeSidebar();
                logout();
              }}
              disabled={loggingOut}
              style={{
                padding: isMobile ? '16px 20px' : '12px 20px',
                backgroundColor: '#dc3545',
                color: '#ffffff',
                border: '2px solid #dc3545',
                borderRadius: '25px',
                textAlign: 'center',
                fontSize: isMobile ? '15px' : '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)',
                marginTop: '20px',
                minHeight: isMobile ? '50px' : '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                letterSpacing: '0.5px',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#c82333';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#dc3545';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.3)';
              }}
            >
              {loggingOut ? '⏳ ÇIKILIYOR...' : '🚪 ÇIKIŞ'}
            </button>
          </div>

        </div> {/* Ana Menü Çerçevesi Kapanış */}
      </div>

      <div className="main-content">
        <PaymentBlockedWarning />
        <Outlet />

        {/* Footer */}
        <footer style={{
          backgroundColor: 'var(--primary-dark)',
          color: 'white',
          padding: '40px 20px 20px 20px',
          marginTop: '50px',
          borderRadius: '15px 15px 0 0'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Ana Footer İçeriği */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '30px',
              marginBottom: '30px'
            }}>

              {/* Şirket Bilgileri */}
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <img
                    src="/hoowell-logo.png"
                    alt="HOOWELL Logo"
                    style={{
                      width: '120px',
                      height: '60px',
                      objectFit: 'contain',
                      marginBottom: '10px'
                    }}
                  />

                </div>
                <h4 style={{ color: 'var(--accent-gold)', marginBottom: '15px', fontSize: '16px' }}>
                  HOOWELL GLOBAL ALKALİ İYONİZER SİSTEMLERİ ANONİM ŞİRKETİ
                </h4>
                <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  <p><strong>📍 Adres:</strong> AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR</p>
                  <p><strong>📞 Telefon:</strong> 0232 905 55 55</p>
                  <p><strong>📧 E-posta:</strong> info@hoowell.com.tr</p>
                  <p><strong>🏢 Ticaret Sicil No:</strong> 264080</p>
                  <p><strong>🏦 IBAN:</strong> TR77 0011 1000 0000 0153 1671 66</p>
                </div>
              </div>

              {/* Hızlı Linkler */}
              <div>
                <h4 style={{ color: 'var(--accent-gold)', marginBottom: '15px', fontSize: '16px' }}>
                  Hızlı Linkler
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link to="/about" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                    Hakkımızda
                  </Link>
                  <Link to="/products" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                    Ürünler
                  </Link>
                  <Link to="/contact" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                    İletişim
                  </Link>
                  <Link to="/partner-registration" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                    İş Ortağı Ol
                  </Link>
                  <Link to="/customer-registration" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                    Ürün Satın Al
                  </Link>
                </div>
              </div>

              {/* Yasal */}
              <div>
                <h4 style={{ color: 'var(--accent-gold)', marginBottom: '15px', fontSize: '16px' }}>
                  Yasal
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link to="/privacy" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                    Gizlilik Politikası
                  </Link>
                  <Link to="/terms" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                    Kullanım Şartları
                  </Link>
                  <Link to="/refund" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                    İade ve Değişim
                  </Link>
                  <Link to="/kvkk" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                    KVKK Aydınlatma Metni
                  </Link>
                  <Link to="/shipping" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                    Teslimat Bilgileri
                  </Link>
                  <Link to="/cookies" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                    Çerez Politikası
                  </Link>
                </div>
              </div>

              {/* Ürünler */}
              <div>
                <h4 style={{ color: 'var(--accent-gold)', marginBottom: '15px', fontSize: '16px' }}>
                  Ürünlerimiz
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '13px' }}>
                    <strong>📱 HOOWELL Premium El Terminali</strong><br />
                    <span style={{ color: '#ccc' }}>19.680 TL (KDV Dahil)</span>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    <strong>🏆 HOOWELL Professional Alkali İyonizer Cihazı</strong><br />
                    <span style={{ color: '#ccc' }}>86.400 TL (KDV Dahil)</span>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    <strong>⭐ HOOWELL Elite Alkali İyonizer Sistemi</strong><br />
                    <span style={{ color: '#ff6b35' }}>🔥 KAMPANYA: 98.400 TL (KDV Dahil)</span>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    <strong>📚 Eğitim Paketi</strong><br />
                    <span style={{ color: '#ccc' }}>4.800 TL (KDV Dahil)</span>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    <strong>🤝 Franchise Paketi</strong><br />
                    <span style={{ color: '#ccc' }}>86.400 TL (Cihaz + Eğitim)</span>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    <strong>🔧 Yedek Parçalar</strong><br />
                    <span style={{ color: '#ccc' }}>Filtreler ve Aksesuarlar</span>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    <strong>🛠️ Teknik Servis</strong><br />
                    <span style={{ color: '#ccc' }}>Kurulum ve Bakım</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alt Footer */}
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.2)',
              paddingTop: '20px',
              textAlign: 'center',
              fontSize: '14px',
              color: '#ccc'
            }}>
              <p style={{ margin: '0 0 10px 0' }}>
                © 2025 HOOWELL GLOBAL ALKALİ İYONİZER SİSTEMLERİ ANONİM ŞİRKETİ. Tüm hakları saklıdır.
              </p>
              <p style={{ margin: 0, fontSize: '12px' }}>
                Bu site 6698 sayılı KVKK kapsamında kişisel verilerinizi korumaktadır.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;