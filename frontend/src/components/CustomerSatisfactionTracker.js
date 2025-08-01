import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerSatisfactionTracker = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/customer-satisfaction/my-customers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data && Array.isArray(response.data)) {
        setCustomers(response.data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error('Customer fetch error:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const addReference = async (customerId, referenceName, referenceSurname, referencePhone) => {
    try {
      const response = await axios.post('/api/customer-satisfaction/add-reference', {
        customer_id: customerId,
        reference_name: referenceName,
        reference_surname: referenceSurname,
        reference_phone: referencePhone
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        alert(`Referans başarıyla eklendi! ${response.data.rewardEarned ? `Ödül kazandınız: ${response.data.rewardEarned}` : ''}`);
        fetchCustomers(); // Verileri yenile
      }
    } catch (error) {
      console.error('Add reference error:', error);
      alert('Referans eklenirken hata oluştu');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  // Gerçek veriler backend'den gelecek

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
        Müşteri verileri yükleniyor...
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
      {/* Başlık */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{
          color: '#FFD700',
          fontSize: '36px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
          letterSpacing: '2px'
        }}>
          MEMNUN MÜŞTERİ TAKİP PROGRAMI
        </h1>
        
        {/* Hoowell Logo - Sağ Üst */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
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

      {/* Ana Panel */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        border: '3px solid #FFD700'
      }}>
        {/* Ödül Kartları */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          {/* 450 USD Kart */}
          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
            borderRadius: '15px',
            padding: '15px',
            textAlign: 'center',
            color: '#FFD700',
            fontWeight: 'bold',
            border: '2px solid #FFD700',
            minWidth: '150px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '5px' }}>450 USD</div>
            <div style={{ fontSize: '12px', marginBottom: '5px' }}>Değerinde</div>
            <div style={{ fontSize: '12px' }}>ÜCRETSİZ FİLTRE</div>
            <div style={{ fontSize: '12px' }}>Hediyesi</div>
          </div>

          {/* 410 USD Kart */}
          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
            borderRadius: '15px',
            padding: '15px',
            textAlign: 'center',
            color: '#FFD700',
            fontWeight: 'bold',
            border: '2px solid #FFD700',
            minWidth: '150px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '5px' }}>410 USD</div>
            <div style={{ fontSize: '12px', marginBottom: '5px' }}>Değerinde</div>
            <div style={{ fontSize: '12px' }}>EL TERMİNALİ</div>
            <div style={{ fontSize: '12px' }}>Hediye</div>
          </div>

          {/* 500 USD Kart */}
          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
            borderRadius: '15px',
            padding: '15px',
            textAlign: 'center',
            color: '#FFD700',
            fontWeight: 'bold',
            border: '2px solid #FFD700',
            minWidth: '150px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '5px' }}>500 USD</div>
            <div style={{ fontSize: '12px', marginBottom: '5px' }}>Değerinde</div>
            <div style={{ fontSize: '12px' }}>FRANCHAİSE</div>
            <div style={{ fontSize: '12px' }}>LİSANS Bedava</div>
          </div>
        </div>

        {/* Tablo Yapısı */}
        <div style={{ overflowX: 'auto', marginBottom: '30px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '2px',
            fontSize: '12px',
            minWidth: '1000px'
          }}>
            {/* Başlık Satırı */}
            <div style={{
              backgroundColor: '#B8860B',
              color: 'white',
              padding: '15px 8px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px'
            }}>
              MÜŞTERİ
            </div>
            <div style={{
              backgroundColor: '#B8860B',
              color: 'white',
              padding: '15px 8px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px'
            }}>
              SATIN ALMA<br />TARİHİ
            </div>
            <div style={{
              backgroundColor: '#B8860B',
              color: 'white',
              padding: '15px 8px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px'
            }}>
              ALINAN ÜRÜN
            </div>
            <div style={{
              backgroundColor: '#B8860B',
              color: 'white',
              padding: '15px 8px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px'
            }}>
              VERİLEN<br />REFERANSLAR
            </div>
            <div style={{
              backgroundColor: '#B8860B',
              color: 'white',
              padding: '15px 8px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px'
            }}>
              1.HEDİYE
            </div>
            <div style={{
              backgroundColor: '#B8860B',
              color: 'white',
              padding: '15px 8px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px'
            }}>
              2.HEDİYE
            </div>
            <div style={{
              backgroundColor: '#B8860B',
              color: 'white',
              padding: '15px 8px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px'
            }}>
              3.HEDİYE
            </div>

            {/* Veri Satırları - Gerçek veriler */}
            {customers.length > 0 ? customers.map((customer, rowIndex) => (
              [
                // Müşteri
                <div key={`${rowIndex}-0`} style={{
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  padding: '15px 8px',
                  minHeight: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}>
                  {customer.first_name} {customer.last_name}
                </div>,
                // Satın Alma Tarihi
                <div key={`${rowIndex}-1`} style={{
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  padding: '15px 8px',
                  minHeight: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}>
                  {formatDate(customer.created_at)}
                </div>,
                // Alınan Ürün
                <div key={`${rowIndex}-2`} style={{
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  padding: '15px 8px',
                  minHeight: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}>
                  {customer.selected_product === 'education' ? 'Eğitim Paketi' : 'Cihaz Paketi'}
                </div>,
                // Verilen Referanslar
                <div key={`${rowIndex}-3`} style={{
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  padding: '15px 8px',
                  minHeight: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}>
                  {customer.reference_count || 0}
                  <button
                    onClick={() => {
                      const name = prompt('Referans Adı:');
                      const surname = prompt('Referans Soyadı:');
                      const phone = prompt('Referans Telefonu:');
                      if (name && surname && phone) {
                        addReference(customer.id, name, surname, phone);
                      }
                    }}
                    style={{
                      marginLeft: '5px',
                      padding: '2px 6px',
                      fontSize: '10px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                </div>,
                // 1. Hediye
                <div key={`${rowIndex}-4`} style={{
                  backgroundColor: (customer.reference_count >= 1) ? '#d4edda' : 'white',
                  border: '1px solid #ddd',
                  padding: '15px 8px',
                  minHeight: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: (customer.reference_count >= 1) ? '#155724' : '#666'
                }}>
                  {(customer.reference_count >= 1) ? '✓ Kazandı' : '-'}
                </div>,
                // 2. Hediye
                <div key={`${rowIndex}-5`} style={{
                  backgroundColor: (customer.reference_count >= 2) ? '#d4edda' : 'white',
                  border: '1px solid #ddd',
                  padding: '15px 8px',
                  minHeight: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: (customer.reference_count >= 2) ? '#155724' : '#666'
                }}>
                  {(customer.reference_count >= 2) ? '✓ Kazandı' : '-'}
                </div>,
                // 3. Hediye
                <div key={`${rowIndex}-6`} style={{
                  backgroundColor: (customer.reference_count >= 3) ? '#d4edda' : 'white',
                  border: '1px solid #ddd',
                  padding: '15px 8px',
                  minHeight: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: (customer.reference_count >= 3) ? '#155724' : '#666'
                }}>
                  {(customer.reference_count >= 3) ? '✓ Kazandı' : '-'}
                </div>
              ]
            )).flat() : 
            // Veri yoksa boş satırlar göster
            Array.from({ length: 8 }, (_, rowIndex) => (
              Array.from({ length: 7 }, (_, colIndex) => (
                <div
                  key={`empty-${rowIndex}-${colIndex}`}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    padding: '15px 8px',
                    minHeight: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#999'
                  }}
                >
                  -
                </div>
              ))
            )).flat()}
          </div>
        </div>

        {/* Alt İstatistik Kartları */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            color: '#FFD700',
            fontWeight: 'bold',
            border: '2px solid #FFD700',
            minWidth: '150px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '10px' }}>TOPLAM MÜŞTERİ</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{customers.length}</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            color: '#FFD700',
            fontWeight: 'bold',
            border: '2px solid #FFD700',
            minWidth: '150px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '10px' }}>TOPLAM REFERANSLAR</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
              {customers.reduce((total, customer) => total + (customer.referrals || 0), 0)}
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            color: '#FFD700',
            fontWeight: 'bold',
            border: '2px solid #FFD700',
            minWidth: '150px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '10px' }}>1.HEDİYE KAZANAN</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
              {customers.filter(customer => (customer.referrals || 0) >= 1).length}
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            color: '#FFD700',
            fontWeight: 'bold',
            border: '2px solid #FFD700',
            minWidth: '150px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '10px' }}>2.HEDİYE KAZANAN</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
              {customers.filter(customer => (customer.referrals || 0) >= 2).length}
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 50%, #2a2a2a 100%)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            color: '#FFD700',
            fontWeight: 'bold',
            border: '2px solid #FFD700',
            minWidth: '150px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '10px' }}>3.HEDİYE KAZANAN</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
              {customers.filter(customer => (customer.referrals || 0) >= 3).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSatisfactionTracker;