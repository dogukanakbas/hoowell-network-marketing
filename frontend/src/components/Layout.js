import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccessRestricted from './AccessRestricted';

const Layout = () => {
  const { user, logout, loading } = useAuth();
  const location = useLocation();

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
    { path: '/', label: 'Ana Sayfa', icon: '🏠' },
    { path: '/kariyerim', label: 'Kariyerim', icon: '📈' },
    { path: '/satislarim', label: 'Satışlarım', icon: '💰' },
    { path: '/franchise-agi', label: 'Franchise Ağı Yapısı', icon: '🌐' },
    { path: '/memnun-musteri-takip', label: 'Memnun Müşteri Takip Paneli', icon: '😊' },
    { path: '/sponsorluk-takip', label: 'Sponsorluk Takip Paneli', icon: '👥' },
    { path: '/takim-takip', label: 'Takım Takip Paneli', icon: '👨‍👩‍👧‍👦' },
    { path: '/liderlik-baskanlik-takip', label: 'Liderlik ve Başkanlık Takip Paneli', icon: '👑' },
    { path: '/kar-paylasimi-promosyon', label: 'Kar Paylaşımı Promosyonu', icon: '🎁' },
    { path: '/global-seyahat-promosyonu', label: 'Global Seyahat Promosyonu', icon: '✈️' },
    { path: '/bilgi-bankasi', label: 'Bilgi Bankası', icon: '📚' }
  ];

  // Admin menü öğeleri
  const adminMenuItems = [
    { path: '/admin/users', label: 'Kullanıcı Yönetimi', icon: '👤' },
    { path: '/admin/payments', label: 'Ödeme Onayları', icon: '💳' },
    { path: '/admin/settings', label: 'Sistem Ayarları', icon: '⚙️' },
    { path: '/admin/reports', label: 'Raporlar', icon: '📊' }
  ];

  return (
    <div className="App">
      <div className="sidebar">
        <div className="sidebar-logo">
          <h2>HOOWELL</h2>
          <p>INNOVATE YOUR LIFE</p>
        </div>
        
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={location.pathname === item.path ? 'active' : ''}
              >
                <span style={{ marginRight: '10px' }}>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
          
          {user.role === 'admin' && (
            <>
              <li style={{ marginTop: '20px', padding: '10px 20px', borderTop: '1px solid #2d5a4a' }}>
                <strong style={{ color: '#FFD700' }}>Admin Panel</strong>
              </li>
              {adminMenuItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={location.pathname === item.path ? 'active' : ''}
                  >
                    <span style={{ marginRight: '10px' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </>
          )}
          
          {!user.payment_confirmed && (
            <li>
              <Link to="/payment">
                <span style={{ marginRight: '10px' }}>💳</span>
                Ödeme Yap
              </Link>
            </li>
          )}
          
          {user.payment_confirmed && !user.education_completed && (
            <li>
              <Link to="/education">
                <span style={{ marginRight: '10px' }}>🎓</span>
                Eğitimler
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="main-content">
        <div className="header">
          <h1>İş Ortağı Kayıt Paneli</h1>
          <div className="user-info">
            <div className="user-avatar">
              {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 'bold' }}>
                {user.first_name} {user.last_name}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                {user.career_level?.toUpperCase()} İŞ ORTAĞI
              </div>
            </div>
            <button 
              onClick={logout}
              className="btn btn-primary"
              style={{ marginLeft: '15px' }}
            >
              Çıkış
            </button>
          </div>
        </div>
        
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;