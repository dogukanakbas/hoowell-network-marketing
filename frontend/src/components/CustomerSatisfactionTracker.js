import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CustomerSatisfactionTracker = () => {
  const { user } = useAuth();
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
      setCustomers(response.data);
    } catch (error) {
      console.error('Customer fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  const getRewardLevel = (referralCount) => {
    if (referralCount >= 3) return '3.SEVİYE ÖDÜL';
    if (referralCount >= 2) return '2.SEVİYE ÖDÜL';
    if (referralCount >= 1) return '1.SEVİYE ÖDÜL';
    return '-';
  };

  const getRewardDescription = (referralCount) => {
    if (referralCount >= 3) return 'Bedava FRANCHISE alma hakkı';
    if (referralCount >= 2) return 'ALKALİ İONİZER EL TERMİNALİ';
    if (referralCount >= 1) return '400 € değerinde FİLTRE SETİ';
    return '-';
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '18px',
        color: 'var(--text-dark)'
      }}>
        Müşteri verileri yükleniyor...
      </div>
    );
  }

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
          MEMNUN MÜŞTERİ TAKİP PANELİ
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

      {/* Ana Tablo */}
      <div style={{
        backgroundColor: 'var(--white)',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        overflowX: 'auto'
      }}>
        {/* Program Açıklaması */}
        <div style={{
          backgroundColor: 'var(--card-gray)',
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>
            MEMNUN MÜŞTERİ PROGRAMI
          </h3>
          <div style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-dark)' }}>
            <p><strong>Ödül Sistemi:</strong></p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li><strong>1. Satış:</strong> 400 € değerinde FİLTRE SETİ (Bedava)</li>
              <li><strong>2. Satış:</strong> ALKALİ İONİZER EL TERMİNALİ</li>
              <li><strong>3. Satış:</strong> Bedava FRANCHISE alma hakkı</li>
            </ul>
            <p><strong>Önemli:</strong> Ödüller satıştan 15 gün sonra aktif olur. İlk 60 gün sadakat programı ile korunursunuz.</p>
          </div>
        </div>

        {/* Tablo */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#4A90E2',
                color: 'white'
              }}>
                <th style={{
                  padding: '15px 10px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  border: '1px solid #ddd'
                }}>
                  MÜŞTERİ
                </th>
                <th style={{
                  padding: '15px 10px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  border: '1px solid #ddd'
                }}>
                  SATIN ALMA TARİHİ
                </th>
                <th style={{
                  padding: '15px 10px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  border: '1px solid #ddd'
                }}>
                  SATIN ALDIĞI ÜRÜN
                </th>
                <th style={{
                  padding: '15px 10px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  border: '1px solid #ddd'
                }}>
                  1.SEVİYE ÖDÜL
                </th>
                <th style={{
                  padding: '15px 10px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  border: '1px solid #ddd'
                }}>
                  2.SEVİYE ÖDÜL
                </th>
                <th style={{
                  padding: '15px 10px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  border: '1px solid #ddd'
                }}>
                  3.SEVİYE ÖDÜL
                </th>
                <th style={{
                  padding: '15px 10px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  border: '1px solid #ddd'
                }}>
                  VERİLMİŞ REFERANSLAR
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? customers.map((customer, index) => (
                <tr key={customer.id} style={{
                  backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'
                }}>
                  <td style={{
                    padding: '12px 10px',
                    textAlign: 'center',
                    border: '1px solid #ddd',
                    fontWeight: 'bold'
                  }}>
                    {customer.first_name} {customer.last_name}
                  </td>
                  <td style={{
                    padding: '12px 10px',
                    textAlign: 'center',
                    border: '1px solid #ddd'
                  }}>
                    {formatDate(customer.purchase_date)}
                  </td>
                  <td style={{
                    padding: '12px 10px',
                    textAlign: 'center',
                    border: '1px solid #ddd'
                  }}>
                    {customer.product_name || 'Alkali İonizer'}
                  </td>
                  <td style={{
                    padding: '12px 10px',
                    textAlign: 'center',
                    border: '1px solid #ddd',
                    backgroundColor: customer.referral_count >= 1 ? '#28a745' : 'transparent',
                    color: customer.referral_count >= 1 ? 'white' : 'var(--text-dark)'
                  }}>
                    {customer.referral_count >= 1 ? customer.level1_reward || 'Filtre Seti' : '-'}
                  </td>
                  <td style={{
                    padding: '12px 10px',
                    textAlign: 'center',
                    border: '1px solid #ddd',
                    backgroundColor: customer.referral_count >= 2 ? '#28a745' : 'transparent',
                    color: customer.referral_count >= 2 ? 'white' : 'var(--text-dark)'
                  }}>
                    {customer.referral_count >= 2 ? customer.level2_reward || 'El Terminali' : '-'}
                  </td>
                  <td style={{
                    padding: '12px 10px',
                    textAlign: 'center',
                    border: '1px solid #ddd',
                    backgroundColor: customer.referral_count >= 3 ? '#28a745' : 'transparent',
                    color: customer.referral_count >= 3 ? 'white' : 'var(--text-dark)'
                  }}>
                    {customer.referral_count >= 3 ? customer.level3_reward || 'Franchise Hakkı' : '-'}
                  </td>
                  <td style={{
                    padding: '12px 10px',
                    textAlign: 'center',
                    border: '1px solid #ddd'
                  }}>
                    <button
                      onClick={() => window.open(`/customer-references/${customer.id}`, '_blank')}
                      style={{
                        backgroundColor: '#4A90E2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '5px 10px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Referansları Gör ({customer.referral_count || 0})
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: 'var(--text-light)',
                    fontSize: '16px'
                  }}>
                    Henüz müşteri kaydınız bulunmamaktadır.
                    <br />
                    <a href="/customer-registration" style={{
                      color: 'var(--primary-dark)',
                      textDecoration: 'none',
                      fontWeight: 'bold'
                    }}>
                      Yeni müşteri kayıt et →
                    </a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Alt Bilgi */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              backgroundColor: 'var(--white)',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
                Toplam Müşteri
              </h4>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4A90E2' }}>
                {customers.length}
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'var(--white)',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
                Ödül Kazanan Müşteri
              </h4>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                {customers.filter(c => c.referral_count >= 1).length}
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'var(--white)',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
                Toplam Referans
              </h4>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFD700' }}>
                {customers.reduce((total, c) => total + (c.referral_count || 0), 0)}
              </div>
            </div>
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

export default CustomerSatisfactionTracker;