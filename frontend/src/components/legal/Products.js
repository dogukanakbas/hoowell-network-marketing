import React from 'react';
import { Link } from 'react-router-dom';

const Products = () => {
  return (
    <div style={{ 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: '40px 20px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: 'var(--primary-dark)', 
          marginBottom: '30px',
          textAlign: 'center',
          fontSize: '32px'
        }}>
          Ürünler ve Hizmetler
        </h1>

        {/* Alkali İonizer Açıklama */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ 
            backgroundColor: 'var(--primary-dark)', 
            color: 'white', 
            padding: '30px', 
            borderRadius: '15px',
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <h2 style={{ color: 'var(--accent-gold)', marginBottom: '20px', fontSize: '28px' }}>
              HOOWELL ALKALİ İONİZER CİHAZI
            </h2>
            <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '20px' }}>
              <strong>Dünya'da herkesin içilecek temiz suya ihtiyacı var. Ama temiz olması yeterli mi?</strong>
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '15px' }}>
              Gerçekte bunun cevabı <strong>HAYIR.</strong> Çünkü insanların su içtiklerinde sudan almaları gerek çok önemli mineraller var.
            </p>
            <div style={{ 
              backgroundColor: 'var(--accent-gold)', 
              color: 'var(--primary-dark)', 
              padding: '20px', 
              borderRadius: '10px',
              margin: '20px 0'
            }}>
              <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                🔬 BİLİMSEL GERÇEK:
              </p>
              <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
                <strong>Temiz su, aslında oksidandır yani vücudumuzu paslandırır.</strong><br/>
                Oysa ki Hoowell Alkali İonizer cihazından içilen su <strong>Antioksidandır. Yani PAS ÇÖZÜCÜDÜR.</strong>
              </p>
            </div>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
              Basit filtrelerden çıkan temiz su insanları YAŞLANDIRIRKEN,<br/>
              Hoowell Alkali İonizer'dan çıkan su GENÇLEŞTİRİR.<br/>
              Bu çok önemli bir İNOVASYONDUR.
            </p>
          </div>
        </section>

        <div style={{ lineHeight: '1.8', fontSize: '16px', color: '#333' }}>
          {/* Ana Ürünler */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '25px', textAlign: 'center' }}>
              Ürün Gamımız
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
              
              {/* HOOWELL Premium El Terminali */}
              <div style={{ 
                backgroundColor: 'white', 
                padding: '25px', 
                borderRadius: '20px', 
                border: '3px solid #ff9800',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>📱</div>
                <h3 style={{ color: 'var(--primary-dark)', marginBottom: '15px', fontSize: '20px' }}>
                  HOOWELL Premium El Terminali
                </h3>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold', 
                    color: '#ff9800' 
                  }}>
                    19.680 TL
                  </span>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    (KDV Dahil)
                  </div>
                </div>
                
                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                  <ul style={{ paddingLeft: '20px', fontSize: '13px' }}>
                    <li>Kompakt Tasarım</li>
                    <li>5 Aşamalı Filtrasyon</li>
                    <li>Renk Seçenekleri</li>
                    <li>2 Yıl Garanti</li>
                    <li>Ücretsiz Kurulum</li>
                  </ul>
                </div>

                <Link 
                  to="/customer-registration"
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#ff9800',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  🛒 Satın Al
                </Link>
              </div>

              {/* HOOWELL Professional */}
              <div style={{ 
                backgroundColor: 'white', 
                padding: '25px', 
                borderRadius: '20px', 
                border: '3px solid var(--primary-dark)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏆</div>
                <h3 style={{ color: 'var(--primary-dark)', marginBottom: '15px', fontSize: '20px' }}>
                  HOOWELL Professional Alkali İyonizer Cihazı
                </h3>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold', 
                    color: 'var(--primary-dark)' 
                  }}>
                    86.400 TL
                  </span>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    (KDV Dahil)
                  </div>
                </div>
                
                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                  <ul style={{ paddingLeft: '20px', fontSize: '13px' }}>
                    <li>7 Aşamalı Filtrasyon</li>
                    <li>UV Sterilizasyon</li>
                    <li>Mineral Dengeleme</li>
                    <li>Akıllı Kontrol Paneli</li>
                    <li>2 Yıl Garanti</li>
                  </ul>
                </div>

                <Link 
                  to="/customer-registration"
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'var(--primary-dark)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  🛒 Satın Al
                </Link>
              </div>

              {/* HOOWELL Elite - KAMPANYALI ÜRÜN */}
              <div style={{ 
                backgroundColor: 'white', 
                padding: '25px', 
                borderRadius: '20px', 
                border: '3px solid #ff6b35',
                boxShadow: '0 8px 25px rgba(255,107,53,0.3)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Kampanya Badge */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '-30px',
                  backgroundColor: '#ff6b35',
                  color: 'white',
                  padding: '5px 40px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  transform: 'rotate(45deg)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}>
                  KAMPANYA
                </div>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>⭐</div>
                <h3 style={{ color: 'var(--primary-dark)', marginBottom: '15px', fontSize: '20px' }}>
                  HOOWELL Elite Alkali İyonizer Sistemi
                </h3>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ 
                    backgroundColor: '#ff6b35', 
                    color: 'white', 
                    padding: '8px 15px', 
                    borderRadius: '20px', 
                    marginBottom: '10px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    🔥 ÖZEL KAMPANYA FİYATI
                  </div>
                  <span style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold', 
                    color: '#ff6b35' 
                  }}>
                    98.400 TL
                  </span>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    (KDV Dahil)
                  </div>
                </div>
                
                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                  <ul style={{ paddingLeft: '20px', fontSize: '13px' }}>
                    <li>Premium 7 Aşamalı Filtrasyon</li>
                    <li>UV + Ozon Sterilizasyon</li>
                    <li>Akıllı Mineral Dengeleme</li>
                    <li>Dokunmatik Kontrol Paneli</li>
                    <li>Renk Seçenekleri</li>
                    <li>2 Yıl Garanti</li>
                  </ul>
                </div>

                <Link 
                  to="/customer-registration"
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'var(--accent-gold)',
                    color: 'var(--primary-dark)',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  🛒 Satın Al
                </Link>
              </div>

              {/* Eğitim Paketi */}
              <div style={{ 
                backgroundColor: 'white', 
                padding: '25px', 
                borderRadius: '20px', 
                border: '3px solid #2196f3',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>📚</div>
                <h3 style={{ color: 'var(--primary-dark)', marginBottom: '15px', fontSize: '20px' }}>
                  Eğitim Paketi
                </h3>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold', 
                    color: '#2196f3' 
                  }}>
                    4.800 TL
                  </span>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    (KDV Dahil)
                  </div>
                </div>
                
                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                  <ul style={{ paddingLeft: '20px', fontSize: '13px' }}>
                    <li>10 Video Eğitimi</li>
                    <li>Sınav Sistemi</li>
                    <li>Dijital Sertifika</li>
                    <li>Online Platform Erişimi</li>
                    <li>7/24 Teknik Destek</li>
                  </ul>
                </div>

                <Link 
                  to="/partner-registration"
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#2196f3',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  🤝 İş Ortağı Ol
                </Link>
              </div>

              {/* Franchise Paketi */}
              <div style={{ 
                backgroundColor: 'white', 
                padding: '25px', 
                borderRadius: '20px', 
                border: '3px solid #4caf50',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🤝</div>
                <h3 style={{ color: 'var(--primary-dark)', marginBottom: '15px', fontSize: '20px' }}>
                  Franchise Paketi
                </h3>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold', 
                    color: '#4caf50' 
                  }}>
                    86.400 TL
                  </span>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    (KDV Dahil)
                  </div>
                </div>
                
                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                  <ul style={{ paddingLeft: '20px', fontSize: '13px' }}>
                    <li>Professional Cihaz</li>
                    <li>Eğitim Paketi Dahil</li>
                    <li>İş Ortaklığı Hakları</li>
                    <li>Komisyon Sistemi</li>
                    <li>Tam Destek</li>
                  </ul>
                </div>

                <Link 
                  to="/partner-registration"
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  🤝 İş Ortağı Ol
                </Link>
              </div>
            </div>
          </section>

          {/* Ürün Karşılaştırması */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '25px', textAlign: 'center' }}>
              Ürün Karşılaştırması
            </h2>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                backgroundColor: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--primary-dark)', color: 'white' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px' }}>Özellik</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>Premium El Terminali</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>Professional Cihazı</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', backgroundColor: '#fff3e0', color: '#ff6b35' }}>Elite Sistemi 🔥</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>Eğitim</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>Franchise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', fontSize: '13px' }}>💰 Fiyat</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>19.680 TL</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>86.400 TL</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>98.400 TL</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>4.800 TL</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>86.400 TL</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee', backgroundColor: '#f8f9fa' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', fontSize: '13px' }}>🔧 Filtrasyon</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>5 Aşama</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>7 Aşama</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>7 Aşama+</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>-</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>7 Aşama</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', fontSize: '13px' }}>🎨 Renk Seçeneği</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>✅</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>❌</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>✅</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>-</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>❌</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee', backgroundColor: '#f8f9fa' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', fontSize: '13px' }}>📚 Eğitim Sistemi</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>❌</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>❌</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>❌</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>✅</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>✅</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', fontSize: '13px' }}>🛡️ Garanti</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>2 Yıl</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>2 Yıl</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>2 Yıl</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>Eğitim Desteği</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>2 Yıl</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee', backgroundColor: '#f8f9fa' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', fontSize: '13px' }}>🎯 Hedef Kitle</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>Bireysel</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>Bireysel</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>Bireysel</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>İş Ortağı</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>İş Ortağı</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', fontWeight: 'bold', fontSize: '13px' }}>💼 İş Ortaklığı</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>❌</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>❌</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>❌</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>✅</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Hizmetlerimiz */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '25px', textAlign: 'center' }}>
              Hizmetlerimiz
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#e3f2fd', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎓</div>
                <h3 style={{ color: '#1565c0', marginBottom: '10px' }}>Eğitim Hizmetleri</h3>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#1565c0', textAlign: 'left' }}>
                  <li>Online Eğitim Platformu</li>
                  <li>Sertifika Programları</li>
                  <li>Webinar ve Seminerler</li>
                  <li>Bireysel Mentorluk</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#f3e5f5', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔧</div>
                <h3 style={{ color: '#7b1fa2', marginBottom: '10px' }}>Teknik Servis</h3>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#7b1fa2', textAlign: 'left' }}>
                  <li>Kurulum Hizmeti</li>
                  <li>Bakım ve Onarım</li>
                  <li>Yedek Parça Tedariki</li>
                  <li>7/24 Teknik Destek</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#e8f5e8', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🤝</div>
                <h3 style={{ color: '#2e7d32', marginBottom: '10px' }}>İş Ortaklığı</h3>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#2e7d32', textAlign: 'left' }}>
                  <li>Bayi Sistemi</li>
                  <li>7 Seviyeli Kariyer Planı</li>
                  <li>Komisyon Sistemi</li>
                  <li>Bonus Programları</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#fff3e0', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>📞</div>
                <h3 style={{ color: '#f57c00', marginBottom: '10px' }}>Müşteri Hizmetleri</h3>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#f57c00', textAlign: 'left' }}>
                  <li>Sipariş Takibi</li>
                  <li>İade ve Değişim</li>
                  <li>Şikayet Yönetimi</li>
                  <li>Müşteri Danışmanlığı</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Teknoloji ve Kalite */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '25px', textAlign: 'center' }}>
              Teknoloji ve Kalite
            </h2>
            
            <div style={{ backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '25px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔬</div>
                  <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
                    İleri Teknoloji
                  </h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    En son alkali iyonizer teknolojileri ile üretilmiş cihazlar
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏅</div>
                  <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
                    Kalite Sertifikaları
                  </h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    Uluslararası kalite standartlarına uygun üretim
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>🌱</div>
                  <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
                    Çevre Dostu
                  </h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    Sürdürülebilir ve çevre dostu teknolojiler
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>⚡</div>
                  <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
                    Enerji Verimli
                  </h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    Düşük enerji tüketimi ile yüksek performans
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Satın Alma Süreci */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '25px', textAlign: 'center' }}>
              Satın Alma Süreci
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: 'var(--primary-dark)', 
                  color: 'white', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 15px auto',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}>
                  1
                </div>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>Ürün Seçimi</h4>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  İhtiyacınıza uygun ürünü seçin
                </p>
              </div>

              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: 'var(--primary-dark)', 
                  color: 'white', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 15px auto',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}>
                  2
                </div>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>Sipariş Verme</h4>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Online formdan siparişinizi verin
                </p>
              </div>

              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: 'var(--primary-dark)', 
                  color: 'white', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 15px auto',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}>
                  3
                </div>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>Ödeme</h4>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  IBAN'a havale/EFT ile ödeme yapın
                </p>
              </div>

              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: 'var(--primary-dark)', 
                  color: 'white', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 15px auto',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}>
                  4
                </div>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>Teslimat</h4>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  7-14 iş günü içinde teslim
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section style={{ textAlign: 'center', backgroundColor: 'var(--primary-dark)', color: 'white', padding: '40px', borderRadius: '15px' }}>
            <h2 style={{ color: 'var(--accent-gold)', marginBottom: '20px', fontSize: '28px' }}>
              Hemen Başlayın!
            </h2>
            <p style={{ fontSize: '18px', marginBottom: '30px' }}>
              HOOWELL ürünleri ile temiz su teknolojilerinin dünyasına adım atın.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <Link 
                to="/customer-registration"
                style={{
                  display: 'inline-block',
                  backgroundColor: 'var(--accent-gold)',
                  color: 'var(--primary-dark)',
                  padding: '15px 30px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  boxShadow: '0 4px 15px rgba(255,215,0,0.3)'
                }}
              >
                🛒 Ürün Satın Al
              </Link>
              
              <Link 
                to="/partner-registration"
                style={{
                  display: 'inline-block',
                  backgroundColor: 'white',
                  color: 'var(--primary-dark)',
                  padding: '15px 30px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  boxShadow: '0 4px 15px rgba(255,255,255,0.3)'
                }}
              >
                🤝 İş Ortağı Ol
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Products;