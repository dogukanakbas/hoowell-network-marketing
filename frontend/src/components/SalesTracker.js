import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SalesTracker = () => {
  const { user } = useAuth();
  const [salesData, setSalesData] = useState({
    pendingSales: [],
    activeSales: [],
    monthlyActivity: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sales/tracker', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSalesData(response.data);
    } catch (error) {
      console.error('Sales data fetch error:', error);
      // Hata durumunda boş veri göster
      setSalesData({
        pendingSales: [],
        activeSales: [],
        monthlyActivity: false
      });
    } finally {
      setLoading(false);
    }
  };

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
            width: '120px',
            height: '70px',
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
          SATIŞ TAKİP PANELİ
        </h1>
      </div>

      {/* Ana Container */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        border: '3px solid #FFD700',
        minHeight: loading ? '400px' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        
        {/* Loading Overlay */}
        {loading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'var(--primary-dark)',
            fontSize: '20px',
            fontWeight: 'bold',
            zIndex: 10
          }}>
            Satış verileri yükleniyor...
          </div>
        )}
        
        {/* Bekleme Odası */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            backgroundColor: '#0f2323',
            color: 'white',
            padding: '15px',
            borderRadius: '10px 10px 0 0',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            BEKLEME ODASI
          </div>
          
          <div style={{
            backgroundColor: 'white',
            border: '2px solid #0f2323',
            borderTop: 'none',
            borderRadius: '0 0 10px 10px',
            overflow: 'hidden'
          }}>
            {/* Tablo Başlıkları */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
              backgroundColor: '#cc9900',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              <div style={{ 
                padding: '15px', 
                textAlign: 'center', 
                borderRight: '1px solid rgba(255,255,255,0.3)',
                backgroundColor: '#cc9900'
              }}>
                ADI SOYADI
              </div>
              <div style={{ 
                padding: '15px', 
                textAlign: 'center', 
                borderRight: '1px solid rgba(255,255,255,0.3)',
                backgroundColor: '#cc9900'
              }}>
                SATILAN ÜRÜN
              </div>
              <div style={{ 
                padding: '15px', 
                textAlign: 'center', 
                borderRight: '1px solid rgba(255,255,255,0.3)',
                backgroundColor: '#cc9900'
              }}>
                SATIŞ TARİHİ
              </div>
              <div style={{ 
                padding: '15px', 
                textAlign: 'center', 
                borderRight: '1px solid rgba(255,255,255,0.3)',
                backgroundColor: '#cc9900'
              }}>
                BONUS TARİHİ
              </div>
              <div style={{ 
                padding: '15px', 
                textAlign: 'center',
                backgroundColor: '#cc9900'
              }}>
                KAZANILAN KOMİSYON
              </div>
            </div>
            
            {/* Bekleme Odası Verileri */}
            <div style={{ minHeight: '60px' }}>
              {loading ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px',
                  fontSize: '16px',
                  color: '#666'
                }}>
                  Veriler yükleniyor...
                </div>
              ) : salesData.pendingSales.length === 0 ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px',
                  fontSize: '16px',
                  color: '#666'
                }}>
                  Bekleme odasında satış bulunmamaktadır.
                </div>
              ) : (
                salesData.pendingSales.map((sale) => (
                  <div key={sale.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                    borderBottom: '1px solid #eee'
                  }}>
                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: '#333'
                    }}>
                      {sale.customer_name}
                    </div>
                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: '#333'
                    }}>
                      {sale.product_name}
                    </div>
                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: '#333'
                    }}>
                      {new Date(sale.sale_date).toLocaleDateString('tr-TR')}
                    </div>
                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: '#333'
                    }}>
                      {new Date(sale.bonus_date).toLocaleDateString('tr-TR')}
                    </div>
                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: '#333',
                      fontWeight: 'bold'
                    }}>
                      ₺{sale.bonus_amount?.toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Ay İçinde Gerçekleşen Satışlar */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            backgroundColor: '#0f2323',
            color: 'white',
            padding: '15px',
            borderRadius: '10px 10px 0 0',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            AY İÇİNDE GERÇEKLEŞEN SATIŞLAR
          </div>
          
          <div style={{
            backgroundColor: 'white',
            border: '2px solid #0f2323',
            borderTop: 'none',
            borderRadius: '0 0 10px 10px',
            overflow: 'hidden'
          }}>
            {/* Tablo Başlıkları */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
              backgroundColor: '#cc9900',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              <div style={{ 
                padding: '15px', 
                textAlign: 'center', 
                borderRight: '1px solid rgba(255,255,255,0.3)',
                backgroundColor: '#cc9900'
              }}>
                ADI SOYADI
              </div>
              <div style={{ 
                padding: '15px', 
                textAlign: 'center', 
                borderRight: '1px solid rgba(255,255,255,0.3)',
                backgroundColor: '#cc9900'
              }}>
                SATILAN ÜRÜN
              </div>
              <div style={{ 
                padding: '15px', 
                textAlign: 'center', 
                borderRight: '1px solid rgba(255,255,255,0.3)',
                backgroundColor: '#cc9900'
              }}>
                SATIŞ TARİHİ
              </div>
              <div style={{ 
                padding: '15px', 
                textAlign: 'center', 
                borderRight: '1px solid rgba(255,255,255,0.3)',
                backgroundColor: '#cc9900'
              }}>
                KAZANILAN KOMİSYON
              </div>
              <div style={{ 
                padding: '15px', 
                textAlign: 'center',
                backgroundColor: '#cc9900'
              }}>
                ÖDEME DURUMU
              </div>
            </div>
            
            {/* Aktif Satış Verileri */}
            <div style={{ minHeight: '60px' }}>
              {loading ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px',
                  fontSize: '16px',
                  color: '#666'
                }}>
                  Veriler yükleniyor...
                </div>
              ) : salesData.activeSales.length === 0 ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px',
                  fontSize: '16px',
                  color: '#666'
                }}>
                  Bu ay gerçekleşen satış bulunmamaktadır.
                </div>
              ) : (
                salesData.activeSales.map((sale) => (
                  <div key={sale.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                    borderBottom: '1px solid #eee'
                  }}>
                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: '#333'
                    }}>
                      {sale.customer_name}
                    </div>
                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: '#333'
                    }}>
                      {sale.product_name}
                    </div>
                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: '#333'
                    }}>
                      {new Date(sale.sale_date).toLocaleDateString('tr-TR')}
                    </div>
                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: '#333',
                      fontWeight: 'bold'
                    }}>
                      ₺{sale.bonus_amount?.toLocaleString()}
                    </div>
                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: '#333'
                    }}>
                      <span style={{
                        backgroundColor: sale.status === 'active' ? '#28a745' : '#ffc107',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {sale.status === 'active' ? 'Ödendi' : 'Bekliyor'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Aylık Aktiflik Kontrolü */}
        <div style={{
          backgroundColor: '#0f2323',
          borderRadius: '15px',
          padding: '30px',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '30px',
            margin: '0 0 30px 0'
          }}>
            AYLIK AKTİFLİK KONTROLÜ
          </h3>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '60px',
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            {/* HAYIR Butonu */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#DC143C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '15px',
                boxShadow: '0 5px 15px rgba(220, 20, 60, 0.4)',
                opacity: salesData.monthlyActivity ? 0.3 : 1,
                filter: salesData.monthlyActivity ? 'blur(2px)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                HAYIR
              </div>
            </div>

            {/* EVET Butonu */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#28a745',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '15px',
                boxShadow: '0 5px 15px rgba(40, 167, 69, 0.4)',
                opacity: !salesData.monthlyActivity ? 0.3 : 1,
                filter: !salesData.monthlyActivity ? 'blur(2px)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                EVET
              </div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '20px',
            color: 'white',
            fontSize: '16px',
            lineHeight: '1.6',
            textAlign: 'left'
          }}>
            <p style={{ margin: '0 0 10px 0', textAlign: 'center', fontWeight: 'bold' }}>
              İş Ortağının o ay içinde AKTİF olması için ya ŞAHSİ olarak en az 1 adet ÜRÜN satması
            </p>
            <p style={{ margin: '0 0 10px 0', textAlign: 'center', fontWeight: 'bold' }}>
              Ya da Kendisinin bulduğu YENİ BİR İŞ ORTAĞININ ilk SATIŞINI yapması gerekir.
            </p>
            <p style={{ margin: '0', textAlign: 'center', fontSize: '14px', opacity: 0.9 }}>
              Satışlar 15. günde AKTİFLEŞTİKTEN sonra aktiflik kotanıza sayılacaktır.
            </p>
          </div>
        </div>
      </div>


    </div>
  );
};

export default SalesTracker;