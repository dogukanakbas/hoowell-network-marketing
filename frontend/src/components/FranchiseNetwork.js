import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const FranchiseNetwork = () => {
  const { user } = useAuth();
  const [networkData, setNetworkData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'list'

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    try {
      const response = await axios.get('/api/network/tree', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNetworkData(response.data);
    } catch (error) {
      console.error('Network data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`/api/network/user-details/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSelectedUser(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('User details fetch error:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  const getCareerLevelColor = (level) => {
    const colors = {
      bronze: '#CD7F32',
      silver: '#C0C0C0',
      gold: '#FFD700',
      star_leader: '#FF6B35',
      super_star_leader: '#8A2BE2',
      presidents_team: '#DC143C',
      country_distributor: '#4B0082'
    };
    return colors[level] || '#CD7F32';
  };

  const getCareerLevelName = (level) => {
    const names = {
      bronze: 'BRONZE',
      silver: 'SILVER',
      gold: 'GOLD',
      star_leader: 'STAR LEADER',
      super_star_leader: 'SUPER STAR',
      presidents_team: 'PRESIDENTS TEAM',
      country_distributor: 'ÜLKE DISTRIBÜTÖRÜ'
    };
    return names[level] || level?.toUpperCase();
  };

  const renderTreeNode = (nodeData, level = 0) => {
    if (!nodeData) return null;

    const isCurrentUser = nodeData.user_id === user.id;
    const hasChildren = nodeData.children && nodeData.children.length > 0;
    const childrenCount = hasChildren ? nodeData.children.length : 0;

    // Responsive card width based on screen size
    const getResponsiveValues = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        return { cardWidth: '140px', cardGap: '15px', fontSize: '11px' };
      } else if (width <= 768) {
        return { cardWidth: '160px', cardGap: '20px', fontSize: '12px' };
      } else if (width <= 992) {
        return { cardWidth: '170px', cardGap: '25px', fontSize: '13px' };
      } else {
        return { cardWidth: '180px', cardGap: '30px', fontSize: '14px' };
      }
    };
    
    const { cardWidth, cardGap, fontSize } = getResponsiveValues();

    return (
      <div key={nodeData.user_id} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '10px',
        position: 'relative',
        minWidth: cardWidth
      }}>
        {/* User Card */}
        <div
          onClick={() => fetchUserDetails(nodeData.user_id)}
          style={{
            width: cardWidth,
            minHeight: '110px',
            background: isCurrentUser ? 
              'linear-gradient(135deg, #FFD700, #FFA500)' : 
              'linear-gradient(135deg, #0e2323, #1a4a3a)',
            borderRadius: '12px',
            padding: '12px',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
            border: isCurrentUser ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
          }}
        >
          {/* Profile Photo */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: isCurrentUser ? '#0e2323' : '#FFD700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 8px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: isCurrentUser ? '#FFD700' : '#0e2323',
            border: '2px solid rgba(255,255,255,0.3)'
          }}>
            {nodeData.career_level?.toLowerCase() === 'bronze' ? (
              <img 
                src="/images/products/bronze_logo.jpeg" 
                alt="Bronze Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : nodeData.career_level?.toLowerCase() === 'silver' ? (
              <img 
                src="/images/products/silver_logo.jpeg" 
                alt="Silver Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : nodeData.career_level?.toLowerCase() === 'gold' ? (
              <img 
                src="/images/products/gold_logo.jpeg" 
                alt="Gold Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : nodeData.career_level?.toLowerCase() === 'star_leader' ? (
              <img 
                src="/images/products/starlider_logo.jpeg" 
                alt="Star Leader Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : nodeData.career_level?.toLowerCase() === 'super_star_leader' ? (
              <img 
                src="/images/products/superstar_logo.jpeg" 
                alt="Super Star Leader Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : nodeData.career_level?.toLowerCase() === 'presidents_team' ? (
              <img 
                src="/images/products/baskanlar_logo.jpeg" 
                alt="Başkanlar Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : nodeData.profile_photo ? (
              <img 
                src={nodeData.profile_photo} 
                alt="Profile" 
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              `${nodeData.first_name?.charAt(0)}${nodeData.last_name?.charAt(0)}`
            )}
          </div>

          {/* User Info */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              color: isCurrentUser ? '#0e2323' : '#FFD700',
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '4px',
              lineHeight: '1.2',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {nodeData.first_name} {nodeData.last_name}
            </div>
            
            <div style={{
              color: isCurrentUser ? '#0e2323' : '#fff',
              fontSize: '10px',
              fontWeight: 'bold',
              marginBottom: '6px'
            }}>
              {nodeData.sponsor_id}
            </div>

            {/* Career Level Badge */}
            <div style={{
              backgroundColor: getCareerLevelColor(nodeData.career_level),
              color: '#fff',
              fontSize: '8px',
              fontWeight: 'bold',
              padding: '2px 6px',
              borderRadius: '10px',
              display: 'inline-block',
              textAlign: 'center',
              minWidth: '50px'
            }}>
              {getCareerLevelName(nodeData.career_level)}
            </div>
          </div>

          {/* Click Indicator */}
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            color: isCurrentUser ? '#0e2323' : '#FFD700',
            fontSize: '10px',
            opacity: 0.7
          }}>
            👁️
          </div>

          {/* Current User Indicator */}
          {isCurrentUser && (
            <div style={{
              position: 'absolute',
              top: '-3px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#28a745',
              color: '#fff',
              fontSize: '8px',
              fontWeight: 'bold',
              padding: '1px 6px',
              borderRadius: '8px'
            }}>
              SİZ
            </div>
          )}
        </div>

        {/* Connection Lines and Children */}
        {hasChildren && (
          <div style={{ position: 'relative', marginTop: '15px', width: '100%' }}>
            {/* Vertical Line from parent */}
            <div style={{
              width: '3px',
              height: '25px',
              backgroundColor: '#FFD700',
              margin: '0 auto',
              borderRadius: '2px',
              boxShadow: '0 2px 4px rgba(255, 215, 0, 0.3)'
            }} />

            {/* Horizontal connecting line for multiple children */}
            {childrenCount > 1 && (
              <div style={{
                height: '3px',
                backgroundColor: '#FFD700',
                position: 'absolute',
                top: '25px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: `${Math.min(childrenCount * 200, window.innerWidth - 100)}px`,
                borderRadius: '2px',
                boxShadow: '0 2px 4px rgba(255, 215, 0, 0.3)',
                zIndex: 1
              }} />
            )}

            {/* Children Container */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: cardGap,
              marginTop: '25px',
              flexWrap: window.innerWidth < 768 ? 'wrap' : 'nowrap',
              position: 'relative'
            }}>
              {nodeData.children.map((child, index) => {
                const totalChildren = nodeData.children.length;
                const isFirstChild = index === 0;
                const isLastChild = index === totalChildren - 1;
                // const isMiddleChild = !isFirstChild && !isLastChild; // Not used currently

                return (
                  <div key={child.user_id} style={{ 
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    {/* Vertical connector from horizontal line to child */}
                    {totalChildren > 1 && (
                      <div style={{
                        width: '3px',
                        height: '25px',
                        backgroundColor: '#FFD700',
                        position: 'absolute',
                        top: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        borderRadius: '2px',
                        boxShadow: '0 2px 4px rgba(255, 215, 0, 0.3)',
                        zIndex: 2
                      }} />
                    )}

                    {/* Connection point dot */}
                    {totalChildren > 1 && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#FFD700',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '-29px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        border: '2px solid #fff',
                        boxShadow: '0 2px 6px rgba(255, 215, 0, 0.4)',
                        zIndex: 3
                      }} />
                    )}

                    {renderTreeNode(child, level + 1)}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
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
        Ağaç yapısı yükleniyor...
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      minHeight: '100vh',
      backgroundColor: 'var(--background-light)'
    }}>
      {/* Header */}
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
          FRANCHISE AĞI YAPISI
        </h1>
        
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
              width: '80px',
              height: '40px',
              objectFit: 'contain'
            }}
          />
        </div>
      </div>

      {/* View Mode Toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px',
        gap: '10px'
      }}>
        <button
          onClick={() => setViewMode('tree')}
          style={{
            padding: '10px 20px',
            backgroundColor: viewMode === 'tree' ? 'var(--primary-dark)' : 'var(--card-gray)',
            color: viewMode === 'tree' ? 'var(--white)' : 'var(--text-dark)',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🌳 Ağaç Görünümü
        </button>
        <button
          onClick={() => setViewMode('list')}
          style={{
            padding: '10px 20px',
            backgroundColor: viewMode === 'list' ? 'var(--primary-dark)' : 'var(--card-gray)',
            color: viewMode === 'list' ? 'var(--white)' : 'var(--text-dark)',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          📋 Liste Görünümü
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        backgroundColor: 'var(--white)',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {viewMode === 'tree' ? (
          <div style={{
            width: '100%',
            overflowX: 'auto',
            overflowY: 'hidden',
            paddingBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              minWidth: 'max-content',
              padding: '20px'
            }}>
              {networkData ? renderTreeNode(networkData) : (
                <div style={{
                  textAlign: 'center',
                  color: 'var(--text-light)',
                  fontSize: '16px',
                  padding: '40px'
                }}>
                  Ağaç yapısı verisi bulunamadı.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* List View - Coming Soon */}
            <div style={{
              textAlign: 'center',
              color: 'var(--text-light)',
              fontSize: '16px',
              padding: '40px'
            }}>
              Liste görünümü yakında eklenecek...
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0e2323, #1a4a3a)',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            border: '2px solid #FFD700',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                color: '#FFD700',
                fontSize: '24px',
                cursor: 'pointer',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            {/* Profile Header */}
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#FFD700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px',
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#0e2323',
                border: '3px solid rgba(255,255,255,0.3)'
              }}>
                {selectedUser.career_level?.toLowerCase() === 'bronze' ? (
                  <img 
                    src="/images/products/bronze_logo.jpeg" 
                    alt="Bronze Logo"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : selectedUser.career_level?.toLowerCase() === 'silver' ? (
                  <img 
                    src="/images/products/silver_logo.jpeg" 
                    alt="Silver Logo"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : selectedUser.career_level?.toLowerCase() === 'gold' ? (
                  <img 
                    src="/images/products/gold_logo.jpeg" 
                    alt="Gold Logo"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : selectedUser.career_level?.toLowerCase() === 'star_leader' ? (
                  <img 
                    src="/images/products/starlider_logo.jpeg" 
                    alt="Star Leader Logo"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : selectedUser.career_level?.toLowerCase() === 'super_star_leader' ? (
                  <img 
                    src="/images/products/superstar_logo.jpeg" 
                    alt="Super Star Leader Logo"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : selectedUser.career_level?.toLowerCase() === 'presidents_team' ? (
                  <img 
                    src="/images/products/baskanlar_logo.jpeg" 
                    alt="Başkanlar Logo"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : selectedUser.profile_photo ? (
                  <img 
                    src={selectedUser.profile_photo} 
                    alt="Profile" 
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  `${selectedUser.first_name?.charAt(0)}${selectedUser.last_name?.charAt(0)}`
                )}
              </div>

              <h3 style={{
                color: '#FFD700',
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '5px'
              }}>
                {selectedUser.first_name} {selectedUser.last_name}
              </h3>

              <div style={{
                color: '#fff',
                fontSize: '14px',
                marginBottom: '10px'
              }}>
                {selectedUser.sponsor_id}
              </div>

              <div style={{
                backgroundColor: getCareerLevelColor(selectedUser.career_level),
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold',
                padding: '5px 15px',
                borderRadius: '15px',
                display: 'inline-block'
              }}>
                {getCareerLevelName(selectedUser.career_level)}
              </div>
            </div>

            {/* Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              fontSize: '14px'
            }}>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '12px',
                borderRadius: '8px'
              }}>
                <div style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: '5px' }}>
                  İşe Başlama Tarihi
                </div>
                <div style={{ color: '#fff' }}>
                  {formatDate(selectedUser.join_date)}
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '12px',
                borderRadius: '8px'
              }}>
                <div style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: '5px' }}>
                  Telefon
                </div>
                <div style={{ color: '#fff' }}>
                  {selectedUser.phone || '-'}
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '12px',
                borderRadius: '8px'
              }}>
                <div style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: '5px' }}>
                  Email
                </div>
                <div style={{ color: '#fff', fontSize: '12px' }}>
                  {selectedUser.email}
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '12px',
                borderRadius: '8px'
              }}>
                <div style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: '5px' }}>
                  Sponsor
                </div>
                <div style={{ color: '#fff' }}>
                  {selectedUser.sponsor_name || '-'}
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '12px',
                borderRadius: '8px'
              }}>
                <div style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: '5px' }}>
                  Toplam Satış
                </div>
                <div style={{ color: '#fff' }}>
                  ${selectedUser.total_sales?.toLocaleString() || '0'}
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '12px',
                borderRadius: '8px'
              }}>
                <div style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: '5px' }}>
                  Takım Büyüklüğü
                </div>
                <div style={{ color: '#fff' }}>
                  {selectedUser.team_size || '0'} kişi
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '12px',
                borderRadius: '8px'
              }}>
                <div style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: '5px' }}>
                  KKP Puanı
                </div>
                <div style={{ color: '#fff' }}>
                  {selectedUser.total_kkp?.toLocaleString() || '0'}
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '12px',
                borderRadius: '8px'
              }}>
                <div style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: '5px' }}>
                  Bu Ay Aktif
                </div>
                <div style={{ 
                  color: selectedUser.is_active_this_month ? '#28a745' : '#dc3545',
                  fontWeight: 'bold'
                }}>
                  {selectedUser.is_active_this_month ? 'EVET' : 'HAYIR'}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {selectedUser.notes && (
              <div style={{
                marginTop: '20px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '15px',
                borderRadius: '10px'
              }}>
                <div style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: '8px' }}>
                  Notlar
                </div>
                <div style={{ color: '#fff', fontSize: '14px', lineHeight: '1.5' }}>
                  {selectedUser.notes}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hoowell Bilgi Bankası Logo */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '10px',
        padding: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        zIndex: 100
      }}>
        <img 
          src="/hoowell-logo.png" 
          alt="HOOWELL Logo"
          style={{
            width: '60px',
            height: '30px',
            objectFit: 'contain',
            marginBottom: '3px'
          }}
        />
        <div style={{
          fontSize: '8px',
          fontWeight: 'bold',
          color: 'var(--primary-dark)'
        }}>
          BİLGİ BANKASI
        </div>
      </div>
    </div>
  );
};

export default FranchiseNetwork;