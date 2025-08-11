import React from 'react';

const CookiePolicy = () => {
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
          Çerez Politikası
        </h1>

        <div style={{ lineHeight: '1.8', fontSize: '16px', color: '#333' }}>
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>1. Çerez Nedir?</h2>
            <p>
              Çerezler (cookies), web sitelerinin daha iyi çalışması ve kullanıcı deneyiminin iyileştirilmesi 
              amacıyla tarayıcınızda saklanan küçük metin dosyalarıdır. Bu dosyalar, web sitesini ziyaret 
              ettiğinizde bilgisayarınıza veya mobil cihazınıza kaydedilir.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>2. Veri Sorumlusu</h2>
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
              <p><strong>Şirket Unvanı:</strong> HOOWELL GLOBAL ALKALİ İYONİZER SİSTEMLERİ ANONİM ŞİRKETİ</p>
              <p><strong>Adres:</strong> AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR</p>
              <p><strong>Ticaret Sicil No:</strong> 264080</p>
              <p><strong>E-posta:</strong> info@hoowell.com.tr</p>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>3. Çerez Türleri</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '15px' }}>
                <h3 style={{ color: '#1565c0', marginBottom: '15px', fontSize: '18px' }}>
                  🔧 Zorunlu Çerezler
                </h3>
                <p style={{ fontSize: '14px', color: '#1565c0', marginBottom: '10px' }}>
                  Web sitesinin temel işlevlerinin çalışması için gereklidir.
                </p>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#1565c0' }}>
                  <li>Oturum yönetimi</li>
                  <li>Güvenlik</li>
                  <li>Dil tercihleri</li>
                  <li>Sepet bilgileri</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#f3e5f5', padding: '20px', borderRadius: '15px' }}>
                <h3 style={{ color: '#7b1fa2', marginBottom: '15px', fontSize: '18px' }}>
                  📊 Analitik Çerezler
                </h3>
                <p style={{ fontSize: '14px', color: '#7b1fa2', marginBottom: '10px' }}>
                  Web sitesi performansını ölçmek ve iyileştirmek için kullanılır.
                </p>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#7b1fa2' }}>
                  <li>Ziyaretçi sayısı</li>
                  <li>Sayfa görüntülemeleri</li>
                  <li>Kullanıcı davranışları</li>
                  <li>Hata raporları</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#e8f5e8', padding: '20px', borderRadius: '15px' }}>
                <h3 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '18px' }}>
                  🎯 Pazarlama Çerezleri
                </h3>
                <p style={{ fontSize: '14px', color: '#2e7d32', marginBottom: '10px' }}>
                  Kişiselleştirilmiş reklamlar ve içerik sunmak için kullanılır.
                </p>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#2e7d32' }}>
                  <li>Reklam tercihleri</li>
                  <li>Sosyal medya entegrasyonu</li>
                  <li>Kişiselleştirme</li>
                  <li>Hedefleme</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#fff3e0', padding: '20px', borderRadius: '15px' }}>
                <h3 style={{ color: '#f57c00', marginBottom: '15px', fontSize: '18px' }}>
                  ⚙️ İşlevsel Çerezler
                </h3>
                <p style={{ fontSize: '14px', color: '#f57c00', marginBottom: '10px' }}>
                  Gelişmiş özellikler ve kişiselleştirme için kullanılır.
                </p>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#f57c00' }}>
                  <li>Kullanıcı tercihleri</li>
                  <li>Form verileri</li>
                  <li>Özelleştirmeler</li>
                  <li>Hatırlanan bilgiler</li>
                </ul>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>4. Kullandığımız Çerezler</h2>
            
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
                    <th style={{ padding: '15px', textAlign: 'left' }}>Çerez Adı</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Türü</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Amacı</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Süre</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>session_id</td>
                    <td style={{ padding: '15px' }}>Zorunlu</td>
                    <td style={{ padding: '15px' }}>Oturum yönetimi</td>
                    <td style={{ padding: '15px' }}>Oturum süresi</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee', backgroundColor: '#f8f9fa' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>auth_token</td>
                    <td style={{ padding: '15px' }}>Zorunlu</td>
                    <td style={{ padding: '15px' }}>Kimlik doğrulama</td>
                    <td style={{ padding: '15px' }}>24 saat</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>language</td>
                    <td style={{ padding: '15px' }}>İşlevsel</td>
                    <td style={{ padding: '15px' }}>Dil tercihi</td>
                    <td style={{ padding: '15px' }}>1 yıl</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee', backgroundColor: '#f8f9fa' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>cart_items</td>
                    <td style={{ padding: '15px' }}>İşlevsel</td>
                    <td style={{ padding: '15px' }}>Sepet bilgileri</td>
                    <td style={{ padding: '15px' }}>7 gün</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>_ga</td>
                    <td style={{ padding: '15px' }}>Analitik</td>
                    <td style={{ padding: '15px' }}>Google Analytics</td>
                    <td style={{ padding: '15px' }}>2 yıl</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>preferences</td>
                    <td style={{ padding: '15px' }}>İşlevsel</td>
                    <td style={{ padding: '15px' }}>Kullanıcı tercihleri</td>
                    <td style={{ padding: '15px' }}>1 yıl</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>5. Çerez Yönetimi</h2>
            
            <div style={{ backgroundColor: '#e3f2fd', padding: '25px', borderRadius: '15px', marginBottom: '20px' }}>
              <h3 style={{ color: '#1565c0', marginBottom: '15px' }}>🔧 Tarayıcı Ayarları</h3>
              <p style={{ color: '#1565c0', marginBottom: '15px' }}>
                Çerezleri tarayıcınızın ayarlarından yönetebilirsiniz:
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                  <h4 style={{ color: '#1565c0', marginBottom: '8px' }}>Chrome</h4>
                  <p style={{ fontSize: '12px', color: '#1565c0', margin: 0 }}>
                    Ayarlar → Gizlilik ve güvenlik → Çerezler
                  </p>
                </div>
                
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                  <h4 style={{ color: '#1565c0', marginBottom: '8px' }}>Firefox</h4>
                  <p style={{ fontSize: '12px', color: '#1565c0', margin: 0 }}>
                    Seçenekler → Gizlilik ve Güvenlik
                  </p>
                </div>
                
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                  <h4 style={{ color: '#1565c0', marginBottom: '8px' }}>Safari</h4>
                  <p style={{ fontSize: '12px', color: '#1565c0', margin: 0 }}>
                    Tercihler → Gizlilik → Çerezler
                  </p>
                </div>
                
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                  <h4 style={{ color: '#1565c0', marginBottom: '8px' }}>Edge</h4>
                  <p style={{ fontSize: '12px', color: '#1565c0', margin: 0 }}>
                    Ayarlar → Site izinleri → Çerezler
                  </p>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '15px' }}>
              <h4 style={{ color: '#856404', marginBottom: '10px' }}>⚠️ Önemli Uyarı</h4>
              <p style={{ color: '#856404', margin: 0 }}>
                Zorunlu çerezleri devre dışı bırakırsanız, web sitesinin bazı özellikleri 
                düzgün çalışmayabilir. Bu durumda tam işlevsellik sağlanamaz.
              </p>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>6. Üçüncü Taraf Çerezleri</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '15px' }}>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>📊 Google Analytics</h4>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                  Web sitesi trafiğini analiz etmek için kullanılır.
                </p>
                <a 
                  href="https://policies.google.com/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ fontSize: '12px', color: 'var(--primary-dark)' }}
                >
                  Gizlilik Politikası →
                </a>
              </div>

              <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '15px' }}>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>💳 Ödeme Sağlayıcıları</h4>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                  Güvenli ödeme işlemleri için kullanılır.
                </p>
                <p style={{ fontSize: '12px', color: '#666' }}>
                  PayTR, İyzico vb.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '15px' }}>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>📱 Sosyal Medya</h4>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                  Sosyal medya paylaşımları için kullanılır.
                </p>
                <p style={{ fontSize: '12px', color: '#666' }}>
                  Facebook, Twitter, Instagram
                </p>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>7. Çerez Onayı</h2>
            
            <div style={{ backgroundColor: '#e8f5e8', padding: '20px', borderRadius: '15px', marginBottom: '15px' }}>
              <h4 style={{ color: '#2e7d32', marginBottom: '10px' }}>✅ Onay Süreci</h4>
              <ul style={{ paddingLeft: '20px', color: '#2e7d32' }}>
                <li>Web sitemizi ilk ziyaret ettiğinizde çerez bildirimi görürsünüz</li>
                <li>Çerez türlerini seçerek onay verebilirsiniz</li>
                <li>Onayınızı istediğiniz zaman değiştirebilirsiniz</li>
                <li>Zorunlu çerezler için onay gerekmez</li>
              </ul>
            </div>

            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '15px' }}>
              <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>🔄 Onay Değiştirme</h4>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Çerez tercihlerinizi değiştirmek için sayfanın alt kısmındaki 
                "Çerez Ayarları" linkini kullanabilirsiniz.
              </p>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>8. Mobil Uygulamalar</h2>
            
            <div style={{ backgroundColor: '#f3e5f5', padding: '20px', borderRadius: '15px' }}>
              <h4 style={{ color: '#7b1fa2', marginBottom: '10px' }}>📱 Mobil Çerezler</h4>
              <p style={{ color: '#7b1fa2', marginBottom: '10px' }}>
                Mobil uygulamalarımızda benzer teknolojiler kullanılır:
              </p>
              <ul style={{ paddingLeft: '20px', color: '#7b1fa2' }}>
                <li>Uygulama tercihleri</li>
                <li>Oturum bilgileri</li>
                <li>Performans verileri</li>
                <li>Kişiselleştirme</li>
              </ul>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>9. Veri Güvenliği</h2>
            
            <div style={{ backgroundColor: '#d4edda', padding: '20px', borderRadius: '15px' }}>
              <h4 style={{ color: '#155724', marginBottom: '10px' }}>🔒 Güvenlik Önlemleri</h4>
              <ul style={{ paddingLeft: '20px', color: '#155724' }}>
                <li>Çerez verileri şifrelenerek saklanır</li>
                <li>Güvenli HTTPS bağlantısı kullanılır</li>
                <li>Düzenli güvenlik güncellemeleri yapılır</li>
                <li>Yetkisiz erişim engellenir</li>
                <li>Veri minimizasyonu ilkesi uygulanır</li>
              </ul>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>10. İletişim</h2>
            <p>Çerez politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:</p>
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
              <p><strong>E-posta:</strong> info@hoowell.com.tr</p>
              <p><strong>Konu:</strong> "Çerez Politikası Sorusu"</p>
              <p><strong>Adres:</strong> AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR</p>
            </div>
          </section>

          <section>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>11. Politika Güncellemeleri</h2>
            <p>
              Bu çerez politikası gerektiğinde güncellenebilir. Güncellemeler web sitemizde 
              yayınlandığı tarihte yürürlüğe girer. Önemli değişiklikler için size bildirim gönderilir.
            </p>
            <p style={{ fontStyle: 'italic', marginTop: '20px' }}>
              <strong>Son Güncelleme Tarihi:</strong> 08.01.2025
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;