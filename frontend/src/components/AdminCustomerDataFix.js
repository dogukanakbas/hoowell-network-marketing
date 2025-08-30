import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCustomerDataFix = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [careerFilter, setCareerFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({});
  const [dataLoading, setDataLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(false);
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm, statusFilter, careerFilter, cityFilter, currentPage]);

  const fetchCustomers = async () => {
    setDataLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      if (careerFilter !== 'all') {
        params.append('career_level', careerFilter);
      }
      
      if (cityFilter !== 'all') {
        params.append('city', cityFilter);
      }
      
      params.append('page', currentPage);
      params.append('limit', 20);

      const response = await axios.get(`/api/admin/customers?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCustomers(response.data.data.customers);
        setPagination(response.data.data.pagination);
        setFilters(response.data.data.filters);
      }
    } catch (error) {
      console.error('Müşteri verileri yüklenirken hata:', error);
      setMessage('Müşteri verileri yüklenirken hata oluştu');
      setMessageType('error');
    } finally {
      setDataLoading(false);
    }
  };

  const updateCustomer = async (customerData) => {
    setUpdateLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/admin/customers/${customerData.id}`, customerData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setMessage(response.data.message);
        setMessageType('success');
        setEditingCustomer(null);
        fetchCustomers(); // Listeyi yenile
      }
    } catch (error) {
      console.error('Müşteri güncellenirken hata:', error);
      setMessage(error.response?.data?.message || 'Müşteri güncellenirken hata oluştu');
      setMessageType('error');
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteCustomer = async (customerId) => {
    if (!window.confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`/api/admin/customers/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setMessage(response.data.message);
        setMessageType('success');
        fetchCustomers(); // Listeyi yenile
      }
    } catch (error) {
      console.error('Müşteri silinirken hata:', error);
      setMessage(error.response?.data?.message || 'Müşteri silinirken hata oluştu');
      setMessageType('error');
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer({ ...customer });
  };

  const handleSave = () => {
    if (editingCustomer) {
      updateCustomer(editingCustomer);
    }
  };

  const handleCancel = () => {
    setEditingCustomer(null);
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
        Müşteri verileri yükleniyor...
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
          MÜŞTERİ VERİLERİ
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
          placeholder="Müşteri adı, email, telefon ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            borderRadius: '25px',
            border: '2px solid #FFD700',
            backgroundColor: 'white',
            width: '250px'
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
          <option value="active">Aktif</option>
          <option value="inactive">Pasif</option>
        </select>
        <select
          value={careerFilter}
          onChange={(e) => setCareerFilter(e.target.value)}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            borderRadius: '25px',
            border: '2px solid #FFD700',
            backgroundColor: 'white',
            width: '150px'
          }}
        >
          <option value="all">Tüm Seviyeler</option>
          <option value="bronze">Bronze</option>
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
          <option value="star_leader">Star Leader</option>
          <option value="super_star_leader">Super Star Leader</option>
          <option value="presidents_team">Presidents Team</option>
          <option value="country_distributor">Country Distributor</option>
        </select>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            borderRadius: '25px',
            border: '2px solid #FFD700',
            backgroundColor: 'white',
            width: '150px'
          }}
        >
          <option value="all">Tüm Şehirler</option>
          {filters.cities && filters.cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Özet İstatistikler */}
      {pagination.total > 0 && (
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
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Toplam Müşteri</h3>
            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
              {pagination.total}
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
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Aktif Müşteri</h3>
            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
              {customers.filter(c => c.is_active).length}
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
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Eğitim Tamamlayan</h3>
            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
              {customers.filter(c => c.education_completed).length}
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
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Sayfa</h3>
            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
              {pagination.page} / {pagination.totalPages}
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
          Müşteri verileri yükleniyor...
        </div>
      )}

      {/* Müşteri Tablosu */}
      {!dataLoading && (
        <div style={{
          background: 'linear-gradient(135deg, #1a4040 0%, #2a5555 50%, #1a4040 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '3px solid #FFD700',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          marginBottom: '30px',
          overflowX: 'auto'
        }}>
          {/* Tablo Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '2px',
            marginBottom: '10px',
            minWidth: '1200px'
          }}>
            {['ID', 'ADI SOYADI', 'EMAIL', 'TELEFON', 'SPONSOR ID', 'KARİYER', 'KKP', 'AKTİF ORTAK', 'DURUM', 'EĞİTİM', 'ŞEHİR', 'İŞLEMLER'].map((header, index) => (
              <div key={index} style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                color: '#000',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '9px',
                fontWeight: 'bold',
                borderRadius: '5px'
              }}>
                {header}
              </div>
            ))}
          </div>

          {/* Tablo Content - Gerçek veriler */}
          {customers.length > 0 ? (
            customers.map((customer, rowIndex) => (
              <div key={customer.id} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '2px',
                marginBottom: '2px',
                minWidth: '1200px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '9px',
                  borderRadius: '3px'
                }}>
                  {customer.id}
                </div>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '9px',
                  borderRadius: '3px'
                }}>
                  {customer.first_name} {customer.last_name}
                </div>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '9px',
                  borderRadius: '3px'
                }}>
                  {customer.email}
                </div>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '9px',
                  borderRadius: '3px'
                }}>
                  {customer.phone}
                </div>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '9px',
                  borderRadius: '3px'
                }}>
                  {customer.sponsor_id}
                </div>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '9px',
                  borderRadius: '3px'
                }}>
                  {customer.career_level}
                </div>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '9px',
                  borderRadius: '3px'
                }}>
                  {customer.total_kkp}
                </div>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '9px',
                  borderRadius: '3px'
                }}>
                  {customer.active_partners}
                </div>
                <div style={{
                  backgroundColor: customer.is_active ? 'rgba(40, 167, 69, 0.9)' : 'rgba(220, 53, 69, 0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '9px',
                  borderRadius: '3px',
                  color: 'white'
                }}>
                  {customer.is_active ? 'Aktif' : 'Pasif'}
                </div>
                <div style={{
                  backgroundColor: customer.education_completed ? 'rgba(40, 167, 69, 0.9)' : 'rgba(255, 193, 7, 0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '9px',
                  borderRadius: '3px',
                  color: 'white'
                }}>
                  {customer.education_completed ? 'Tamamladı' : 'Bekliyor'}
                </div>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '9px',
                  borderRadius: '3px'
                }}>
                  {customer.city}
                </div>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '9px',
                  borderRadius: '3px'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '5px',
                    justifyContent: 'center'
                  }}>
                    <button
                      onClick={() => handleEdit(customer)}
                      style={{
                        background: 'linear-gradient(135deg, #007bff, #0056b3)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '2px 6px',
                        fontSize: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteCustomer(customer.id)}
                      style={{
                        background: 'linear-gradient(135deg, #dc3545, #c82333)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '2px 6px',
                        fontSize: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️
                    </button>
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
              Müşteri verisi bulunamadı
            </div>
          )}
        </div>
      )}

      {/* Sayfalama */}
      {pagination.totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '20px'
        }}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              borderRadius: '10px',
              border: '2px solid #FFD700',
              backgroundColor: currentPage === 1 ? '#666' : '#FFD700',
              color: currentPage === 1 ? '#999' : '#000',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Önceki
          </button>
          <span style={{
            padding: '10px 20px',
            fontSize: '14px',
            color: '#FFD700'
          }}>
            Sayfa {currentPage} / {pagination.totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
            disabled={currentPage === pagination.totalPages}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              borderRadius: '10px',
              border: '2px solid #FFD700',
              backgroundColor: currentPage === pagination.totalPages ? '#666' : '#FFD700',
              color: currentPage === pagination.totalPages ? '#999' : '#000',
              cursor: currentPage === pagination.totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Sonraki
          </button>
        </div>
      )}

      {/* Düzenleme Modal */}
      {editingCustomer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a4040 0%, #2a5555 50%, #1a4040 100%)',
            borderRadius: '20px',
            padding: '30px',
            border: '3px solid #FFD700',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3 style={{
              color: '#FFD700',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              Müşteri Düzenle
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '15px'
            }}>
              <input
                type="text"
                placeholder="Ad"
                value={editingCustomer.first_name || ''}
                onChange={(e) => setEditingCustomer({...editingCustomer, first_name: e.target.value})}
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              />
              <input
                type="text"
                placeholder="Soyad"
                value={editingCustomer.last_name || ''}
                onChange={(e) => setEditingCustomer({...editingCustomer, last_name: e.target.value})}
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={editingCustomer.email || ''}
                onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              />
              <input
                type="text"
                placeholder="Telefon"
                value={editingCustomer.phone || ''}
                onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})}
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              />
              <input
                type="text"
                placeholder="Şehir"
                value={editingCustomer.city || ''}
                onChange={(e) => setEditingCustomer({...editingCustomer, city: e.target.value})}
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              />
              <select
                value={editingCustomer.career_level || ''}
                onChange={(e) => setEditingCustomer({...editingCustomer, career_level: e.target.value})}
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              >
                <option value="">Kariyer Seviyesi Seçin</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="star_leader">Star Leader</option>
                <option value="super_star_leader">Super Star Leader</option>
                <option value="presidents_team">Presidents Team</option>
                <option value="country_distributor">Country Distributor</option>
              </select>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: '#FFD700', fontSize: '14px', marginBottom: '5px', display: 'block' }}>
                  <input
                    type="checkbox"
                    checked={editingCustomer.is_active || false}
                    onChange={(e) => setEditingCustomer({...editingCustomer, is_active: e.target.checked})}
                    style={{ marginRight: '10px' }}
                  />
                  Aktif
                </label>
                <label style={{ color: '#FFD700', fontSize: '14px', marginBottom: '5px', display: 'block' }}>
                  <input
                    type="checkbox"
                    checked={editingCustomer.education_completed || false}
                    onChange={(e) => setEditingCustomer({...editingCustomer, education_completed: e.target.checked})}
                    style={{ marginRight: '10px' }}
                  />
                  Eğitim Tamamlandı
                </label>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              marginTop: '20px'
            }}>
              <button
                onClick={handleSave}
                disabled={updateLoading}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#28a745',
                  color: 'white',
                  cursor: 'pointer',
                  opacity: updateLoading ? 0.6 : 1
                }}
              >
                {updateLoading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <button
                onClick={handleCancel}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomerDataFix;
