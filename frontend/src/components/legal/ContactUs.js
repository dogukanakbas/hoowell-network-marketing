import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulated form submission
    setTimeout(() => {
      setSuccessMessage('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setLoading(false);
    }, 1000);
  };

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
          İletişim
        </h1>

        <div style={{ lineHeight: '1.8', fontSize: '16px', color: '#333' }}>
          {/* Şirket Bilgileri */}
          <section style={{ marginBottom: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <img 
                src="/hoowell-logo.png" 
                alt="HOOWELL Logo"
                style={{
                  width: '150px',
                  height: '90px',
                  objectFit: 'contain',
                  marginBottom: '15px'
                }}
              />
              <h2 style={{ color: 'var(--primary-dark)', marginBottom: '5px' }}>
                HOOWELL GLOBAL ALKALİ İYONİZER SİSTEMLERİ ANONİM ŞİRKETİ
              </h2>
              <p style={{ color: 'var(--accent-gold)', fontStyle: 'italic' }}>
                INNOVATE YOUR LIFE
              </p>
            </div>
          </section>

          {/* İletişim Bilgileri Grid */}
          <section style={{ marginBottom: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
              
              {/* Adres Bilgileri */}
              <div style={{ backgroundColor: '#e3f2fd', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>📍</div>
                <h3 style={{ color: '#1565c0', marginBottom: '15px' }}>Adres</h3>
                <p style={{ color: '#1565c0', fontWeight: '500' }}>
                  AOSB MAH. 10035 SK. NO 5<br/>
                  ÇİĞİLİ İZMİR<br/>
                  TÜRKİYE
                </p>
              </div>

              {/* İletişim Bilgileri */}
              <div style={{ backgroundColor: '#f3e5f5', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>📞</div>
                <h3 style={{ color: '#7b1fa2', marginBottom: '15px' }}>İletişim</h3>
                <p style={{ color: '#7b1fa2', fontWeight: '500' }}>
                  <strong>Telefon:</strong><br/>
                  0232 905 55 55<br/><br/>
                  <strong>E-posta:</strong><br/>
                  info@hoowell.com.tr<br/><br/>
                  <strong>Çalışma Saatleri:</strong><br/>
                  Pazartesi - Cuma<br/>
                  09:00 - 18:00
                </p>
              </div>

              {/* Banka Bilgileri */}
              <div style={{ backgroundColor: '#e8f5e8', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏦</div>
                <h3 style={{ color: '#2e7d32', marginBottom: '15px' }}>Banka Bilgileri</h3>
                <p style={{ color: '#2e7d32', fontWeight: '500' }}>
                  <strong>IBAN:</strong><br/>
                  TR77 0011 1000 0000 0153 1671 66<br/><br/>
                  <strong>Hesap Sahibi:</strong><br/>
                  HOOWELL GLOBAL ALKALİ İYONİZER<br/>
                  SİSTEMLERİ ANONİM ŞİRKETİ
                </p>
              </div>

              {/* Yasal Bilgiler */}
              <div style={{ backgroundColor: '#fff3e0', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏢</div>
                <h3 style={{ color: '#f57c00', marginBottom: '15px' }}>Yasal Bilgiler</h3>
                <p style={{ color: '#f57c00', fontWeight: '500' }}>
                  <strong>Ticaret Sicil No:</strong><br/>
                  264080<br/><br/>
                  <strong>Telefon:</strong><br/>
                  0232 905 55 55<br/><br/>
                  <strong>E-posta:</strong><br/>
                  info@hoowell.com.tr
                </p>
              </div>

            </div>
          </section>

          {/* İletişim Formu */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', textAlign: 'center' }}>
              Bize Mesaj Gönderin
            </h2>
            
            {successMessage && (
              <div style={{
                backgroundColor: '#d4edda',
                color: '#155724',
                padding: '15px',
                borderRadius: '10px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                ✅ {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid #ddd',
                      borderRadius: '10px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Adınız ve soyadınız"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                    E-posta *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid #ddd',
                      borderRadius: '10px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid #ddd',
                      borderRadius: '10px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="0555 123 45 67"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                    Konu *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid #ddd',
                      borderRadius: '10px',
                      fontSize: '16px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Konu seçiniz</option>
                    <option value="product">Ürün Bilgisi</option>
                    <option value="order">Sipariş Durumu</option>
                    <option value="technical">Teknik Destek</option>
                    <option value="partnership">İş Ortaklığı</option>
                    <option value="complaint">Şikayet</option>
                    <option value="suggestion">Öneri</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                  Mesajınız *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #ddd',
                    borderRadius: '10px',
                    fontSize: '16px',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Mesajınızı buraya yazınız..."
                />
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? '#ccc' : 'var(--primary-dark)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '15px 40px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}
                >
                  {loading ? 'Gönderiliyor...' : '📧 Mesaj Gönder'}
                </button>
              </div>
            </form>
          </section>

          {/* Harita Bölümü */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', textAlign: 'center' }}>
              Konum
            </h2>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '20px', 
              borderRadius: '15px',
              textAlign: 'center'
            }}>
              <p style={{ marginBottom: '15px', color: '#666' }}>
                📍 AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR
              </p>
              <div style={{
                width: '100%',
                height: '300px',
                backgroundColor: '#e9ecef',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6c757d',
                fontSize: '18px'
              }}>
                🗺️ Harita Entegrasyonu<br/>
                <small style={{ fontSize: '14px' }}>
                  (Google Maps entegrasyonu eklenecek)
                </small>
              </div>
            </div>
          </section>

          {/* Sık Sorulan Sorular */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px', textAlign: 'center' }}>
              Sık Sorulan Sorular
            </h2>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
                  ❓ Ürünleriniz hakkında nasıl bilgi alabilirim?
                </h4>
                <p style={{ margin: 0, color: '#666' }}>
                  Ürünlerimiz hakkında detaylı bilgi almak için yukarıdaki iletişim formunu kullanabilir 
                  veya info@hoowell.com.tr adresine e-posta gönderebilirsiniz.
                </p>
              </div>
              
              <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
                  ❓ Sipariş durumumu nasıl öğrenebilirim?
                </h4>
                <p style={{ margin: 0, color: '#666' }}>
                  Sipariş durumunuzu öğrenmek için müşteri panelinden giriş yapabilir veya 
                  sipariş numaranızla birlikte bize ulaşabilirsiniz.
                </p>
              </div>
              
              <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
                  ❓ İş ortaklığı başvurusu nasıl yapabilirim?
                </h4>
                <p style={{ margin: 0, color: '#666' }}>
                  İş ortaklığı başvurusu için "İş Ortaklığı" konusunu seçerek yukarıdaki formu doldurabilir 
                  veya doğrudan bizimle iletişime geçebilirsiniz.
                </p>
              </div>
              
              <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
                  ❓ Teknik destek nasıl alabilirim?
                </h4>
                <p style={{ margin: 0, color: '#666' }}>
                  Teknik destek için "Teknik Destek" konusunu seçerek mesaj gönderebilir veya 
                  ürün seri numaranızla birlikte bize ulaşabilirsiniz.
                </p>
              </div>
            </div>
          </section>

          {/* Sosyal Medya */}
          <section style={{ textAlign: 'center', backgroundColor: 'var(--primary-dark)', color: 'white', padding: '30px', borderRadius: '15px' }}>
            <h2 style={{ color: 'var(--accent-gold)', marginBottom: '20px' }}>
              Bizi Takip Edin
            </h2>
            <p style={{ marginBottom: '20px' }}>
              HOOWELL'in son haberlerini ve güncellemelerini kaçırmayın!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                padding: '15px', 
                borderRadius: '10px',
                minWidth: '120px'
              }}>
                📘 Facebook<br/>
                <small>(Yakında)</small>
              </div>
              <div style={{ 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                padding: '15px', 
                borderRadius: '10px',
                minWidth: '120px'
              }}>
                📷 Instagram<br/>
                <small>(Yakında)</small>
              </div>
              <div style={{ 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                padding: '15px', 
                borderRadius: '10px',
                minWidth: '120px'
              }}>
                🐦 Twitter<br/>
                <small>(Yakında)</small>
              </div>
              <div style={{ 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                padding: '15px', 
                borderRadius: '10px',
                minWidth: '120px'
              }}>
                💼 LinkedIn<br/>
                <small>(Yakında)</small>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;