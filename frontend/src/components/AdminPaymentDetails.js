import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPaymentDetails = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentData, setPaymentData] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState({});
  const [methodStats, setMethodStats] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    setLoading(false);
    fetchPaymentData();
  }, []);

  useEffect(() => {
    fetchPaymentData();
  }, [statusFilter, methodFilter, startDate, endDate, searchTerm]);

  const fetchPaymentData = async () => {
    setDataLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      if (methodFilter !== 'all') {
        params.append('payment_method', methodFilter);
      }
      
      if (startDate && endDate) {
        params.append('start_date', startDate);
        params.append('end_date', endDate);
      }
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      console.log('Token:', token);
      console.log('Params:', params);
      
      const response = await axios.get(`/api/admin/payment-details?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Response:', response.data);
      console.log('Payments:', response.data.payments);
      console.log('Summary:', response.data.summary);
      console.log('Method Stats:', response.data.method_stats);
      
      if (response.data.success) {
        console.log('Setting payment data:', response.data.payments);
        setPaymentData(response.data.payments);
        setPaymentSummary(response.data.summary);
        setMethodStats(response.data.method_stats);
      }
    } catch (error) {
      console.error('Ödeme verileri yüklenirken hata:', error);
      setMessage('Ödeme verileri yüklenirken hata oluştu');
      setMessageType('error');
    } finally {
      setDataLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId, newStatus, notes = '') => {
    setUpdateLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/admin/payment-details/${paymentId}/status`, {
        status: newStatus,
        notes: notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setMessage(response.data.message);
        setMessageType('success');
        fetchPaymentData(); // Listeyi yenile
      }
    } catch (error) {
      console.error('Ödeme durumu güncellenirken hata:', error);
      setMessage(error.response?.data?.message || 'Ödeme durumu güncellenirken hata oluştu');
      setMessageType('error');
    } finally {
      setUpdateLoading(false);
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
      margin: '0 -20px',
      marginLeft: '-5px'
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

      {/* Mesaj Gösterimi */}
      {message && (
        <div style={{
          padding: '10px 20px',
          margin: '20px auto',
          borderRadius: '10px',
          textAlign: 'center',
          maxWidth: '500px',
          backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
          color: messageType === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${messageType === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}

      {/* Filtre Alanları */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Müşteri adı, transaction ID ara..."
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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
          padding: '12px 20px',
          fontSize: '16px',
          borderRadius: '25px',
          border: '2px solid #FFD700',
          backgroundColor: 'white',
            width: '150px'
          }}
        >
          <option value="all">Tüm Durumlar</option>
          <option value="pending">Beklemede</option>
          <option value="approved">Onaylandı</option>
          <option value="rejected">Reddedildi</option>
          <option value="verified">Doğrulandı</option>
        </select>
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            borderRadius: '25px',
            border: '2px solid #FFD700',
            backgroundColor: 'white',
            width: '150px'
          }}
        >
          <option value="all">Tüm Yöntemler</option>
          <option value="credit_card">Kredi Kartı</option>
          <option value="bank_transfer">Banka Transferi</option>
          <option value="cash">Nakit</option>
          <option value="manual">Manuel</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            borderRadius: '25px',
            border: '2px solid #FFD700',
            backgroundColor: 'white',
            width: '150px'
          }}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            borderRadius: '25px',
            border: '2px solid #FFD700',
            backgroundColor: 'white',
            width: '150px'
          }}
        />
      </div>

      {/* Özet İstatistikler */}
      {Object.keys(paymentSummary).length > 0 && (
      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
          <div style={{
            background: 'linear-gradient(135deg, #28a745, #20c997)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Toplam Ödeme</h3>
            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
              {paymentSummary.total_payments || 0}
            </p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #007bff, #0056b3)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Toplam Tutar (₺)</h3>
            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
              ₺{paymentSummary.total_amount_try || 0}
            </p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #ffc107, #e0a800)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Onaylanan</h3>
            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
              {paymentSummary.approved_count || 0}
            </p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #dc3545, #c82333)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Bekleyen</h3>
            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
              {paymentSummary.pending_count || 0}
            </p>
          </div>
        </div>
      )}

      {/* Loading Durumu */}
      {dataLoading && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#FFD700',
          fontSize: '16px'
        }}>
          Ödeme verileri yükleniyor...
      </div>
      )}

      {/* Ödeme Tablosu */}
      {!dataLoading && (
      <div style={{
        background: 'linear-gradient(135deg, #1a4040 0%, #2a5555 50%, #1a4040 100%)',
        borderRadius: '20px',
        padding: '20px',
        border: '3px solid #FFD700',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          marginBottom: '30px'
      }}>
        {/* Tablo Header */}
        <div style={{
          display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
          gap: '2px',
          marginBottom: '10px'
        }}>
            {['ÖDEME ID', 'MÜŞTERİ', 'SPONSOR ID', 'ÜRÜN', 'TUTAR (₺)', 'TUTAR (USD)', 'YÖNTEM', 'DURUM', 'TARİH', 'İŞLEMLER'].map((header, index) => (
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
            ))}
          </div>

          {/* Tablo Content - Gerçek veriler */}
          {paymentData.length > 0 ? (
            paymentData.map((payment, rowIndex) => (
              <div key={payment.id} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(10, 1fr)',
                gap: '2px',
                marginBottom: '2px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '10px',
                  borderRadius: '3px'
                }}>
                  {payment.id}
                </div>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '10px',
                  borderRadius: '3px'
                }}>
                  {payment.user_name}
                </div>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '10px',
                  borderRadius: '3px'
                }}>
                  {payment.sponsor_id}
                </div>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '10px',
                  borderRadius: '3px'
                }}>
                  {payment.payment_type === 'education' ? 'Eğitim' :
                   payment.payment_type === 'device' ? 'Cihaz' :
                   payment.payment_type === 'franchise' ? 'Franchise' : 'N/A'}
                </div>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '10px',
                  borderRadius: '3px'
                }}>
                  ₺{payment.total_amount}
                </div>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '10px',
                  borderRadius: '3px'
                }}>
                  ${payment.amount_usd}
                </div>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '10px',
                  borderRadius: '3px'
                }}>
                  {payment.payment_type === 'education' ? 'Eğitim' :
                   payment.payment_type === 'device' ? 'Cihaz' :
                   payment.payment_type === 'franchise' ? 'Franchise' : 'N/A'}
                </div>
                <div style={{
                  backgroundColor: payment.status === 'approved' ? 'rgba(40, 167, 69, 0.9)' :
                                  payment.status === 'pending' ? 'rgba(255, 193, 7, 0.9)' :
                                  payment.status === 'rejected' ? 'rgba(220, 53, 69, 0.9)' :
                                  'rgba(255,255,255,0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '10px',
                  borderRadius: '3px',
                  color: payment.status === 'approved' ? 'white' : 'black'
                }}>
                  {payment.status === 'approved' ? 'Onaylandı' :
                   payment.status === 'pending' ? 'Beklemede' :
                   payment.status === 'rejected' ? 'Reddedildi' :
                   payment.status === 'verified' ? 'Doğrulandı' : payment.status}
                </div>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '10px',
                  borderRadius: '3px'
                }}>
                  {new Date(payment.created_at).toLocaleDateString('tr-TR')}
                </div>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '10px',
                  borderRadius: '3px'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '5px',
                    justifyContent: 'center'
                  }}>
                    {payment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updatePaymentStatus(payment.id, 'approved')}
                          disabled={updateLoading}
                          style={{
                            background: 'linear-gradient(135deg, #28a745, #20c997)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            padding: '2px 6px',
                            fontSize: '8px',
                            cursor: 'pointer',
                            opacity: updateLoading ? 0.6 : 1
                          }}
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => updatePaymentStatus(payment.id, 'rejected')}
                          disabled={updateLoading}
                          style={{
                            background: 'linear-gradient(135deg, #dc3545, #c82333)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            padding: '2px 6px',
                            fontSize: '8px',
                            cursor: 'pointer',
                            opacity: updateLoading ? 0.6 : 1
                          }}
                        >
                          ✗
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              color: '#FFD700',
              fontSize: '16px'
            }}>
              Ödeme verisi bulunamadı
            </div>
          )}
        </div>
      )}

      {/* Ödeme Yöntemi İstatistikleri */}
      {methodStats.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #1a4040 0%, #2a5555 50%, #1a4040 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '3px solid #FFD700',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <h3 style={{
            color: '#FFD700',
            textAlign: 'center',
            marginBottom: '20px',
            fontSize: '20px'
          }}>
            Ödeme Yöntemi İstatistikleri
          </h3>
          
          {/* Yöntem İstatistikleri Tablosu */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2px',
            marginBottom: '10px'
          }}>
            {['ÖDEME YÖNTEMİ', 'ÖDEME ADEDİ', 'TOPLAM TUTAR'].map((header, index) => (
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
            ))}
        </div>

          {methodStats.map((method, index) => (
            <div key={index} style={{
            display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2px',
            marginBottom: '2px'
          }}>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {method.payment_method === 'credit_card' ? 'Kredi Kartı' :
                 method.payment_method === 'bank_transfer' ? 'Banka Transferi' :
                 method.payment_method === 'cash' ? 'Nakit' : 'Manuel'}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {method.payment_count}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                ₺{method.total_amount}
              </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default AdminPaymentDetails;