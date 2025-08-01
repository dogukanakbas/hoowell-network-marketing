import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const KarPaylasimi = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profitData, setProfitData] = useState({
    salesChampions: {
      pool_amount: 0,
      personal_sales: 0,
      career_promotions: 0,
      total_points: 0,
      target_points: 50,
      remaining_points: 50,
      is_qualified: false
    },
    partnershipChampions: {
      pool_amount: 0,
      active_partners: 0,
      career_promotions: 0,
      total_points: 0,
      target_points: 25,
      remaining_points: 25,
      is_qualified: false
    },
    yearLeaders: {
      pool_amount: 0,
      personal_sales: 0,
      active_partners: 0,
      career_promotions: 0,
      total_points: 0,
      target_points: 75,
      remaining_points: 75,
      is_qualified: false
    },
    yearly_revenue: 0,
    current_year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchProfitData();
  }, []);

  const fetchProfitData = async () => {
    try {
      const response = await axios.get('/api/profit-sharing/data', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProfitData(response.data);
    } catch (error) {
      console.error('Profit sharing data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcının erişim yetkisini kontrol et (Gold ve üzeri)
  const hasAccess = () => {
    const allowedLevels = ['gold', 'star_leader', 'super_star_leader', 'presidents_team', 'country_distributor'];
    return allowedLevels.includes(user?.career_level);
  };

  // Yılın En İyi Liderleri için erişim kontrolü (Star Leader ve üzeri)
  const hasLeaderAccess = () => {
    const allowedLevels = ['star_leader', 'super_star_leader', 'presidents_team'];
    return allowedLevels.includes(user?.career_level);
  };

  // Erişim yetkisi yoksa kısıtlama sayfası göster
  if (!hasAccess()) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0e2323 0%, #1a3333 50%, #0e2323 100%)',
        padding: '20px',
        margin: '0 -20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '600px',
          border: '3px solid #FFD700'
        }}>
          <div style={{
            fontSize: '80px',
            marginBottom: '20px'
          }}>
            💰
          </div>
          
          <h2 style={{
            color: '#FFD700',
            fontSize: '32px',
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            KAR PAYLAŞIMI HAVUZLARI
          </h2>
          
          <div style={{
            backgroundColor: '#fff3cd',
            border: '2px solid #ffeaa7',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '25px'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#856404',
              marginBottom: '15px'
            }}>
              🚫 ERİŞİM KISITLI
            </div>
            <p style={{
              color: '#856404',
              fontSize: '18px',
              lineHeight: '1.6',
              margin: 0
            }}>
              Bu sayfaya erişmek için <strong>GOLD İŞ ORTAĞI</strong> veya daha yüksek kariyer seviyesine ulaşmanız gerekiyor.
            </p>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '15px',
            padding: '25px',
            marginBottom: '25px'
          }}>
            <h4 style={{
              color: '#0e2323',
              marginBottom: '15px',
              fontSize: '18px'
            }}>
              📊 Mevcut Durumunuz:
            </h4>
            
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#dc3545',
              marginBottom: '10px'
            }}>
              Kariyer Seviyeniz: {user?.career_level?.toUpperCase() || 'BRONZE'}
            </div>
            
            <div style={{
              color: '#6c757d',
              fontSize: '16px'
            }}>
              Gerekli Seviye: GOLD İŞ ORTAĞI veya üzeri
            </div>
          </div>

          <div style={{
            color: '#0e2323',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Kariyer seviyenizi yükseltmek için satış yapın ve takım oluşturun! 🚀
          </div>
        </div>
      </div>
    );
  }

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
        Kar paylaşımı verileri yükleniyor...
      </div>
    );
  }

  // Kart bileşeni
  const ProfitCard = ({ title, data, isLeaderCard = false }) => {
    // Lider kartı için erişim kontrolü
    if (isLeaderCard && !hasLeaderAccess()) {
      return (
        <div style={{
          background: 'linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 50%, #e8e8e8 100%)',
          borderRadius: '20px',
          padding: '25px',
          minWidth: '350px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          border: '3px solid #ccc',
          opacity: 0.5
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
            borderRadius: '15px',
            padding: '15px',
            textAlign: 'center',
            color: '#FFD700',
            fontWeight: 'bold',
            fontSize: '16px',
            marginBottom: '20px',
            border: '2px solid #FFD700'
          }}>
            {title}
          </div>
          
          <div style={{
            textAlign: 'center',
            color: '#dc3545',
            fontSize: '16px',
            fontWeight: 'bold',
            padding: '40px 20px'
          }}>
            🔒 STAR LİDER SEVİYESİ GEREKLİ
          </div>
        </div>
      );
    }

    return (
      <div style={{
        background: 'linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 50%, #e8e8e8 100%)',
        borderRadius: '20px',
        padding: '25px',
        minWidth: '350px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        border: '3px solid #ccc'
      }}>
        {/* Başlık */}
        <div style={{
          background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
          borderRadius: '15px',
          padding: '15px',
          textAlign: 'center',
          color: '#FFD700',
          fontWeight: 'bold',
          fontSize: '16px',
          marginBottom: '20px',
          border: '2px solid #FFD700'
        }}>
          {title}
        </div>

        {/* Aktivasyon Puanı */}
        <div style={{
          background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
          borderRadius: '10px',
          padding: '10px',
          textAlign: 'center',
          color: '#FFD700',
          fontWeight: 'bold',
          fontSize: '14px',
          marginBottom: '15px'
        }}>
          AKTİVASYON PUANI TAKİBİ<br />
          HEDEF = {data.target_points} PUAN
        </div>

        {/* Tablo */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '5px',
          marginBottom: '15px'
        }}>
          {/* Başlık Satırı */}
          <div style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
            borderRadius: '8px',
            padding: '8px',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '12px',
            textAlign: 'center'
          }}>
            AKTİVİTE
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
            borderRadius: '8px',
            padding: '8px',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '12px',
            textAlign: 'center'
          }}>
            YAPILAN
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
            borderRadius: '8px',
            padding: '8px',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '12px',
            textAlign: 'center'
          }}>
            PUAN
          </div>

          {/* Şahsi Satış (Satış Şampiyonları ve Yılın En İyi Liderleri için) */}
          {(title === 'SATIŞ ŞAMPİYONLARI' || title === 'YILIN EN İYİ LİDERLERİ') && (
            <>
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #ccc',
                borderRadius: '8px',
                padding: '8px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                ŞAHSİ SATIŞ
              </div>
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #ccc',
                borderRadius: '8px',
                padding: '8px',
                textAlign: 'center',
                fontSize: '11px'
              }}>
                {data.personal_sales}
              </div>
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #ccc',
                borderRadius: '8px',
                padding: '8px',
                textAlign: 'center',
                fontSize: '11px'
              }}>
                {data.personal_sales}
              </div>
            </>
          )}

          {/* İş Ortağı (Ortak Bulma Şampiyonları ve Yılın En İyi Liderleri için) */}
          {(title === 'ORTAK BULMA ŞAMPİYONLARI' || title === 'YILIN EN İYİ LİDERLERİ') && (
            <>
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #ccc',
                borderRadius: '8px',
                padding: '8px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                İŞ ORTAĞI
              </div>
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #ccc',
                borderRadius: '8px',
                padding: '8px',
                textAlign: 'center',
                fontSize: '11px'
              }}>
                {data.active_partners}
              </div>
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #ccc',
                borderRadius: '8px',
                padding: '8px',
                textAlign: 'center',
                fontSize: '11px'
              }}>
                {title === 'YILIN EN İYİ LİDERLERİ' ? data.active_partners * 2 : data.active_partners}
              </div>
            </>
          )}

          {/* Kariyer Puanı */}
          <div style={{
            backgroundColor: 'white',
            border: '2px solid #ccc',
            borderRadius: '8px',
            padding: '8px',
            textAlign: 'center',
            fontSize: '11px',
            fontWeight: 'bold'
          }}>
            KARİYER PUANI
          </div>
          <div style={{
            backgroundColor: 'white',
            border: '2px solid #ccc',
            borderRadius: '8px',
            padding: '8px',
            textAlign: 'center',
            fontSize: '11px'
          }}>
            {data.career_promotions}
          </div>
          <div style={{
            backgroundColor: 'white',
            border: '2px solid #ccc',
            borderRadius: '8px',
            padding: '8px',
            textAlign: 'center',
            fontSize: '11px'
          }}>
            {data.career_promotions * 10}
          </div>

          {/* Toplam Puan */}
          <div style={{
            backgroundColor: 'white',
            border: '2px solid #ccc',
            borderRadius: '8px',
            padding: '8px',
            textAlign: 'center',
            fontSize: '11px',
            fontWeight: 'bold'
          }}>
            TOPLAM PUAN
          </div>
          <div style={{
            backgroundColor: 'white',
            border: '2px solid #ccc',
            borderRadius: '8px',
            padding: '8px',
            textAlign: 'center',
            fontSize: '11px'
          }}>
            {data.total_points}
          </div>
          <div style={{
            backgroundColor: 'white',
            border: '2px solid #ccc',
            borderRadius: '8px',
            padding: '8px',
            textAlign: 'center',
            fontSize: '11px'
          }}>
            -
          </div>

          {/* Hedef Puan */}
          <div style={{
            backgroundColor: 'white',
            border: '2px solid #ccc',
            borderRadius: '8px',
            padding: '8px',
            textAlign: 'center',
            fontSize: '11px',
            fontWeight: 'bold'
          }}>
            HEDEF PUAN
          </div>
          <div style={{
            backgroundColor: 'white',
            border: '2px solid #ccc',
            borderRadius: '8px',
            padding: '8px',
            textAlign: 'center',
            fontSize: '11px'
          }}>
            {data.target_points}
          </div>
          <div style={{
            backgroundColor: 'white',
            border: '2px solid #ccc',
            borderRadius: '8px',
            padding: '8px',
            textAlign: 'center',
            fontSize: '11px'
          }}>
            -
          </div>

          {/* Kalan Puan */}
          <div style={{
            backgroundColor: 'white',
            border: '2px solid #ccc',
            borderRadius: '8px',
            padding: '8px',
            textAlign: 'center',
            fontSize: '11px',
            fontWeight: 'bold'
          }}>
            KALAN PUAN
          </div>
          <div style={{
            backgroundColor: 'white',
            border: '2px solid #ccc',
            borderRadius: '8px',
            padding: '8px',
            textAlign: 'center',
            fontSize: '11px'
          }}>
            {Math.max(0, data.remaining_points)}
          </div>
          <div style={{
            backgroundColor: 'white',
            border: '2px solid #ccc',
            borderRadius: '8px',
            padding: '8px',
            textAlign: 'center',
            fontSize: '11px'
          }}>
            -
          </div>
        </div>

        {/* Logo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '15px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: data.is_qualified 
              ? 'linear-gradient(135deg, #28a745, #20c997)' 
              : 'linear-gradient(135deg, #dc3545, #c82333)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            {data.is_qualified ? '✅' : '🎯'}
          </div>
        </div>

        {/* Durum Mesajı */}
        <div style={{
          textAlign: 'center',
          color: data.is_qualified ? '#28a745' : '#dc3545',
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '15px'
        }}>
          {data.is_qualified 
            ? `TEBRİKLER ${profitData.current_year} YILI KAR PAYLAŞIMINI\nBU KATEGORİDE KAZANDINIZ !`
            : `${data.remaining_points} PUAN DAHA TOPLAYARAK\nBU KATEGORİYE GİREBİLİRSİNİZ !`
          }
        </div>

        {/* Havuz Bilgisi */}
        <div style={{
          background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
          borderRadius: '15px',
          padding: '15px',
          textAlign: 'center',
          color: '#FFD700',
          fontWeight: 'bold'
        }}>
          <div style={{ fontSize: '12px', marginBottom: '5px' }}>
            HAVUZDA TOPLANAN PARA
          </div>
          <div style={{ fontSize: '10px', marginBottom: '10px' }}>
            Başlangıç Tarihi : 01.01.{profitData.current_year}<br />
            Bitiş Tarihi : 31.12.{profitData.current_year}
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
            {data.pool_amount.toFixed(3)} $
          </div>
        </div>
      </div>
    );
  };

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
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          borderRadius: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 5px 15px rgba(255, 215, 0, 0.4)',
          border: '2px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#0e2323',
            textAlign: 'center',
            lineHeight: '1.2'
          }}>
            <div>HOOWELL</div>
            <div style={{ fontSize: '8px' }}>INNOVATE YOUR LIFE</div>
          </div>
        </div>
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
          KAR PAYLAŞIMI HAVUZLARI
        </h1>
      </div>

      {/* Ana Kartlar */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        flexWrap: 'wrap',
        marginBottom: '40px'
      }}>
        <ProfitCard 
          title="SATIŞ ŞAMPİYONLARI" 
          data={profitData.salesChampions} 
        />
        <ProfitCard 
          title="ORTAK BULMA ŞAMPİYONLARI" 
          data={profitData.partnershipChampions} 
        />
        <ProfitCard 
          title="YILIN EN İYİ LİDERLERİ" 
          data={profitData.yearLeaders}
          isLeaderCard={true}
        />
      </div>

      {/* Alt Bilgi */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        border: '3px solid #FFD700'
      }}>
        <div style={{
          color: '#FFD700',
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          KAR PAYLAŞIMI HAVUZU SİSTEMİ
        </div>
        <div style={{
          color: '#000',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          <p><strong>Satış Şampiyonları:</strong> Yıllık cironun %0.5'i, minimum 50 puan gerekli</p>
          <p><strong>Ortak Bulma Şampiyonları:</strong> Yıllık cironun %0.5'i, minimum 25 puan gerekli</p>
          <p><strong>Yılın En İyi Liderleri:</strong> Yıllık cironun %1.0'i, minimum 75 puan gerekli (Star Leader+)</p>
          <p><strong>Puan Sistemi:</strong> 1 Satış = 1 Puan, 1 İş Ortağı = 1-2 Puan, 1 Kariyer Atlama = 10 Puan</p>
          <p><strong>Ödeme:</strong> Her yıl 1 Şubat'ta hesaplara yansır, 15 Şubat'ta ödenir</p>
        </div>
      </div>

      {/* Alt Sağ Logo */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 10
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          borderRadius: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 5px 15px rgba(255, 215, 0, 0.4)',
          border: '2px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#0e2323',
            textAlign: 'center',
            lineHeight: '1.1'
          }}>
            <div>HOOWELL</div>
            <div style={{ fontSize: '8px' }}>BİLGİ</div>
            <div style={{ fontSize: '8px' }}>BANKASI</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KarPaylasimi;