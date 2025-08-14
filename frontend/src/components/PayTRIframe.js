import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PayTRIframe = ({ iframeToken, onClose, onSuccess, onError }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!iframeToken) return;

    // PayTR iframe resizer script'ini yükle
    const script = document.createElement('script');
    script.src = 'https://www.paytr.com/js/iframeResizer.min.js';
    script.onload = () => {
      setLoading(false);
      // Iframe'i resize et
      if (window.iFrameResize) {
        window.iFrameResize({
          log: false,
          checkOrigin: false,
          onMessage: function(messageData) {
            console.log('PayTR Message:', messageData);
            
            // PayTR'den gelen mesajları dinle
            if (messageData.message) {
              if (messageData.message.includes('success')) {
                onSuccess && onSuccess();
              } else if (messageData.message.includes('error') || messageData.message.includes('fail')) {
                onError && onError(messageData.message);
              }
            }
          },
          onClosed: function() {
            console.log('PayTR iframe closed');
            onClose && onClose();
          }
        }, '#paytr-iframe');
      }
    };
    document.head.appendChild(script);

    // Cleanup
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [iframeToken, onClose, onSuccess, onError]);

  // Sayfa değişikliklerini dinle (PayTR yönlendirmeleri için)
  useEffect(() => {
    const handleMessage = (event) => {
      // PayTR'den gelen mesajları kontrol et
      if (event.origin === 'https://www.paytr.com') {
        console.log('PayTR postMessage:', event.data);
        
        if (event.data && typeof event.data === 'string') {
          if (event.data.includes('success')) {
            navigate('/payment/success');
          } else if (event.data.includes('fail') || event.data.includes('error')) {
            navigate('/payment/fail');
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  if (!iframeToken) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>PayTR token bulunamadı</p>
        <button onClick={onClose} className="btn btn-secondary">
          Kapat
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8f9fa'
        }}>
          <h3 style={{ margin: 0, color: '#333' }}>
            🔒 Güvenli Ödeme - PayTR
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '5px'
            }}
            title="Kapat"
          >
            ✕
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#666'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '15px' }}>⏳</div>
            <p>PayTR ödeme sayfası yükleniyor...</p>
          </div>
        )}

        {/* PayTR Iframe */}
        <div style={{ 
          minHeight: loading ? '0' : '500px',
          display: loading ? 'none' : 'block'
        }}>
          <iframe
            id="paytr-iframe"
            src={`https://www.paytr.com/odeme/guvenli/${iframeToken}`}
            frameBorder="0"
            scrolling="no"
            style={{
              width: '100%',
              minHeight: '500px',
              border: 'none'
            }}
            title="PayTR Güvenli Ödeme"
            onLoad={() => setLoading(false)}
            allow="payment"
          />
        </div>

        {/* Footer */}
        <div style={{
          padding: '15px 20px',
          borderTop: '1px solid #eee',
          backgroundColor: '#f8f9fa',
          fontSize: '12px',
          color: '#666',
          textAlign: 'center'
        }}>
          🔐 Bu ödeme sayfası SSL sertifikası ile korunmaktadır. Kart bilgileriniz güvenle şifrelenir.
        </div>
      </div>
    </div>
  );
};

export default PayTRIframe;