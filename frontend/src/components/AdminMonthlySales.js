/**
 * @typedef {import('react').FC} FC
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminMonthlySales = () => {
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('AY SEÇİN');
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        fetchSalesData();
    }, []);

    const fetchSalesData = async () => {
        try {
            // API'den satış verilerini çek
            setLoading(false);
        } catch (error) {
            console.error('Satış verileri yüklenirken hata:', error);
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
                Satış verileri yükleniyor...
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
                border: '2px solid rgba(255, 255, 255, 0.2)',
                zIndex: 10
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
                marginBottom: '30px'
            }}>
                <input
                    type="text"
                    placeholder="Ara..."
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
                    <option value="OCAK">OCAK</option>
                    <option value="ŞUBAT">ŞUBAT</option>
                    <option value="MART">MART</option>
                    <option value="NİSAN">NİSAN</option>
                    <option value="MAYIS">MAYIS</option>
                    <option value="HAZİRAN">HAZİRAN</option>
                    <option value="TEMMUZ">TEMMUZ</option>
                    <option value="AĞUSTOS">AĞUSTOS</option>
                    <option value="EYLÜL">EYLÜL</option>
                    <option value="EKİM">EKİM</option>
                    <option value="KASIM">KASIM</option>
                    <option value="ARALIK">ARALIK</option>
                </select>
            </div>

            {/* Satış Tablosu */}
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
                    gridTemplateColumns: 'repeat(10, 1fr)',
                    gap: '2px',
                    marginBottom: '10px'
                }}>
                    {['ID NUMARASI', 'ADI SOYADI', 'SPONSOR ID', 'MÜŞTERİ ADI SOYADI', 'MÜŞTERİ TELEFONU', 'MÜŞTERİ Email Adresi', 'SATIŞ TARİHİ', 'TESLİMAT TARİHİ', 'TESLİMAT TARİHİ', 'ÖDEME ŞEKLİ'].map((header, index) => (
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

                {/* Tablo Content - Boş satırlar */}
                {Array.from({ length: 10 }, (_, rowIndex) => (
                    <div key={rowIndex} style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(10, 1fr)',
                        gap: '2px',
                        marginBottom: '2px'
                    }}>
                        {Array.from({ length: 10 }, (_, colIndex) => (
                            <div key={colIndex} style={{
                                backgroundColor: rowIndex % 2 === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)',
                                padding: '8px 4px',
                                textAlign: 'center',
                                fontSize: '11px',
                                borderRadius: '3px',
                                minHeight: '20px'
                            }}>
                                {/* Boş hücre */}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminMonthlySales;