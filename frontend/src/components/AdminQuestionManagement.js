import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminQuestionManagement = () => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      // API'den soru verilerini çek
      setLoading(false);
    } catch (error) {
      console.error('Soru verileri yüklenirken hata:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '18px',
        color: '#FFD700',
        backgroundColor: '#0e2323'
      }}>
        Soru verileri yükleniyor...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f2324',
      padding: '20px',
      margin: '0 -20px'
    }}>
      {/* HOOWELL Logo - Sağ Üst */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 10
      }}>
        <img 
          src="/hoowell-logo.png" 
          alt="HOOWELL Logo"
          style={{
            width: '90px',
            height: '50px',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Başlık */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        paddingTop: '20px'
      }}>
        <h1 style={{
          color: '#FFD700',
          fontSize: '42px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
          letterSpacing: '2px'
        }}>
          SORU YÖNETİMİ
        </h1>
      </div>

      {/* Soru Tablosu */}
      <div style={{
        background: 'linear-gradient(135deg, #1a4040 0%, #2a5555 50%, #1a4040 100%)',
        borderRadius: '20px',
        padding: '20px',
        border: '3px solid #FFD700',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        {/* Tablo Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '2px',
          marginBottom: '10px'
        }}>
          {['VİDEO NO', 'SORU NO', 'SORU METNİ', 'A SEÇENEĞİ', 'B SEÇENEĞİ', 'C SEÇENEĞİ', 'DOĞRU CEVAP'].map((header, index) => (
            <div key={index} style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
              color: '#000',
              padding: '10px 5px',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              borderRadius: '5px'
            }}>
              {header}
            </div>
          ))}
        </div>

        {/* Tablo Content - Boş satırlar */}
        {Array.from({ length: 15 }, (_, rowIndex) => (
          <div key={rowIndex} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '2px',
            marginBottom: '2px'
          }}>
            {Array.from({ length: 7 }, (_, colIndex) => (
              <div key={colIndex} style={{
                backgroundColor: rowIndex % 2 === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)',
                padding: '10px 5px',
                textAlign: 'center',
                fontSize: '11px',
                borderRadius: '3px',
                minHeight: '25px'
              }}>
                {/* Boş hücre */}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Kaydet Butonu */}
      <div style={{
        textAlign: 'center',
        marginTop: '30px'
      }}>
        <button style={{
          background: 'linear-gradient(135deg, #28a745, #20c997)',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          padding: '15px 40px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
        }}>
          SORULARI KAYDET
        </button>
      </div>
    </div>
  );
};

export default AdminQuestionManagement;