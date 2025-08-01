import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PaymentBlockedWarning from './PaymentBlockedWarning';

const Layout = () => {
  const { user, logout, loading, refreshUser } = useAuth();
  const location = useLocation();

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
    { path: '/kariyerim', label: 'Kariyerim', requiresEducation: true },
    { path: '/satislarim', label: 'Satışlarım', requiresEducation: true },
    { path: '/franchise-agi', label: 'Franchise Ağı Yapısı', requiresEducation: true },
    { path: '/memnun-musteri-takip', label: 'Memnun Müşteri Takip', requiresEducation: true },
    { path: '/sponsorluk-takip', label: 'Sponsorluk Takip Paneli', requiresEducation: true },
    { path: '/takim-takip', label: 'Takım Takip Paneli', requiresEducation: true },
    { path: '/liderlik-baskanlik-takip', label: 'Liderlik ve Başkanlık Takip', requiresEducation: true },
    { path: '/kar-paylasimi-promosyon', label: 'Kar Paylaşımı Promosyonu', requiresEducation: true },
    { path: '/doping-promosyonu', label: 'Doping Promosyonu', requiresEducation: true },
    { path: '/global-seyahat-promosyonu', label: 'Global Seyahat', requiresEducation: true },
    { path: '/muhasebe-takip-paneli', label: 'Muhasebe Takip Paneli', requiresEducation: true },
    { path: '/bilgi-bankasi', label: 'Bilgi Bankası', requiresEducation: true }
  ];

  // Partner kullanıcıları için menu filtreleme
  const menuItems = user.role === 'admin' 
    ? allMenuItems 
    : allMenuItems.filter(item => 
        !item.requiresEducation || user.education_completed
      );

  // Admin menü öğeleri
  const adminMenuItems = [
    { path: '/admin/users', label: 'Kullanıcı Yönetimi' },
    { path: '/admin/payments', label: 'Ödeme Onayları' },
    { path: '/admin/settings', label: 'Sistem Ayarları' },
    { path: '/admin/reports', label: 'Raporlar' },
    { path: '/partner-registration', label: 'İş Ortağı Kayıt' }
  ];

  return (
    <div className="App">
      <div className="sidebar">


        {/* Kullanıcı Bilgileri */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: 'var(--white)',
          borderRadius: '15px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            backgroundColor: 'var(--accent-gold)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '15px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'var(--primary-dark)'
          }}>
            {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 'bold', color: 'var(--text-dark)', fontSize: '16px' }}>
              {user.career_level?.charAt(0).toUpperCase() + user.career_level?.slice(1)} İş Ortağı
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>
              ID: {user.sponsor_id || 'Atanmamış'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--accent-gold)', marginTop: '2px', fontWeight: 'bold' }}>
              KKP: {user.total_kkp?.toLocaleString() || '0'}
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
              border: '2px solid var(--border-color)',
              borderRadius: '25px',
              fontSize: '14px',
              backgroundColor: 'var(--white)',
              color: 'var(--text-dark)'
            }}
          />
        </div>
        
        {/* Menü Butonları */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              style={{
                display: 'block',
                padding: '15px 20px',
                backgroundColor: location.pathname === item.path ? 'var(--primary-dark)' : 'var(--primary-dark)',
                color: 'var(--white)',
                textDecoration: 'none',
                borderRadius: '15px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                opacity: location.pathname === item.path ? '1' : '0.9'
              }}
            >
              {item.label}
            </Link>
          ))}
          
          {user.role === 'admin' && (
            <>
              <div style={{ 
                margin: '20px 0 10px 0', 
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                color: 'var(--accent-gold)'
              }}>
                Admin Panel
              </div>
              {adminMenuItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'block',
                    padding: '15px 20px',
                    backgroundColor: location.pathname === item.path ? 'var(--primary-dark)' : 'var(--primary-dark)',
                    color: 'var(--white)',
                    textDecoration: 'none',
                    borderRadius: '15px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    opacity: location.pathname === item.path ? '1' : '0.9'
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </>
          )}
          
          {/* Ödeme Yap butonu kaldırıldı - Yeni kullanıcılar için */}
          
          {user.payment_confirmed && !user.education_completed && (
            <Link 
              to="/education"
              style={{
                display: 'block',
                padding: '15px 20px',
                backgroundColor: 'var(--accent-gold)',
                color: 'var(--primary-dark)',
                textDecoration: 'none',
                borderRadius: '15px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginTop: '10px'
              }}
            >
              Eğitimler
            </Link>
          )}

          {/* Çıkış Butonu */}
          <button 
            onClick={logout}
            style={{
              padding: '15px 20px',
              backgroundColor: '#dc3545',
              color: 'var(--white)',
              border: 'none',
              borderRadius: '15px',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginTop: '20px'
            }}
          >
            Çıkış
          </button>
        </div>
      </div>

      <div className="main-content">
        <PaymentBlockedWarning />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;