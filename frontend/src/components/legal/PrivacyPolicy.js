import React from 'react';

const PrivacyPolicy = () => {
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
            GİZLİLİK POLİTİKASI
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
              🛡️ KVKK VE GDPR UYUMLU GİZLİLİK POLİTİKASI
            </h3>
            <p style={{ color: '#155724', margin: 0, fontSize: '14px' }}>
              Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK), 
              Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) ve ilgili mevzuat uyarınca hazırlanmıştır.
            </p>
          </div>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              1. VERİ SORUMLUSU BİLGİLERİ
            </h2>
            
            <div style={{ backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '15px', border: '2px solid #e9ecef' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
                <div>
                  <h4 style={{ color: 'var(--primary-dark)', marginBottom: '15px', fontSize: '18px' }}>
                    🏢 ŞİRKET BİLGİLERİ
                  </h4>
                  <p><strong>Unvan:</strong> HOOWELL GLOBAL SU ARITMA SİSTEMLERİ ANONİM ŞİRKETİ</p>
                  <p><strong>Ticaret Sicil No:</strong> 264080</p>
                  <p><strong>E-posta:</strong> info@hoowell.com.tr</p>
                  <p><strong>Web:</strong> www.hoowell.com.tr</p>
                </div>
                
                <div>
                  <h4 style={{ color: 'var(--primary-dark)', marginBottom: '15px', fontSize: '18px' }}>
                    📍 İLETİŞİM BİLGİLERİ
                  </h4>
                  <p><strong>Adres:</strong> AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR</p>
                  <p><strong>E-posta:</strong> info@hoowell.com.tr</p>
                  <p><strong>KVKK Sorumlusu:</strong> kvkk@hoowell.com.tr</p>
                  <p><strong>Web Sitesi:</strong> www.hoowell.com.tr</p>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              2. POLİTİKANIN KAPSAMI VE AMACI
            </h2>
            
            <div style={{ backgroundColor: '#e3f2fd', padding: '25px', borderRadius: '15px', marginBottom: '20px' }}>
              <h4 style={{ color: '#1565c0', marginBottom: '15px' }}>📋 Politikanın Amacı</h4>
              <p style={{ color: '#1565c0', marginBottom: '15px' }}>
                Bu Gizlilik Politikası, HOOWELL GLOBAL SU ARITMA SİSTEMLERİ ANONİM ŞİRKETİ ("Şirket", "Biz", "HOOWELL") 
                tarafından işlenen kişisel verilerin korunması, işlenmesi, saklanması ve aktarılması konularında 
                veri sahiplerinin bilgilendirilmesi amacıyla hazırlanmıştır.
              </p>
              <ul style={{ paddingLeft: '20px', color: '#1565c0' }}>
                <li>Kişisel verilerin hangi amaçlarla işlendiği</li>
                <li>İşlenen kişisel verilerin kimlerle ve hangi amaçlarla paylaşıldığı</li>
                <li>Kişisel veri toplama yöntemi ve hukuki sebebi</li>
                <li>Veri sahiplerinin hakları ve bu hakları nasıl kullanabilecekleri</li>
              </ul>
            </div>

            <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '15px' }}>
              <h4 style={{ color: '#856404', marginBottom: '10px' }}>⚖️ Hukuki Dayanak</h4>
              <ul style={{ paddingLeft: '20px', color: '#856404', fontSize: '14px' }}>
                <li>6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)</li>
                <li>Kişisel Verilerin İşlenmesinde Uyulacak İlkeler Tebliği</li>
                <li>Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR)</li>
                <li>6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun</li>
                <li>6502 sayılı Tüketicinin Korunması Hakkında Kanun</li>
              </ul>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              3. İŞLENEN KİŞİSEL VERİ KATEGORİLERİ
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
              
              <div style={{ backgroundColor: '#e3f2fd', padding: '25px', borderRadius: '15px', border: '2px solid #2196f3' }}>
                <h4 style={{ color: '#1565c0', marginBottom: '15px', fontSize: '18px' }}>
                  👤 KİMLİK VE İLETİŞİM BİLGİLERİ
                </h4>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#1565c0' }}>
                  <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, TC kimlik numarası, doğum tarihi</li>
                  <li><strong>İletişim Bilgileri:</strong> E-posta adresi, cep telefonu, sabit telefon</li>
                  <li><strong>Adres Bilgileri:</strong> Ev adresi, iş adresi, fatura adresi, teslimat adresi</li>
                  <li><strong>Demografik Bilgiler:</strong> Yaş, cinsiyet, meslek</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#f3e5f5', padding: '25px', borderRadius: '15px', border: '2px solid #9c27b0' }}>
                <h4 style={{ color: '#7b1fa2', marginBottom: '15px', fontSize: '18px' }}>
                  💼 TİCARİ VE FİNANSAL BİLGİLER
                </h4>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#7b1fa2' }}>
                  <li><strong>Sipariş Bilgileri:</strong> Ürün tercihleri, sipariş geçmişi, sepet içeriği</li>
                  <li><strong>Ödeme Bilgileri:</strong> Fatura bilgileri, ödeme yöntemi, işlem kayıtları</li>
                  <li><strong>Kurumsal Bilgiler:</strong> Şirket unvanı, vergi numarası, vergi dairesi</li>
                  <li><strong>Yetkili Kişi Bilgileri:</strong> Kurumsal müşteriler için yetkili kişi bilgileri</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#e8f5e8', padding: '25px', borderRadius: '15px', border: '2px solid #4caf50' }}>
                <h4 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '18px' }}>
                  🎯 PAZARLAMA VE TERCİH BİLGİLERİ
                </h4>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#2e7d32' }}>
                  <li><strong>Pazarlama Tercihleri:</strong> E-posta, SMS, arama izinleri</li>
                  <li><strong>İlgi Alanları:</strong> Ürün kategorileri, kampanya tercihleri</li>
                  <li><strong>Davranışsal Veriler:</strong> Site kullanım alışkanlıkları</li>
                  <li><strong>Etkileşim Bilgileri:</strong> Müşteri hizmetleri görüşmeleri</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#fff3e0', padding: '25px', borderRadius: '15px', border: '2px solid #ff9800' }}>
                <h4 style={{ color: '#f57c00', marginBottom: '15px', fontSize: '18px' }}>
                  💻 TEKNİK VE SİSTEM BİLGİLERİ
                </h4>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#f57c00' }}>
                  <li><strong>Cihaz Bilgileri:</strong> IP adresi, MAC adresi, cihaz türü</li>
                  <li><strong>Tarayıcı Bilgileri:</strong> Tarayıcı türü, sürüm, dil ayarları</li>
                  <li><strong>Çerez Bilgileri:</strong> Oturum çerezleri, tercih çerezleri</li>
                  <li><strong>Log Kayıtları:</strong> Erişim zamanları, sayfa görüntülemeleri</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#fce4ec', padding: '25px', borderRadius: '15px', border: '2px solid #e91e63' }}>
                <h4 style={{ color: '#c2185b', marginBottom: '15px', fontSize: '18px' }}>
                  🤝 İŞ ORTAKLIĞI BİLGİLERİ
                </h4>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#c2185b' }}>
                  <li><strong>Bayi Bilgileri:</strong> Bayi kodu, seviye, performans verileri</li>
                  <li><strong>Komisyon Bilgileri:</strong> Kazanç geçmişi, ödeme bilgileri</li>
                  <li><strong>Eğitim Bilgileri:</strong> Tamamlanan eğitimler, sertifikalar</li>
                  <li><strong>Network Bilgileri:</strong> Sponsor bilgileri, alt bayi ağı</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#e1f5fe', padding: '25px', borderRadius: '15px', border: '2px solid #00bcd4' }}>
                <h4 style={{ color: '#0277bd', marginBottom: '15px', fontSize: '18px' }}>
                  📞 İLETİŞİM VE DESTEK BİLGİLERİ
                </h4>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#0277bd' }}>
                  <li><strong>Destek Talepleri:</strong> Şikayet, öneri, talep içerikleri</li>
                  <li><strong>Görüşme Kayıtları:</strong> Müşteri hizmetleri görüşmeleri</li>
                  <li><strong>Geri Bildirimler:</strong> Memnuniyet anketleri, değerlendirmeler</li>
                  <li><strong>Sosyal Medya:</strong> Sosyal medya hesap bilgileri (isteğe bağlı)</li>
                </ul>
              </div>
            </div>

            <div style={{ backgroundColor: '#f8d7da', padding: '20px', borderRadius: '15px', marginTop: '25px', border: '2px solid #dc3545' }}>
              <h4 style={{ color: '#721c24', marginBottom: '10px' }}>🚫 ÖZEL NİTELİKLİ KİŞİSEL VERİLER</h4>
              <p style={{ color: '#721c24', margin: 0, fontSize: '14px' }}>
                Şirketimiz, KVKK'nın 6. maddesinde tanımlanan özel nitelikli kişisel verileri 
                (ırk, etnik köken, siyasi düşünce, felsefi inanç, din, mezhep, sağlık, cinsel hayat vb.) 
                işlememektedir. Bu tür veriler talep edilmez ve toplanmaz.
              </p>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              4. KİŞİSEL VERİLERİN İŞLENME AMAÇLARI VE HUKUKİ SEBEPLERİ
            </h2>
            
            <div style={{ display: 'grid', gap: '20px' }}>
              
              <div style={{ backgroundColor: '#e8f5e8', padding: '25px', borderRadius: '15px', border: '2px solid #4caf50' }}>
                <h4 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '18px' }}>
                  🛒 TİCARİ FAALİYETLER VE SÖZLEŞME YÖNETİMİ
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' }}>
                  <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#2e7d32', margin: 0 }}>
                    <li>Ürün ve hizmet satışının gerçekleştirilmesi</li>
                    <li>Sipariş alma, işleme ve teslimat süreçlerinin yönetimi</li>
                    <li>Ödeme işlemlerinin gerçekleştirilmesi ve takibi</li>
                    <li>Fatura düzenleme ve muhasebe işlemleri</li>
                    <li>Garanti ve servis hizmetlerinin sunulması</li>
                    <li>İade ve değişim işlemlerinin yürütülmesi</li>
                  </ul>
                  <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                    <strong style={{ color: '#2e7d32', fontSize: '12px' }}>HUKUKİ SEBEP:</strong><br/>
                    <span style={{ fontSize: '12px', color: '#2e7d32' }}>
                      • Sözleşmenin kurulması/ifası<br/>
                      • Hukuki yükümlülük<br/>
                      • Meşru menfaat
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#e3f2fd', padding: '25px', borderRadius: '15px', border: '2px solid #2196f3' }}>
                <h4 style={{ color: '#1565c0', marginBottom: '15px', fontSize: '18px' }}>
                  📞 MÜŞTERİ HİZMETLERİ VE İLETİŞİM
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' }}>
                  <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#1565c0', margin: 0 }}>
                    <li>Müşteri destek hizmetlerinin sunulması</li>
                    <li>Şikayet, öneri ve taleplerin değerlendirilmesi</li>
                    <li>Teknik destek ve danışmanlık hizmetleri</li>
                    <li>Müşteri memnuniyeti araştırmaları</li>
                    <li>Bilgilendirme ve duyuru gönderimi</li>
                    <li>İletişim ve geri bildirim yönetimi</li>
                  </ul>
                  <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                    <strong style={{ color: '#1565c0', fontSize: '12px' }}>HUKUKİ SEBEP:</strong><br/>
                    <span style={{ fontSize: '12px', color: '#1565c0' }}>
                      • Sözleşmenin ifası<br/>
                      • Meşru menfaat<br/>
                      • Açık rıza (pazarlama için)
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f3e5f5', padding: '25px', borderRadius: '15px', border: '2px solid #9c27b0' }}>
                <h4 style={{ color: '#7b1fa2', marginBottom: '15px', fontSize: '18px' }}>
                  📊 PAZARLAMA VE TANITIM FAALİYETLERİ
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' }}>
                  <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#7b1fa2', margin: 0 }}>
                    <li>Ürün ve hizmet tanıtımı yapılması</li>
                    <li>Kampanya ve promosyon bilgilendirmesi</li>
                    <li>Kişiselleştirilmiş ürün önerileri sunulması</li>
                    <li>Pazarlama araştırmaları ve analizleri</li>
                    <li>Müşteri segmentasyonu ve profilleme</li>
                    <li>Sosyal medya pazarlama faaliyetleri</li>
                  </ul>
                  <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                    <strong style={{ color: '#7b1fa2', fontSize: '12px' }}>HUKUKİ SEBEP:</strong><br/>
                    <span style={{ fontSize: '12px', color: '#7b1fa2' }}>
                      • Açık rıza<br/>
                      • Meşru menfaat<br/>
                      • (Pazarlama için mutlaka açık rıza)
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff3e0', padding: '25px', borderRadius: '15px', border: '2px solid #ff9800' }}>
                <h4 style={{ color: '#f57c00', marginBottom: '15px', fontSize: '18px' }}>
                  🤝 İŞ ORTAKLIĞI VE NETWORK YÖNETİMİ
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' }}>
                  <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#f57c00', margin: 0 }}>
                    <li>Bayi ve distribütör kayıt işlemleri</li>
                    <li>Komisyon hesaplama ve ödeme işlemleri</li>
                    <li>Eğitim programlarının yürütülmesi</li>
                    <li>Performans değerlendirme ve raporlama</li>
                    <li>Network ağı yönetimi ve takibi</li>
                    <li>İş ortaklığı sözleşmelerinin yönetimi</li>
                  </ul>
                  <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                    <strong style={{ color: '#f57c00', fontSize: '12px' }}>HUKUKİ SEBEP:</strong><br/>
                    <span style={{ fontSize: '12px', color: '#f57c00' }}>
                      • Sözleşmenin kurulması/ifası<br/>
                      • Hukuki yükümlülük<br/>
                      • Meşru menfaat
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#fce4ec', padding: '25px', borderRadius: '15px', border: '2px solid #e91e63' }}>
                <h4 style={{ color: '#c2185b', marginBottom: '15px', fontSize: '18px' }}>
                  ⚖️ YASAL YÜKÜMLÜLÜKLER VE GÜVENLİK
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' }}>
                  <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#c2185b', margin: 0 }}>
                    <li>Vergi mevzuatı gereği kayıt tutma</li>
                    <li>Ticaret kanunu kapsamında arşivleme</li>
                    <li>Kara para aklanması önleme tedbirleri</li>
                    <li>Tüketici hakları mevzuatına uyum</li>
                    <li>Sistem güvenliği ve dolandırıcılık önleme</li>
                    <li>Denetim ve teftiş süreçlerine destek</li>
                  </ul>
                  <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                    <strong style={{ color: '#c2185b', fontSize: '12px' }}>HUKUKİ SEBEP:</strong><br/>
                    <span style={{ fontSize: '12px', color: '#c2185b' }}>
                      • Hukuki yükümlülük<br/>
                      • Meşru menfaat<br/>
                      • Kamu yararı
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#e1f5fe', padding: '25px', borderRadius: '15px', border: '2px solid #00bcd4' }}>
                <h4 style={{ color: '#0277bd', marginBottom: '15px', fontSize: '18px' }}>
                  📈 ANALİZ VE İYİLEŞTİRME FAALİYETLERİ
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' }}>
                  <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#0277bd', margin: 0 }}>
                    <li>Web sitesi performans analizi</li>
                    <li>Kullanıcı deneyimi iyileştirme çalışmaları</li>
                    <li>İstatistiksel analiz ve raporlama</li>
                    <li>Pazar araştırması ve trend analizi</li>
                    <li>Ürün ve hizmet geliştirme çalışmaları</li>
                    <li>Kalite kontrol ve iyileştirme süreçleri</li>
                  </ul>
                  <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                    <strong style={{ color: '#0277bd', fontSize: '12px' }}>HUKUKİ SEBEP:</strong><br/>
                    <span style={{ fontSize: '12px', color: '#0277bd' }}>
                      • Meşru menfaat<br/>
                      • Açık rıza (kişisel analiz için)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              5. KİŞİSEL VERİLERİN PAYLAŞILMASI VE AKTARILMASI
            </h2>
            
            <div style={{ backgroundColor: '#d4edda', padding: '25px', borderRadius: '15px', marginBottom: '25px', border: '2px solid #28a745' }}>
              <h4 style={{ color: '#155724', marginBottom: '15px' }}>🛡️ TEMEL İLKELERİMİZ</h4>
              <p style={{ color: '#155724', marginBottom: '10px', fontSize: '14px' }}>
                Şirketimiz, kişisel verilerinizi gizlilik ve güvenlik ilkeleri çerçevesinde korur. 
                Verileriniz, yasal zorunluluklar ve açık rızanız olmadıkça üçüncü kişilerle paylaşılmaz.
              </p>
              <ul style={{ paddingLeft: '20px', color: '#155724', fontSize: '14px' }}>
                <li>Veri minimizasyonu ilkesi: Sadece gerekli veriler paylaşılır</li>
                <li>Amaç sınırlaması: Sadece belirtilen amaçlar için paylaşım yapılır</li>
                <li>Güvenlik önceliği: Tüm aktarımlarda güvenlik tedbirleri alınır</li>
                <li>Şeffaflık: Tüm paylaşımlar hakkında bilgilendirilirsiniz</li>
              </ul>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              
              <div style={{ backgroundColor: '#e3f2fd', padding: '25px', borderRadius: '15px', border: '2px solid #2196f3' }}>
                <h4 style={{ color: '#1565c0', marginBottom: '15px', fontSize: '18px' }}>
                  🏢 HİZMET SAĞLAYICILAR VE İŞ ORTAKLARI
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  <div>
                    <h5 style={{ color: '#1565c0', marginBottom: '8px', fontSize: '14px' }}>🚚 Lojistik ve Kargo</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#1565c0' }}>
                      <li>MNG Kargo, Yurtiçi Kargo, Aras Kargo</li>
                      <li>Sadece teslimat için gerekli bilgiler</li>
                      <li>Ad, soyad, telefon, adres bilgileri</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#1565c0', marginBottom: '8px', fontSize: '14px' }}>💳 Ödeme Kuruluşları</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#1565c0' }}>
                      <li>PayTR, İyzico, Banka POS sistemleri</li>
                      <li>Ödeme işlemleri için gerekli bilgiler</li>
                      <li>Kimlik, iletişim ve ödeme bilgileri</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#1565c0', marginBottom: '8px', fontSize: '14px' }}>💻 Teknoloji Hizmetleri</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#1565c0' }}>
                      <li>Bulut hizmet sağlayıcıları</li>
                      <li>Web hosting ve altyapı hizmetleri</li>
                      <li>Teknik destek ve bakım hizmetleri</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#1565c0', marginBottom: '8px', fontSize: '14px' }}>📊 Analiz ve Pazarlama</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#1565c0' }}>
                      <li>Google Analytics, Facebook Pixel</li>
                      <li>E-posta pazarlama platformları</li>
                      <li>Müşteri ilişkileri yönetim sistemleri</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff3e0', padding: '25px', borderRadius: '15px', border: '2px solid #ff9800' }}>
                <h4 style={{ color: '#f57c00', marginBottom: '15px', fontSize: '18px' }}>
                  🏛️ KAMU KURUMLARI VE YASAL YÜKÜMLÜLÜKLER
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div>
                    <h5 style={{ color: '#f57c00', marginBottom: '8px', fontSize: '14px' }}>⚖️ Adli Makamlar</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#f57c00' }}>
                      <li>Mahkeme kararları</li>
                      <li>Savcılık soruşturmaları</li>
                      <li>Emniyet müdürlüğü talepleri</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#f57c00', marginBottom: '8px', fontSize: '14px' }}>🏦 Mali Makamlar</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#f57c00' }}>
                      <li>Vergi dairesi denetimleri</li>
                      <li>Gümrük ve Ticaret Bakanlığı</li>
                      <li>MASAK (Mali Suçları Araştırma)</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#f57c00', marginBottom: '8px', fontSize: '14px' }}>🛡️ Düzenleyici Kurumlar</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#f57c00' }}>
                      <li>Kişisel Verileri Koruma Kurulu</li>
                      <li>Rekabet Kurumu</li>
                      <li>Tüketici Hakem Heyetleri</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f3e5f5', padding: '25px', borderRadius: '15px', border: '2px solid #9c27b0' }}>
                <h4 style={{ color: '#7b1fa2', marginBottom: '15px', fontSize: '18px' }}>
                  🌍 YURT DIŞI AKTARIMLARI
                </h4>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                  <p style={{ color: '#7b1fa2', marginBottom: '15px', fontSize: '14px' }}>
                    Kişisel verileriniz, aşağıdaki durumlarda yurt dışına aktarılabilir:
                  </p>
                  <ul style={{ paddingLeft: '20px', color: '#7b1fa2', fontSize: '14px' }}>
                    <li><strong>Bulut Hizmetleri:</strong> AWS, Google Cloud, Microsoft Azure (AB ve ABD)</li>
                    <li><strong>Analiz Platformları:</strong> Google Analytics, Facebook Analytics</li>
                    <li><strong>E-posta Servisleri:</strong> Uluslararası e-posta hizmet sağlayıcıları</li>
                    <li><strong>Ödeme Sistemleri:</strong> Uluslararası ödeme ağları (Visa, Mastercard)</li>
                  </ul>
                  <div style={{ backgroundColor: '#f3e5f5', padding: '15px', borderRadius: '8px', marginTop: '15px' }}>
                    <strong style={{ color: '#7b1fa2', fontSize: '12px' }}>GÜVENLİK TEDBİRLERİ:</strong>
                    <p style={{ color: '#7b1fa2', fontSize: '12px', margin: '5px 0 0 0' }}>
                      Yurt dışı aktarımlarında KVKK ve GDPR uyumlu güvenlik tedbirleri alınır. 
                      Sadece yeterli koruma seviyesine sahip ülkelere aktarım yapılır.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#f8d7da', padding: '20px', borderRadius: '15px', marginTop: '25px', border: '2px solid #dc3545' }}>
              <h4 style={{ color: '#721c24', marginBottom: '10px' }}>🚫 PAYLAŞILMAYAN BİLGİLER</h4>
              <p style={{ color: '#721c24', margin: 0, fontSize: '14px' }}>
                Aşağıdaki durumlar dışında kişisel verileriniz üçüncü kişilerle paylaşılmaz:
                Ticari amaçlı satış, kiralama veya pazarlama listesi oluşturma; 
                Reklam ajanslarına müşteri listesi verme; 
                Rakip firmalarla bilgi paylaşımı; 
                İzinsiz pazarlama faaliyetleri için kullanım.
              </p>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              6. KİŞİSEL VERİLERİN SAKLANMA SÜRELERİ
            </h2>
            
            <div style={{ backgroundColor: '#e8f5e8', padding: '25px', borderRadius: '15px', marginBottom: '25px', border: '2px solid #4caf50' }}>
              <h4 style={{ color: '#2e7d32', marginBottom: '15px' }}>📅 SAKLAMA İLKELERİMİZ</h4>
              <ul style={{ paddingLeft: '20px', color: '#2e7d32', fontSize: '14px' }}>
                <li><strong>Amaç Sınırlaması:</strong> Veriler sadece işleme amacının gerektirdiği süre boyunca saklanır</li>
                <li><strong>Yasal Uyum:</strong> Mevzuat gereği belirlenen asgari saklama sürelerine uyulur</li>
                <li><strong>Güvenli İmha:</strong> Saklama süresi sona eren veriler güvenli şekilde silinir</li>
                <li><strong>Periyodik Gözden Geçirme:</strong> Saklama süreleri düzenli olarak gözden geçirilir</li>
              </ul>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              
              <div style={{ backgroundColor: '#e3f2fd', padding: '25px', borderRadius: '15px', border: '2px solid #2196f3' }}>
                <h4 style={{ color: '#1565c0', marginBottom: '15px', fontSize: '18px' }}>
                  📋 MÜŞTERİ VE SİPARİŞ BİLGİLERİ
                </h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'white' }}>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#1565c0', borderBottom: '1px solid #2196f3' }}>Veri Türü</th>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#1565c0', borderBottom: '1px solid #2196f3' }}>Saklama Süresi</th>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#1565c0', borderBottom: '1px solid #2196f3' }}>Yasal Dayanak</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '10px', color: '#1565c0' }}>Müşteri Kimlik Bilgileri</td>
                        <td style={{ padding: '10px', color: '#1565c0' }}>Son işlem + 10 yıl</td>
                        <td style={{ padding: '10px', color: '#1565c0' }}>Ticaret Kanunu</td>
                      </tr>
                      <tr style={{ backgroundColor: 'rgba(33, 150, 243, 0.05)' }}>
                        <td style={{ padding: '10px', color: '#1565c0' }}>Sipariş ve Fatura Bilgileri</td>
                        <td style={{ padding: '10px', color: '#1565c0' }}>10 yıl</td>
                        <td style={{ padding: '10px', color: '#1565c0' }}>Vergi Usul Kanunu</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '10px', color: '#1565c0' }}>İletişim Bilgileri</td>
                        <td style={{ padding: '10px', color: '#1565c0' }}>Son iletişim + 3 yıl</td>
                        <td style={{ padding: '10px', color: '#1565c0' }}>Tüketici Kanunu</td>
                      </tr>
                      <tr style={{ backgroundColor: 'rgba(33, 150, 243, 0.05)' }}>
                        <td style={{ padding: '10px', color: '#1565c0' }}>Garanti ve Servis Kayıtları</td>
                        <td style={{ padding: '10px', color: '#1565c0' }}>Garanti süresi + 5 yıl</td>
                        <td style={{ padding: '10px', color: '#1565c0' }}>Tüketici Kanunu</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ backgroundColor: '#f3e5f5', padding: '25px', borderRadius: '15px', border: '2px solid #9c27b0' }}>
                <h4 style={{ color: '#7b1fa2', marginBottom: '15px', fontSize: '18px' }}>
                  🤝 İŞ ORTAKLIĞI VE NETWORK BİLGİLERİ
                </h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'white' }}>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#7b1fa2', borderBottom: '1px solid #9c27b0' }}>Veri Türü</th>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#7b1fa2', borderBottom: '1px solid #9c27b0' }}>Saklama Süresi</th>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#7b1fa2', borderBottom: '1px solid #9c27b0' }}>Yasal Dayanak</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '10px', color: '#7b1fa2' }}>Bayi Kayıt Bilgileri</td>
                        <td style={{ padding: '10px', color: '#7b1fa2' }}>Sözleşme sonu + 10 yıl</td>
                        <td style={{ padding: '10px', color: '#7b1fa2' }}>Ticaret Kanunu</td>
                      </tr>
                      <tr style={{ backgroundColor: 'rgba(156, 39, 176, 0.05)' }}>
                        <td style={{ padding: '10px', color: '#7b1fa2' }}>Komisyon ve Ödeme Kayıtları</td>
                        <td style={{ padding: '10px', color: '#7b1fa2' }}>10 yıl</td>
                        <td style={{ padding: '10px', color: '#7b1fa2' }}>Vergi Usul Kanunu</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '10px', color: '#7b1fa2' }}>Eğitim ve Sertifika Kayıtları</td>
                        <td style={{ padding: '10px', color: '#7b1fa2' }}>Süresiz (başarı belgesi)</td>
                        <td style={{ padding: '10px', color: '#7b1fa2' }}>Mesleki Yeterlilik</td>
                      </tr>
                      <tr style={{ backgroundColor: 'rgba(156, 39, 176, 0.05)' }}>
                        <td style={{ padding: '10px', color: '#7b1fa2' }}>Performans Değerlendirmeleri</td>
                        <td style={{ padding: '10px', color: '#7b1fa2' }}>5 yıl</td>
                        <td style={{ padding: '10px', color: '#7b1fa2' }}>İş Kanunu</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff3e0', padding: '25px', borderRadius: '15px', border: '2px solid #ff9800' }}>
                <h4 style={{ color: '#f57c00', marginBottom: '15px', fontSize: '18px' }}>
                  💻 TEKNİK VE SİSTEM VERİLERİ
                </h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'white' }}>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#f57c00', borderBottom: '1px solid #ff9800' }}>Veri Türü</th>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#f57c00', borderBottom: '1px solid #ff9800' }}>Saklama Süresi</th>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#f57c00', borderBottom: '1px solid #ff9800' }}>Yasal Dayanak</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '10px', color: '#f57c00' }}>Web Sitesi Log Kayıtları</td>
                        <td style={{ padding: '10px', color: '#f57c00' }}>1 yıl</td>
                        <td style={{ padding: '10px', color: '#f57c00' }}>Elektronik Ticaret Kanunu</td>
                      </tr>
                      <tr style={{ backgroundColor: 'rgba(255, 152, 0, 0.05)' }}>
                        <td style={{ padding: '10px', color: '#f57c00' }}>Çerez Bilgileri</td>
                        <td style={{ padding: '10px', color: '#f57c00' }}>Çerez türüne göre değişir</td>
                        <td style={{ padding: '10px', color: '#f57c00' }}>KVKK Çerez Rehberi</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '10px', color: '#f57c00' }}>Güvenlik Kayıtları</td>
                        <td style={{ padding: '10px', color: '#f57c00' }}>2 yıl</td>
                        <td style={{ padding: '10px', color: '#f57c00' }}>Bilgi Güvenliği</td>
                      </tr>
                      <tr style={{ backgroundColor: 'rgba(255, 152, 0, 0.05)' }}>
                        <td style={{ padding: '10px', color: '#f57c00' }}>Yedekleme Verileri</td>
                        <td style={{ padding: '10px', color: '#f57c00' }}>Ana veri ile aynı</td>
                        <td style={{ padding: '10px', color: '#f57c00' }}>Veri Koruma İlkeleri</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ backgroundColor: '#fce4ec', padding: '25px', borderRadius: '15px', border: '2px solid #e91e63' }}>
                <h4 style={{ color: '#c2185b', marginBottom: '15px', fontSize: '18px' }}>
                  📞 İLETİŞİM VE PAZARLAMA VERİLERİ
                </h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'white' }}>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#c2185b', borderBottom: '1px solid #e91e63' }}>Veri Türü</th>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#c2185b', borderBottom: '1px solid #e91e63' }}>Saklama Süresi</th>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#c2185b', borderBottom: '1px solid #e91e63' }}>Yasal Dayanak</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '10px', color: '#c2185b' }}>Pazarlama İzin Kayıtları</td>
                        <td style={{ padding: '10px', color: '#c2185b' }}>İzin geri alınana kadar</td>
                        <td style={{ padding: '10px', color: '#c2185b' }}>KVKK Açık Rıza</td>
                      </tr>
                      <tr style={{ backgroundColor: 'rgba(233, 30, 99, 0.05)' }}>
                        <td style={{ padding: '10px', color: '#c2185b' }}>Müşteri Hizmetleri Kayıtları</td>
                        <td style={{ padding: '10px', color: '#c2185b' }}>3 yıl</td>
                        <td style={{ padding: '10px', color: '#c2185b' }}>Tüketici Kanunu</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '10px', color: '#c2185b' }}>Şikayet ve Öneri Kayıtları</td>
                        <td style={{ padding: '10px', color: '#c2185b' }}>5 yıl</td>
                        <td style={{ padding: '10px', color: '#c2185b' }}>Tüketici Kanunu</td>
                      </tr>
                      <tr style={{ backgroundColor: 'rgba(233, 30, 99, 0.05)' }}>
                        <td style={{ padding: '10px', color: '#c2185b' }}>Anket ve Araştırma Verileri</td>
                        <td style={{ padding: '10px', color: '#c2185b' }}>2 yıl</td>
                        <td style={{ padding: '10px', color: '#c2185b' }}>Araştırma Amacı</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#d4edda', padding: '20px', borderRadius: '15px', marginTop: '25px', border: '2px solid #28a745' }}>
              <h4 style={{ color: '#155724', marginBottom: '10px' }}>🔄 VERİ İMHA SÜRECİ</h4>
              <p style={{ color: '#155724', margin: 0, fontSize: '14px' }}>
                Saklama süresi sona eren kişisel veriler, güvenli veri imha prosedürlerimiz çerçevesinde 
                geri getirilemeyecek şekilde silinir, yok edilir veya anonim hale getirilir. 
                Bu süreç düzenli olarak denetlenir ve kayıt altına alınır.
              </p>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              7. VERİ SAHİBİNİN HAKLARI VE KULLANIM YÖNTEMLERİ
            </h2>
            
            <div style={{ backgroundColor: '#d4edda', padding: '25px', borderRadius: '15px', marginBottom: '25px', border: '2px solid #28a745' }}>
              <h4 style={{ color: '#155724', marginBottom: '15px' }}>⚖️ KVKK KAPSAMINDA HAKLARINIZ</h4>
              <p style={{ color: '#155724', marginBottom: '10px', fontSize: '14px' }}>
                6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 11. maddesi uyarınca, 
                veri sahibi olarak aşağıdaki haklara sahipsiniz. Bu haklar ücretsizdir ve 
                30 gün içinde yanıtlanır.
              </p>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              
              <div style={{ backgroundColor: '#e3f2fd', padding: '25px', borderRadius: '15px', border: '2px solid #2196f3' }}>
                <h4 style={{ color: '#1565c0', marginBottom: '15px', fontSize: '18px' }}>
                  🔍 BİLGİ ALMA VE ERİŞİM HAKLARI
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#1565c0', marginBottom: '10px', fontSize: '16px' }}>📋 Bilgi Alma Hakkı</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#1565c0' }}>
                      <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                      <li>İşlenme amaçlarını ve yöntemlerini öğrenme</li>
                      <li>Veri kategorilerini ve kaynaklarını öğrenme</li>
                    </ul>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#1565c0', marginBottom: '10px', fontSize: '16px' }}>📊 Detaylı Bilgi Talep Hakkı</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#1565c0' }}>
                      <li>İşlenen tüm kişisel verilerinizin listesi</li>
                      <li>İşleme amaçları ve hukuki sebepleri</li>
                      <li>Saklama süreleri ve kriterleri</li>
                    </ul>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#1565c0', marginBottom: '10px', fontSize: '16px' }}>🌐 Aktarım Bilgisi Hakkı</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#1565c0' }}>
                      <li>Verilerin aktarıldığı üçüncü kişiler</li>
                      <li>Yurt içi ve yurt dışı aktarım bilgileri</li>
                      <li>Aktarım amaçları ve güvenlik tedbirleri</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f3e5f5', padding: '25px', borderRadius: '15px', border: '2px solid #9c27b0' }}>
                <h4 style={{ color: '#7b1fa2', marginBottom: '15px', fontSize: '18px' }}>
                  ✏️ DÜZELTME VE GÜNCELLEME HAKLARI
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#7b1fa2', marginBottom: '10px', fontSize: '16px' }}>🔧 Düzeltme Hakkı</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#7b1fa2' }}>
                      <li>Eksik veya yanlış verilerin düzeltilmesi</li>
                      <li>Güncel olmayan bilgilerin güncellenmesi</li>
                      <li>Hatalı kayıtların düzeltilmesi</li>
                    </ul>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#7b1fa2', marginBottom: '10px', fontSize: '16px' }}>📝 Tamamlama Hakkı</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#7b1fa2' }}>
                      <li>Eksik verilerin tamamlanması</li>
                      <li>Ek bilgi sağlanması</li>
                      <li>Profil bilgilerinin güncellenmesi</li>
                    </ul>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#7b1fa2', marginBottom: '10px', fontSize: '16px' }}>🔄 Bildirim Hakkı</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#7b1fa2' }}>
                      <li>Düzeltmelerin üçüncü kişilere bildirilmesi</li>
                      <li>Güncelleme işlemlerinin onaylanması</li>
                      <li>Değişikliklerin takip edilmesi</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff3e0', padding: '25px', borderRadius: '15px', border: '2px solid #ff9800' }}>
                <h4 style={{ color: '#f57c00', marginBottom: '15px', fontSize: '18px' }}>
                  🗑️ SİLME VE UNUTULMA HAKLARI
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#f57c00', marginBottom: '10px', fontSize: '16px' }}>🗂️ Silme Hakkı</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#f57c00' }}>
                      <li>İşleme amacı ortadan kalkan verilerin silinmesi</li>
                      <li>Yasal saklama süresi sona eren verilerin imhası</li>
                      <li>Rıza geri alınan verilerin silinmesi</li>
                    </ul>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#f57c00', marginBottom: '10px', fontSize: '16px' }}>🔒 Anonim Hale Getirme</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#f57c00' }}>
                      <li>Kişisel tanımlayıcıların kaldırılması</li>
                      <li>İstatistiksel amaçlı anonim veri oluşturma</li>
                      <li>Geri döndürülemez veri maskeleme</li>
                    </ul>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#f57c00', marginBottom: '10px', fontSize: '16px' }}>📢 Bildirim Hakkı</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#f57c00' }}>
                      <li>Silme işleminin üçüncü kişilere bildirilmesi</li>
                      <li>Veri paylaşımı yapılan tarafların bilgilendirilmesi</li>
                      <li>İşlem sonuçlarının onaylanması</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#fce4ec', padding: '25px', borderRadius: '15px', border: '2px solid #e91e63' }}>
                <h4 style={{ color: '#c2185b', marginBottom: '15px', fontSize: '18px' }}>
                  🚫 İTİRAZ VE SINIRLANDIRMA HAKLARI
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#c2185b', marginBottom: '10px', fontSize: '16px' }}>⛔ İtiraz Hakkı</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#c2185b' }}>
                      <li>Otomatik karar verme sistemlerine itiraz</li>
                      <li>Profilleme faaliyetlerine itiraz</li>
                      <li>Pazarlama amaçlı işlemelere itiraz</li>
                    </ul>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#c2185b', marginBottom: '10px', fontSize: '16px' }}>🔐 Sınırlandırma Hakkı</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#c2185b' }}>
                      <li>Belirli işleme faaliyetlerinin durdurulması</li>
                      <li>Veri kullanımının sınırlandırılması</li>
                      <li>Geçici işleme durdurma talebi</li>
                    </ul>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#c2185b', marginBottom: '10px', fontSize: '16px' }}>📱 Taşınabilirlik Hakkı</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#c2185b' }}>
                      <li>Verilerinizi yapılandırılmış formatta alma</li>
                      <li>Başka bir veri sorumlusuna aktarım</li>
                      <li>Makine tarafından okunabilir format</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#e8f5e8', padding: '25px', borderRadius: '15px', border: '2px solid #4caf50' }}>
                <h4 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '18px' }}>
                  💰 TAZMİNAT VE ŞİKAYET HAKLARI
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#2e7d32', marginBottom: '10px', fontSize: '16px' }}>💸 Tazminat Hakkı</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#2e7d32' }}>
                      <li>Kanuna aykırı işleme nedeniyle zarar talebi</li>
                      <li>Maddi ve manevi tazminat hakkı</li>
                      <li>Hukuki yollara başvurma hakkı</li>
                    </ul>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#2e7d32', marginBottom: '10px', fontSize: '16px' }}>📝 Şikayet Hakkı</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#2e7d32' }}>
                      <li>Kişisel Verileri Koruma Kurulu'na başvuru</li>
                      <li>Veri sorumlusuna doğrudan başvuru</li>
                      <li>İdari ve adli yollara başvuru</li>
                    </ul>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h5 style={{ color: '#2e7d32', marginBottom: '10px', fontSize: '16px' }}>🏛️ Denetim Hakkı</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '14px', color: '#2e7d32' }}>
                      <li>İşleme faaliyetlerinin denetlenmesi</li>
                      <li>Güvenlik tedbirlerinin kontrolü</li>
                      <li>Uyumluluk değerlendirmesi talebi</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              8. HAKLARINIZI KULLANMA YÖNTEMLERİ
            </h2>
            
            <div style={{ backgroundColor: '#e3f2fd', padding: '25px', borderRadius: '15px', marginBottom: '25px', border: '2px solid #2196f3' }}>
              <h4 style={{ color: '#1565c0', marginBottom: '15px' }}>📧 BAŞVURU YÖNTEMLERİ</h4>
              <p style={{ color: '#1565c0', marginBottom: '15px', fontSize: '14px' }}>
                KVKK haklarınızı kullanmak için aşağıdaki yöntemlerle başvurabilirsiniz. 
                Başvurularınız 30 gün içinde ücretsiz olarak yanıtlanır.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                  <h5 style={{ color: '#1565c0', marginBottom: '10px' }}>📧 E-posta ile Başvuru</h5>
                  <p style={{ fontSize: '14px', color: '#1565c0', marginBottom: '10px' }}>
                    <strong>E-posta:</strong> kvkk@hoowell.com.tr<br/>
                    <strong>Konu:</strong> "KVKK Başvurusu - Hak Türünüz"<br/>
                    <strong>Gerekli Belgeler:</strong> Kimlik fotokopisi, imzalı başvuru formu
                  </p>
                </div>
                
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                  <h5 style={{ color: '#1565c0', marginBottom: '10px' }}>📮 Posta ile Başvuru</h5>
                  <p style={{ fontSize: '14px', color: '#1565c0', marginBottom: '10px' }}>
                    <strong>Adres:</strong> AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR<br/>
                    <strong>Alıcı:</strong> HOOWELL KVKK Sorumlusu<br/>
                    <strong>Gerekli Belgeler:</strong> Kimlik fotokopisi, imzalı başvuru formu
                  </p>
                </div>
                
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                  <h5 style={{ color: '#1565c0', marginBottom: '10px' }}>🏢 Şahsen Başvuru</h5>
                  <p style={{ fontSize: '14px', color: '#1565c0', marginBottom: '10px' }}>
                    <strong>Adres:</strong> AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR<br/>
                    <strong>Çalışma Saatleri:</strong> Pazartesi-Cuma 09:00-17:00<br/>
                    <strong>Gerekli Belgeler:</strong> Kimlik belgesi (aslı)
                  </p>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '15px', border: '2px solid #ffc107' }}>
              <h4 style={{ color: '#856404', marginBottom: '10px' }}>📋 BAŞVURU FORMU GEREKLİLİKLERİ</h4>
              <ul style={{ paddingLeft: '20px', color: '#856404', fontSize: '14px' }}>
                <li>Ad, soyad ve imza bilgileri</li>
                <li>Türkiye Cumhuriyeti vatandaşları için T.C. kimlik numarası</li>
                <li>Yabancı uyruklu kişiler için pasaport numarası</li>
                <li>Tebligata esas yerleşim yeri veya iş yeri adresi</li>
                <li>Varsa bildirime esas elektronik posta adresi</li>
                <li>Talep konusu (hangi hakkın kullanılmak istendiği)</li>
              </ul>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              9. VERİ GÜVENLİĞİ VE KORUMA TEDBİRLERİ
            </h2>
            
            <div style={{ display: 'grid', gap: '20px' }}>
              
              <div style={{ backgroundColor: '#e8f5e8', padding: '25px', borderRadius: '15px', border: '2px solid #4caf50' }}>
                <h4 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '18px' }}>
                  🔒 TEKNİK GÜVENLİK TEDBİRLERİ
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  <div>
                    <h5 style={{ color: '#2e7d32', marginBottom: '8px', fontSize: '14px' }}>🛡️ Şifreleme ve Koruma</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#2e7d32' }}>
                      <li>SSL/TLS şifreleme (256-bit)</li>
                      <li>Veritabanı şifreleme</li>
                      <li>Güçlü parola politikaları</li>
                      <li>İki faktörlü kimlik doğrulama</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#2e7d32', marginBottom: '8px', fontSize: '14px' }}>🔥 Firewall ve Güvenlik</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#2e7d32' }}>
                      <li>Web Application Firewall (WAF)</li>
                      <li>DDoS saldırı koruması</li>
                      <li>Intrusion Detection System (IDS)</li>
                      <li>Güvenlik duvarı koruması</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#2e7d32', marginBottom: '8px', fontSize: '14px' }}>💾 Yedekleme ve Kurtarma</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#2e7d32' }}>
                      <li>Otomatik günlük yedekleme</li>
                      <li>Çoklu lokasyon yedekleme</li>
                      <li>Disaster recovery planı</li>
                      <li>Veri bütünlüğü kontrolü</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#2e7d32', marginBottom: '8px', fontSize: '14px' }}>🔍 İzleme ve Denetim</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#2e7d32' }}>
                      <li>7/24 sistem izleme</li>
                      <li>Log kayıtları ve analizi</li>
                      <li>Anormal aktivite tespiti</li>
                      <li>Düzenli güvenlik taramaları</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f3e5f5', padding: '25px', borderRadius: '15px', border: '2px solid #9c27b0' }}>
                <h4 style={{ color: '#7b1fa2', marginBottom: '15px', fontSize: '18px' }}>
                  👥 İDARİ GÜVENLİK TEDBİRLERİ
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  <div>
                    <h5 style={{ color: '#7b1fa2', marginBottom: '8px', fontSize: '14px' }}>🎓 Personel Eğitimi</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#7b1fa2' }}>
                      <li>KVKK farkındalık eğitimleri</li>
                      <li>Veri güvenliği eğitimleri</li>
                      <li>Phishing ve sosyal mühendislik</li>
                      <li>Düzenli güvenlik briefingleri</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#7b1fa2', marginBottom: '8px', fontSize: '14px' }}>🔐 Erişim Kontrolü</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#7b1fa2' }}>
                      <li>Rol tabanlı erişim kontrolü</li>
                      <li>En az yetki prensibi</li>
                      <li>Düzenli yetki gözden geçirme</li>
                      <li>Çalışan giriş-çıkış takibi</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#7b1fa2', marginBottom: '8px', fontSize: '14px' }}>📋 Politika ve Prosedürler</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#7b1fa2' }}>
                      <li>Veri koruma politikaları</li>
                      <li>Olay müdahale prosedürleri</li>
                      <li>Veri ihlali bildirimi planı</li>
                      <li>Gizlilik sözleşmeleri</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style={{ color: '#7b1fa2', marginBottom: '8px', fontSize: '14px' }}>🏢 Fiziksel Güvenlik</h5>
                    <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#7b1fa2' }}>
                      <li>Güvenli veri merkezi</li>
                      <li>Kartlı giriş sistemleri</li>
                      <li>CCTV izleme sistemleri</li>
                      <li>Temiz masa politikası</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff3e0', padding: '25px', borderRadius: '15px', border: '2px solid #ff9800' }}>
                <h4 style={{ color: '#f57c00', marginBottom: '15px', fontSize: '18px' }}>
                  🚨 OLAY MÜDAHALE VE BİLDİRİM
                </h4>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                  <p style={{ color: '#f57c00', marginBottom: '15px', fontSize: '14px' }}>
                    Veri güvenliği ihlali durumunda aşağıdaki süreç işletilir:
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
                      <h6 style={{ color: '#f57c00', fontSize: '12px', marginBottom: '5px' }}>ANINDA MÜDAHALE</h6>
                      <p style={{ fontSize: '11px', color: '#f57c00', margin: 0 }}>İhlal tespit edilir edilmez acil müdahale</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
                      <h6 style={{ color: '#f57c00', fontSize: '12px', marginBottom: '5px' }}>HASAR TESPİTİ</h6>
                      <p style={{ fontSize: '11px', color: '#f57c00', margin: 0 }}>Etkilenen veri kapsamının belirlenmesi</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏛️</div>
                      <h6 style={{ color: '#f57c00', fontSize: '12px', marginBottom: '5px' }}>KVKK BİLDİRİMİ</h6>
                      <p style={{ fontSize: '11px', color: '#f57c00', margin: 0 }}>72 saat içinde KVKK'ya bildirim</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>📢</div>
                      <h6 style={{ color: '#f57c00', fontSize: '12px', marginBottom: '5px' }}>KULLANICI BİLGİSİ</h6>
                      <p style={{ fontSize: '11px', color: '#f57c00', margin: 0 }}>Etkilenen kişilerin bilgilendirilmesi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              10. ÇEREZ POLİTİKASI VE DİJİTAL TAKİP
            </h2>
            
            <div style={{ backgroundColor: '#e1f5fe', padding: '25px', borderRadius: '15px', border: '2px solid #00bcd4' }}>
              <h4 style={{ color: '#0277bd', marginBottom: '15px' }}>🍪 ÇEREZ KULLANIMI</h4>
              <p style={{ color: '#0277bd', marginBottom: '15px', fontSize: '14px' }}>
                Web sitemizde kullanıcı deneyimini iyileştirmek, site performansını analiz etmek ve 
                kişiselleştirilmiş içerik sunmak amacıyla çerezler kullanılmaktadır.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
                  <h5 style={{ color: '#0277bd', fontSize: '14px', marginBottom: '8px' }}>🔧 Zorunlu Çerezler</h5>
                  <p style={{ fontSize: '12px', color: '#0277bd', margin: 0 }}>
                    Site işlevselliği için gerekli temel çerezler
                  </p>
                </div>
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
                  <h5 style={{ color: '#0277bd', fontSize: '14px', marginBottom: '8px' }}>📊 Analitik Çerezler</h5>
                  <p style={{ fontSize: '12px', color: '#0277bd', margin: 0 }}>
                    Google Analytics ve performans ölçümü
                  </p>
                </div>
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
                  <h5 style={{ color: '#0277bd', fontSize: '14px', marginBottom: '8px' }}>🎯 Pazarlama Çerezleri</h5>
                  <p style={{ fontSize: '12px', color: '#0277bd', margin: 0 }}>
                    Kişiselleştirilmiş reklam ve içerik
                  </p>
                </div>
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
                  <h5 style={{ color: '#0277bd', fontSize: '14px', marginBottom: '8px' }}>⚙️ İşlevsel Çerezler</h5>
                  <p style={{ fontSize: '12px', color: '#0277bd', margin: 0 }}>
                    Kullanıcı tercihleri ve gelişmiş özellikler
                  </p>
                </div>
              </div>
              
              <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', marginTop: '15px' }}>
                <p style={{ color: '#0277bd', fontSize: '12px', margin: 0 }}>
                  <strong>Çerez Yönetimi:</strong> Tarayıcınızın ayarlarından çerezleri yönetebilir, 
                  kabul etmeyebilir veya silebilirsiniz. Detaylı bilgi için 
                  <a href="/cookies" style={{ color: '#0277bd', textDecoration: 'underline' }}> Çerez Politikamızı</a> inceleyiniz.
                </p>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              11. İLETİŞİM VE BAŞVURU BİLGİLERİ
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
              
              <div style={{ backgroundColor: '#e8f5e8', padding: '25px', borderRadius: '15px', border: '2px solid #4caf50' }}>
                <h4 style={{ color: '#2e7d32', marginBottom: '15px' }}>🏢 ŞİRKET İLETİŞİM</h4>
                <div style={{ fontSize: '14px', color: '#2e7d32' }}>
                  <p><strong>Şirket:</strong> HOOWELL GLOBAL SU ARITMA SİSTEMLERİ ANONİM ŞİRKETİ</p>
                  <p><strong>Adres:</strong> AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR</p>
                  <p><strong>Ticaret Sicil No:</strong> 264080</p>
                  <p><strong>Web:</strong> www.hoowell.com.tr</p>
                </div>
              </div>

              <div style={{ backgroundColor: '#e3f2fd', padding: '25px', borderRadius: '15px', border: '2px solid #2196f3' }}>
                <h4 style={{ color: '#1565c0', marginBottom: '15px' }}>📧 KVKK İLETİŞİM</h4>
                <div style={{ fontSize: '14px', color: '#1565c0' }}>
                  <p><strong>KVKK Sorumlusu:</strong> kvkk@hoowell.com.tr</p>
                  <p><strong>Genel İletişim:</strong> info@hoowell.com.tr</p>
                  <p><strong>Müşteri Hizmetleri:</strong> destek@hoowell.com.tr</p>
                  <p><strong>Çalışma Saatleri:</strong> Pazartesi-Cuma 09:00-17:00</p>
                </div>
              </div>

              <div style={{ backgroundColor: '#f3e5f5', padding: '25px', borderRadius: '15px', border: '2px solid #9c27b0' }}>
                <h4 style={{ color: '#7b1fa2', marginBottom: '15px' }}>🏛️ KVKK KURULU</h4>
                <div style={{ fontSize: '14px', color: '#7b1fa2' }}>
                  <p><strong>Başvuru:</strong> www.kvkk.gov.tr</p>
                  <p><strong>E-posta:</strong> kvkk@kvkk.gov.tr</p>
                  <p><strong>Adres:</strong> Ziya Gökalp Caddesi No:8 Kızılay/ANKARA</p>
                  <p><strong>Telefon:</strong> 0312 216 50 50</p>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              12. POLİTİKA GÜNCELLEMELERİ VE YÜRÜRLÜK
            </h2>
            
            <div style={{ backgroundColor: '#fff3cd', padding: '25px', borderRadius: '15px', border: '2px solid #ffc107' }}>
              <h4 style={{ color: '#856404', marginBottom: '15px' }}>📅 GÜNCELLEME SÜRECİ</h4>
              <ul style={{ paddingLeft: '20px', color: '#856404', fontSize: '14px' }}>
                <li>Bu Gizlilik Politikası, yasal değişiklikler ve iş gereksinimlerine göre güncellenebilir</li>
                <li>Önemli değişiklikler e-posta, SMS veya web sitesi bildirimi ile duyurulur</li>
                <li>Güncellemeler yayınlandığı tarihte yürürlüğe girer</li>
                <li>Eski versiyonlar arşivlenir ve talep halinde erişilebilir</li>
                <li>Kullanıcılar düzenli olarak politikayı gözden geçirmelidir</li>
              </ul>
            </div>
          </section>

          <section style={{ textAlign: 'center', backgroundColor: 'var(--primary-dark)', color: 'white', padding: '40px', borderRadius: '15px' }}>
            <h3 style={{ color: 'var(--accent-gold)', marginBottom: '20px', fontSize: '24px' }}>
              🛡️ KİŞİSEL VERİLERİNİZ GÜVENDEDİR
            </h3>
            <p style={{ fontSize: '16px', marginBottom: '15px', lineHeight: '1.6' }}>
              HOOWELL olarak, kişisel verilerinizin korunması konusunda en yüksek standartları uyguluyoruz. 
              KVKK ve GDPR uyumlu süreçlerimizle verilerinizin güvenliğini sağlıyoruz.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', marginTop: '25px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔒</div>
                <div style={{ fontSize: '12px', color: 'var(--accent-gold)' }}>256-bit SSL</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚖️</div>
                <div style={{ fontSize: '12px', color: 'var(--accent-gold)' }}>KVKK Uyumlu</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛡️</div>
                <div style={{ fontSize: '12px', color: 'var(--accent-gold)' }}>GDPR Uyumlu</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏆</div>
                <div style={{ fontSize: '12px', color: 'var(--accent-gold)' }}>ISO 27001</div>
              </div>
            </div>
            
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
              <p style={{ fontSize: '14px', margin: 0, fontStyle: 'italic' }}>
                <strong>Son Güncelleme Tarihi:</strong> 08 Ocak 2025<br/>
                <strong>Yürürlük Tarihi:</strong> 08 Ocak 2025<br/>
                <strong>Versiyon:</strong> 2.0 (PayTR Uyumlu)
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;