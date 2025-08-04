import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Türkiye İl ve İlçe verileri (Kısaltılmış versiyon)
const turkeyData = {
  "İstanbul": ["Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt", "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane", "Kartal", "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer", "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Tuzla", "Ümraniye", "Üsküdar", "Zeytinburnu"],
  "Ankara": ["Akyurt", "Altındağ", "Ayaş", "Bala", "Beypazarı", "Çamlıdere", "Çankaya", "Çubuk", "Elmadağ", "Etimesgut", "Evren", "Gölbaşı", "Güdül", "Haymana", "Kalecik", "Kazan", "Keçiören", "Kızılcahamam", "Mamak", "Nallıhan", "Polatlı", "Pursaklar", "Sincan", "Şereflikoçhisar", "Yenimahalle"],
  "İzmir": ["Aliağa", "Balçova", "Bayındır", "Bayraklı", "Bergama", "Beydağ", "Bornova", "Buca", "Çeşme", "Çiğli", "Dikili", "Foça", "Gaziemir", "Güzelbahçe", "Karabağlar", "Karaburun", "Karşıyaka", "Kemalpaşa", "Kınık", "Kiraz", "Konak", "Menderes", "Menemen", "Narlıdere", "Ödemiş", "Seferihisar", "Selçuk", "Tire", "Torbalı", "Urla"],
  "Bursa": ["Büyükorhan", "Gemlik", "Gürsu", "Harmancık", "İnegöl", "İznik", "Karacabey", "Keles", "Kestel", "Mudanya", "Mustafakemalpaşa", "Nilüfer", "Orhaneli", "Orhangazi", "Osmangazi", "Yenişehir", "Yıldırım"],
  "Antalya": ["Akseki", "Aksu", "Alanya", "Demre", "Döşemealtı", "Elmalı", "Finike", "Gazipaşa", "Gündoğmuş", "İbradı", "Kaş", "Kemer", "Kepez", "Konyaaltı", "Korkuteli", "Kumluca", "Manavgat", "Muratpaşa", "Serik"],
  "Adana": ["Aladağ", "Ceyhan", "Çukurova", "Feke", "İmamoğlu", "Karaisalı", "Karataş", "Kozan", "Pozantı", "Saimbeyli", "Sarıçam", "Seyhan", "Tufanbeyli", "Yumurtalık", "Yüreğir"],
  "Konya": ["Ahırlı", "Akören", "Akşehir", "Altınekin", "Beyşehir", "Bozkır", "Cihanbeyli", "Çeltik", "Çumra", "Derbent", "Derebucak", "Doğanhisar", "Emirgazi", "Ereğli", "Güneysınır", "Hadim", "Halkapınar", "Hüyük", "Ilgın", "Kadınhanı", "Karapınar", "Karatay", "Kulu", "Meram", "Sarayönü", "Selçuklu", "Seydişehir", "Taşkent", "Tuzlukçu", "Yalıhüyük", "Yunak"],
  "Gaziantep": ["Araban", "İslahiye", "Karkamış", "Nizip", "Nurdağı", "Oğuzeli", "Şahinbey", "Şehitkamil", "Yavuzeli"],
  "Şanlıurfa": ["Akçakale", "Birecik", "Bozova", "Ceylanpınar", "Eyyübiye", "Halfeti", "Haliliye", "Harran", "Hilvan", "Karaköprü", "Siverek", "Suruç", "Viranşehir"],
  "Kocaeli": ["Başiskele", "Çayırova", "Darıca", "Derince", "Dilovası", "Gebze", "Gölcük", "İzmit", "Kandıra", "Karamürsel", "Kartepe", "Körfez"],
  "Mersin": ["Akdeniz", "Anamur", "Aydıncık", "Bozyazı", "Çamlıyayla", "Erdemli", "Gülnar", "Mezitli", "Mut", "Silifke", "Tarsus", "Toroslar", "Yenişehir"],
  "Diyarbakır": ["Bağlar", "Bismil", "Çermik", "Çınar", "Çüngüş", "Dicle", "Eğil", "Ergani", "Hani", "Hazro", "Kayapınar", "Kocaköy", "Kulp", "Lice", "Silvan", "Sur", "Yenişehir"],
  "Hatay": ["Altınözü", "Antakya", "Arsuz", "Belen", "Defne", "Dörtyol", "Erzin", "Hassa", "İskenderun", "Kırıkhan", "Kumlu", "Payas", "Reyhanlı", "Samandağ", "Yayladağı"],
  "Manisa": ["Ahmetli", "Akhisar", "Alaşehir", "Demirci", "Gölmarmara", "Gördes", "Kırkağaç", "Köprübaşı", "Kula", "Salihli", "Sarıgöl", "Saruhanlı", "Selendi", "Soma", "Şehzadeler", "Turgutlu", "Yunusemre"],
  "Kayseri": ["Akkışla", "Bünyan", "Develi", "Felahiye", "Hacılar", "İncesu", "Kocasinan", "Melikgazi", "Özvatan", "Pınarbaşı", "Sarıoğlan", "Sarız", "Talas", "Tomarza", "Yahyalı", "Yeşilhisar"]
};

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    registration_type: 'individual',
    first_name: '',
    last_name: '',
    tc_no: '',
    email: '',
    phone: '',
    city: '',
    district: '',
    delivery_address: '',
    company_name: '',
    tax_office: '',
    tax_no: '',
    authorized_person: '',
    authorized_email: '',
    authorized_phone: '',
    selected_product: '',
    contract1_accepted: false,
    contract2_accepted: false
  });

  const products = [
    {
      id: 'education',
      name: 'Eğitim Paketi',
      price: 4000, // 100 USD * 40 TL
      vat: 800,    // 20% KDV
      total: 4800, // KDV dahil
      description: 'Su Arıtma Eğitim Sistemi'
    },
    {
      id: 'device',
      name: 'Cihaz Paketi',
      price: 72000,  // 1800 USD * 40 TL
      vat: 14400,    // 20% KDV
      total: 86400,  // KDV dahil
      description: 'HOOWELL Cihazı + Eğitim Sistemi'
    }
  ];

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // Validasyon kontrolleri
      if (formData.registration_type === 'individual') {
        if (!formData.first_name || !formData.last_name || !formData.tc_no || !formData.email || !formData.phone || !formData.city || !formData.district || !formData.delivery_address) {
          alert('Lütfen tüm zorunlu alanları doldurun.');
          return;
        }
        if (formData.tc_no.length !== 11 || !/^\d+$/.test(formData.tc_no)) {
          alert('TC Kimlik No 11 haneli olmalıdır.');
          return;
        }
      } else {
        if (!formData.company_name || !formData.tax_office || !formData.tax_no || !formData.authorized_person || !formData.city || !formData.district || !formData.delivery_address) {
          alert('Lütfen tüm zorunlu alanları doldurun.');
          return;
        }
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || formData.authorized_email)) {
        alert('Geçerli bir e-posta adresi girin.');
        return;
      }

      const selectedProductData = products.find(p => p.id === formData.selected_product);

      const submitData = {
        ...formData,
        product_price: selectedProductData?.price || 0,  // TL cinsinden net fiyat
        product_vat: selectedProductData?.vat || 0,      // TL cinsinden KDV
        total_amount: selectedProductData?.total || 0    // TL cinsinden toplam
      };

      const response = await axios.post('/api/customers', submitData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        alert(`Müşteri kaydı başarıyla oluşturuldu!\n\nKazandığınız KKP: ${response.data.kkp_earned?.toFixed(2) || 0} KKP\nToplam Tutar: ${selectedProductData?.total?.toLocaleString() || 0} TL (KDV Dahil)`);
        setCurrentStep(6);
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('Kayıt sırasında bir hata oluştu.');
    }
  };

  return (
    <div className="registration-container" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Başlık */}
      <div style={{
        backgroundColor: 'var(--card-gray)',
        borderRadius: '15px',
        padding: '30px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: 'var(--primary-dark)', marginBottom: '20px' }}>
          Müşteri Kayıt Paneli
        </h1>

        {/* İlerleme Çubuğu */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: currentStep >= step ? 'var(--primary-dark)' : '#ddd',
                color: currentStep >= step ? 'white' : '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}
            >
              {step}
            </div>
          ))}
        </div>

        <p style={{ color: 'var(--text-light)' }}>
          Adım {currentStep}/5: {
            currentStep === 1 ? 'Kayıt Türü' :
              currentStep === 2 ? 'Bilgiler' :
                currentStep === 3 ? 'Ürün Seçimi' :
                  currentStep === 4 ? 'Sözleşmeler' :
                    currentStep === 5 ? 'Özet' : 'Tamamlandı'
          }
        </p>
      </div>

      {/* ADIM 1: Kayıt Türü */}
      {currentStep === 1 && (
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '40px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-dark)' }}>
            Kayıt Türü Seçimi
          </h2>

          <div className="registration-type-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', maxWidth: '600px', margin: '0 auto' }}>
            <div
              onClick={() => setFormData({ ...formData, registration_type: 'individual' })}
              style={{
                backgroundColor: formData.registration_type === 'individual' ? 'var(--primary-dark)' : 'white',
                color: formData.registration_type === 'individual' ? 'white' : 'var(--text-dark)',
                padding: '30px',
                borderRadius: '15px',
                border: '2px solid ' + (formData.registration_type === 'individual' ? 'var(--primary-dark)' : '#ddd'),
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>👤</div>
              <h3>Bireysel Müşteri</h3>
              <p style={{ fontSize: '14px', opacity: 0.8 }}>Kişisel kullanım</p>
            </div>

            <div
              onClick={() => setFormData({ ...formData, registration_type: 'corporate' })}
              style={{
                backgroundColor: formData.registration_type === 'corporate' ? 'var(--primary-dark)' : 'white',
                color: formData.registration_type === 'corporate' ? 'white' : 'var(--text-dark)',
                padding: '30px',
                borderRadius: '15px',
                border: '2px solid ' + (formData.registration_type === 'corporate' ? 'var(--primary-dark)' : '#ddd'),
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏢</div>
              <h3>Kurumsal Müşteri</h3>
              <p style={{ fontSize: '14px', opacity: 0.8 }}>Şirket adına</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              onClick={handleNext}
              disabled={!formData.registration_type}
              style={{
                backgroundColor: formData.registration_type ? 'var(--primary-dark)' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 30px',
                fontSize: '16px',
                cursor: formData.registration_type ? 'pointer' : 'not-allowed'
              }}
            >
              Devam Et →
            </button>
          </div>
        </div>
      )}

      {/* ADIM 2: Bilgiler */}
      {currentStep === 2 && (
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '40px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-dark)' }}>
            {formData.registration_type === 'individual' ? 'Kişisel Bilgiler' : 'Kurumsal Bilgiler'}
          </h2>

          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {formData.registration_type === 'individual' ? (
              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ad *</label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Soyad *</label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>TC Kimlik No *</label>
                  <input
                    type="text"
                    value={formData.tc_no}
                    onChange={(e) => setFormData({ ...formData, tc_no: e.target.value })}
                    maxLength="11"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>E-posta *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Telefon *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>İl *</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value, district: '' })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '16px',
                        backgroundColor: '#fff'
                      }}
                    >
                      <option value="">İl Seçin</option>
                      {Object.keys(turkeyData).map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>İlçe *</label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      disabled={!formData.city}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '16px',
                        backgroundColor: formData.city ? '#fff' : '#f5f5f5',
                        cursor: formData.city ? 'pointer' : 'not-allowed'
                      }}
                    >
                      <option value="">İlçe Seçin</option>
                      {formData.city && turkeyData[formData.city]?.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Teslimat Adresi *</label>
                  <textarea
                    value={formData.delivery_address}
                    onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                    placeholder="Detaylı adres bilgisi (Mahalle, Sokak, Bina No, Daire No vb.)"
                  />
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Şirket Adı *</label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Vergi Dairesi *</label>
                    <input
                      type="text"
                      value={formData.tax_office}
                      onChange={(e) => setFormData({ ...formData, tax_office: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Vergi No *</label>
                    <input
                      type="text"
                      value={formData.tax_no}
                      onChange={(e) => setFormData({ ...formData, tax_no: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Yetkili Kişi *</label>
                  <input
                    type="text"
                    value={formData.authorized_person}
                    onChange={(e) => setFormData({ ...formData, authorized_person: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>E-posta *</label>
                  <input
                    type="email"
                    value={formData.authorized_email}
                    onChange={(e) => setFormData({ ...formData, authorized_email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Telefon *</label>
                  <input
                    type="tel"
                    value={formData.authorized_phone}
                    onChange={(e) => setFormData({ ...formData, authorized_phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Teslimat Adresi *</label>
                  <textarea
                    value={formData.delivery_address}
                    onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                    placeholder="Detaylı adres bilgisi..."
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
            <button
              onClick={handlePrevious}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 30px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              ← Geri
            </button>

            <button
              onClick={handleNext}
              style={{
                backgroundColor: 'var(--primary-dark)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 30px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Devam Et →
            </button>
          </div>
        </div>
      )}

      {/* ADIM 3: Ürün Seçimi */}
      {currentStep === 3 && (
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '40px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-dark)' }}>
            Ürün Seçimi
          </h2>

          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => setFormData({ ...formData, selected_product: product.id })}
                style={{
                  backgroundColor: formData.selected_product === product.id ? 'var(--primary-dark)' : 'white',
                  color: formData.selected_product === product.id ? 'white' : 'var(--text-dark)',
                  padding: '30px',
                  borderRadius: '15px',
                  border: '2px solid ' + (formData.selected_product === product.id ? 'var(--primary-dark)' : '#ddd'),
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <h3 style={{ marginBottom: '15px' }}>{product.name}</h3>
                <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '20px' }}>
                  {product.description}
                </p>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
                  {product.total.toLocaleString()} TL
                </div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>
                  (KDV Dahil)
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
            <button
              onClick={handlePrevious}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 30px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              ← Geri
            </button>

            <button
              onClick={handleNext}
              disabled={!formData.selected_product}
              style={{
                backgroundColor: formData.selected_product ? 'var(--primary-dark)' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 30px',
                fontSize: '16px',
                cursor: formData.selected_product ? 'pointer' : 'not-allowed'
              }}
            >
              Devam Et →
            </button>
          </div>
        </div>
      )}

      {/* ADIM 4: Sözleşmeler */}
      {currentStep === 4 && (
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '40px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-dark)' }}>
            Sözleşme Onayları
          </h2>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Sözleşme 1 */}
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '20px',
              maxHeight: '200px',
              overflowY: 'auto',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              <h4>SATIŞ SÖZLEŞMESİ</h4>
              <p>İşbu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun çerçevesinde düzenlenmiştir.</p>
              <p><strong>SATICI:</strong> HOOWELL GLOBAL SU ARITMA SİSTEMLERİ ANONİM ŞİRKETİ</p>
              <p><strong>ÜRÜN:</strong> {products.find(p => p.id === formData.selected_product)?.name}</p>
              <p><strong>FİYAT:</strong> {products.find(p => p.id === formData.selected_product)?.total.toLocaleString()} TL (KDV Dahil)</p>
              <p>Ürün, sipariş onayından sonra 7-14 iş günü içinde teslim edilecektir.</p>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.contract1_accepted}
                onChange={(e) => setFormData({ ...formData, contract1_accepted: e.target.checked })}
                style={{ marginRight: '10px', transform: 'scale(1.2)' }}
              />
              <span>Satış sözleşmesini okudum, anladım ve kabul ediyorum.</span>
            </label>

            {/* Sözleşme 2 */}
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '20px',
              maxHeight: '200px',
              overflowY: 'auto',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              <h4>KİŞİSEL VERİLERİN KORUNMASI</h4>
              <p>6698 sayılı KVKK kapsamında kişisel verileriniz işlenmektedir.</p>
              <p>Verileriniz hizmet sunumu ve müşteri ilişkileri yönetimi amacıyla kullanılacaktır.</p>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.contract2_accepted}
                onChange={(e) => setFormData({ ...formData, contract2_accepted: e.target.checked })}
                style={{ marginRight: '10px', transform: 'scale(1.2)' }}
              />
              <span>KVKK aydınlatma metnini okudum, anladım ve kabul ediyorum.</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
            <button
              onClick={handlePrevious}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 30px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              ← Geri
            </button>

            <button
              onClick={handleNext}
              disabled={!formData.contract1_accepted || !formData.contract2_accepted}
              style={{
                backgroundColor: (formData.contract1_accepted && formData.contract2_accepted) ? 'var(--primary-dark)' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 30px',
                fontSize: '16px',
                cursor: (formData.contract1_accepted && formData.contract2_accepted) ? 'pointer' : 'not-allowed'
              }}
            >
              Devam Et →
            </button>
          </div>
        </div>
      )}

      {/* ADIM 5: Özet ve Onay */}
      {currentStep === 5 && (
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '40px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-dark)' }}>
            Sipariş Özeti
          </h2>

          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '15px',
              marginBottom: '30px'
            }}>
              <h3 style={{ marginBottom: '20px', color: 'var(--primary-dark)' }}>Müşteri Bilgileri</h3>
              {formData.registration_type === 'individual' ? (
                <div>
                  <p><strong>Ad Soyad:</strong> {formData.first_name} {formData.last_name}</p>
                  <p><strong>TC No:</strong> {formData.tc_no}</p>
                  <p><strong>E-posta:</strong> {formData.email}</p>
                  <p><strong>Telefon:</strong> {formData.phone}</p>
                </div>
              ) : (
                <div>
                  <p><strong>Şirket:</strong> {formData.company_name}</p>
                  <p><strong>Vergi Dairesi:</strong> {formData.tax_office}</p>
                  <p><strong>Vergi No:</strong> {formData.tax_no}</p>
                  <p><strong>Yetkili:</strong> {formData.authorized_person}</p>
                  <p><strong>E-posta:</strong> {formData.authorized_email}</p>
                  <p><strong>Telefon:</strong> {formData.authorized_phone}</p>
                </div>
              )}
              <p><strong>Adres:</strong> {formData.delivery_address}</p>

              <hr style={{ margin: '20px 0' }} />

              <h3 style={{ marginBottom: '15px', color: 'var(--primary-dark)' }}>Seçilen Ürün</h3>
              {formData.selected_product && (
                <div>
                  <p><strong>Ürün:</strong> {products.find(p => p.id === formData.selected_product)?.name}</p>
                  <p><strong>Açıklama:</strong> {products.find(p => p.id === formData.selected_product)?.description}</p>
                  <p><strong>Fiyat:</strong> {products.find(p => p.id === formData.selected_product)?.price.toLocaleString()} TL</p>
                  <p><strong>KDV (%20):</strong> {products.find(p => p.id === formData.selected_product)?.vat.toLocaleString()} TL</p>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                    <strong>Toplam:</strong> {products.find(p => p.id === formData.selected_product)?.total.toLocaleString()} TL
                  </p>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
            <button
              onClick={handlePrevious}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 30px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              ← Geri
            </button>

            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: 'var(--success-color)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 30px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Siparişi Onayla ✓
            </button>
          </div>
        </div>
      )}

      {/* ADIM 6: Başarı */}
      {currentStep === 6 && (
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
          <h2 style={{ color: 'var(--success-color)', marginBottom: '20px' }}>
            Kayıt Başarıyla Tamamlandı!
          </h2>
          <p style={{ fontSize: '16px', marginBottom: '30px', color: 'var(--text-dark)' }}>
            Müşteri kaydınız oluşturuldu. Sipariş bilgileri e-posta adresinize gönderilecektir.
          </p>

          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: 'var(--primary-dark)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '15px 40px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Ana Sayfa
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerRegistration