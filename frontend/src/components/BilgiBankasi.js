import React from 'react';
import { useAuth } from '../context/AuthContext';

const BilgiBankasi = () => {
  const { user } = useAuth();

  // Bilgi bankası kategorileri
  const categories = [
    // Üst ve Orta Bölüm (Koyu Gri/Siyah Butonlar)
    { title: 'TEMEL EĞİTİM VİDEOLARI', color: 'dark' },
    { title: 'ÜRÜN EĞİTİM VİDEOLARI', color: 'dark' },
    { title: 'SOSYAL MEDYA REKLAM VİDEOLARI', color: 'dark' },
    { title: 'ŞİRKET KÜLTÜRÜ VİDEOLARI', color: 'dark' },
    { title: 'ÇALIŞMA DÖNGÜSÜ VİDEOLARI', color: 'dark' },
    { title: 'TİCARET KURMA VİDEOLARI', color: 'dark' },
    { title: 'SATIŞ TEKNİKLERİ VİDEOLARI', color: 'dark' },
    { title: 'KİŞİSEL GELİŞİM VİDEOLARI', color: 'dark' },
    { title: 'MENTÖRLÜK SİSTEM VİDEOLARI', color: 'dark' },
    { title: 'LİDERLİK VİDEOLARI', color: 'dark' },
    { title: 'BAŞARI HİKAYELERİ VİDEOLARI', color: 'dark' },
    { title: 'MÜŞTERİ DENEYİMLERİ VİDEOLARI', color: 'dark' },
    { title: 'LİDER GELİŞTİRME KAMPLARI', color: 'dark' },
    { title: 'KAR PAYLAŞIMI TOPLANTILARI', color: 'dark' },
    { title: 'GLOBAL SEYAHATLER', color: 'dark' },
    // Alt Bölüm (Yeşil Butonlar)
    { title: 'FRANCHAISE ANLAŞMASI', color: 'green' },
    { title: 'PAZARLAMA ve KAZANÇ PLANI', color: 'green' },
    { title: 'BİLİMSEL DÖKÜMANLAR', color: 'green' },
    { title: 'GARANTİ BELGELERİ', color: 'green' }
  ];

  const handleCategoryClick = (category) => {
    // Burada sonradan yönlendirme eklenebilir
    console.log('Kategori tıklandı:', category.title);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0e2323 0%, #1a3333 50%, #0e2323 100%)',
      padding: '20px',
      position: 'relative'
    }}>


      {/* Ana Başlık */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        paddingTop: '20px'
      }}>
        <h1 className="main-title" style={{
          color: '#FFD700',
          fontSize: '36px',
          fontWeight: 'bold',
          textDecoration: 'underline',
          margin: 0,
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          HOOWELL BİLGİ BANKASI
        </h1>
      </div>

      {/* Kategoriler Grid */}
      <div className="grid-container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '20px',
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {categories.map((category, index) => (
          <button
            key={index}
            className="category-button"
            onClick={() => handleCategoryClick(category)}
            style={{
              height: '120px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '15px',
              background: category.color === 'dark' 
                ? 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 50%, #000000 100%)'
                : 'linear-gradient(135deg, #1a4d4d 0%, #2a6666 50%, #1a4d4d 100%)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
            }}
          >
            {/* Hoowell yazısı */}
            <div style={{
              color: '#FFD700',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px',
              opacity: 0.8
            }}>
              Hoowell
            </div>
            
            {/* Kategori başlığı */}
            <div style={{
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: '1.3'
            }}>
              {category.title}
            </div>
          </button>
        ))}
      </div>

      {/* Responsive tasarım için CSS */}
      <style jsx>{`
        @media (max-width: 1200px) {
          .grid-container {
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            padding: 0 15px;
          }
        }
        
        @media (max-width: 992px) {
          .grid-container {
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            padding: 0 15px;
          }
        }
        
        @media (max-width: 768px) {
          .grid-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            padding: 0 15px;
          }
          
          .category-button {
            height: 100px;
            font-size: 14px;
          }
          
          .main-title {
            font-size: 28px;
          }
        }
        
        @media (max-width: 480px) {
          .grid-container {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 0 10px;
          }
          
          .category-button {
            height: 90px;
            font-size: 13px;
          }
          
          .main-title {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default BilgiBankasi;
