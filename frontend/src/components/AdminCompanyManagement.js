import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCompanyManagement = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      // API'den şirket verilerini çek
      setLoading(false);
    } catch (error) {
      console.error('Şirket verileri yüklenirken hata:', error);
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
        Şirket verileri yükleniyor...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0e2323 0%, #1a3333 50%, #0e2323 100%)',
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
          ŞİRKET YÖNETİMİ
        </h1>
      </div>

      {/* Arama Kutusu */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px'
      }}>
        <input
          type="text"
          placeholder="Şirket ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            borderRadius: '25px',
            border: '2px solid #FFD700',
            backgroundColor: 'white',
            width: '400px',
            textAlign: 'center'
          }}
        />
      </div>

      {/* Şirket Tablosu */}
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
          gridTemplateColumns: 'repeat(10, 1fr)',
          gap: '2px',
          marginBottom: '10px'
        }}>
          {['ID NUMARASI', 'ADI SOYADI', 'SPONSOR ID', 'TELEFON NUMARASI', 'Email Adresi', 'İL', 'SATIŞ', 'TOPLAM KKP', 'TOPLAM İŞ ORTAĞI', 'KARİYER SEVİYESİ', 'AKTİFLİK DURUMU'].map((header, index) => (
            <div key={index} style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
              color: '#000',
              padding: '8px 4px',
              textAlign: 'center',
              fontSize: '10px',
              fontWeight: 'bold',
              borderRadius: '5px'
            }}>
              {header}
            </div>
          ))}
        </div>

        {/* Tablo Content - Boş satırlar */}
        {Array.from({ length: 10 }, (_, rowIndex) => (
          <div key={rowIndex} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            gap: '2px',
            marginBottom: '2px'
          }}>
            {Array.from({ length: 10 }, (_, colIndex) => (
              <div key={colIndex} style={{
                backgroundColor: rowIndex % 2 === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '11px',
                borderRadius: '3px',
                minHeight: '20px'
              }}>
                {/* Boş hücre */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCompanyManagement;