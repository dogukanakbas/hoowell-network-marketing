import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SalesTracker = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products'); // 'products' veya 'franchise'
  const [salesData, setSalesData] = useState({
    pendingSales: [],
    activeSales: [],
    monthlyActivity: false
  });
  const [franchiseData, setFranchiseData] = useState({
    pendingFranchises: [],
    activeFranchises: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
    fetchFranchiseData();
  }, []);

  useEffect(() => {
    if (activeTab === 'franchise') {
      fetchFranchiseData();
    }
  }, [activeTab]);

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

  const fetchFranchiseData = async () => {
    try {
      const response = await axios.get('/api/sales/franchise-tracker', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFranchiseData(response.data);
    } catch (error) {
      console.error('Franchise data fetch error:', error);
      setFranchiseData({
        pendingFranchises: [],
        activeFranchises: []
      });
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

      {/* Tab Butonları - Ana Container Üstünde */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={() => setActiveTab('products')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: activeTab === 'products' ? '#FFD700' : '#333',
            color: activeTab === 'products' ? '#000' : '#FFD700',
            border: '2px solid #FFD700',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'products') {
              e.target.style.backgroundColor = '#555';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'products') {
              e.target.style.backgroundColor = '#333';
            }
          }}
        >
          ÜRÜN SATIŞLARI
        </button>
        
        <button
          onClick={() => setActiveTab('franchise')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: activeTab === 'franchise' ? '#FFD700' : '#333',
            color: activeTab === 'franchise' ? '#000' : '#FFD700',
            border: '2px solid #FFD700',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'franchise') {
              e.target.style.backgroundColor = '#555';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'franchise') {
              e.target.style.backgroundColor = '#333';
            }
          }}
        >
          FRANCHISE SATIŞLARI
        </button>
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

        {/* Ürün Satışları Tab */}
        {activeTab === 'products' && (
          <>
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
              <img 
                src="/images/buttons/hayır.png" 
                alt="HAYIR" 
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  marginBottom: '15px',
                  opacity: salesData.monthlyActivity ? 0.3 : 1,
                  filter: salesData.monthlyActivity ? 'blur(2px)' : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!salesData.monthlyActivity) {
                    e.target.style.transform = 'scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>

            {/* EVET Butonu */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <img 
                src="/images/buttons/evet.png" 
                alt="EVET" 
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  marginBottom: '15px',
                  opacity: !salesData.monthlyActivity ? 0.3 : 1,
                  filter: !salesData.monthlyActivity ? 'blur(2px)' : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (salesData.monthlyActivity) {
                    e.target.style.transform = 'scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              />
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
            </>
          )}

          {/* Franchise Satışları Tab */}
          {activeTab === 'franchise' && (
            <>
              {/* Franchise Satışları */}
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
                  FRANCHISE SATIŞLARI
                </div>
                
                <div style={{
                  backgroundColor: 'white',
                  border: '2px solid #0f2323',
                  borderTop: 'none',
                  borderRadius: '0 0 10px 10px',
                  overflow: 'hidden'
                }}>
                  {/* Tablo Başlıkları - Franchise */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '0.5fr 1fr 1fr 1fr 1fr 1fr',
                    backgroundColor: '#cc9900',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    <div style={{ 
                      padding: '15px', 
                      textAlign: 'center', 
                      borderRight: '1px solid #ddd',
                      backgroundColor: '#cc9900'
                    }}>
                      ID NUMARASI
                    </div>
                    <div style={{ 
                      padding: '15px', 
                      textAlign: 'center', 
                      borderRight: '1px solid #ddd',
                      backgroundColor: '#cc9900'
                    }}>
                      ADI SOYADI
                    </div>
                    <div style={{ 
                      padding: '15px', 
                      textAlign: 'center', 
                      borderRight: '1px solid #ddd',
                      backgroundColor: '#cc9900'
                    }}>
                      FRANCHISE SATIN ALDIĞI TARİH
                    </div>
                    <div style={{ 
                      padding: '15px', 
                      textAlign: 'center', 
                      borderRight: '1px solid #ddd',
                      backgroundColor: '#cc9900'
                    }}>
                      TEMEL EĞİTİMLERİ BİTİRDİĞİ TARİH
                    </div>
                    <div style={{ 
                      padding: '15px', 
                      textAlign: 'center', 
                      borderRight: '1px solid #ddd',
                      backgroundColor: '#cc9900'
                    }}>
                      1. SATIŞINI YAPTIĞI TARİH
                    </div>
                    <div style={{ 
                      padding: '15px', 
                      textAlign: 'center', 
                      backgroundColor: '#cc9900'
                    }}>
                      DURUM
                    </div>
                  </div>
                  
                  {/* Franchise Verileri */}
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
                    ) : franchiseData.pendingFranchises.length === 0 ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px',
                        fontSize: '16px',
                        color: '#666'
                      }}>
                        Franchise kaydı bulunmuyor
                      </div>
                    ) : (
                      franchiseData.pendingFranchises.map((franchise, index) => (
                        <div key={index} style={{
                          display: 'grid',
                          gridTemplateColumns: '0.5fr 1fr 1fr 1fr 1fr 1fr',
                          borderBottom: '1px solid #ddd'
                        }}>
                          <div style={{
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            padding: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            color: '#333',
                            fontWeight: 'bold',
                            borderRight: '1px solid #ddd'
                          }}>
                            {franchise.partner_id || `P${franchise.id.toString().padStart(10, '0')}`}
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
                            borderRight: '1px solid #ddd'
                          }}>
                            {franchise.first_name} {franchise.last_name}
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
                            borderRight: '1px solid #ddd'
                          }}>
                            {franchise.created_at ? new Date(franchise.created_at).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
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
                            borderRight: '1px solid #ddd'
                          }}>
                            {franchise.education_completed ? new Date(franchise.education_completed).toLocaleDateString('tr-TR') : 'Tamamlanmadı'}
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
                            borderRight: '1px solid #ddd'
                          }}>
                            {franchise.first_sale_date && franchise.first_sale_date !== null ? new Date(franchise.first_sale_date).toLocaleDateString('tr-TR') : 'Henüz yapmadı'}
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
                            {franchise.payment_confirmed ? 'Aktif' : 'Beklemede'}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    
  );
};

export default SalesTracker;