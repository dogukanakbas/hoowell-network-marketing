import React from 'react';
import { useAuth } from '../context/AuthContext';

const AccessRestricted = ({ pageName, icon }) => {
  const { user } = useAuth();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '40px 20px'
    }}>
      {/* Icon */}
      <div style={{
        fontSize: '80px',
        marginBottom: '20px',
        opacity: 0.3
      }}>
        {icon || '🔒'}
      </div>

      {/* Main Card */}
      <div style={{
        backgroundColor: 'var(--white)',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        width: '100%'
      }}>
        {/* Hoowell Logo */}
        <div style={{
          color: 'var(--accent-gold)',
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '10px'
        }}>
          HOOWELL
        </div>



        {/* Page Title */}
        <h2 style={{
          color: 'var(--primary-green)',
          fontSize: '24px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          {icon && <span style={{ fontSize: '28px' }}>{icon}</span>}
          {pageName}
        </h2>

        {/* Restriction Message */}
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '25px'
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#856404',
            marginBottom: '10px'
          }}>
            🎓 Eğitim Tamamlama Gerekli
          </div>
          <p style={{
            color: '#856404',
            fontSize: '16px',
            lineHeight: '1.5',
            margin: 0
          }}>
            Bu sayfalara erişmek için eğitim bölümünü tamamlamanız lazım.
          </p>
        </div>

        {/* Progress Info */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '25px'
        }}>
          <h4 style={{
            color: 'var(--primary-green)',
            marginBottom: '15px',
            fontSize: '16px'
          }}>
            📊 Mevcut Durumunuz:
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                color: user?.payment_confirmed ? '#28a745' : '#dc3545',
                fontSize: '16px'
              }}>
                {user?.payment_confirmed ? '✅' : '❌'}
              </span>
              <span style={{ color: 'var(--text-dark)' }}>
                Ödeme Onayı
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                color: user?.education_completed ? '#28a745' : '#dc3545',
                fontSize: '16px'
              }}>
                {user?.education_completed ? '✅' : '❌'}
              </span>
              <span style={{ color: 'var(--text-dark)' }}>
                Eğitim Tamamlama
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                color: user?.backoffice_access ? '#28a745' : '#dc3545',
                fontSize: '16px'
              }}>
                {user?.backoffice_access ? '✅' : '❌'}
              </span>
              <span style={{ color: 'var(--text-dark)' }}>
                Backoffice Erişimi
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!user?.payment_confirmed ? (
          <a
            href="/payment"
            className="btn btn-primary"
            style={{
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: '15px'
            }}
          >
            💳 Ödeme Yap
          </a>
        ) : !user?.education_completed ? (
          <a
            href="/education"
            className="btn btn-gold"
            style={{
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: '15px'
            }}
          >
            🎓 Eğitimlere Git
          </a>
        ) : (
          <div style={{
            color: '#28a745',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '15px'
          }}>
            🎉 Tebrikler! Yakında bu sayfaya erişebileceksiniz.
          </div>
        )}

        {/* Success Message */}
        <div style={{
          color: 'var(--primary-green)',
          fontSize: '18px',
          fontWeight: '600',
          marginTop: '20px'
        }}>
          Hoowell kariyer yolculuğunuzda başarılar diler! 🚀
        </div>
      </div>
    </div>
  );
};

export default AccessRestricted;