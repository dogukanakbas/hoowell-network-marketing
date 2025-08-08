import React from 'react';

const TermsOfService = () => {
  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '40px 20px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '50px',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img 
            src="/hoowell-logo.png" 
            alt="HOOWELL Logo"
            style={{
              width: '180px',
              height: '100px',
              objectFit: 'contain',
              marginBottom: '20px'
            }}
          />
          <h1 style={{ 
            color: 'var(--primary-dark)', 
            marginBottom: '10px',
            fontSize: '36px',
            fontWeight: 'bold'
          }}>
            KULLANIM ŞARTLARI VE HİZMET SÖZLEŞMESİ
          </h1>
          <p style={{ color: 'var(--accent-gold)', fontSize: '16px', fontWeight: '500' }}>
            HOOWELL GLOBAL SU ARITMA SİSTEMLERİ ANONİM ŞİRKETİ
          </p>
        </div>

        <div style={{ lineHeight: '1.8', fontSize: '16px', color: '#333' }}>
          
          {/* Yasal Uyarı */}
          <div style={{ 
            backgroundColor: '#d4edda', 
            border: '2px solid #28a745',
            padding: '25px', 
            borderRadius: '15px', 
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#155724', marginBottom: '15px', fontSize: '20px' }}>
              ⚖️ ELEKTRONİK TİCARET VE TÜKETİCİ HAKLARI UYUMLU SÖZLEŞME
            </h3>
            <p style={{ color: '#155724', margin: 0, fontSize: '14px' }}>
              Bu sözleşme, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun, 
              6502 sayılı Tüketicinin Korunması Hakkında Kanun ve ilgili mevzuat uyarınca hazırlanmıştır.
            </p>
          </div>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              1. TARAFLAR VE SÖZLEŞMENİN KONUSU
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
              
              <div style={{ backgroundColor: '#e3f2fd', padding: '25px', borderRadius: '15px', border: '2px solid #2196f3' }}>
                <h4 style={{ color: '#1565c0', marginBottom: '15px', fontSize: '18px' }}>
                  🏢 SATICI BİLGİLERİ (VERGİ MÜKELLEFİ)
                </h4>
                <div style={{ fontSize: '14px', color: '#1565c0' }}>
                  <p><strong>Unvan:</strong> HOOWELL GLOBAL SU ARITMA SİSTEMLERİ ANONİM ŞİRKETİ</p>
                  <p><strong>Adres:</strong> AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR</p>
                  <p><strong>Ticaret Sicil No:</strong> 264080</p>
                  <p><strong>Telefon:</strong> 0232 XXX XX XX</p>
                  <p><strong>E-posta:</strong> info@hoowell.com.tr</p>
                  <p><strong>Web Sitesi:</strong> www.hoowell.com.tr</p>
                </div>
              </div>

              <div style={{ backgroundColor: '#f3e5f5', padding: '25px', borderRadius: '15px', border: '2px solid #9c27b0' }}>
                <h4 style={{ color: '#7b1fa2', marginBottom: '15px', fontSize: '18px' }}>
                  👤 ALICI BİLGİLERİ (TÜKETİCİ/MÜŞTERİ)
                </h4>
                <div style={{ fontSize: '14px', color: '#7b1fa2' }}>
                  <p><strong>Tanım:</strong> Bu sözleşmeyi kabul eden gerçek veya tüzel kişi</p>
                  <p><strong>Tüketici:</strong> Ticari veya mesleki olmayan amaçlarla hareket eden gerçek kişi</p>
                  <p><strong>Müşteri:</strong> Ticari amaçlarla hareket eden gerçek veya tüzel kişi</p>
                  <p><strong>Kayıt:</strong> Sipariş sırasında verilen bilgiler geçerlidir</p>
                  <p><strong>Tebligat:</strong> Kayıtlı adres ve e-posta üzerinden yapılır</p>
                  <p><strong>Sorumluluk:</strong> Verilen bilgilerin doğruluğundan alıcı sorumludur</p>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff3e0', padding: '25px', borderRadius: '15px', marginTop: '25px', border: '2px solid #ff9800' }}>
              <h4 style={{ color: '#f57c00', marginBottom: '15px', fontSize: '18px' }}>
                📋 SÖZLEŞMENİN KONUSU VE KAPSAMI
              </h4>
              <p style={{ color: '#f57c00', marginBottom: '15px', fontSize: '14px' }}>
                Bu sözleşme, HOOWELL'in sunduğu aşağıdaki ürün ve hizmetlerin elektronik ortamda satışı, 
                teslimatı ve satış sonrası hizmetleri kapsamaktadır:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                  <h5 style={{ color: '#f57c00', marginBottom: '8px' }}>🏆 Fiziksel Ürünler</h5>
                  <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#f57c00' }}>
                    <li>HOOWELL Su Arıtma Cihazları</li>
                    <li>Yedek parçalar ve aksesuarlar</li>
                    <li>Filtre sistemleri</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                  <h5 style={{ color: '#f57c00', marginBottom: '8px' }}>📚 Dijital Hizmetler</h5>
                  <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#f57c00' }}>
                    <li>Online eğitim programları</li>
                    <li>Sertifika programları</li>
                    <li>Platform erişim hakları</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                  <h5 style={{ color: '#f57c00', marginBottom: '8px' }}>🤝 İş Ortaklığı</h5>
                  <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#f57c00' }}>
                    <li>Bayi kayıt hizmetleri</li>
                    <li>Network marketing sistemi</li>
                    <li>Komisyon ve bonus ödemeleri</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                  <h5 style={{ color: '#f57c00', marginBottom: '8px' }}>🔧 Destek Hizmetleri</h5>
                  <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#f57c00' }}>
                    <li>Kurulum ve montaj</li>
                    <li>Teknik destek</li>
                    <li>Bakım ve onarım</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              2. ÜRÜN VE HİZMET BİLGİLERİ
            </h2>
            
            <div style={{ display: 'grid', gap: '25px' }}>
              
              <div style={{ backgroundColor: '#e8f5e8', padding: '25px', borderRadius: '15px', border: '2px solid #4caf50' }}>
                <h4 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '18px' }}>
                  📚 EĞİTİM PAKETİ - DİJİTAL HİZMET
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div>
                    <h5 style={{ color: '#2e7d32', marginBottom: '10px' }}>💰 Fiyat Bilgileri</h5>
                    <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px', fontSize: '14px', color: '#2e7d32' }}>
                      <p><strong>Net Fiyat:</strong> 4.000 TL</p>
                      <p><strong>KDV (%20):</strong> 800 TL</p>
                      <p><strong>Toplam Fiyat:</strong> 4.800 TL</p>
                      <p><strong>Para Birimi:</strong> Türk Lirası (TL)</p>
                    </div>
                  </div>
                  <div>
                    <h5 style={{ color: '#2e7d32', marginBottom: '10px' }}>📦 İçerik Detayları</h5>
                    <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px', fontSize: '14px', color: '#2e7d32' }}>
                      <p><strong>Video Sayısı:</strong> 10 Adet</p>
                      <p><strong>Sınav Sistemi:</strong> Her video sonrası</p>
                      <p><strong>Sertifika:</strong> Başarı belgesi</p>
                      <p><strong>Platform Erişimi:</strong> 1 yıl</p>
                    </div>
                  </div>
                  <div>
                    <h5 style={{ color: '#2e7d32', marginBottom: '10px' }}>⏱️ Teslimat Bilgileri</h5>
                    <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px', fontSize: '14px', color: '#2e7d32' }}>
                      <p><strong>Teslimat Türü:</strong> Dijital</p>
                      <p><strong>Teslimat Süresi:</strong> Ödeme onayı sonrası 2 saat</p>
                      <p><strong>Erişim Yöntemi:</strong> E-posta + SMS</p>
                      <p><strong>Cayma Hakkı:</strong> Erişim sağlanmadan önce</p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#e3f2fd', padding: '25px', borderRadius: '15px', border: '2px solid #2196f3' }}>
                <h4 style={{ color: '#1565c0', marginBottom: '15px', fontSize: '18px' }}>
                  🏆 HOOWELL CİHAZ PAKETİ - FİZİKSEL ÜRÜN
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div>
                    <h5 style={{ color: '#1565c0', marginBottom: '10px' }}>💰 Fiyat Bilgileri</h5>
                    <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px', fontSize: '14px', color: '#1565c0' }}>
                      <p><strong>Net Fiyat:</strong> 72.000 TL</p>
                      <p><strong>KDV (%20):</strong> 14.400 TL</p>
                      <p><strong>Toplam Fiyat:</strong> 86.400 TL</p>
                      <p><strong>Para Birimi:</strong> Türk Lirası (TL)</p>
                    </div>
                  </div>
                  <div>
                    <h5 style={{ color: '#1565c0', marginBottom: '10px' }}>📦 Ürün Detayları</h5>
                    <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px', fontSize: '14px', color: '#1565c0' }}>
                      <p><strong>Ürün:</strong> HOOWELL Su Arıtma Cihazı</p>
                      <p><strong>Garanti:</strong> 2 yıl resmi garanti</p>
                      <p><strong>Kurulum:</strong> Ücretsiz profesyonel kurulum</p>
                      <p><strong>Eğitim:</strong> Dahil (4.800 TL değerinde)</p>
                    </div>
                  </div>
                  <div>
                    <h5 style={{ color: '#1565c0', marginBottom: '10px' }}>🚚 Teslimat Bilgileri</h5>
                    <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px', fontSize: '14px', color: '#1565c0' }}>
                      <p><strong>Teslimat Türü:</strong> Kargo</p>
                      <p><strong>Teslimat Süresi:</strong> 7-14 iş günü</p>
                      <p><strong>Kargo Ücreti:</strong> Ücretsiz</p>
                      <p><strong>Cayma Hakkı:</strong> 14 gün</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#f8d7da', padding: '20px', borderRadius: '15px', marginTop: '25px', border: '2px solid #dc3545' }}>
              <h4 style={{ color: '#721c24', marginBottom: '10px' }}>⚠️ ÖNEMLİ UYARILAR</h4>
              <ul style={{ paddingLeft: '20px', color: '#721c24', fontSize: '14px' }}>
                <li>Fiyatlar önceden haber verilmeksizin değiştirilebilir</li>
                <li>Stok durumuna göre teslimat süreleri değişebilir</li>
                <li>Teknik özellikler üretici tarafından güncellenebilir</li>
                <li>Kampanya ve indirimler belirli süre ile sınırlıdır</li>
                <li>Ürün görselleri temsilidir, gerçek ürün farklılık gösterebilir</li>
              </ul>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              3. ÖDEME ŞARTLARI VE YÖNTEMLERİ
            </h2>
            
            <div style={{ display: 'grid', gap: '25px' }}>
              
              <div style={{ backgroundColor: '#e8f5e8', padding: '25px', borderRadius: '15px', border: '2px solid #4caf50' }}>
                <h4 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '18px' }}>
                  💳 KABUL EDİLEN ÖDEME YÖNTEMLERİ
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#2e7d32', marginBottom: '10px' }}>🏦 Banka Havalesi/EFT</h5>
                    <div style={{ fontSize: '14px', color: '#2e7d32' }}>
                      <p><strong>Hesap Sahibi:</strong> HOOWELL GLOBAL SU ARITMA SİSTEMLERİ A.Ş.</p>
                      <p><strong>IBAN:</strong> TR77 0011 1000 0000 0153 1671 66</p>
                      <p><strong>Banka:</strong> Ziraat Bankası</p>
                      <p><strong>Şube:</strong> Çiğli Şubesi</p>
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#2e7d32', marginBottom: '10px' }}>💻 Online Ödeme (Yakında)</h5>
                    <div style={{ fontSize: '14px', color: '#2e7d32' }}>
                      <p><strong>Kredi Kartı:</strong> Visa, Mastercard</p>
                      <p><strong>Debit Kart:</strong> Tüm bankalar</p>
                      <p><strong>Güvenlik:</strong> 3D Secure</p>
                      <p><strong>Sağlayıcı:</strong> PayTR, İyzico</p>
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#2e7d32', marginBottom: '10px' }}>📱 Mobil Ödeme (Yakında)</h5>
                    <div style={{ fontSize: '14px', color: '#2e7d32' }}>
                      <p><strong>Apple Pay:</strong> iOS cihazlar</p>
                      <p><strong>Google Pay:</strong> Android cihazlar</p>
                      <p><strong>Samsung Pay:</strong> Samsung cihazlar</p>
                      <p><strong>Güvenlik:</strong> Biometrik doğrulama</p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#e3f2fd', padding: '25px', borderRadius: '15px', border: '2px solid #2196f3' }}>
                <h4 style={{ color: '#1565c0', marginBottom: '15px', fontSize: '18px' }}>
                  📋 ÖDEME ŞARTLARI VE KOŞULLARI
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div>
                    <h5 style={{ color: '#1565c0', marginBottom: '10px' }}>⏰ Ödeme Süreleri</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#1565c0' }}>
                      <li><strong>Peşin Ödeme:</strong> Sipariş anında</li>
                      <li><strong>Havale/EFT:</strong> Sipariş sonrası 3 gün içinde</li>
                      <li><strong>Kredi Kartı:</strong> Anında işlem</li>
                      <li><strong>Ödeme Onayı:</strong> 1-2 iş günü</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#1565c0', marginBottom: '10px' }}>💰 Fiyat Politikası</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#1565c0' }}>
                      <li><strong>Para Birimi:</strong> Türk Lirası (TL)</li>
                      <li><strong>KDV Oranı:</strong> %20 (dahil)</li>
                      <li><strong>Fiyat Değişikliği:</strong> Önceden bildirim</li>
                      <li><strong>Kampanya Fiyatları:</strong> Sınırlı süre</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#1565c0', marginBottom: '10px' }}>🧾 Fatura ve Belge</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#1565c0' }}>
                      <li><strong>E-Fatura:</strong> Otomatik gönderim</li>
                      <li><strong>E-Arşiv:</strong> Bireysel müşteriler</li>
                      <li><strong>Kağıt Fatura:</strong> Talep halinde</li>
                      <li><strong>Dekont:</strong> Ödeme belgesi gerekli</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '15px', border: '2px solid #ffc107' }}>
                <h4 style={{ color: '#856404', marginBottom: '10px' }}>⚠️ ÖDEME GÜVENLİĞİ VE UYARILAR</h4>
                <ul style={{ paddingLeft: '20px', color: '#856404', fontSize: '14px' }}>
                  <li><strong>Güvenli Ödeme:</strong> Tüm ödemeler SSL şifreleme ile korunur</li>
                  <li><strong>Kişisel Bilgiler:</strong> Kredi kartı bilgileri saklanmaz</li>
                  <li><strong>Dolandırıcılık:</strong> Şüpheli işlemler otomatik tespit edilir</li>
                  <li><strong>İade Güvencesi:</strong> Hatalı ödemeler 5 iş günü içinde iade edilir</li>
                  <li><strong>Müşteri Desteği:</strong> Ödeme sorunları için 7/24 destek</li>
                </ul>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              4. SİPARİŞ SÜRECİ VE ONAY KOŞULLARI
            </h2>
            
            <div style={{ display: 'grid', gap: '25px' }}>
              
              <div style={{ backgroundColor: '#f3e5f5', padding: '25px', borderRadius: '15px', border: '2px solid #9c27b0' }}>
                <h4 style={{ color: '#7b1fa2', marginBottom: '15px', fontSize: '18px' }}>
                  📝 SİPARİŞ VERME SÜRECİ
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      backgroundColor: '#7b1fa2', 
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
                    <h5 style={{ color: '#7b1fa2', marginBottom: '10px' }}>Ürün Seçimi</h5>
                    <p style={{ fontSize: '12px', color: '#7b1fa2', margin: 0 }}>
                      Web sitesinden ürün seçimi ve sepete ekleme
                    </p>
                  </div>

                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      backgroundColor: '#7b1fa2', 
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
                    <h5 style={{ color: '#7b1fa2', marginBottom: '10px' }}>Bilgi Girişi</h5>
                    <p style={{ fontSize: '12px', color: '#7b1fa2', margin: 0 }}>
                      Kişisel ve teslimat bilgilerinin girilmesi
                    </p>
                  </div>

                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      backgroundColor: '#7b1fa2', 
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
                    <h5 style={{ color: '#7b1fa2', marginBottom: '10px' }}>Sözleşme Onayı</h5>
                    <p style={{ fontSize: '12px', color: '#7b1fa2', margin: 0 }}>
                      Kullanım şartları ve sözleşmelerin onaylanması
                    </p>
                  </div>

                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      backgroundColor: '#7b1fa2', 
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
                    <h5 style={{ color: '#7b1fa2', marginBottom: '10px' }}>Ödeme</h5>
                    <p style={{ fontSize: '12px', color: '#7b1fa2', margin: 0 }}>
                      Seçilen yöntemle ödeme işleminin tamamlanması
                    </p>
                  </div>

                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      backgroundColor: '#7b1fa2', 
                      color: 'white', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 15px auto',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}>
                      5
                    </div>
                    <h5 style={{ color: '#7b1fa2', marginBottom: '10px' }}>Onay</h5>
                    <p style={{ fontSize: '12px', color: '#7b1fa2', margin: 0 }}>
                      Sipariş onayı ve teslimat sürecinin başlatılması
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff3e0', padding: '25px', borderRadius: '15px', border: '2px solid #ff9800' }}>
                <h4 style={{ color: '#f57c00', marginBottom: '15px', fontSize: '18px' }}>
                  ✅ SİPARİŞ ONAY KOŞULLARI
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div>
                    <h5 style={{ color: '#f57c00', marginBottom: '10px' }}>📋 Zorunlu Bilgiler</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#f57c00' }}>
                      <li>Ad, soyad ve TC kimlik numarası</li>
                      <li>Geçerli e-posta adresi</li>
                      <li>Cep telefonu numarası</li>
                      <li>Tam teslimat adresi</li>
                      <li>Fatura bilgileri (kurumsal için)</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#f57c00', marginBottom: '10px' }}>✅ Onay Gereksinimleri</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#f57c00' }}>
                      <li>Kullanım şartlarının kabul edilmesi</li>
                      <li>Gizlilik politikasının onaylanması</li>
                      <li>Mesafeli satış sözleşmesinin kabulü</li>
                      <li>Ön bilgilendirme formunun onayı</li>
                      <li>KVKK aydınlatma metninin kabulü</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#f57c00', marginBottom: '10px' }}>🔍 Doğrulama Süreci</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#f57c00' }}>
                      <li>Ödeme doğrulaması (1-2 iş günü)</li>
                      <li>Stok kontrolü</li>
                      <li>Adres doğrulaması</li>
                      <li>Kimlik kontrolü (gerektiğinde)</li>
                      <li>Sipariş onay e-postası gönderimi</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              5. TESLİMAT ŞARTLARI VE KOŞULLARI
            </h2>
            
            <div style={{ display: 'grid', gap: '25px' }}>
              
              <div style={{ backgroundColor: '#e8f5e8', padding: '25px', borderRadius: '15px', border: '2px solid #4caf50' }}>
                <h4 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '18px' }}>
                  🚚 TESLİMAT SÜRELERİ VE BÖLGELER
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#2e7d32', marginBottom: '10px' }}>📚 Dijital Ürünler</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#2e7d32' }}>
                      <li><strong>Eğitim Paketi:</strong> Ödeme onayı sonrası 2 saat</li>
                      <li><strong>Platform Erişimi:</strong> E-posta + SMS ile</li>
                      <li><strong>Sertifika:</strong> Eğitim tamamlandıktan sonra</li>
                      <li><strong>Destek:</strong> 7/24 teknik destek</li>
                    </ul>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#2e7d32', marginBottom: '10px' }}>🏆 Fiziksel Ürünler</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#2e7d32' }}>
                      <li><strong>Hazırlık Süresi:</strong> 2-3 iş günü</li>
                      <li><strong>Kargo Süresi:</strong> 5-7 iş günü</li>
                      <li><strong>Toplam Süre:</strong> 7-10 iş günü</li>
                      <li><strong>Kurulum:</strong> Teslimat sonrası 1-2 gün</li>
                    </ul>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#2e7d32', marginBottom: '10px' }}>🗺️ Teslimat Bölgeleri</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#2e7d32' }}>
                      <li><strong>Türkiye Geneli:</strong> 81 il ve tüm ilçeler</li>
                      <li><strong>Adalar:</strong> +1-2 gün ek süre</li>
                      <li><strong>Dağlık Bölgeler:</strong> +2-3 gün ek süre</li>
                      <li><strong>Kargo Ücreti:</strong> Ücretsiz</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#e3f2fd', padding: '25px', borderRadius: '15px', border: '2px solid #2196f3' }}>
                <h4 style={{ color: '#1565c0', marginBottom: '15px', fontSize: '18px' }}>
                  📦 KARGO VE KURULUM HİZMETLERİ
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#1565c0', marginBottom: '8px', fontSize: '14px' }}>🚛 Kargo Şirketleri</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#1565c0' }}>
                      <li>MNG Kargo</li>
                      <li>Yurtiçi Kargo</li>
                      <li>Aras Kargo</li>
                      <li>Özel Kurye (İstanbul)</li>
                    </ul>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#1565c0', marginBottom: '8px', fontSize: '14px' }}>🔧 Kurulum Hizmeti</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#1565c0' }}>
                      <li>Ücretsiz profesyonel kurulum</li>
                      <li>Sertifikalı teknisyenler</li>
                      <li>Test ve eğitim dahil</li>
                      <li>Garanti başlangıcı</li>
                    </ul>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#1565c0', marginBottom: '8px', fontSize: '14px' }}>📱 Takip Sistemi</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#1565c0' }}>
                      <li>SMS bildirimi</li>
                      <li>E-posta güncellemeleri</li>
                      <li>Online takip</li>
                      <li>Müşteri paneli</li>
                    </ul>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#1565c0', marginBottom: '8px', fontSize: '14px' }}>🛡️ Güvence</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#1565c0' }}>
                      <li>Kargo sigortası dahil</li>
                      <li>Hasarlı teslimat koruması</li>
                      <li>Kayıp paket garantisi</li>
                      <li>Yeniden gönderim</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              6. CAYMA HAKKI VE İADE KOŞULLARI
            </h2>
            
            <div style={{ backgroundColor: '#d4edda', padding: '25px', borderRadius: '15px', marginBottom: '25px', border: '2px solid #28a745' }}>
              <h4 style={{ color: '#155724', marginBottom: '15px' }}>✅ TÜKETİCİ HAKLARI (6502 SAYILI KANUN)</h4>
              <p style={{ color: '#155724', marginBottom: '15px', fontSize: '14px' }}>
                Tüketicinin Korunması Hakkında Kanun uyarınca, tüketiciler aşağıdaki haklara sahiptir:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                  <h5 style={{ color: '#155724', marginBottom: '10px' }}>🕐 14 Günlük Cayma Hakkı</h5>
                  <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#155724' }}>
                    <li>Ürün teslim tarihinden itibaren 14 gün</li>
                    <li>Herhangi bir gerekçe göstermeden</li>
                    <li>Ceza ödemeden cayma hakkı</li>
                    <li>Yazılı bildirim yeterli</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                  <h5 style={{ color: '#155724', marginBottom: '10px' }}>📝 Cayma Bildirimi</h5>
                  <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#155724' }}>
                    <li>E-posta ile bildirim: info@hoowell.com.tr</li>
                    <li>Posta ile bildirim kabul edilir</li>
                    <li>Cayma formu kullanılabilir</li>
                    <li>Açık beyan yeterlidir</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                  <h5 style={{ color: '#155724', marginBottom: '10px' }}>💰 Ödeme İadesi</h5>
                  <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#155724' }}>
                    <li>Cayma bildiriminden itibaren 14 gün içinde</li>
                    <li>Ödeme yapılan yöntemle iade</li>
                    <li>Ek ücret talep edilmez</li>
                    <li>Faiz veya tazminat ödenmez</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              
              <div style={{ backgroundColor: '#fff3e0', padding: '25px', borderRadius: '15px', border: '2px solid #ff9800' }}>
                <h4 style={{ color: '#f57c00', marginBottom: '15px', fontSize: '18px' }}>
                  🏆 FİZİKSEL ÜRÜNLER İÇİN İADE KOŞULLARI
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div>
                    <h5 style={{ color: '#f57c00', marginBottom: '10px' }}>✅ İade Edilebilir Durumlar</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#f57c00' }}>
                      <li>Ürün orijinal ambalajında</li>
                      <li>Kullanılmamış ve hasarsız</li>
                      <li>Tüm aksesuarlar eksiksiz</li>
                      <li>Garanti belgesi mevcut</li>
                      <li>Fatura ve belgeler tam</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#f57c00', marginBottom: '10px' }}>❌ İade Edilemeyen Durumlar</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#f57c00' }}>
                      <li>Su ile temas etmiş cihazlar</li>
                      <li>Kullanılmış veya hasarlı ürünler</li>
                      <li>Orijinal ambalajı olmayan</li>
                      <li>14 günlük süre geçmiş</li>
                      <li>Özel sipariş ürünler</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#f57c00', marginBottom: '10px' }}>🚚 İade Kargo Süreci</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#f57c00' }}>
                      <li>İade onayı sonrası kargo</li>
                      <li>Kargo ücreti müşteri tarafından</li>
                      <li>Hasarlı ürün: şirket karşılar</li>
                      <li>Sigortalı gönderim önerilir</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f3e5f5', padding: '25px', borderRadius: '15px', border: '2px solid #9c27b0' }}>
                <h4 style={{ color: '#7b1fa2', marginBottom: '15px', fontSize: '18px' }}>
                  📚 DİJİTAL HİZMETLER İÇİN ÖZEL KOŞULLAR
                </h4>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                  <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                    <h5 style={{ color: '#856404', marginBottom: '8px' }}>⚠️ ÖNEMLİ UYARI</h5>
                    <p style={{ color: '#856404', fontSize: '14px', margin: 0 }}>
                      Dijital içerik ve hizmetlerde, içeriğe erişim sağlandıktan sonra cayma hakkı kullanılamaz. 
                      Bu durum Tüketicinin Korunması Hakkında Kanun'un 15. maddesinde düzenlenmiştir.
                    </p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <h5 style={{ color: '#7b1fa2', marginBottom: '10px' }}>✅ Cayma Hakkı Var</h5>
                      <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#7b1fa2' }}>
                        <li>Ödeme yapıldı, erişim sağlanmadı</li>
                        <li>Teknik sorun nedeniyle erişim yok</li>
                        <li>Açıklanan özellikler sağlanmıyor</li>
                        <li>Platform çalışmıyor</li>
                      </ul>
                    </div>
                    <div>
                      <h5 style={{ color: '#7b1fa2', marginBottom: '10px' }}>❌ Cayma Hakkı Yok</h5>
                      <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#7b1fa2' }}>
                        <li>Eğitim videolarına erişim sağlandı</li>
                        <li>Platform kullanımına başlandı</li>
                        <li>İndirme işlemi yapıldı</li>
                        <li>Sertifika alındı</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              7. KULLANICI YÜKÜMLÜLÜKLERİ VE SORUMLULUKLAR
            </h2>
            
            <div style={{ display: 'grid', gap: '25px' }}>
              
              <div style={{ backgroundColor: '#e8f5e8', padding: '25px', borderRadius: '15px', border: '2px solid #4caf50' }}>
                <h4 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '18px' }}>
                  ✅ KULLANICI YÜKÜMLÜLÜKLERİ
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div>
                    <h5 style={{ color: '#2e7d32', marginBottom: '10px' }}>📋 Bilgi Doğruluğu</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#2e7d32' }}>
                      <li>Doğru ve güncel bilgi sağlama</li>
                      <li>Kimlik bilgilerinin doğruluğu</li>
                      <li>İletişim bilgilerinin güncel tutulması</li>
                      <li>Adres değişikliklerinin bildirilmesi</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#2e7d32', marginBottom: '10px' }}>🔐 Hesap Güvenliği</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#2e7d32' }}>
                      <li>Şifre güvenliğinin sağlanması</li>
                      <li>Hesap bilgilerinin korunması</li>
                      <li>Yetkisiz erişimin engellenmesi</li>
                      <li>Güvenlik ihlallerinin bildirilmesi</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#2e7d32', marginBottom: '10px' }}>⚖️ Yasal Uyum</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#2e7d32' }}>
                      <li>Türk hukukuna uygun davranış</li>
                      <li>Telif haklarına saygı</li>
                      <li>Ticari etik kurallara uyum</li>
                      <li>Vergi yükümlülüklerinin yerine getirilmesi</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8d7da', padding: '25px', borderRadius: '15px', border: '2px solid #dc3545' }}>
                <h4 style={{ color: '#721c24', marginBottom: '15px', fontSize: '18px' }}>
                  🚫 YASAK FAALİYETLER
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div>
                    <h5 style={{ color: '#721c24', marginBottom: '10px' }}>💻 Sistem Kötüye Kullanımı</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#721c24' }}>
                      <li>Sistemin hacklenmesi veya zarar verilmesi</li>
                      <li>Virüs, malware yayılması</li>
                      <li>DDoS saldırıları</li>
                      <li>Güvenlik açıklarından yararlanma</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#721c24', marginBottom: '10px' }}>📧 Spam ve Taciz</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#721c24' }}>
                      <li>Toplu e-posta gönderimi</li>
                      <li>İstenmeyen reklam mesajları</li>
                      <li>Diğer kullanıcıları rahatsız etme</li>
                      <li>Sahte hesap oluşturma</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#721c24', marginBottom: '10px' }}>⚖️ Hukuka Aykırı İçerik</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#721c24' }}>
                      <li>Telif hakkı ihlali</li>
                      <li>Nefret söylemi</li>
                      <li>Yanıltıcı bilgi paylaşımı</li>
                      <li>Dolandırıcılık faaliyetleri</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              8. FİKRİ MÜLKİYET HAKLARI VE LİSANSLAR
            </h2>
            
            <div style={{ backgroundColor: '#e3f2fd', padding: '25px', borderRadius: '15px', border: '2px solid #2196f3' }}>
              <h4 style={{ color: '#1565c0', marginBottom: '15px', fontSize: '18px' }}>
                ©️ TELİF HAKLARI VE FİKRİ MÜLKİYET
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                  <h5 style={{ color: '#1565c0', marginBottom: '10px' }}>🏢 Şirket Mülkiyeti</h5>
                  <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#1565c0' }}>
                    <li>HOOWELL markası ve logosu</li>
                    <li>Web sitesi tasarımı ve kodları</li>
                    <li>Eğitim içerikleri ve videoları</li>
                    <li>Yazılım ve uygulamalar</li>
                    <li>Ürün katalogları ve görseller</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                  <h5 style={{ color: '#1565c0', marginBottom: '10px' }}>📜 Kullanım Lisansı</h5>
                  <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#1565c0' }}>
                    <li>Kişisel kullanım için sınırlı lisans</li>
                    <li>Ticari kullanım yasak</li>
                    <li>Çoğaltma ve dağıtım yasak</li>
                    <li>Değiştirme ve türev eser yasak</li>
                    <li>Geri alınabilir lisans</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                  <h5 style={{ color: '#1565c0', marginBottom: '10px' }}>⚖️ İhlal Durumları</h5>
                  <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#1565c0' }}>
                    <li>Hukuki işlem başlatılır</li>
                    <li>Tazminat talep edilir</li>
                    <li>Hesap kapatılır</li>
                    <li>Erişim engellenir</li>
                    <li>Cezai sorumluluk doğar</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              9. SORUMLULUK SINIRLAMALARI VE GARANTİLER
            </h2>
            
            <div style={{ display: 'grid', gap: '25px' }}>
              
              <div style={{ backgroundColor: '#fff3e0', padding: '25px', borderRadius: '15px', border: '2px solid #ff9800' }}>
                <h4 style={{ color: '#f57c00', marginBottom: '15px', fontSize: '18px' }}>
                  🛡️ HİZMET GARANTİLERİ
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div>
                    <h5 style={{ color: '#f57c00', marginBottom: '10px' }}>✅ Sağladığımız Garantiler</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#f57c00' }}>
                      <li>Ürün kalitesi ve özellikleri</li>
                      <li>Teslimat sürelerine uyum</li>
                      <li>Müşteri hizmetleri desteği</li>
                      <li>Gizlilik ve veri güvenliği</li>
                      <li>Yasal uyumluluk</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#f57c00', marginBottom: '10px' }}>❌ Garanti Dışı Durumlar</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#f57c00' }}>
                      <li>Kullanıcı hatalarından kaynaklanan sorunlar</li>
                      <li>Üçüncü parti hizmet kesintileri</li>
                      <li>İnternet bağlantı sorunları</li>
                      <li>Mücbir sebep durumları</li>
                      <li>Yetkisiz değişiklikler</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#f57c00', marginBottom: '10px' }}>⚠️ Sorumluluk Sınırları</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#f57c00' }}>
                      <li>Dolaylı zararlar kapsam dışı</li>
                      <li>Kar kaybı tazmin edilmez</li>
                      <li>Maksimum tazminat: ödenen bedel</li>
                      <li>İş kesintisi sorumluluğu yok</li>
                      <li>Üçüncü kişi zararları kapsam dışı</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f3e5f5', padding: '25px', borderRadius: '15px', border: '2px solid #9c27b0' }}>
                <h4 style={{ color: '#7b1fa2', marginBottom: '15px', fontSize: '18px' }}>
                  🤝 İŞ ORTAKLIĞI SİSTEMİ ÖZEL ŞARTLARI
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div>
                    <h5 style={{ color: '#7b1fa2', marginBottom: '10px' }}>📊 Performans Kriterleri</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#7b1fa2' }}>
                      <li>Aylık satış hedefleri</li>
                      <li>Müşteri memnuniyet oranları</li>
                      <li>Eğitim tamamlama zorunluluğu</li>
                      <li>Etik kurallara uyum</li>
                      <li>Düzenli aktivite gerekliliği</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#7b1fa2', marginBottom: '10px' }}>💰 Komisyon Sistemi</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#7b1fa2' }}>
                      <li>Aylık komisyon ödemeleri</li>
                      <li>Performansa dayalı bonuslar</li>
                      <li>Kariyer seviyesi avantajları</li>
                      <li>Network kazançları</li>
                      <li>Vergi kesintileri uygulanır</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#7b1fa2', marginBottom: '10px' }}>📋 Sözleşme Feshi</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#7b1fa2' }}>
                      <li>30 gün önceden bildirim</li>
                      <li>Karşılıklı anlaşma ile fesih</li>
                      <li>İhlal durumunda tek taraflı fesih</li>
                      <li>Fesih sonrası yükümlülükler</li>
                      <li>Gizlilik yükümlülüğü devam eder</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              10. UYUŞMAZLIK ÇÖZÜMÜ VE YETKİLİ MAHKEME
            </h2>
            
            <div style={{ backgroundColor: '#e8f5e8', padding: '25px', borderRadius: '15px', border: '2px solid #4caf50' }}>
              <h4 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '18px' }}>
                ⚖️ HUKUKI SÜREÇLER VE YETKİ
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                  <h5 style={{ color: '#2e7d32', marginBottom: '10px' }}>🏛️ Yetkili Mahkeme</h5>
                  <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#2e7d32' }}>
                    <li><strong>Yer:</strong> İzmir Mahkemeleri ve İcra Müdürlükleri</li>
                    <li><strong>Tüketici Uyuşmazlıkları:</strong> Tüketici Hakem Heyetleri</li>
                    <li><strong>Ticari Uyuşmazlıklar:</strong> İzmir Ticaret Mahkemesi</li>
                    <li><strong>İcra Takipleri:</strong> İzmir İcra Müdürlükleri</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                  <h5 style={{ color: '#2e7d32', marginBottom: '10px' }}>📜 Uygulanacak Hukuk</h5>
                  <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#2e7d32' }}>
                    <li><strong>Ana Hukuk:</strong> Türkiye Cumhuriyeti Hukuku</li>
                    <li><strong>Tüketici İşlemleri:</strong> 6502 sayılı Kanun</li>
                    <li><strong>Elektronik Ticaret:</strong> 6563 sayılı Kanun</li>
                    <li><strong>Veri Koruma:</strong> 6698 sayılı KVKK</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                  <h5 style={{ color: '#2e7d32', marginBottom: '10px' }}>🤝 Alternatif Çözüm</h5>
                  <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#2e7d32' }}>
                    <li><strong>Müzakere:</strong> Doğrudan görüşme</li>
                    <li><strong>Arabuluculuk:</strong> Bağımsız arabulucu</li>
                    <li><strong>Tahkim:</strong> Karşılıklı anlaşma ile</li>
                    <li><strong>Tüketici Hakemi:</strong> Tüketici uyuşmazlıkları için</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              11. İLETİŞİM VE BAŞVURU BİLGİLERİ
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
              
              <div style={{ backgroundColor: '#e3f2fd', padding: '25px', borderRadius: '15px', border: '2px solid #2196f3' }}>
                <h4 style={{ color: '#1565c0', marginBottom: '15px' }}>🏢 ŞİRKET İLETİŞİM</h4>
                <div style={{ fontSize: '14px', color: '#1565c0' }}>
                  <p><strong>Unvan:</strong> HOOWELL GLOBAL SU ARITMA SİSTEMLERİ ANONİM ŞİRKETİ</p>
                  <p><strong>Adres:</strong> AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR</p>
                  <p><strong>Ticaret Sicil No:</strong> 264080</p>
                  <p><strong>E-posta:</strong> info@hoowell.com.tr</p>
                  <p><strong>Web:</strong> www.hoowell.com.tr</p>
                </div>
              </div>

              <div style={{ backgroundColor: '#f3e5f5', padding: '25px', borderRadius: '15px', border: '2px solid #9c27b0' }}>
                <h4 style={{ color: '#7b1fa2', marginBottom: '15px' }}>📞 MÜŞTERİ HİZMETLERİ</h4>
                <div style={{ fontSize: '14px', color: '#7b1fa2' }}>
                  <p><strong>Genel Destek:</strong> destek@hoowell.com.tr</p>
                  <p><strong>Sipariş Takibi:</strong> siparis@hoowell.com.tr</p>
                  <p><strong>Teknik Destek:</strong> teknik@hoowell.com.tr</p>
                  <p><strong>İade İşlemleri:</strong> iade@hoowell.com.tr</p>
                  <p><strong>Çalışma Saatleri:</strong> Pazartesi-Cuma 09:00-18:00</p>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff3e0', padding: '25px', borderRadius: '15px', border: '2px solid #ff9800' }}>
                <h4 style={{ color: '#f57c00', marginBottom: '15px' }}>⚖️ HUKUKI BAŞVURULAR</h4>
                <div style={{ fontSize: '14px', color: '#f57c00' }}>
                  <p><strong>Hukuk İşleri:</strong> hukuk@hoowell.com.tr</p>
                  <p><strong>KVKK Başvuruları:</strong> kvkk@hoowell.com.tr</p>
                  <p><strong>Şikayet:</strong> sikayet@hoowell.com.tr</p>
                  <p><strong>Tüketici Hakları:</strong> tuketici@hoowell.com.tr</p>
                  <p><strong>Yanıt Süresi:</strong> 30 gün</p>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              12. SÖZLEŞME DEĞİŞİKLİKLERİ VE YÜRÜRLÜK
            </h2>
            
            <div style={{ backgroundColor: '#fff3cd', padding: '25px', borderRadius: '15px', border: '2px solid #ffc107' }}>
              <h4 style={{ color: '#856404', marginBottom: '15px' }}>📅 GÜNCELLEME VE YÜRÜRLÜK</h4>
              <ul style={{ paddingLeft: '20px', color: '#856404', fontSize: '14px' }}>
                <li><strong>Değişiklik Hakkı:</strong> Şirket bu sözleşmeyi tek taraflı değiştirebilir</li>
                <li><strong>Bildirim:</strong> Değişiklikler web sitesinde yayınlanır</li>
                <li><strong>Kabul:</strong> Hizmet kullanımına devam etmek kabul sayılır</li>
                <li><strong>İtiraz Hakkı:</strong> Değişikliklere itiraz halinde sözleşme feshedilebilir</li>
                <li><strong>Yürürlük:</strong> Değişiklikler yayın tarihinde yürürlüğe girer</li>
                <li><strong>Arşiv:</strong> Eski versiyonlar arşivlenir</li>
              </ul>
            </div>
          </section>

          <section style={{ textAlign: 'center', backgroundColor: 'var(--primary-dark)', color: 'white', padding: '40px', borderRadius: '15px' }}>
            <h3 style={{ color: 'var(--accent-gold)', marginBottom: '20px', fontSize: '24px' }}>
              🤝 GÜVENİLİR TİCARET ORTAĞINIZ
            </h3>
            <p style={{ fontSize: '16px', marginBottom: '15px', lineHeight: '1.6' }}>
              HOOWELL olarak, müşterilerimizle uzun vadeli ve güven temelli ilişkiler kurmayı hedefliyoruz. 
              Tüm işlemlerimizde şeffaflık, kalite ve müşteri memnuniyetini ön planda tutuyoruz.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', marginTop: '25px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚖️</div>
                <div style={{ fontSize: '12px', color: 'var(--accent-gold)' }}>Yasal Uyumluluk</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛡️</div>
                <div style={{ fontSize: '12px', color: 'var(--accent-gold)' }}>Güvenli Alışveriş</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏆</div>
                <div style={{ fontSize: '12px', color: 'var(--accent-gold)' }}>Kalite Garantisi</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📞</div>
                <div style={{ fontSize: '12px', color: 'var(--accent-gold)' }}>7/24 Destek</div>
              </div>
            </div>
            
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
              <p style={{ fontSize: '14px', margin: 0, fontStyle: 'italic' }}>
                <strong>Son Güncelleme Tarihi:</strong> 08 Ocak 2025<br/>
                <strong>Yürürlük Tarihi:</strong> 08 Ocak 2025<br/>
                <strong>Versiyon:</strong> 2.0 (PayTR Uyumlu)<br/>
                <strong>Sözleşme Dili:</strong> Türkçe
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;