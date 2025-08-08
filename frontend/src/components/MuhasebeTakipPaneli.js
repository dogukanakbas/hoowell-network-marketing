import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MuhasebeTakipPaneli = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bireysel'); // 'bireysel' veya 'sirket'
  const [accountingData, setAccountingData] = useState({
    bireysel: [],
    sirket: []
  });

  useEffect(() => {
    fetchAccountingData();
  }, []);

  const fetchAccountingData = async () => {
    try {
      const response = await axios.get('/api/accounting/data', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setAccountingData(response.data.data);
      }
    } catch (error) {
      console.error('Muhasebe verileri yüklenirken hata:', error);
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
        Muhasebe verileri yükleniyor...
      </div>
    );
  }

  const renderBireyselPanel = () => (
    <div style={{ width: '100%' }}>
      {/* Bireysel Panel Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a4040 0%, #2a5555 50%, #1a4040 100%)',
        borderRadius: '15px 15px 0 0',
        padding: '15px',
        border: '2px solid #FFD700',
        borderBottom: 'none'
      }}>
        <div style={{
          display: 'flex',
          backgroundColor: '#2a2a2a',
          borderRadius: '10px',
          overflow: 'hidden',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>KAZANÇ TÜRÜ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>ADI SOYADI</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>SATIŞ TARİHİ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>HAK EDİŞ TARİHİ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>ÖDEME TARİHİ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>KAZANÇ (USD)</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>STOPAJLI KAZANÇ %20</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>T. KURU</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>NET KAZANÇ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700' }}>ÖDEME DURUMU</div>
        </div>
      </div>

      {/* Bireysel Panel Content */}
      <div style={{
        background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
        borderRadius: '0 0 15px 15px',
        border: '2px solid #FFD700',
        borderTop: 'none',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        {accountingData.bireysel && accountingData.bireysel.length > 0 ? (
          accountingData.bireysel.map((row, index) => (
            <div key={row.id} style={{
              display: 'flex',
              backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
              fontSize: '11px',
              borderBottom: '1px solid rgba(255,215,0,0.2)'
            }}>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.earning_type}</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.related_person || '-----'}</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.sale_date}</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.earn_date}</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.payment_date}</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.amount_usd} $</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.stopaj_amount} $</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.exchange_rate} ₺</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.net_amount_tl.toLocaleString()} ₺</div>
              <div style={{ 
                flex: 1, 
                padding: '8px', 
                textAlign: 'center', 
                color: row.payment_status === 'ÖDENDİ' ? '#28a745' : '#ffc107',
                fontWeight: 'bold'
              }}>{row.payment_status}</div>
            </div>
          ))
        ) : (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#fff',
            fontSize: '14px'
          }}>
            Henüz bireysel kazanç kaydı bulunmamaktadır.
          </div>
        )}
      </div>
    </div>
  );

  const renderSirketPanel = () => (
    <div style={{ width: '100%' }}>
      {/* Şirket Panel Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a4040 0%, #2a5555 50%, #1a4040 100%)',
        borderRadius: '15px 15px 0 0',
        padding: '15px',
        border: '2px solid #FFD700',
        borderBottom: 'none'
      }}>
        <div style={{
          display: 'flex',
          backgroundColor: '#2a2a2a',
          borderRadius: '10px',
          overflow: 'hidden',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>KAZANÇ TÜRÜ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>ADI SOYADI</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>SATIŞ TARİHİ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>HAK EDİŞ TARİHİ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>ÖDEME TARİHİ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>KAZANÇ (USD)</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>%20 KDV'Lİ KAZANÇ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>T. KURU</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700', borderRight: '1px solid #444' }}>NET KAZANÇ</div>
          <div style={{ flex: 1, padding: '10px', textAlign: 'center', color: '#FFD700' }}>ÖDEME DURUMU</div>
        </div>
      </div>

      {/* Şirket Panel Content */}
      <div style={{
        background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
        borderRadius: '0 0 15px 15px',
        border: '2px solid #FFD700',
        borderTop: 'none',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        {accountingData.sirket && accountingData.sirket.length > 0 ? (
          accountingData.sirket.map((row, index) => (
            <div key={row.id} style={{
              display: 'flex',
              backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
              fontSize: '11px',
              borderBottom: '1px solid rgba(255,215,0,0.2)'
            }}>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.earning_type}</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.related_person || '-----'}</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.sale_date}</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.earn_date}</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.payment_date}</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.amount_usd} $</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.taxed_amount} $</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.exchange_rate} ₺</div>
              <div style={{ flex: 1, padding: '8px', textAlign: 'center', color: '#fff', borderRight: '1px solid rgba(255,215,0,0.2)' }}>{row.net_amount_tl.toLocaleString()} ₺</div>
              <div style={{ 
                flex: 1, 
                padding: '8px', 
                textAlign: 'center', 
                color: row.payment_status === 'ÖDENDİ' ? '#28a745' : '#ffc107',
                fontWeight: 'bold'
              }}>{row.payment_status}</div>
            </div>
          ))
        ) : (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#fff',
            fontSize: '14px'
          }}>
            Henüz şirket kazanç kaydı bulunmamaktadır.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0e2323 0%, #1a3333 50%, #0e2323 100%)',
      padding: '20px',
      margin: '0 -20px',
      position: 'relative'
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
          MUHASEBE TAKİP PANELİ
        </h1>
      </div>

      {/* Tab Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px',
        gap: '20px'
      }}>
        <button
          onClick={() => setActiveTab('bireysel')}
          style={{
            padding: '15px 40px',
            borderRadius: '15px',
            border: '3px solid #FFD700',
            background: activeTab === 'bireysel' 
              ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
              : 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
            color: activeTab === 'bireysel' ? '#000' : '#FFD700',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          BİREYSEL
        </button>
        <button
          onClick={() => setActiveTab('sirket')}
          style={{
            padding: '15px 40px',
            borderRadius: '15px',
            border: '3px solid #FFD700',
            background: activeTab === 'sirket' 
              ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
              : 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
            color: activeTab === 'sirket' ? '#000' : '#FFD700',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          ŞİRKET
        </button>
      </div>

      {/* Panel Content */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '0 20px'
      }}>
        {activeTab === 'bireysel' ? renderBireyselPanel() : renderSirketPanel()}
      </div>

      {/* Vergi Bilgilendirme */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: 'linear-gradient(135deg, #1a4040 0%, #2a5555 50%, #1a4040 100%)',
        borderRadius: '15px',
        border: '2px solid #FFD700',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        maxWidth: '1000px',
        margin: '30px auto 0 auto'
      }}>
        <div style={{
          color: '#FFD700',
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          VERGİ YÜKÜMLÜLÜĞÜ BİLGİLENDİRME
        </div>
        <div style={{
          color: '#ffffff',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#FFD700' }}>BİREYSEL:</strong> Şirketi olmayan İş Ortaklarının kazançları ödenirken <strong style={{ color: '#FFD700' }}>%20 stopaj kesintisi</strong> yapılarak ödenir. Kesilen %20'lik meblağ TC kimlik numarası ile her ay devlete yatırılır.
          </div>
          <div>
            <strong style={{ color: '#FFD700' }}>ŞİRKET:</strong> Şahıs, Limited veya Anonim Şirket sahipleri kazanılan meblağın üzerine <strong style={{ color: '#FFD700' }}>%20 KDV</strong> ekleyerek fatura keserler ve kendi vergilerini şirket bünyesinde ödemekten sorumludur.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuhasebeTakipPaneli;