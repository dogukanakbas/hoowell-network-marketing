import React from 'react';

const KVKKPolicy = () => {
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
          KVKK Aydınlatma Metni
        </h1>

        <div style={{ lineHeight: '1.8', fontSize: '16px', color: '#333' }}>
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>1. Veri Sorumlusu</h2>
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
              <p><strong>Şirket Unvanı:</strong> HOOWELL GLOBAL ALKALİ İYONİZER SİSTEMLERİ ANONİM ŞİRKETİ</p>
              <p><strong>Adres:</strong> AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR</p>
              <p><strong>Ticaret Sicil No:</strong> 264080</p>
              <p><strong>Telefon:</strong> 0232 905 55 55</p>
              <p><strong>E-posta:</strong> info@hoowell.com.tr</p>
            </div>
            <p style={{ marginTop: '15px' }}>
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verilerinizin 
              işlenmesine ilişkin aşağıdaki bilgileri sizlerle paylaşıyoruz.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>2. İşlenen Kişisel Veri Kategorileri</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '10px' }}>
                <h4 style={{ color: '#1565c0', marginBottom: '10px' }}>👤 Kimlik Bilgileri</h4>
                <ul style={{ paddingLeft: '20px', fontSize: '14px' }}>
                  <li>Ad, Soyad</li>
                  <li>TC Kimlik Numarası</li>
                  <li>Doğum Tarihi</li>
                  <li>Uyruk Bilgisi</li>
                </ul>
              </div>
              
              <div style={{ backgroundColor: '#f3e5f5', padding: '20px', borderRadius: '10px' }}>
                <h4 style={{ color: '#7b1fa2', marginBottom: '10px' }}>📞 İletişim Bilgileri</h4>
                <ul style={{ paddingLeft: '20px', fontSize: '14px' }}>
                  <li>E-posta Adresi</li>
                  <li>Telefon Numarası</li>
                  <li>Adres Bilgileri</li>
                  <li>Posta Kodu</li>
                </ul>
              </div>
              
              <div style={{ backgroundColor: '#e8f5e8', padding: '20px', borderRadius: '10px' }}>
                <h4 style={{ color: '#2e7d32', marginBottom: '10px' }}>💼 Müşteri İşlem Bilgileri</h4>
                <ul style={{ paddingLeft: '20px', fontSize: '14px' }}>
                  <li>Sipariş Bilgileri</li>
                  <li>Ödeme Bilgileri</li>
                  <li>Fatura Bilgileri</li>
                  <li>İşlem Geçmişi</li>
                </ul>
              </div>
              
              <div style={{ backgroundColor: '#fff3e0', padding: '20px', borderRadius: '10px' }}>
                <h4 style={{ color: '#f57c00', marginBottom: '10px' }}>🏢 Kurumsal Bilgiler</h4>
                <ul style={{ paddingLeft: '20px', fontSize: '14px' }}>
                  <li>Şirket Unvanı</li>
                  <li>Vergi Numarası</li>
                  <li>Vergi Dairesi</li>
                  <li>Yetkili Kişi Bilgileri</li>
                </ul>
              </div>
              
              <div style={{ backgroundColor: '#fce4ec', padding: '20px', borderRadius: '10px' }}>
                <h4 style={{ color: '#c2185b', marginBottom: '10px' }}>💻 Teknik Bilgiler</h4>
                <ul style={{ paddingLeft: '20px', fontSize: '14px' }}>
                  <li>IP Adresi</li>
                  <li>Çerez Bilgileri</li>
                  <li>Tarayıcı Bilgileri</li>
                  <li>Cihaz Bilgileri</li>
                </ul>
              </div>
              
              <div style={{ backgroundColor: '#e1f5fe', padding: '20px', borderRadius: '10px' }}>
                <h4 style={{ color: '#0277bd', marginBottom: '10px' }}>📊 Pazarlama Bilgileri</h4>
                <ul style={{ paddingLeft: '20px', fontSize: '14px' }}>
                  <li>Tercih Bilgileri</li>
                  <li>İlgi Alanları</li>
                  <li>Demografik Bilgiler</li>
                  <li>Davranışsal Veriler</li>
                </ul>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>3. Kişisel Verilerin İşlenme Amaçları</h2>
            <ul style={{ paddingLeft: '20px' }}>
              <li><strong>Sözleşme İlişkisi:</strong> Satış sözleşmesinin kurulması ve ifası</li>
              <li><strong>Müşteri Hizmetleri:</strong> Müşteri destek hizmetlerinin sunulması</li>
              <li><strong>Sipariş Yönetimi:</strong> Sipariş alma, işleme ve teslimat süreçleri</li>
              <li><strong>Ödeme İşlemleri:</strong> Ödeme alma ve fatura düzenleme</li>
              <li><strong>İletişim:</strong> Müşteri ile iletişim kurma ve bilgilendirme</li>
              <li><strong>Pazarlama:</strong> Ürün ve hizmet tanıtımı (onay dahilinde)</li>
              <li><strong>Yasal Yükümlülük:</strong> Kanuni yükümlülüklerin yerine getirilmesi</li>
              <li><strong>Güvenlik:</strong> Sistem güvenliği ve dolandırıcılık önleme</li>
              <li><strong>İstatistik:</strong> İstatistiksel analiz ve raporlama</li>
              <li><strong>Arşivleme:</strong> Yasal saklama sürelerine uygun arşivleme</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>4. Kişisel Verilerin İşlenme Hukuki Sebepleri</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div style={{ backgroundColor: '#d4edda', padding: '15px', borderRadius: '10px' }}>
                <h4 style={{ color: '#155724', fontSize: '16px', marginBottom: '8px' }}>📋 Sözleşme</h4>
                <p style={{ fontSize: '14px', color: '#155724', margin: 0 }}>
                  Sözleşmenin kurulması veya ifası için gerekli olması
                </p>
              </div>
              
              <div style={{ backgroundColor: '#cce5ff', padding: '15px', borderRadius: '10px' }}>
                <h4 style={{ color: '#004085', fontSize: '16px', marginBottom: '8px' }}>⚖️ Hukuki Yükümlülük</h4>
                <p style={{ fontSize: '14px', color: '#004085', margin: 0 }}>
                  Hukuki yükümlülüğün yerine getirilmesi için gerekli olması
                </p>
              </div>
              
              <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '10px' }}>
                <h4 style={{ color: '#856404', fontSize: '16px', marginBottom: '8px' }}>✅ Açık Rıza</h4>
                <p style={{ fontSize: '14px', color: '#856404', margin: 0 }}>
                  Açık rızanızın bulunması
                </p>
              </div>
              
              <div style={{ backgroundColor: '#f8d7da', padding: '15px', borderRadius: '10px' }}>
                <h4 style={{ color: '#721c24', fontSize: '16px', marginBottom: '8px' }}>🏢 Meşru Menfaat</h4>
                <p style={{ fontSize: '14px', color: '#721c24', margin: 0 }}>
                  Meşru menfaatlerimiz için gerekli olması
                </p>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>5. Kişisel Verilerin Aktarılması</h2>
            <p>Kişisel verileriniz aşağıdaki durumlarda üçüncü kişilerle paylaşılabilir:</p>
            
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--primary-dark)', fontSize: '18px', marginBottom: '10px' }}>
                5.1. Yurt İçi Aktarımlar
              </h3>
              <ul style={{ paddingLeft: '20px' }}>
                <li><strong>Kargo Şirketleri:</strong> Teslimat için gerekli bilgiler</li>
                <li><strong>Ödeme Kuruluşları:</strong> Ödeme işlemleri için</li>
                <li><strong>Hukuk Müşavirleri:</strong> Hukuki süreçler için</li>
                <li><strong>Muhasebe Firması:</strong> Mali işlemler için</li>
                <li><strong>IT Hizmet Sağlayıcıları:</strong> Teknik destek için</li>
              </ul>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--primary-dark)', fontSize: '18px', marginBottom: '10px' }}>
                5.2. Resmi Makamlar
              </h3>
              <ul style={{ paddingLeft: '20px' }}>
                <li>Mahkeme kararları</li>
                <li>Savcılık soruşturmaları</li>
                <li>Vergi dairesi talepleri</li>
                <li>Diğer kamu kurum talepleri</li>
              </ul>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>6. Kişisel Verilerin Saklanma Süresi</h2>
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
              <ul style={{ paddingLeft: '20px' }}>
                <li><strong>Müşteri Bilgileri:</strong> Sözleşme süresi + 10 yıl</li>
                <li><strong>Fatura Bilgileri:</strong> 10 yıl (VUK gereği)</li>
                <li><strong>İletişim Kayıtları:</strong> 3 yıl</li>
                <li><strong>Pazarlama Verileri:</strong> Rıza geri alınana kadar</li>
                <li><strong>Teknik Loglar:</strong> 1 yıl</li>
                <li><strong>Güvenlik Kayıtları:</strong> 2 yıl</li>
              </ul>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>7. Kişisel Veri Sahibinin Hakları</h2>
            <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklarınız bulunmaktadır:</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
              <div style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '10px' }}>
                <h4 style={{ color: '#1565c0', marginBottom: '8px' }}>🔍 Bilgi Alma Hakkı</h4>
                <p style={{ fontSize: '14px', margin: 0 }}>
                  Kişisel verilerinizin işlenip işlenmediğini öğrenme hakkı
                </p>
              </div>
              
              <div style={{ backgroundColor: '#f3e5f5', padding: '15px', borderRadius: '10px' }}>
                <h4 style={{ color: '#7b1fa2', marginBottom: '8px' }}>📋 Bilgi Talep Hakkı</h4>
                <p style={{ fontSize: '14px', margin: 0 }}>
                  İşlenen kişisel verileriniz hakkında bilgi talep etme hakkı
                </p>
              </div>
              
              <div style={{ backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '10px' }}>
                <h4 style={{ color: '#2e7d32', marginBottom: '8px' }}>✏️ Düzeltme Hakkı</h4>
                <p style={{ fontSize: '14px', margin: 0 }}>
                  Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme hakkı
                </p>
              </div>
              
              <div style={{ backgroundColor: '#fff3e0', padding: '15px', borderRadius: '10px' }}>
                <h4 style={{ color: '#f57c00', marginBottom: '8px' }}>🗑️ Silme Hakkı</h4>
                <p style={{ fontSize: '14px', margin: 0 }}>
                  Kişisel verilerinizin silinmesini veya yok edilmesini isteme hakkı
                </p>
              </div>
              
              <div style={{ backgroundColor: '#fce4ec', padding: '15px', borderRadius: '10px' }}>
                <h4 style={{ color: '#c2185b', marginBottom: '8px' }}>🚫 İtiraz Hakkı</h4>
                <p style={{ fontSize: '14px', margin: 0 }}>
                  Otomatik sistemlerle analiz edilmesine itiraz etme hakkı
                </p>
              </div>
              
              <div style={{ backgroundColor: '#e1f5fe', padding: '15px', borderRadius: '10px' }}>
                <h4 style={{ color: '#0277bd', marginBottom: '8px' }}>⚖️ Tazminat Hakkı</h4>
                <p style={{ fontSize: '14px', margin: 0 }}>
                  Kanuna aykırı işleme nedeniyle zararın giderilmesini talep etme hakkı
                </p>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>8. Haklarınızı Kullanma Yolları</h2>
            <p>Yukarıda belirtilen haklarınızı kullanmak için aşağıdaki yollarla başvurabilirsiniz:</p>
            
            <div style={{ backgroundColor: '#d4edda', padding: '20px', borderRadius: '10px', marginBottom: '15px' }}>
              <h4 style={{ color: '#155724', marginBottom: '10px' }}>📧 E-posta ile Başvuru</h4>
              <p style={{ color: '#155724', margin: 0 }}>
                <strong>E-posta:</strong> info@hoowell.com.tr<br/>
                <strong>Konu:</strong> "KVKK Başvurusu - Adınız Soyadınız"
              </p>
            </div>
            
            <div style={{ backgroundColor: '#cce5ff', padding: '20px', borderRadius: '10px', marginBottom: '15px' }}>
              <h4 style={{ color: '#004085', marginBottom: '10px' }}>📮 Posta ile Başvuru</h4>
              <p style={{ color: '#004085', margin: 0 }}>
                <strong>Adres:</strong> AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR<br/>
                <strong>Alıcı:</strong> HOOWELL GLOBAL ALKALİ İYONİZER SİSTEMLERİ A.Ş. - KVKK Sorumlusu
              </p>
            </div>

            <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '10px' }}>
              <p style={{ color: '#856404', margin: 0, fontSize: '14px' }}>
                <strong>⚠️ Önemli:</strong> Başvurularınız kimlik tespiti yapıldıktan sonra 30 gün içinde 
                ücretsiz olarak sonuçlandırılır. Başvurunuzda kimlik bilgilerinizi doğrulayacak belgeleri eklemeyi unutmayınız.
              </p>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>9. Çerez Politikası</h2>
            <p>
              Web sitemizde kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanılmaktadır. 
              Çerez kullanımına ilişkin detaylı bilgi için Çerez Politikamızı inceleyebilirsiniz.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>10. Veri Güvenliği</h2>
            <ul style={{ paddingLeft: '20px' }}>
              <li>SSL şifreleme ile veri koruması</li>
              <li>Güvenli sunucu altyapısı</li>
              <li>Düzenli güvenlik güncellemeleri</li>
              <li>Erişim kontrolü ve yetkilendirme</li>
              <li>Veri yedekleme ve kurtarma sistemleri</li>
              <li>Personel eğitimi ve gizlilik sözleşmeleri</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>11. İletişim</h2>
            <p>KVKK ile ilgili sorularınız için bizimle iletişime geçebilirsiniz:</p>
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
              <p><strong>Şirket:</strong> HOOWELL GLOBAL ALKALİ İYONİZER SİSTEMLERİ ANONİM ŞİRKETİ</p>
              <p><strong>Telefon:</strong> 0232 905 55 55</p>
              <p><strong>E-posta:</strong> info@hoowell.com.tr</p>
              <p><strong>Adres:</strong> AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR</p>
              <p><strong>Ticaret Sicil No:</strong> 264080</p>
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

export default KVKKPolicy;