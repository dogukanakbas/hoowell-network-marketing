import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import InfoBankPopup from './InfoBankPopup';

const InfoBankButton = () => {
  const location = useLocation();
  const [showInfoPopup, setShowInfoPopup] = useState(false);

  // Sadece bilgi bankası içeriği olan sayfalarda gösterme
  const allowedPaths = [
    '/kariyerim',
    '/doping-promosyonu', 
    '/satislarim',
    '/memnun-musteri-takip',
    '/sponsorluk-takip',
    '/takim-takip',
    '/liderlik-baskanlik-takip',
    '/kar-paylasimi-promosyon',
    '/global-seyahat-promosyonu',
    '/muhasebe-takip-paneli'
  ];
  
  if (!allowedPaths.includes(location.pathname)) {
    return null;
  }

  // Sayfa bazlı contentType belirleme
  const getContentType = () => {
    switch (location.pathname) {
      case '/kariyerim':
        return 'career';
      case '/doping-promosyonu':
        return 'doping';
      case '/satislarim':
        return 'sales';
      case '/memnun-musteri-takip':
        return 'customers';
      case '/sponsorluk-takip':
        return 'sponsorship';
      case '/takim-takip':
        return 'team';
      case '/liderlik-baskanlik-takip':
        return 'leadership';
      case '/kar-paylasimi-promosyon':
        return 'profit';
      case '/global-seyahat-promosyonu':
        return 'travel';
      case '/muhasebe-takip-paneli':
        return 'accounting';
      default:
        return 'career'; // Varsayılan olarak kariyer bilgileri
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowInfoPopup(true)}
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

      {/* Bilgi Bankası Popup */}
      <InfoBankPopup 
        isOpen={showInfoPopup}
        onClose={() => setShowInfoPopup(false)}
        contentType={getContentType()}
      />
    </div>
  );
};

export default InfoBankButton;
