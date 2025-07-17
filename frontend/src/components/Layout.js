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

  const menuItems = [
    { path: '/', label: 'Ana Sayfa' },
    { path: '/kariyerim', label: 'Kariyerim' },
    { path: '/satislarim', label: 'Satışlarım' },
    { path: '/franchise-agi', label: 'Franchise Ağı Yapısı' },
    { path: '/memnun-musteri-takip', label: 'Memnun Müşteri Takip' },
    { path: '/sponsorluk-takip', label: 'Sponsorluk Takip Paneli' },
    { path: '/takim-takip', label: 'Takım Takip Paneli' },
    { path: '/liderlik-baskanlik-takip', label: 'Liderlik ve Başkanlık Takip' },
    { path: '/kar-paylasimi-promosyon', label: 'Kar Paylaşımı Promosyonu' },
    { path: '/global-seyahat-promosyonu', label: 'Global Seyahat' },
    { path: '/bilgi-bankasi', label: 'Bilgi Bankası' }
  ];

  // Admin menü öğeleri
  const adminMenuItems = [
    { path: '/admin/users', label: 'Kullanıcı Yönetimi' },
    { path: '/admin/payments', label: 'Ödeme Onayları' },
    { path: '/admin/settings', label: 'Sistem Ayarları' },
    { path: '/admin/reports', label: 'Raporlar' }
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
          
          {!user.payment_confirmed && (
            <Link 
              to="/payment"
              style={{
                display: 'block',
                padding: '15px 20px',
                backgroundColor: 'var(--success-green)',
                color: 'var(--white)',
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
              Ödeme Yap
            </Link>
          )}
          
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