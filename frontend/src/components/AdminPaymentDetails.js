import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPaymentDetails = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('gunluk');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('AY SEÇİN');
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      // API'den ödeme verilerini çek
      setLoading(false);
    } catch (error) {
      console.error('Ödeme verileri yüklenirken hata:', error);
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
        Ödeme verileri yükleniyor...
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
          ÖDEME DETAYLARI
        </h1>
      </div>

      {/* Filtre Alanları */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <input
          type="text"
          placeholder="Ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            borderRadius: '25px',
            border: '2px solid #FFD700',
            backgroundColor: 'white',
            width: '200px'
          }}
        />
        <button style={{
          padding: '12px 20px',
          fontSize: '16px',
          borderRadius: '25px',
          border: '2px solid #FFD700',
          backgroundColor: 'white',
          cursor: 'pointer'
        }}>
          GÜN SEÇİN
        </button>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            borderRadius: '25px',
            border: '2px solid #FFD700',
            backgroundColor: 'white',
            width: '150px'
          }}
        >
          <option value="AY SEÇİN">AY SEÇİN</option>
          <option value="OCAK">OCAK</option>
          <option value="ŞUBAT">ŞUBAT</option>
          <option value="MART">MART</option>
          <option value="NİSAN">NİSAN</option>
          <option value="MAYIS">MAYIS</option>
          <option value="HAZİRAN">HAZİRAN</option>
          <option value="TEMMUZ">TEMMUZ</option>
          <option value="AĞUSTOS">AĞUSTOS</option>
          <option value="EYLÜL">EYLÜL</option>
          <option value="EKİM">EKİM</option>
          <option value="KASIM">KASIM</option>
          <option value="ARALIK">ARALIK</option>
        </select>
      </div>

      {/* Tab Butonları */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <button
          onClick={() => setActiveTab('gunluk')}
          style={{
            background: activeTab === 'gunluk' 
              ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
              : 'linear-gradient(135deg, #2a2a2a, #404040)',
            color: activeTab === 'gunluk' ? '#000' : '#FFD700',
            border: '2px solid #FFD700',
            borderRadius: '15px',
            padding: '12px 30px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}
        >
          FRANCHİSE SATIŞI
        </button>
        <button
          onClick={() => setActiveTab('aylik')}
          style={{
            background: activeTab === 'aylik' 
              ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
              : 'linear-gradient(135deg, #2a2a2a, #404040)',
            color: activeTab === 'aylik' ? '#000' : '#FFD700',
            border: '2px solid #FFD700',
            borderRadius: '15px',
            padding: '12px 30px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}
        >
          CİHAZ SATIŞI
        </button>
      </div>

      {/* Ödeme Tablosu */}
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
          gridTemplateColumns: activeTab === 'gunluk' 
            ? 'repeat(7, 1fr)' 
            : 'repeat(8, 1fr)',
          gap: '2px',
          marginBottom: '10px'
        }}>
          {activeTab === 'gunluk' ? 
            ['MÜŞTERİ NUMARASI', 'ADI SOYADI', 'TELEFON NUMARASI', 'Email Adresi', 'YAŞADIĞI ŞEHİR', 'ÖDEME KREDİ KARTI', 'ÖDEME BANKA EFT', 'BANKA ONAYI'].map((header, index) => (
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
            )) :
            ['ID NUMARASI', 'ADI SOYADI', 'TELEFON NUMARASI', 'SPONSOR ID NUMARASI', 'SPONSOR ADI SOYADI', 'ÖDEME KREDİ KARTI', 'ÖDEME BANKA EFT', 'BANKA ONAYI'].map((header, index) => (
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
            ))
          }
        </div>

        {/* Tablo Content - Boş satırlar */}
        {Array.from({ length: 8 }, (_, rowIndex) => (
          <div key={rowIndex} style={{
            display: 'grid',
            gridTemplateColumns: activeTab === 'gunluk' 
              ? 'repeat(7, 1fr)' 
              : 'repeat(8, 1fr)',
            gap: '2px',
            marginBottom: '2px'
          }}>
            {Array.from({ length: activeTab === 'gunluk' ? 7 : 8 }, (_, colIndex) => (
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

export default AdminPaymentDetails;