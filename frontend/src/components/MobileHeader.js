import React from 'react';
import { useAuth } from '../context/AuthContext';

const MobileHeader = ({ title, showUserInfo = true }) => {
  const { user } = useAuth();

  return (
    <div style={{
      display: window.innerWidth <= 768 ? 'block' : 'none',
      background: 'var(--white)',
      padding: '15px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
      position: 'sticky',
      top: '80px',
      zIndex: 100
    }}>
      {/* Başlık */}
      <div style={{
        textAlign: 'center',
        marginBottom: showUserInfo ? '15px' : '0'
      }}>
        <h2 style={{
          color: 'var(--primary-dark)',
          fontSize: '18px',
          margin: '0',
          fontWeight: '600'
        }}>
          {title || 'HOOWELL'}
        </h2>
      </div>

      {/* Kullanıcı Bilgileri */}
      {showUserInfo && user && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '10px',
          backgroundColor: 'var(--primary-dark)',
          borderRadius: '8px'
        }}>
          <div style={{
            width: '35px',
            height: '35px',
            backgroundColor: (user.career_level?.toLowerCase() === 'bronze' || user.career_level?.toLowerCase() === 'silver') ? 'transparent' : 'var(--accent-gold)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'var(--primary-dark)',
            overflow: 'hidden'
          }}>
            {user.career_level?.toLowerCase() === 'bronze' ? (
              <img 
                src="/images/products/bronze_logo.jpeg" 
                alt="Bronze Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
            ) : user.career_level?.toLowerCase() === 'silver' ? (
              <img 
                src="/images/products/silver_logo.jpeg" 
                alt="Silver Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
            ) : user.career_level?.toLowerCase() === 'gold' ? (
              <img 
                src="/images/products/gold_logo.jpeg" 
                alt="Gold Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
            ) : user.career_level?.toLowerCase() === 'star_leader' ? (
              <img 
                src="/images/products/starlider_logo.jpeg" 
                alt="Star Leader Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
            ) : user.career_level?.toLowerCase() === 'super_star_leader' ? (
              <img 
                src="/images/products/superstar_logo.jpeg" 
                alt="Super Star Leader Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
            ) : user.career_level?.toLowerCase() === 'presidents_team' ? (
              <img 
                src="/images/products/baskanlar_logo.jpeg" 
                alt="Başkanlar Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
            ) : (
              user.first_name?.charAt(0) + user.last_name?.charAt(0)
            )}
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              color: 'var(--white)', 
              fontSize: '14px', 
              fontWeight: '500' 
            }}>
              {user.career_level?.charAt(0).toUpperCase() + user.career_level?.slice(1)}
            </div>
            <div style={{ 
              color: 'var(--accent-gold)', 
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              KKP: {user.total_kkp?.toLocaleString() || '0'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileHeader;