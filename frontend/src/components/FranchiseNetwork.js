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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    fetchNetworkData();
  }, []);

  // Arama kutusunun dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

  // Arama fonksiyonu
  const searchInTree = (node, searchTerm) => {
    const results = [];
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) return results;
    
    const searchNode = (currentNode) => {
      if (!currentNode) return;
      
      const fullName = `${currentNode.first_name} ${currentNode.last_name}`.toLowerCase();
      const firstName = currentNode.first_name?.toLowerCase() || '';
      const lastName = currentNode.last_name?.toLowerCase() || '';
      const sponsorId = currentNode.sponsor_id?.toLowerCase() || '';
      
      if (fullName.includes(term) || firstName.includes(term) || lastName.includes(term) || sponsorId.includes(term)) {
        results.push(currentNode);
      }
      
      if (currentNode.children && currentNode.children.length > 0) {
        currentNode.children.forEach(child => searchNode(child));
      }
    };
    
    searchNode(node);
    return results;
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.trim() && networkData) {
      const results = searchInTree(networkData, value);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const selectSearchResult = (user) => {
    fetchUserDetails(user.user_id);
    setShowSearchResults(false);
    setSearchTerm('');
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
        return { cardWidth: '140px', cardGap: '40px', fontSize: '11px' };
      } else if (width <= 768) {
        return { cardWidth: '160px', cardGap: '50px', fontSize: '12px' };
      } else if (width <= 992) {
        return { cardWidth: '170px', cardGap: '60px', fontSize: '13px' };
      } else {
        return { cardWidth: '180px', cardGap: '70px', fontSize: '14px' };
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
              'linear-gradient(135deg, #000000, #1a1a1a)',
            borderRadius: '12px',
            padding: '12px',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
            border: isCurrentUser ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'visible'
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
              overflow: 'visible',
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
                width: `${(childrenCount - 1) * parseInt(cardGap) + childrenCount * parseInt(cardWidth)}px`,
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
              position: 'relative',
              width: '100%',
              minWidth: `${(childrenCount - 1) * parseInt(cardGap) + childrenCount * parseInt(cardWidth)}px`
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
                        zIndex: 2,
                        minHeight: '25px',
                        minWidth: '3px'
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
                        zIndex: 3,
                        minWidth: '8px',
                        minHeight: '8px'
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
      backgroundColor: '#0f2323'
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
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          FRANCHISE AĞI YAPISI
        </h1>
        
        {/* Arama Kutusu */}
        <div className="search-container" style={{
          position: 'relative',
          maxWidth: '400px',
          margin: '0 auto 20px',
          zIndex: 20
        }}>
          <input
            type="text"
            placeholder="Ad, soyad veya ID ile arama yapın..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 45px 12px 15px',
              borderRadius: '25px',
              border: '2px solid #FFD700',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#0f2323',
              fontSize: '14px',
              fontWeight: '500',
              outline: 'none',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.5)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
              e.target.style.transform = 'translateY(0)';
            }}
          />
          <div style={{
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#FFD700',
            fontSize: '18px',
            pointerEvents: 'none'
          }}>
            🔍
          </div>
          
          {/* Arama Sonuçları */}
          {showSearchResults && searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              right: '0',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
              border: '2px solid #FFD700',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 1000,
              marginTop: '5px'
            }}>
              {searchResults.map((result, index) => (
                <div
                  key={result.user_id}
                  onClick={() => selectSearchResult(result)}
                  style={{
                    padding: '12px 15px',
                    borderBottom: index < searchResults.length - 1 ? '1px solid rgba(255, 215, 0, 0.2)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    backgroundColor: getCareerLevelColor(result.career_level),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {result.first_name?.charAt(0)}{result.last_name?.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: '#0f2323',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {result.first_name} {result.last_name}
                    </div>
                    <div style={{
                      color: '#666',
                      fontSize: '12px'
                    }}>
                      {result.sponsor_id} • {getCareerLevelName(result.career_level)}
                    </div>
                  </div>
                  <div style={{
                    color: '#FFD700',
                    fontSize: '16px'
                  }}>
                    👁️
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Arama sonucu bulunamadı */}
          {showSearchResults && searchResults.length === 0 && searchTerm.trim() && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              right: '0',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
              border: '2px solid #FFD700',
              padding: '20px',
              textAlign: 'center',
              color: '#666',
              fontSize: '14px',
              marginTop: '5px'
            }}>
              Arama kriterinize uygun sonuç bulunamadı.
            </div>
          )}
        </div>
        
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
        backgroundColor: '#0f2323',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        overflow: 'visible'
      }}>
        {viewMode === 'tree' ? (
          <div style={{
            width: '100%',
            overflowX: 'auto',
            overflowY: 'visible',
            paddingBottom: '20px',
            minWidth: '100%'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              minWidth: 'max-content',
              padding: '20px',
              width: '100%'
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
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {selectedUser.is_active_this_month ? (
                    <img 
                      src="/images/buttons/evet.png" 
                      alt="EVET" 
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                  ) : (
                    <img 
                      src="/images/buttons/hayır.png" 
                      alt="HAYIR" 
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                  )}
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


    </div>
  );
};

export default FranchiseNetwork;