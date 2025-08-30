import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCareerManagement = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('urun');
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const careerLevels = [
    {
      level: 'BRONZE İŞ ORTAĞI',
      startAmount: '0.000',
      endAmount: '20.000',
      minPartners: '0',
      salesCommission: '% 14',
      careerBonus: '*****',
      teamCommission: '*****',
      leadershipPool: '****',
      presidencyPool: '****',
      profitShare: '*****',
      globalTravel: '*****'
    },
    {
      level: 'SILVER İŞ ORTAĞI',
      startAmount: '20.001',
      endAmount: '50.000',
      minPartners: '1',
      salesCommission: '% 15',
      careerBonus: '400 $',
      teamCommission: '% 2',
      leadershipPool: '***',
      presidencyPool: '***',
      profitShare: '***',
      globalTravel: '****'
    },
    {
      level: 'GOLD İŞ ORTAĞI',
      startAmount: '50.001',
      endAmount: '100.000',
      minPartners: '3',
      salesCommission: '% 17',
      careerBonus: '800 $',
      teamCommission: '% 4',
      leadershipPool: '****',
      presidencyPool: '****',
      profitShare: 'EVET',
      globalTravel: 'EVET'
    },
    {
      level: 'STAR LİDER',
      startAmount: '100.001',
      endAmount: '175.000',
      minPartners: '7',
      salesCommission: '% 18',
      careerBonus: '1.200 $',
      teamCommission: '% 6',
      leadershipPool: 'EVET',
      presidencyPool: '***',
      profitShare: 'EVET',
      globalTravel: 'EVET'
    },
    {
      level: 'SÜPER STAR LİDER',
      startAmount: '175.001',
      endAmount: '300.000',
      minPartners: '15',
      salesCommission: '% 19',
      careerBonus: '1.600 $',
      teamCommission: '% 8',
      leadershipPool: 'EVET',
      presidencyPool: '*****',
      profitShare: 'EVET',
      globalTravel: 'EVET'
    },
    {
      level: 'BAŞKANLIK TAKIMI',
      startAmount: '300.001',
      endAmount: '400.000',
      minPartners: '25',
      salesCommission: '% 20',
      careerBonus: '*****',
      teamCommission: '% 10',
      leadershipPool: '*****',
      presidencyPool: 'EVET',
      profitShare: 'EVET',
      globalTravel: 'EVET'
    },
    {
      level: 'ÜLKE DISTRIBUTOR',
      startAmount: '400.001',
      endAmount: '*****',
      minPartners: '30',
      salesCommission: '% 20',
      careerBonus: '*****',
      teamCommission: '****',
      leadershipPool: '*****',
      presidencyPool: '*****',
      profitShare: '****',
      globalTravel: 'EVET'
    },
    {
      level: 'YÖNETİM KURULU',
      startAmount: '*****',
      endAmount: '*****',
      minPartners: '*****',
      salesCommission: '% 20',
      careerBonus: '*****',
      teamCommission: '% 12',
      leadershipPool: '*****',
      presidencyPool: '*****',
      profitShare: '*****',
      globalTravel: 'EVET'
    }
  ];

  useEffect(() => {
    setLoading(false);
    if (activeTab === 'urun') {
      fetchProducts();
    }
  }, [activeTab]);

  // Ürünleri getir
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
      setMessage('Ürünler yüklenirken hata oluştu');
      setMessageType('error');
    } finally {
      setProductsLoading(false);
    }
  };

  // Ürün kaydet/güncelle
  const saveProduct = async (productData, isNew = false) => {
    setSaveLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = isNew ? '/api/admin/products' : `/api/admin/products/${productData.id}`;
      const method = isNew ? 'post' : 'put';
      
      const response = await axios[method](url, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setMessage(response.data.message);
        setMessageType('success');
        fetchProducts(); // Listeyi yenile
      }
    } catch (error) {
      console.error('Ürün kaydedilirken hata:', error);
      setMessage(error.response?.data?.message || 'Ürün kaydedilirken hata oluştu');
      setMessageType('error');
    } finally {
      setSaveLoading(false);
    }
  };

  // Ürün sil
  const deleteProduct = async (productId) => {
    if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`/api/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setMessage(response.data.message);
        setMessageType('success');
        fetchProducts(); // Listeyi yenile
      }
    } catch (error) {
      console.error('Ürün silinirken hata:', error);
      setMessage(error.response?.data?.message || 'Ürün silinirken hata oluştu');
      setMessageType('error');
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
        Kariyer verileri yükleniyor...
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
          SİSTEM AYARLARI
        </h1>
      </div>

      {/* Tab Butonları */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <button
          onClick={() => setActiveTab('urun')}
          style={{
            background: activeTab === 'urun' 
              ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
              : 'linear-gradient(135deg, #2a2a2a, #404040)',
            color: activeTab === 'urun' ? '#000' : '#FFD700',
            border: '2px solid #FFD700',
            borderRadius: '15px',
            padding: '12px 30px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}
        >
          ÜRÜN YÖNETİMİ
        </button>
        <button
          onClick={() => setActiveTab('kariyer')}
          style={{
            background: activeTab === 'kariyer' 
              ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
              : 'linear-gradient(135deg, #2a2a2a, #404040)',
            color: activeTab === 'kariyer' ? '#000' : '#FFD700',
            border: '2px solid #FFD700',
            borderRadius: '15px',
            padding: '12px 30px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}
        >
          KARİYER YÖNETİMİ
        </button>
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

      {/* Ürün Yönetimi Tablosu */}
      {activeTab === 'urun' && (
        <div style={{
          background: 'linear-gradient(135deg, #1a4040 0%, #2a5555 50%, #1a4040 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '3px solid #FFD700',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          marginBottom: '30px'
        }}>
          {/* Yeni Ürün Ekleme Butonu */}
          <div style={{
            textAlign: 'right',
            marginBottom: '20px'
          }}>
            <button
              onClick={() => setProducts([...products, {
                id: `new_${Date.now()}`,
                product_name: '',
                product_code: '',
                usd_price: '',
                kkp_points: '',
                vat_percentage: '20',
                sale_price_try: '',
                vat_price: '',
                total_price: '',
                stock_quantity: ''
              }])}
              style={{
                background: 'linear-gradient(135deg, #28a745, #20c997)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              + Yeni Ürün Ekle
            </button>
          </div>

          {/* Loading Durumu */}
          {productsLoading && (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              color: '#FFD700',
              fontSize: '16px'
            }}>
              Ürünler yükleniyor...
            </div>
          )}

          {/* Ürünler Tablosu */}
          {!productsLoading && (
            <div style={{
              display: 'table',
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              {/* Tablo Header */}
              <div style={{
                display: 'table-row'
              }}>
                {['ÜRÜNÜN ADI', 'ÜRÜNÜN KODU', 'USD FİYATI', 'KKP PUANI', 'KDV YÜZDESİ', 'SATIŞ FİYATI (₺)', 'KDV FİYATI', 'TOPLAM FİYAT', 'STOK ADEDİ', 'İŞLEMLER'].map((header, index) => (
                  <div key={index} style={{
                    display: 'table-cell',
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                    color: '#000',
                    padding: '10px 5px',
                    textAlign: 'center',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    borderRadius: '5px',
                    border: '1px solid #FFD700',
                    verticalAlign: 'middle',
                    width: index === 9 ? '8%' : '10.22%' // Son sütun daha dar
                  }}>
                    {header}
                  </div>
                ))}
              </div>

              {/* Ürün Satırları */}
              {products.map((product, rowIndex) => (
                <div key={product.id} style={{
                  display: 'table-row'
                }}>
                  {/* Ürün Adı */}
                  <div style={{
                    display: 'table-cell',
                    padding: '2px',
                    verticalAlign: 'top',
                    width: '10.22%'
                  }}>
                    <input
                      type="text"
                      value={product.product_name || ''}
                      onChange={(e) => {
                        const newProducts = [...products];
                        newProducts[rowIndex].product_name = e.target.value;
                        setProducts(newProducts);
                      }}
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        padding: '6px',
                        textAlign: 'center',
                        fontSize: '10px',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Ürün adı"
                    />
                  </div>

                  {/* Ürün Kodu */}
                  <div style={{
                    display: 'table-cell',
                    padding: '2px',
                    verticalAlign: 'top',
                    width: '10.22%'
                  }}>
                    <input
                      type="text"
                      value={product.product_code || ''}
                      onChange={(e) => {
                        const newProducts = [...products];
                        newProducts[rowIndex].product_code = e.target.value;
                        setProducts(newProducts);
                      }}
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        padding: '6px',
                        textAlign: 'center',
                        fontSize: '10px',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Ürün kodu"
                    />
                  </div>

                  {/* USD Fiyatı */}
                  <div style={{
                    display: 'table-cell',
                    padding: '2px',
                    verticalAlign: 'top',
                    width: '10.22%'
                  }}>
                    <input
                      type="number"
                      step="0.01"
                      value={product.usd_price || ''}
                      onChange={(e) => {
                        const newProducts = [...products];
                        newProducts[rowIndex].usd_price = e.target.value;
                        setProducts(newProducts);
                      }}
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        padding: '6px',
                        textAlign: 'center',
                        fontSize: '10px',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                      placeholder="USD"
                    />
                  </div>

                  {/* KKP Puanı */}
                  <div style={{
                    display: 'table-cell',
                    padding: '2px',
                    verticalAlign: 'top',
                    width: '10.22%'
                  }}>
                    <input
                      type="number"
                      value={product.kkp_points || ''}
                      onChange={(e) => {
                        const newProducts = [...products];
                        newProducts[rowIndex].kkp_points = e.target.value;
                        setProducts(newProducts);
                      }}
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        padding: '6px',
                        textAlign: 'center',
                        fontSize: '10px',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                      placeholder="KKP"
                    />
                  </div>

                  {/* KDV Yüzdesi */}
                  <div style={{
                    display: 'table-cell',
                    padding: '2px',
                    verticalAlign: 'top',
                    width: '10.22%'
                  }}>
                    <input
                      type="number"
                      step="0.01"
                      value={product.vat_percentage || ''}
                      onChange={(e) => {
                        const newProducts = [...products];
                        newProducts[rowIndex].vat_percentage = e.target.value;
                        setProducts(newProducts);
                      }}
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        padding: '6px',
                        textAlign: 'center',
                        fontSize: '10px',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                      placeholder="%"
                    />
                  </div>

                  {/* Satış Fiyatı (₺) */}
                  <div style={{
                    display: 'table-cell',
                    padding: '2px',
                    verticalAlign: 'top',
                    width: '10.22%'
                  }}>
                    <input
                      type="number"
                      step="0.01"
                      value={product.sale_price_try || ''}
                      onChange={(e) => {
                        const newProducts = [...products];
                        newProducts[rowIndex].sale_price_try = e.target.value;
                        setProducts(newProducts);
                      }}
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        padding: '6px',
                        textAlign: 'center',
                        fontSize: '10px',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                      placeholder="₺"
                    />
                  </div>

                  {/* KDV Fiyatı */}
                  <div style={{
                    display: 'table-cell',
                    padding: '2px',
                    verticalAlign: 'top',
                    width: '10.22%'
                  }}>
                    <input
                      type="number"
                      step="0.01"
                      value={product.vat_price || ''}
                      onChange={(e) => {
                        const newProducts = [...products];
                        newProducts[rowIndex].vat_price = e.target.value;
                        setProducts(newProducts);
                      }}
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        padding: '6px',
                        textAlign: 'center',
                        fontSize: '10px',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                      placeholder="₺"
                    />
                  </div>

                  {/* Toplam Fiyat */}
                  <div style={{
                    display: 'table-cell',
                    padding: '2px',
                    verticalAlign: 'top',
                    width: '10.22%'
                  }}>
                    <input
                      type="number"
                      step="0.01"
                      value={product.total_price || ''}
                      onChange={(e) => {
                        const newProducts = [...products];
                        newProducts[rowIndex].total_price = e.target.value;
                        setProducts(newProducts);
                      }}
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        padding: '6px',
                        textAlign: 'center',
                        fontSize: '10px',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                      placeholder="₺"
                    />
                  </div>

                  {/* Stok Adedi */}
                  <div style={{
                    display: 'table-cell',
                    padding: '2px',
                    verticalAlign: 'top',
                    width: '10.22%'
                  }}>
                    <input
                      type="number"
                      value={product.stock_quantity || ''}
                      onChange={(e) => {
                        const newProducts = [...products];
                        newProducts[rowIndex].stock_quantity = e.target.value;
                        setProducts(newProducts);
                      }}
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        padding: '6px',
                        textAlign: 'center',
                        fontSize: '10px',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Adet"
                    />
                  </div>

                  {/* İşlemler */}
                  <div style={{
                    display: 'table-cell',
                    padding: '2px',
                    verticalAlign: 'top',
                    width: '8%',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '5px',
                      justifyContent: 'center'
                    }}>
                      {/* Kaydet Butonu */}
                      <button
                        onClick={() => {
                          const isNew = product.id.toString().startsWith('new_');
                          saveProduct(product, isNew);
                        }}
                        disabled={saveLoading}
                        style={{
                          background: 'linear-gradient(135deg, #28a745, #20c997)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          padding: '4px 8px',
                          fontSize: '9px',
                          cursor: 'pointer',
                          opacity: saveLoading ? 0.6 : 1
                        }}
                      >
                        {saveLoading ? '...' : '💾'}
                      </button>

                      {/* Sil Butonu */}
                      {!product.id.toString().startsWith('new_') && (
                        <button
                          onClick={() => deleteProduct(product.id)}
                          style={{
                            background: 'linear-gradient(135deg, #dc3545, #c82333)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '4px 8px',
                            fontSize: '9px',
                            cursor: 'pointer'
                          }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Kariyer Yönetimi Tablosu */}
      {activeTab === 'kariyer' && (
        <div style={{
          background: 'linear-gradient(135deg, #1a4040 0%, #2a5555 50%, #1a4040 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '3px solid #FFD700',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          {/* Tablo Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(11, 1fr)',
            gap: '2px',
            marginBottom: '10px'
          }}>
            {['KARİYER SEVİYESİ', 'BAŞLANGIÇ TUTAR', 'BİTİŞ TUTAR', 'MİNİMUM İŞ ORTAĞI', 'SATIŞ KOMİSYONU', 'KARİYER BONUSU', 'TAKIM KOMİSYONU', 'LİDERLİK HAVUZU', 'BAŞKANLIK HAVUZU', 'KAR PAYLAŞIMI', 'GLOBAL SEYAHAT'].map((header, index) => (
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

          {/* Tablo Content */}
          {careerLevels.map((career, rowIndex) => (
            <div key={rowIndex} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(11, 1fr)',
              gap: '2px',
              marginBottom: '2px'
            }}>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '9px',
                fontWeight: 'bold',
                borderRadius: '3px'
              }}>
                {career.level}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {career.startAmount}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {career.endAmount}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {career.minPartners}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {career.salesCommission}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {career.careerBonus}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {career.teamCommission}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {career.leadershipPool}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {career.presidencyPool}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {career.profitShare}
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '8px 4px',
                textAlign: 'center',
                fontSize: '10px',
                borderRadius: '3px'
              }}>
                {career.globalTravel}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Kaydet Butonu */}
      <div style={{
        textAlign: 'center',
        marginTop: '30px'
      }}>
        <button style={{
          background: 'linear-gradient(135deg, #28a745, #20c997)',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          padding: '15px 40px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
        }}>
          AYARLARI KAYDET
        </button>
      </div>
    </div>
  );
};

export default AdminCareerManagement;