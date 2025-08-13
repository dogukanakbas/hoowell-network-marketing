import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const InfoBankButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Anasayfa ve organizasyon sayfasında gösterme
  const excludedPaths = ['/', '/franchise-agi'];
  if (excludedPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <div>
      <button
        onClick={() => navigate('/bilgi-bankasi')}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '80px',
          height: '80px',
          borderRadius: '8px',
          border: '3px solid #FFD700',
          backgroundColor: 'rgba(14, 35, 35, 0.9)',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 12px 35px rgba(255, 215, 0, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.3)';
        }}
      >
        <img
          src="/images/products/bilgi_bankasi.png"
          alt="Bilgi Bankası"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '8px'
          }}
        />
      </button>
      
      {/* Responsive CSS */}
      <style jsx>{`
        @media (max-width: 768px) {
          button {
            width: 70px !important;
            height: 70px !important;
            bottom: 20px !important;
            right: 20px !important;
          }
        }
        
        @media (max-width: 480px) {
          button {
            width: 60px !important;
            height: 60px !important;
            bottom: 15px !important;
            right: 15px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InfoBankButton;
