import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    liderlikHavuzu: 12000,
    baskanlikHavuzu: 8000,
    karPaylasimHavuzu: 5000
  });
  // const [news, setNews] = useState([]);
  // const [videos, setVideos] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch dashboard statistics
      const statsResponse = await axios.get('/api/dashboard/stats');
      setStats(statsResponse.data);

      // Fetch news
      // const newsResponse = await axios.get('/api/news');
      // setNews(newsResponse.data);

      // Fetch videos if user has access
      // if (user.payment_confirmed) {
      //   const videosResponse = await axios.get('/api/videos');
      //   setVideos(videosResponse.data);
      // }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getStatusMessage = () => {
    if (!user.payment_confirmed) {
      return {
        title: "Ödeme Bekleniyor",
        message: "Eğitimlere başlamak için ödemenizi yapmanız gerekmektedir.",
        action: "Ödeme Yap",
        link: "/payment"
      };
    } else if (!user.education_completed) {
      return {
        title: "Eğitim Süreci",
        message: "Backoffice erişimi için eğitimlerinizi tamamlamanız gerekmektedir.",
        action: "Eğitimlere Git",
        link: "/education"
      };
    } else {
      return {
        title: "Hoş Geldiniz!",
        message: "Tüm sistemlere erişiminiz bulunmaktadır.",
        action: null,
        link: null
      };
    }
  };

  const status = getStatusMessage();

  return (
    <div>
      {/* Sponsor ID Kartı */}
      <div className="dashboard-card" style={{ marginBottom: '20px', backgroundColor: '#f8f9fa', border: '2px solid #007bff' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h3 style={{ color: '#007bff', marginBottom: '10px' }}>Sponsor ID'niz</h3>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#007bff',
            fontFamily: 'monospace',
            letterSpacing: '2px',
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '10px',
            border: '2px dashed #007bff'
          }}>
            {user.sponsor_id || 'Henüz Atanmamış'}
          </div>
          <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
            Bu ID'yi referans olarak kullanabilirsiniz
          </p>
        </div>
      </div>

      {/* Status Card */}
      <div className="dashboard-card" style={{ marginBottom: '30px', textAlign: 'left' }}>
        <h3>{status.title}</h3>
        <p style={{ margin: '15px 0', color: '#666' }}>{status.message}</p>
        {status.action && (
          <a href={status.link} className="btn btn-primary">
            {status.action}
          </a>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>LİDERLİK HAVUZU</h3>
          <div className="date">Bitiş Tarihi: 31.03.2025</div>
          <div className="amount">₺{stats.liderlikHavuzu?.toLocaleString()}</div>
        </div>
        
        <div className="dashboard-card">
          <h3>BAŞKANLIK HAVUZU</h3>
          <div className="date">Bitiş Tarihi: 31.03.2025</div>
          <div className="amount">₺{stats.baskanlikHavuzu?.toLocaleString()}</div>
        </div>
        
        <div className="dashboard-card">
          <h3>KAR PAYLAŞIMI HAVUZU</h3>
          <div className="date">Bitiş Tarihi: 31.03.2025</div>
          <div className="amount">₺{stats.karPaylasimHavuzu?.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* News Section */}
        <div className="dashboard-card" style={{ textAlign: 'left' }}>
          <h3>HABERLER</h3>
          <div style={{ marginTop: '20px' }}>
            <h4>Yeni Dönem Başladı!</h4>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
              Mart ayı itibariyle yeni dönem başladı.
            </p>
            
            <h4>Sistem Güncellemesi</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Platformda performans iyileştirmeleri yapıldı.
            </p>
          </div>
        </div>

        {/* Videos Section */}
        <div className="dashboard-card" style={{ textAlign: 'left' }}>
          {user.payment_confirmed ? (
            <>
              <h3>ÇALIŞIRKEN KULLANILACAK VİDEOLAR</h3>
              <div style={{ marginTop: '20px' }}>
                <h4>İş Tanıtım Programı</h4>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                  Bu video, işin genel tanıtımını ve temel prensiplerini anlatır.
                </p>
                
                <div style={{ 
                  backgroundColor: '#1a4a3a', 
                  color: 'white', 
                  padding: '40px', 
                  borderRadius: '10px',
                  textAlign: 'center',
                  marginBottom: '15px'
                }}>
                  <div style={{ fontSize: '48px', color: '#FFD700', marginBottom: '10px' }}>⚙️</div>
                  <h4 style={{ color: '#FFD700' }}>HOOWELL</h4>
                  <p style={{ fontSize: '12px' }}>İŞ TANITIM PROGRAMI</p>
                  <p style={{ fontSize: '10px', marginTop: '10px' }}>INNOVATE YOUR LIFE</p>
                </div>

                <h4>Kazanç ve Pazarlama Planı</h4>
                <p style={{ color: '#666', fontSize: '14px' }}>
                  Bu video, kazanç modellerinin planlarının detaylarını açıklar.
                </p>
              </div>
            </>
          ) : (
            <>
              <h3>PROMOSYONLAR</h3>
              <div style={{ marginTop: '20px' }}>
                <h4>Mart Ayı Promosyonu</h4>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                  Mart ayında %10 ek kazanç fırsatı!
                </p>
                
                <h4>Yeni Üye Bonusu</h4>
                <p style={{ color: '#666', fontSize: '14px' }}>
                  Her yeni üye için ekstra bonus!
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;