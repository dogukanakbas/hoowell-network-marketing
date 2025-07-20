import React, { useState, useEffect, useCallback } from 'react';
// import { useAuth } from '../context/AuthContext'; // Şu an kullanılmıyor
import axios from 'axios';

const Dashboard = () => {
  // const { user } = useAuth(); // Şu an kullanılmıyor
  const [stats, setStats] = useState({
    liderlikHavuzu: 0,
    baskanlikHavuzu: 0,
    karPaylasimHavuzu: 0
  });

  // Dinamik tarih hesaplama
  const getNextMonthEnd = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return nextMonth.toLocaleDateString('tr-TR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch dashboard statistics
      const statsResponse = await axios.get('/api/dashboard/stats');
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div style={{ padding: '0' }}>
      {/* Üst Butonlar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        gap: '20px'
      }}>
        <a 
          href="/customer-registration"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--card-gray)',
            border: 'none',
            borderRadius: '15px',
            padding: '15px 25px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'var(--text-dark)',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s',
            textDecoration: 'none',
            textAlign: 'center',
            height: '60px'
          }}
        >
          Müşteri Kayıt Paneli
        </a>
        
        <div style={{
          backgroundColor: 'var(--primary-dark)',
          borderRadius: '15px',
          padding: '20px 40px',
          textAlign: 'center',
          minWidth: '200px',
          height: '60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ color: 'var(--accent-gold)', fontSize: '24px', fontWeight: 'bold' }}>
            HOOWELL
          </div>
          <div style={{ color: 'var(--white)', fontSize: '10px', marginTop: '2px' }}>
            INNOVATE YOUR LIFE
          </div>
        </div>
        
        <a 
          href="/partner-registration"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--card-gray)',
            border: 'none',
            borderRadius: '15px',
            padding: '15px 25px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'var(--text-dark)',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s',
            textDecoration: 'none',
            textAlign: 'center',
            height: '60px'
          }}
        >
          İş Ortağı Kayıt Paneli
        </a>
      </div>

      {/* Ana Havuz Kartları */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '25px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: 'var(--text-dark)', marginBottom: '10px', fontSize: '18px' }}>
            LİDERLİK HAVUZU
          </h3>
          <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '15px' }}>
            Bitiş Tarihi: {getNextMonthEnd()}
          </p>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: 'var(--text-dark)' 
          }}>
            ₺0
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '25px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: 'var(--text-dark)', marginBottom: '10px', fontSize: '18px' }}>
            BAŞKANLIK HAVUZU
          </h3>
          <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '15px' }}>
            Bitiş Tarihi: {getNextMonthEnd()}
          </p>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: 'var(--text-dark)' 
          }}>
            ₺0
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '25px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: 'var(--text-dark)', marginBottom: '10px', fontSize: '18px' }}>
            KAR PAYLAŞIMI HAVUZU
          </h3>
          <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '15px' }}>
            Promosyon Havuzu
          </p>
          <div style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#ffc107',
            marginBottom: '10px'
          }}>
            🚀 OCAK 2026'DA BAŞLAYACAKTIR
          </div>
          <p style={{ color: '#dc3545', fontSize: '12px', fontWeight: 'bold' }}>
            ⚠️ Yeni dönem promosyonu
          </p>
        </div>
      </div>

      {/* Alt İçerik Alanları */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gap: '20px' 
      }}>
        {/* Haberler */}
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '25px',
          minHeight: '300px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: 'var(--text-dark)', marginBottom: '20px' }}>HABERLER</h3>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--text-dark)', fontSize: '16px', marginBottom: '10px' }}>
              Yeni Dönem Başladı!
            </h4>
            <p style={{ color: 'var(--text-light)', fontSize: '14px', lineHeight: '1.5' }}>
              Mart ayı itibariyle yeni dönem başladı.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-dark)', fontSize: '16px', marginBottom: '10px' }}>
              Sistem Güncellemesi
            </h4>
            <p style={{ color: 'var(--text-light)', fontSize: '14px', lineHeight: '1.5' }}>
              Platformda performans iyileştirmeleri yapıldı.
            </p>
          </div>
        </div>

        {/* Video Paylaşım Alanı */}
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '25px',
          minHeight: '300px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: 'var(--text-dark)', marginBottom: '20px' }}>
            📹 PAYLAŞIM VİDEOLARI
          </h3>
          
          {/* Ürün Demo */}
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ color: 'var(--text-dark)', fontSize: '14px', marginBottom: '8px' }}>
              🎬 Ürün Demo Videosu
            </h4>
            <button
              onClick={() => {
                const shareText = "HOOWELL Ürün Demo - İnovatif ürünlerimizi keşfedin!";
                const shareUrl = "https://drive.google.com/file/d/demo-video-id/view";
                
                if (navigator.share) {
                  navigator.share({ title: shareText, url: shareUrl });
                } else {
                  navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                  alert('Link kopyalandı!');
                }
              }}
              style={{
                backgroundColor: 'var(--primary-dark)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 15px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              📤 Paylaş
            </button>
          </div>

          {/* İş Tanıtım */}
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ color: 'var(--text-dark)', fontSize: '14px', marginBottom: '8px' }}>
              💼 İş Tanıtım Videosu
            </h4>
            <button
              onClick={() => {
                const shareText = "HOOWELL İş Fırsatı - Hayalinizdeki işe sahip olun!";
                const shareUrl = "https://drive.google.com/file/d/business-intro-video-id/view";
                
                if (navigator.share) {
                  navigator.share({ title: shareText, url: shareUrl });
                } else {
                  navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                  alert('Link kopyalandı!');
                }
              }}
              style={{
                backgroundColor: 'var(--primary-dark)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 15px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              📤 Paylaş
            </button>
          </div>

          {/* Pazarlama Planı */}
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ color: 'var(--text-dark)', fontSize: '14px', marginBottom: '8px' }}>
              📈 Pazarlama Planı
            </h4>
            <button
              onClick={() => {
                const shareText = "HOOWELL Pazarlama Planı - Kazanç fırsatlarını keşfedin!";
                const shareUrl = "https://drive.google.com/file/d/marketing-plan-video-id/view";
                
                if (navigator.share) {
                  navigator.share({ title: shareText, url: shareUrl });
                } else {
                  navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                  alert('Link kopyalandı!');
                }
              }}
              style={{
                backgroundColor: 'var(--primary-dark)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 15px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '15px'
              }}
            >
              📤 Paylaş
            </button>
          </div>

          {/* Temel Eğitimler Butonu */}
          <div style={{
            backgroundColor: 'var(--primary-dark)',
            borderRadius: '10px',
            padding: '15px',
            marginTop: '20px'
          }}>
            <div style={{ color: 'var(--accent-gold)', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
              📚 TEMEL EĞİTİMLER
            </div>
            <p style={{ color: 'var(--white)', fontSize: '12px', marginBottom: '10px' }}>
              Sınavsız erişim - İstediğiniz zaman izleyin
            </p>
            <a 
              href="/education"
              style={{
                backgroundColor: 'var(--accent-gold)',
                color: 'var(--primary-dark)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 15px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              EĞİTİMLERE GİT
            </a>
          </div>
        </div>

        {/* Promosyonlar */}
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '25px',
          minHeight: '300px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: 'var(--text-dark)', marginBottom: '20px' }}>PROMOSYONLAR</h3>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--text-dark)', fontSize: '16px', marginBottom: '10px' }}>
              Mart Ayı Promosyonu
            </h4>
            <p style={{ color: 'var(--text-light)', fontSize: '14px', lineHeight: '1.5' }}>
              Mart ayında %10 ek kazanç fırsatı!
            </p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-dark)', fontSize: '16px', marginBottom: '10px' }}>
              Yeni Üye Bonusu
            </h4>
            <p style={{ color: 'var(--text-light)', fontSize: '14px', lineHeight: '1.5' }}>
              Her yeni üye için ekstra bonus!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;