import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const KisiselYonetim = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [personalData, setPersonalData] = useState({
    profile: {},
    settings: {},
    notifications: []
  });

  useEffect(() => {
    fetchPersonalData();
  }, []);

  const fetchPersonalData = async () => {
    try {
      setLoading(true);
      // API çağrısı yapılacak
      // const response = await axios.get('/api/personal-management', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      // setPersonalData(response.data);
      
      // Şimdilik örnek veri
      setPersonalData({
        profile: {
          name: user.first_name + ' ' + user.last_name,
          email: user.email,
          phone: user.phone || 'Belirtilmemiş',
          address: 'Adres bilgisi yok'
        },
        settings: {
          notifications: true,
          emailAlerts: true,
          smsAlerts: false
        },
        notifications: [
          { id: 1, message: 'Profil güncelleme hatırlatması', date: '2025-01-08' },
          { id: 2, message: 'Yeni komisyon ödemesi', date: '2025-01-07' }
        ]
      });
    } catch (error) {
      console.error('Personal data fetch error:', error);
    } finally {
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
        Kişisel veriler yükleniyor...
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

      {/* Ana Başlık */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        paddingTop: '20px'
      }}>
        <h1 style={{
          color: '#FFD700',
          fontSize: '48px',
          fontWeight: 'bold',
          margin: '0',
          textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
          letterSpacing: '2px',
          textDecoration: 'underline'
        }}>
          KİŞİSEL YÖNETİM PANELİ
        </h1>
      </div>

      {/* Ana İçerik */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Profil Bilgileri */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          border: '3px solid #FFD700'
        }}>
          <h3 style={{
            color: '#0e2323',
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center',
            borderBottom: '2px solid #FFD700',
            paddingBottom: '10px'
          }}>
            👤 PROFİL BİLGİLERİ
          </h3>
          
          <div style={{ fontSize: '14px', lineHeight: '2' }}>
            <div><strong>Ad Soyad:</strong> {personalData.profile.name}</div>
            <div><strong>E-posta:</strong> {personalData.profile.email}</div>
            <div><strong>Telefon:</strong> {personalData.profile.phone}</div>
            <div><strong>Adres:</strong> {personalData.profile.address}</div>
          </div>

          <button style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#FFD700',
            color: '#0e2323',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            marginTop: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}>
            Profili Düzenle
          </button>
        </div>

        {/* Bildirim Ayarları */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          border: '3px solid #FFD700'
        }}>
          <h3 style={{
            color: '#0e2323',
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center',
            borderBottom: '2px solid #FFD700',
            paddingBottom: '10px'
          }}>
            🔔 BİLDİRİM AYARLARI
          </h3>
          
          <div style={{ fontSize: '14px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '15px',
              padding: '10px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <span>E-posta Bildirimleri</span>
              <input type="checkbox" checked={personalData.settings.emailAlerts} readOnly />
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '15px',
              padding: '10px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <span>SMS Bildirimleri</span>
              <input type="checkbox" checked={personalData.settings.smsAlerts} readOnly />
            </div>
          </div>

          <button style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#FFD700',
            color: '#0e2323',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            marginTop: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}>
            Ayarları Kaydet
          </button>
        </div>

        {/* Son Bildirimler */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          border: '3px solid #FFD700'
        }}>
          <h3 style={{
            color: '#0e2323',
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center',
            borderBottom: '2px solid #FFD700',
            paddingBottom: '10px'
          }}>
            📢 SON BİLDİRİMLER
          </h3>
          
          <div style={{ fontSize: '13px' }}>
            {personalData.notifications.map((notification) => (
              <div key={notification.id} style={{
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                marginBottom: '10px',
                borderLeft: '4px solid #FFD700'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {notification.message}
                </div>
                <div style={{ color: '#666', fontSize: '11px' }}>
                  {notification.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KisiselYonetim;