import React from 'react';

const ShippingInfo = () => {
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
          Teslimat Bilgileri
        </h1>

        <div style={{ lineHeight: '1.8', fontSize: '16px', color: '#333' }}>
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>1. Genel Teslimat Bilgileri</h2>
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
              <p><strong>Şirket:</strong> HOOWELL GLOBAL SU ARITMA SİSTEMLERİ ANONİM ŞİRKETİ</p>
              <p><strong>Teslimat Adresi:</strong> AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR</p>
              <p><strong>Ticaret Sicil No:</strong> 264080</p>
              <p><strong>İletişim:</strong> info@hoowell.com.tr</p>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>2. Teslimat Süreleri</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '15px' }}>
                <h3 style={{ color: '#1565c0', marginBottom: '15px', fontSize: '18px' }}>
                  📚 Eğitim Paketi
                </h3>
                <ul style={{ paddingLeft: '20px', color: '#1565c0' }}>
                  <li><strong>Dijital Teslimat:</strong> Anında</li>
                  <li><strong>Platform Erişimi:</strong> Ödeme onayından sonra 1-2 saat</li>
                  <li><strong>Eğitim Materyalleri:</strong> Online erişim</li>
                  <li><strong>Sertifika:</strong> Eğitim tamamlandıktan sonra</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#f3e5f5', padding: '20px', borderRadius: '15px' }}>
                <h3 style={{ color: '#7b1fa2', marginBottom: '15px', fontSize: '18px' }}>
                  🏆 HOOWELL Cihaz Paketi
                </h3>
                <ul style={{ paddingLeft: '20px', color: '#7b1fa2' }}>
                  <li><strong>Hazırlık Süresi:</strong> 2-3 iş günü</li>
                  <li><strong>Kargo Süresi:</strong> 5-7 iş günü</li>
                  <li><strong>Toplam Süre:</strong> 7-10 iş günü</li>
                  <li><strong>Kurulum:</strong> Teslimat sonrası 1-2 gün</li>
                </ul>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>3. Teslimat Alanları</h2>
            
            <div style={{ backgroundColor: '#e8f5e8', padding: '20px', borderRadius: '15px', marginBottom: '15px' }}>
              <h4 style={{ color: '#2e7d32', marginBottom: '10px' }}>✅ Teslimat Yapılan Bölgeler</h4>
              <p style={{ color: '#2e7d32', margin: 0 }}>
                <strong>Türkiye Geneli:</strong> 81 il ve tüm ilçelere teslimat yapılmaktadır.
              </p>
            </div>

            <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '15px' }}>
              <h4 style={{ color: '#856404', marginBottom: '10px' }}>⚠️ Özel Teslimat Bölgeleri</h4>
              <ul style={{ paddingLeft: '20px', color: '#856404' }}>
                <li><strong>Adalar:</strong> +1-2 gün ek süre</li>
                <li><strong>Dağlık Bölgeler:</strong> +2-3 gün ek süre</li>
                <li><strong>Uzak İlçeler:</strong> Kargo şirketinin ulaştığı noktalara kadar</li>
              </ul>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>4. Kargo Şirketleri</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '8px' }}>🚚 MNG Kargo</h4>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Standart teslimat</p>
              </div>
              
              <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '8px' }}>📦 Yurtiçi Kargo</h4>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Hızlı teslimat</p>
              </div>
              
              <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '8px' }}>🚛 Aras Kargo</h4>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Büyük paketler</p>
              </div>
              
              <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '8px' }}>🏪 Özel Kurye</h4>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>İstanbul içi</p>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>5. Teslimat Ücreti</h2>
            
            <div style={{ backgroundColor: '#d4edda', padding: '20px', borderRadius: '15px', marginBottom: '15px' }}>
              <h4 style={{ color: '#155724', marginBottom: '10px' }}>🆓 Ücretsiz Teslimat</h4>
              <ul style={{ paddingLeft: '20px', color: '#155724' }}>
                <li>Tüm ürünlerde kargo ücreti ürün fiyatına dahildir</li>
                <li>Ek kargo ücreti alınmaz</li>
                <li>Sigorta ücreti dahildir</li>
              </ul>
            </div>

            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '15px' }}>
              <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>📋 Fiyat Detayları</h4>
              <ul style={{ paddingLeft: '20px' }}>
                <li><strong>Eğitim Paketi:</strong> 4.800 TL (Kargo Dahil)</li>
                <li><strong>Cihaz Paketi:</strong> 86.400 TL (Kargo + Kurulum Dahil)</li>
                <li><strong>Sigorta:</strong> Tüm gönderilerde dahil</li>
                <li><strong>Ambalaj:</strong> Özel koruyucu ambalaj dahil</li>
              </ul>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>6. Teslimat Süreci</h2>
            
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
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>Sipariş Onayı</h4>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Ödeme onaylandıktan sonra sipariş hazırlığa alınır
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
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>Hazırlık</h4>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Ürün kontrol edilir ve özel ambalajlanır
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
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>Kargo</h4>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Kargo şirketine teslim edilir ve takip numarası gönderilir
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
                  Ürün adresinize teslim edilir
                </p>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>7. Kurulum Hizmeti</h2>
            
            <div style={{ backgroundColor: '#e3f2fd', padding: '25px', borderRadius: '15px' }}>
              <h3 style={{ color: '#1565c0', marginBottom: '15px' }}>🔧 HOOWELL Cihaz Paketi Kurulumu</h3>
              <ul style={{ paddingLeft: '20px', color: '#1565c0' }}>
                <li><strong>Ücretsiz Kurulum:</strong> Cihaz fiyatına dahil</li>
                <li><strong>Kurulum Süresi:</strong> Teslimat sonrası 1-2 gün içinde</li>
                <li><strong>Teknik Ekip:</strong> Sertifikalı teknisyenler</li>
                <li><strong>Test ve Eğitim:</strong> Kurulum sonrası kullanım eğitimi</li>
                <li><strong>Garanti Başlangıcı:</strong> Kurulum tarihinden itibaren</li>
              </ul>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>8. Teslimat Takibi</h2>
            
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '15px' }}>
              <h4 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>📱 Takip Yöntemleri</h4>
              <ul style={{ paddingLeft: '20px' }}>
                <li><strong>SMS Bildirimi:</strong> Kargo çıkışında otomatik SMS</li>
                <li><strong>E-posta:</strong> Detaylı takip bilgileri</li>
                <li><strong>Müşteri Paneli:</strong> Online sipariş takibi</li>
                <li><strong>Telefon:</strong> Müşteri hizmetlerinden bilgi alma</li>
              </ul>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>9. Teslimat Sorunları</h2>
            
            <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '15px', marginBottom: '15px' }}>
              <h4 style={{ color: '#856404', marginBottom: '10px' }}>⚠️ Olası Sorunlar ve Çözümler</h4>
              <ul style={{ paddingLeft: '20px', color: '#856404' }}>
                <li><strong>Adres Bulunamama:</strong> Detaylı adres bilgisi gerekli</li>
                <li><strong>Alıcı Bulunamama:</strong> Alternatif iletişim bilgisi</li>
                <li><strong>Hava Koşulları:</strong> Teslimat gecikmesi olabilir</li>
                <li><strong>Tatil Günleri:</strong> Teslimat yapılmaz</li>
              </ul>
            </div>

            <div style={{ backgroundColor: '#d4edda', padding: '20px', borderRadius: '15px' }}>
              <h4 style={{ color: '#155724', marginBottom: '10px' }}>✅ Çözüm Süreci</h4>
              <ul style={{ paddingLeft: '20px', color: '#155724' }}>
                <li>Sorun durumunda müşteri hizmetleri aranır</li>
                <li>Alternatif teslimat tarihi belirlenir</li>
                <li>Gerekirse farklı adrese teslimat yapılır</li>
                <li>Kargo şirketi ile koordinasyon sağlanır</li>
              </ul>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>10. İletişim</h2>
            <p>Teslimat ile ilgili sorularınız için bizimle iletişime geçebilirsiniz:</p>
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
              <p><strong>E-posta:</strong> info@hoowell.com.tr</p>
              <p><strong>Konu:</strong> "Teslimat Bilgisi - Sipariş Numaranız"</p>
              <p><strong>Adres:</strong> AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR</p>
              <p><strong>Çalışma Saatleri:</strong> Pazartesi-Cuma 09:00-18:00</p>
            </div>
            <p style={{ fontStyle: 'italic', marginTop: '20px' }}>
              <strong>Son Güncelleme Tarihi:</strong> 08.01.2025
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;