import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SponsorshipTracker = () => {
  const { user } = useAuth();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await axios.get('/api/sponsorship/my-partners', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPartners(response.data);
    } catch (error) {
      console.error('Partners fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  const getBonusPercentage = (level) => {
    const percentages = {
      bronze: 5,
      silver: 4,
      gold: 3,
      star_leader: 2,
      super_star_leader: 1
    };
    return percentages[level] || 0;
  };

  const getMaxEarning = (level) => {
    const maxEarnings = {
      bronze: 750,
      silver: 1200,
      gold: 1350,
      star_leader: 1200,
      super_star_leader: 750
    };
    return maxEarnings[level] || 0;
  };

  const getLevelName = (level) => {
    const names = {
      bronze: 'BRONZE',
      silver: 'SILVER',
      gold: 'GOLD',
      star_leader: 'STAR',
      super_star_leader: 'S.STAR'
    };
    return names[level] || level?.toUpperCase();
  };

  const getEarningColor = (earned, max) => {
    if (earned >= max) return '#dc3545'; // Kırmızı - limit doldu
    if (earned > 0) return '#28a745'; // Yeşil - kazanç var
    return 'transparent'; // Şeffaf - kazanç yok
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
        Partner verileri yükleniyor...
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
          SPONSORLUK TAKİP PANELİ
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
            ORTAKLIK BONUSU SİSTEMİ
          </h3>
          <div style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-dark)' }}>
            <p><strong>Bonus Oranları ve Limitler:</strong></p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li><strong>Bronze:</strong> %5 - Max 750$</li>
              <li><strong>Silver:</strong> %4 - Max 1.200$</li>
              <li><strong>Gold:</strong> %3 - Max 1.350$</li>
              <li><strong>Star Leader:</strong> %2 - Max 1.200$</li>
              <li><strong>Super Star Leader:</strong> %1 - Max 750$</li>
            </ul>
            <p><strong>Önemli:</strong> Bonuslar 15 gün sonra aktif olur. Başkanlar Takımı'na ulaştığında bonus sona erer.</p>
          </div>
        </div>

        {/* Tablo */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#4A90E2',
                color: 'white'
              }}>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  border: '1px solid #ddd'
                }}>
                  AD SOYADI
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  border: '1px solid #ddd'
                }}>
                  BAŞLANGIÇ TARİHİ
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  border: '1px solid #ddd'
                }}>
                  İLK SATIŞ AKTİVASYONU
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  border: '1px solid #ddd'
                }}>
                  BRONZE SEVİYE<br />%5. Max. 750$
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  border: '1px solid #ddd'
                }}>
                  SILVER SEVİYE<br />%4. Max.1000$
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  border: '1px solid #ddd'
                }}>
                  GOLD SEVİYE<br />%3. Max. 1.250$
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  border: '1px solid #ddd'
                }}>
                  STAR SEVİYE<br />%2. Max.1.500$
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  border: '1px solid #ddd'
                }}>
                  S.STAR SEVİYE<br />%1. Max.1.500$
                </th>
              </tr>
            </thead>
            <tbody>
              {partners.length > 0 ? partners.map((partner, index) => (
                <tr key={partner.id} style={{
                  backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'
                }}>
                  <td style={{
                    padding: '10px 8px',
                    textAlign: 'center',
                    border: '1px solid #ddd',
                    fontWeight: 'bold'
                  }}>
                    {partner.first_name} {partner.last_name}
                  </td>
                  <td style={{
                    padding: '10px 8px',
                    textAlign: 'center',
                    border: '1px solid #ddd'
                  }}>
                    {formatDate(partner.created_at)}
                  </td>
                  <td style={{
                    padding: '10px 8px',
                    textAlign: 'center',
                    border: '1px solid #ddd',
                    fontWeight: 'bold',
                    color: partner.first_sale_activated ? '#28a745' : '#dc3545'
                  }}>
                    {partner.first_sale_activated ? 'EVET' : 'HAYIR'}
                  </td>
                  <td style={{
                    padding: '10px 8px',
                    textAlign: 'center',
                    border: '1px solid #ddd',
                    backgroundColor: getEarningColor(partner.bronze_earnings || 0, 750),
                    color: (partner.bronze_earnings || 0) > 0 ? 'white' : 'var(--text-dark)',
                    fontWeight: 'bold'
                  }}>
                    {partner.bronze_earnings ? `${partner.bronze_earnings}$` : '-'}
                  </td>
                  <td style={{
                    padding: '10px 8px',
                    textAlign: 'center',
                    border: '1px solid #ddd',
                    backgroundColor: getEarningColor(partner.silver_earnings || 0, 1200),
                    color: (partner.silver_earnings || 0) > 0 ? 'white' : 'var(--text-dark)',
                    fontWeight: 'bold'
                  }}>
                    {partner.silver_earnings ? `${partner.silver_earnings}$` : '-'}
                  </td>
                  <td style={{
                    padding: '10px 8px',
                    textAlign: 'center',
                    border: '1px solid #ddd',
                    backgroundColor: getEarningColor(partner.gold_earnings || 0, 1350),
                    color: (partner.gold_earnings || 0) > 0 ? 'white' : 'var(--text-dark)',
                    fontWeight: 'bold'
                  }}>
                    {partner.gold_earnings ? `${partner.gold_earnings}$` : '-'}
                  </td>
                  <td style={{
                    padding: '10px 8px',
                    textAlign: 'center',
                    border: '1px solid #ddd',
                    backgroundColor: getEarningColor(partner.star_earnings || 0, 1200),
                    color: (partner.star_earnings || 0) > 0 ? 'white' : 'var(--text-dark)',
                    fontWeight: 'bold'
                  }}>
                    {partner.star_earnings ? `${partner.star_earnings}$` : '-'}
                  </td>
                  <td style={{
                    padding: '10px 8px',
                    textAlign: 'center',
                    border: '1px solid #ddd',
                    backgroundColor: getEarningColor(partner.super_star_earnings || 0, 750),
                    color: (partner.super_star_earnings || 0) > 0 ? 'white' : 'var(--text-dark)',
                    fontWeight: 'bold'
                  }}>
                    {partner.super_star_earnings ? `${partner.super_star_earnings}$` : '-'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: 'var(--text-light)',
                    fontSize: '16px'
                  }}>
                    Henüz sponsor olduğunuz partner bulunmamaktadır.
                    <br />
                    <a href="/partner-registration" style={{
                      color: 'var(--primary-dark)',
                      textDecoration: 'none',
                      fontWeight: 'bold'
                    }}>
                      Yeni partner kayıt et →
                    </a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* İstatistikler */}
        <div style={{
          marginTop: '30px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--card-gray)',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
              Toplam Partner
            </h4>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4A90E2' }}>
              {partners.length}
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'var(--card-gray)',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
              Aktif Partner
            </h4>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
              {partners.filter(p => p.first_sale_activated).length}
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'var(--card-gray)',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
              Toplam Kazanç
            </h4>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFD700' }}>
              ${partners.reduce((total, p) => {
                return total + (p.bronze_earnings || 0) + (p.silver_earnings || 0) + 
                       (p.gold_earnings || 0) + (p.star_earnings || 0) + (p.super_star_earnings || 0);
              }, 0)}
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'var(--card-gray)',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
              Bu Ay Kazanç
            </h4>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>
              ${partners.reduce((total, p) => total + (p.monthly_earnings || 0), 0)}
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

export default SponsorshipTracker;