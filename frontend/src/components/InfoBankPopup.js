import React from 'react';
import './InfoBankPopup.css';

const InfoBankPopup = ({ isOpen, onClose, content, title }) => {
  if (!isOpen) return null;

  return (
    <div className="info-bank-overlay" onClick={onClose}>
      <div className="info-bank-popup" onClick={(e) => e.stopPropagation()}>
        <div className="info-bank-header">
          <h2 className="info-bank-title">
            <span className="info-icon">📚</span>
            {title || 'Bilgi Bankası'}
          </h2>
          <button className="info-bank-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="info-bank-content">
          {typeof content === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <div>{content}</div>
          )}
        </div>
        
        <div className="info-bank-footer">
          <button className="info-bank-close-btn" onClick={onClose}>
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoBankPopup;

