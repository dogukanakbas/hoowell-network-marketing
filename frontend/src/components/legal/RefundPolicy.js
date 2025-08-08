import React from 'react';

const RefundPolicy = () => {
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
            İADE VE DEĞİŞİM POLİTİKASI
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
              🛡️ TÜKETİCİ HAKLARI UYUMLU İADE POLİTİKASI
            </h3>
            <p style={{ color: '#155724', margin: 0, fontSize: '14px' }}>
              Bu politika, 6502 sayılı Tüketicinin Korunması Hakkında Kanun, 
              6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun ve ilgili mevzuat uyarınca hazırlanmıştır.
            </p>
          </div>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px', borderBottom: '3px solid var(--accent-gold)', paddingBottom: '10px' }}>
              1. GENEL BİLGİLER VE YASAL DAYANAK
            </h2>
            
            <div style={{ backgroundColor: '#e3f2fd', padding: '25px', borderRadius: '15px', marginBottom: '25px', border: '2px solid #2196f3' }}>
              <h4 style={{ color: '#1565c0', marginBottom: '15px' }}>📋 POLİTİKANIN AMACI</h4>
              <p style={{ color: '#1565c0', marginBottom: '15px', fontSize: '14px' }}>
                HOOWELL GLOBAL SU ARITMA SİSTEMLERİ ANONİM ŞİRKETİ olarak, müşteri memnuniyetini ve 
                tüketici haklarını korumayı öncelik olarak benimsiyoruz. Bu İade ve Değişim Politikası, 
                satın aldığınız ürün ve hizmetlerle ilgili iade, değişim ve cayma haklarınızı düzenler.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                  <h5 style={{ color: '#1565c0', marginBottom: '8px', fontSize: '14px' }}>⚖️ Yasal Dayanaklar</h5>
                  <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#1565c0' }}>
                    <li>6502 sayılı Tüketicinin Korunması Hakkında Kanun</li>
                    <li>6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun</li>
                    <li>Mesafeli Sözleşmeler Yönetmeliği</li>
                    <li>Tüketici Hakem Heyetleri Yönetmeliği</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                  <h5 style={{ color: '#1565c0', marginBottom: '8px', fontSize: '14px' }}>🎯 Kapsam</h5>
                  <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#1565c0' }}>
                    <li>Fiziksel ürünler (Su arıtma cihazları)</li>
                    <li>Dijital hizmetler (Eğitim paketleri)</li>
                    <li>İş ortaklığı hizmetleri</li>
                    <li>Destek ve kurulum hizmetleri</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px' }}>
                  <h5 style={{ color: '#1565c0', marginBottom: '8px', fontSize: '14px' }}>👥 Kimler Yararlanabilir</h5>
                  <ul style={{ paddingLeft: '15px', fontSize: '12px', color: '#1565c0' }}>
                    <li>Tüketiciler (gerçek kişiler)</li>
                    <li>Küçük işletmeler (belirli koşullarda)</li>
                    <li>Mesafeli satış müşterileri</li>
                    <li>Online alışveriş yapanlar</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#f8f9fa', padding: '25px', borderRadius: '15px', border: '2px solid #e9ecef' }}>
              <h4 style={{ color: 'var(--primary-dark)', marginBottom: '15px', fontSize: '18px' }}>
                🏢 ŞİRKET BİLGİLERİ
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div>
                  <h5 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>📋 Resmi Bilgiler</h5>
                  <div style={{ fontSize: '14px', color: '#333' }}>
                    <p><strong>Unvan:</strong> HOOWELL GLOBAL SU ARITMA SİSTEMLERİ ANONİM ŞİRKETİ</p>
                    <p><strong>Ticaret Sicil No:</strong> 264080</p>
                    <p><strong>E-posta:</strong> info@hoowell.com.tr</p>
                    <p><strong>Web:</strong> www.hoowell.com.tr</p>
                  </div>
                </div>
                <div>
                  <h5 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>📍 İletişim Bilgileri</h5>
                  <div style={{ fontSize: '14px', color: '#333' }}>
                    <p><strong>Adres:</strong> AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR</p>
                    <p><strong>E-posta:</strong> info@hoowell.com.tr</p>
                    <p><strong>İade E-posta:</strong> iade@hoowell.com.tr</p>
                    <p><strong>Web:</strong> www.hoowell.com.tr</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>2. Cayma Hakkı</h2>
            <div style={{ backgroundColor: '#d4edda', padding: '20px', borderRadius: '10px', marginBottom: '15px' }}>
              <h4 style={{ color: '#155724', marginBottom: '10px' }}>✅ 14 Günlük Cayma Hakkı</h4>
              <p style={{ color: '#155724', margin: 0 }}>
                Tüketiciler, ürünü teslim aldıkları tarihten itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin 
                sözleşmeden cayabilirler.
              </p>
            </div>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Cayma hakkı ürünün teslim alındığı günden itibaren başlar</li>
              <li>Cayma bildiriminin yazılı olarak yapılması gerekmektedir</li>
              <li>E-posta ile cayma bildirimi yapılabilir</li>
              <li>Ürünün orijinal ambalajında ve kullanılmamış olması şarttır</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>3. İade Koşulları</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--primary-dark)', fontSize: '18px', marginBottom: '10px' }}>
                3.1. Su Arıtma Cihazları
              </h3>
              <ul style={{ paddingLeft: '20px' }}>
                <li>Ürün orijinal ambalajında olmalıdır</li>
                <li>Tüm aksesuarlar ve belgeler eksiksiz olmalıdır</li>
                <li>Cihaz kullanılmamış ve hasarsız olmalıdır</li>
                <li>Garanti belgesi ve fatura bulunmalıdır</li>
                <li>Hijyen koşulları nedeniyle su ile temas etmiş cihazlar iade edilemez</li>
              </ul>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--primary-dark)', fontSize: '18px', marginBottom: '10px' }}>
                3.2. Eğitim Paketleri
              </h3>
              <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '10px' }}>
                <p style={{ color: '#856404', margin: 0 }}>
                  <strong>⚠️ Önemli:</strong> Eğitim videolarına erişim sağlandıktan sonra cayma hakkı kullanılamaz. 
                  Dijital içerik teslim edildiği anda cayma hakkı sona erer.
                </p>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>4. İade Süreci</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>1️⃣</div>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>İade Talebi</h4>
                <p style={{ fontSize: '14px' }}>E-posta ile iade talebinizi bildirin</p>
              </div>
              
              <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>2️⃣</div>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>Onay</h4>
                <p style={{ fontSize: '14px' }}>İade talebiniz 1-2 iş günü içinde değerlendirilir</p>
              </div>
              
              <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>3️⃣</div>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>Kargo</h4>
                <p style={{ fontSize: '14px' }}>Ürünü kargo ile gönderiniz</p>
              </div>
              
              <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>4️⃣</div>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>İnceleme</h4>
                <p style={{ fontSize: '14px' }}>Ürün incelenir ve onaylanır</p>
              </div>
              
              <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>5️⃣</div>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>İade</h4>
                <p style={{ fontSize: '14px' }}>Ödeme 5-7 iş günü içinde iade edilir</p>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>5. Kargo ve Masraflar</h2>
            <ul style={{ paddingLeft: '20px' }}>
              <li><strong>İade Kargo Ücreti:</strong> Müşteri tarafından karşılanır</li>
              <li><strong>Hasarlı Ürün:</strong> Kargo ücreti şirket tarafından karşılanır</li>
              <li><strong>Yanlış Ürün Gönderimi:</strong> Tüm masraflar şirket tarafından karşılanır</li>
              <li><strong>Kargo Sigortası:</strong> Yüksek değerli ürünler için önerilir</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>6. Ödeme İadesi</h2>
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
              <p><strong>İade Yöntemi:</strong> Ödeme hangi yöntemle yapıldıysa aynı yöntemle iade edilir</p>
              <p><strong>İade Süresi:</strong> Ürün onaylandıktan sonra 5-7 iş günü</p>
              <p><strong>Banka Hesabı:</strong> IBAN: TR77 0011 1000 0000 0153 1671 66</p>
              <p><strong>Hesap Sahibi:</strong> HOOWELL GLOBAL SU ARITMA SİSTEMLERİ ANONİM ŞİRKETİ</p>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>7. İade Edilemeyen Ürünler</h2>
            <div style={{ backgroundColor: '#f8d7da', padding: '20px', borderRadius: '10px' }}>
              <h4 style={{ color: '#721c24', marginBottom: '10px' }}>❌ Aşağıdaki ürünler iade edilemez:</h4>
              <ul style={{ paddingLeft: '20px', color: '#721c24' }}>
                <li>Hijyen koşulları nedeniyle su ile temas etmiş cihazlar</li>
                <li>Kullanılmış veya hasarlı ürünler</li>
                <li>Orijinal ambalajı olmayan ürünler</li>
                <li>Özel sipariş üzerine üretilen ürünler</li>
                <li>Dijital içerik (eğitim videoları) - erişim sağlandıktan sonra</li>
                <li>14 günlük süre geçmiş ürünler</li>
              </ul>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>8. Değişim Politikası</h2>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Aynı ürün grubu içinde değişim yapılabilir</li>
              <li>Fiyat farkı varsa ek ödeme yapılır</li>
              <li>Değişim için de 14 günlük süre geçerlidir</li>
              <li>Değişim kargo ücreti müşteri tarafından karşılanır</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>9. Garanti Kapsamı</h2>
            <div style={{ backgroundColor: '#d4edda', padding: '20px', borderRadius: '10px' }}>
              <h4 style={{ color: '#155724', marginBottom: '10px' }}>🛡️ Garanti Koşulları:</h4>
              <ul style={{ paddingLeft: '20px', color: '#155724' }}>
                <li><strong>Su Arıtma Cihazları:</strong> 2 yıl garanti</li>
                <li><strong>Yedek Parçalar:</strong> 1 yıl garanti</li>
                <li><strong>İşçilik:</strong> 1 yıl garanti</li>
                <li><strong>Garanti Belgesi:</strong> Mutlaka saklanmalıdır</li>
              </ul>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>10. İletişim Bilgileri</h2>
            <p>İade ve değişim işlemleri için bizimle iletişime geçebilirsiniz:</p>
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
              <p><strong>E-posta:</strong> info@hoowell.com.tr</p>
              <p><strong>Konu:</strong> "İade Talebi - Sipariş Numaranız"</p>
              <p><strong>Adres:</strong> AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR</p>
              <p><strong>Çalışma Saatleri:</strong> Pazartesi-Cuma 09:00-18:00</p>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>11. Tüketici Hakları</h2>
            <p>
              Bu politika tüketici haklarınızı kısıtlamaz. Tüketici sorunları için 
              <strong> Tüketici Hakem Heyetleri</strong> ve <strong>Tüketici Mahkemeleri</strong>ne başvurabilirsiniz.
            </p>
          </section>

          <section>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>12. Politika Güncellemeleri</h2>
            <p>
              Bu iade ve değişim politikası gerektiğinde güncellenebilir. 
              Güncellemeler web sitemizde yayınlandığı tarihte yürürlüğe girer.
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

export default RefundPolicy;