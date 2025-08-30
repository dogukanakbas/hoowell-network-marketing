/**
 * @typedef {import('react').FC} FC
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminMonthlySales = () => {
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('AY SEÇİN');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [salesData, setSalesData] = useState([]);
    const [salesSummary, setSalesSummary] = useState({});
    const [productStats, setProductStats] = useState([]);
    const [monthlySummary, setMonthlySummary] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
        fetchSalesData();
        fetchSalesSummary();
    }, []);

    useEffect(() => {
        if (selectedMonth !== 'AY SEÇİN') {
            fetchSalesData();
        }
    }, [selectedMonth, selectedYear, searchTerm]);

    const fetchSalesData = async () => {
        setDataLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            
            if (selectedMonth !== 'AY SEÇİN') {
                params.append('year', selectedYear);
                params.append('month', selectedMonth);
            }
            
            if (searchTerm) {
                params.append('search', searchTerm);
            }

            const response = await axios.get(`/api/admin/monthly-sales?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setSalesData(response.data.data.sales);
                setSalesSummary(response.data.data.summary);
                setProductStats(response.data.data.productStats);
            }
        } catch (error) {
            console.error('Satış verileri yüklenirken hata:', error);
        } finally {
            setDataLoading(false);
        }
    };

    const fetchSalesSummary = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/admin/sales-summary', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setMonthlySummary(response.data.monthlySummary);
            }
        } catch (error) {
            console.error('Satış özeti yüklenirken hata:', error);
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
                Satış verileri yükleniyor...
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
                    AYLIK SATIŞLAR
                </h1>
            </div>

            {/* Arama ve Filtre */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                marginBottom: '30px',
                flexWrap: 'wrap'
            }}>
                <input
                    type="text"
                    placeholder="Müşteri adı, ürün adı ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '12px 20px',
                        fontSize: '16px',
                        borderRadius: '25px',
                        border: '2px solid #FFD700',
                        backgroundColor: 'white',
                        width: '300px'
                    }}
                />
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{
                        padding: '12px 20px',
                        fontSize: '16px',
                        borderRadius: '25px',
                        border: '2px solid #FFD700',
                        backgroundColor: 'white',
                        width: '120px'
                    }}
                >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={{
                        padding: '12px 20px',
                        fontSize: '16px',
                        borderRadius: '25px',
                        border: '2px solid #FFD700',
                        backgroundColor: 'white',
                        width: '150px'
                    }}
                >
                    <option value="AY SEÇİN">AY SEÇİN</option>
                    <option value="1">OCAK</option>
                    <option value="2">ŞUBAT</option>
                    <option value="3">MART</option>
                    <option value="4">NİSAN</option>
                    <option value="5">MAYIS</option>
                    <option value="6">HAZİRAN</option>
                    <option value="7">TEMMUZ</option>
                    <option value="8">AĞUSTOS</option>
                    <option value="9">EYLÜL</option>
                    <option value="10">EKİM</option>
                    <option value="11">KASIM</option>
                    <option value="12">ARALIK</option>
                </select>
            </div>

            {/* Özet İstatistikler */}
            {Object.keys(salesSummary).length > 0 && (
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
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Toplam Satış</h3>
                        <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
                            {salesSummary.total_sales || 0}
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
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Toplam Tutar (USD)</h3>
                        <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
                            ${salesSummary.total_amount_usd || 0}
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
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Toplam KKP</h3>
                        <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
                            {salesSummary.total_kkp_earned || 0}
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
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Ortalama Satış</h3>
                        <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
                            ${salesSummary.avg_sale_amount ? salesSummary.avg_sale_amount.toFixed(2) : 0}
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
                    Satış verileri yükleniyor...
                </div>
            )}

            {/* Satış Tablosu */}
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
                        gridTemplateColumns: 'repeat(8, 1fr)',
                    gap: '2px',
                    marginBottom: '10px'
                }}>
                        {['SATIŞ ID', 'SATICI', 'SPONSOR ID', 'ÜRÜN', 'MİKTAR', 'TUTAR (USD)', 'KKP', 'TARİH'].map((header, index) => (
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
                    {salesData.length > 0 ? (
                        salesData.map((sale, rowIndex) => (
                            <div key={sale.id} style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(8, 1fr)',
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
                                    {sale.id}
                                </div>
                                <div style={{
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    padding: '8px 4px',
                                    textAlign: 'center',
                                    fontSize: '10px',
                                    borderRadius: '3px'
                                }}>
                                    {sale.first_name} {sale.last_name}
                                </div>
                                <div style={{
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    padding: '8px 4px',
                                    textAlign: 'center',
                                    fontSize: '10px',
                                    borderRadius: '3px'
                                }}>
                                    {sale.sponsor_id}
                                </div>
                                <div style={{
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    padding: '8px 4px',
                                    textAlign: 'center',
                                    fontSize: '10px',
                                    borderRadius: '3px'
                                }}>
                                    {sale.product_name || 'N/A'}
                                </div>
                                <div style={{
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    padding: '8px 4px',
                                    textAlign: 'center',
                                    fontSize: '10px',
                                    borderRadius: '3px'
                                }}>
                                    {sale.quantity || 1}
                                </div>
                                <div style={{
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    padding: '8px 4px',
                                    textAlign: 'center',
                                    fontSize: '10px',
                                    borderRadius: '3px'
                                }}>
                                    ${sale.amount_usd}
                                </div>
                                <div style={{
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    padding: '8px 4px',
                                    textAlign: 'center',
                                    fontSize: '10px',
                                    borderRadius: '3px'
                                }}>
                                    {sale.kkp_earned}
                                </div>
                                <div style={{
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    padding: '8px 4px',
                                    textAlign: 'center',
                                    fontSize: '10px',
                                    borderRadius: '3px'
                                }}>
                                    {new Date(sale.created_at).toLocaleDateString('tr-TR')}
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
                            {selectedMonth === 'AY SEÇİN' ? 'Lütfen bir ay seçin' : 'Bu ay için satış verisi bulunamadı'}
                        </div>
                    )}
                </div>
            )}

            {/* Ürün Bazında İstatistikler */}
            {productStats.length > 0 && (
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
                        Ürün Bazında Satış İstatistikleri
                    </h3>
                    
                    {/* Ürün İstatistikleri Tablosu */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: '2px',
                        marginBottom: '10px'
                    }}>
                        {['ÜRÜN ADI', 'ÜRÜN KODU', 'SATIŞ ADEDİ', 'TOPLAM TUTAR', 'TOPLAM MİKTAR'].map((header, index) => (
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

                    {productStats.map((product, index) => (
                        <div key={index} style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)',
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
                                {product.product_name}
                            </div>
                            <div style={{
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                padding: '8px 4px',
                                textAlign: 'center',
                                fontSize: '10px',
                                borderRadius: '3px'
                            }}>
                                {product.product_code}
                            </div>
                            <div style={{
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                padding: '8px 4px',
                                textAlign: 'center',
                                fontSize: '10px',
                                borderRadius: '3px'
                            }}>
                                {product.sales_count}
                            </div>
                            <div style={{
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                padding: '8px 4px',
                                textAlign: 'center',
                                fontSize: '10px',
                                borderRadius: '3px'
                            }}>
                                ${product.total_amount}
                            </div>
                            <div style={{
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                padding: '8px 4px',
                                textAlign: 'center',
                                fontSize: '10px',
                                borderRadius: '3px'
                            }}>
                                {product.total_quantity}
                            </div>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};

export default AdminMonthlySales;