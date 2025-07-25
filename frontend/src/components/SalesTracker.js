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

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get('/api/sales/tracker', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSalesData(response.data);
    } catch (error) {
      console.error('Sales data fetch error:', error);
    }
  };

  return (
    <div style={{
      padding: '20px',
      minHeight: '100vh',
      backgroundColor: 'var(--background-light)'
    }}>
      {/* Başlık */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{
          color: 'var(--accent-gold)',
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          SATIŞ TAKİP PANELİ
        </h1>
        
        {/* Hoowell Logo */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'var(--accent-gold)',
          color: 'var(--white)',
          padding: '10px 15px',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          HooWell
        </div>
      </div>

      {/* Ana Container */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        backgroundColor: 'var(--white)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        
        {/* Bekleme Odası */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            backgroundColor: '#FF8C42',
            color: 'var(--white)',
            padding: '15px',
            borderRadius: '10px 10px 0 0',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            BEKLEME ODASI
          </div>
          
          <div style={{
            backgroundColor: 'var(--white)',
            border: '2px solid #FF8C42',
            borderTop: 'none',
            borderRadius: '0 0 10px 10px',
            overflow: 'hidden'
          }}>
            {/* Tablo Başlıkları */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
              backgroundColor: '#4A90E2',
              color: 'var(--white)',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              <div style={{ padding: '15px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                SATILAN ÜRÜN
              </div>
              <div style={{ padding: '15px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                SATIŞ TARİHİ
              </div>
              <div style={{ padding: '15px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                BONUS TARİHİ
              </div>
              <div style={{ padding: '15px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                KAZANILAN BONUS
              </div>
              <div style={{ padding: '15px', textAlign: 'center' }}>
                ADI SOYADI
              </div>
            </div>
            
            {/* Bekleme Odası Verileri */}
            {salesData.pendingSales.length > 0 ? (
              salesData.pendingSales.map((sale, index) => (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'var(--white)',
                    fontSize: '14px'
                  }}
                >
                  <div style={{ padding: '15px', textAlign: 'center', borderRight: '1px solid #dee2e6' }}>
                    {sale.product_name}
                  </div>
                  <div style={{ padding: '15px', textAlign: 'center', borderRight: '1px solid #dee2e6' }}>
                    {new Date(sale.sale_date).toLocaleDateString('tr-TR')}
                  </div>
                  <div style={{ padding: '15px', textAlign: 'center', borderRight: '1px solid #dee2e6' }}>
                    {new Date(sale.bonus_date).toLocaleDateString('tr-TR')}
                  </div>
                  <div style={{ padding: '15px', textAlign: 'center', borderRight: '1px solid #dee2e6', fontWeight: 'bold' }}>
                    {sale.bonus_amount.toLocaleString()} ₺
                  </div>
                  <div style={{ padding: '15px', textAlign: 'center' }}>
                    {sale.customer_name}
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                padding: '30px',
                textAlign: 'center',
                color: 'var(--text-light)',
                fontSize: '16px'
              }}>
                Bekleme odasında satış bulunmuyor
              </div>
            )}
          </div>
        </div>

        {/* Ay İçinde Gerçekleşen Satışlar */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            backgroundColor: '#FF8C42',
            color: 'var(--white)',
            padding: '15px',
            borderRadius: '10px 10px 0 0',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            AY İÇİNDE GERÇEKLEŞEN SATIŞLAR
          </div>
          
          <div style={{
            backgroundColor: 'var(--white)',
            border: '2px solid #FF8C42',
            borderTop: 'none',
            borderRadius: '0 0 10px 10px',
            overflow: 'hidden'
          }}>
            {/* Tablo Başlıkları */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
              backgroundColor: '#4A90E2',
              color: 'var(--white)',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              <div style={{ padding: '15px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                SATILAN ÜRÜN
              </div>
              <div style={{ padding: '15px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                SATIŞ TARİHİ
              </div>
              <div style={{ padding: '15px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                BONUS TARİHİ
              </div>
              <div style={{ padding: '15px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                KAZANILAN BONUS
              </div>
              <div style={{ padding: '15px', textAlign: 'center' }}>
                ADI SOYADI
              </div>
            </div>
            
            {/* Aktif Satış Verileri */}
            {salesData.activeSales.length > 0 ? (
              salesData.activeSales.map((sale, index) => (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'var(--white)',
                    fontSize: '14px'
                  }}
                >
                  <div style={{ padding: '15px', textAlign: 'center', borderRight: '1px solid #dee2e6' }}>
                    {sale.product_name}
                  </div>
                  <div style={{ padding: '15px', textAlign: 'center', borderRight: '1px solid #dee2e6' }}>
                    {new Date(sale.sale_date).toLocaleDateString('tr-TR')}
                  </div>
                  <div style={{ padding: '15px', textAlign: 'center', borderRight: '1px solid #dee2e6' }}>
                    {new Date(sale.bonus_date).toLocaleDateString('tr-TR')}
                  </div>
                  <div style={{ padding: '15px', textAlign: 'center', borderRight: '1px solid #dee2e6', fontWeight: 'bold' }}>
                    {sale.bonus_amount.toLocaleString()} ₺
                  </div>
                  <div style={{ padding: '15px', textAlign: 'center' }}>
                    {sale.customer_name}
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                padding: '30px',
                textAlign: 'center',
                color: 'var(--text-light)',
                fontSize: '16px'
              }}>
                Bu ay gerçekleşen satış bulunmuyor
              </div>
            )}
          </div>
        </div>

        {/* Aktiflik Kontrolü */}
        <div style={{
          backgroundColor: '#FF8C42',
          color: 'var(--white)',
          padding: '20px',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>
            AKTİFLİK KONTROLÜ
          </h3>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: salesData.monthlyActivity ? '#28a745' : '#DC143C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--white)',
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '10px',
                transition: 'all 0.3s ease'
              }}>
                {salesData.monthlyActivity ? 'EVET' : 'HAYIR'}
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                Bu Ay Aktif Misiniz?
              </div>
            </div>
          </div>
          
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            <strong>Aktiflik Kuralı:</strong> Bu ay aktif olmak için şahsi olarak en az 1 ürün satmanız 
            veya bulduğunuz yeni bir iş ortağının ilk satışını yapması gerekir.
          </div>
        </div>

        {/* Hoowell Bilgi Bankası Logo */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'var(--accent-gold)',
          color: 'var(--white)',
          padding: '10px 15px',
          borderRadius: '10px',
          fontSize: '12px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          <div>Hoowell</div>
          <div>BİLGİ</div>
          <div>BANKASI</div>
        </div>
      </div>
    </div>
  );
};

export default SalesTracker;