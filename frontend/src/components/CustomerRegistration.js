import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext'; // Şu an kullanılmıyor
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Türkiye İl ve İlçe verileri
const turkeyData = {
  "Adana": ["Aladağ", "Ceyhan", "Çukurova", "Feke", "İmamoğlu", "Karaisalı", "Karataş", "Kozan", "Pozantı", "Saimbeyli", "Sarıçam", "Seyhan", "Tufanbeyli", "Yumurtalık", "Yüreğir"],
  "Adıyaman": ["Besni", "Çelikhan", "Gerger", "Gölbaşı", "Kahta", "Merkez", "Samsat", "Sincik", "Tut"],
  "Afyonkarahisar": ["Başmakçı", "Bayat", "Bolvadin", "Çay", "Çobanlar", "Dazkırı", "Dinar", "Emirdağ", "Evciler", "Hocalar", "İhsaniye", "İscehisar", "Kızılören", "Merkez", "Sandıklı", "Sinanpaşa", "Sultandağı", "Şuhut"],
  "Ağrı": ["Diyadin", "Doğubayazıt", "Eleşkirt", "Hamur", "Merkez", "Patnos", "Taşlıçay", "Tutak"],
  "Aksaray": ["Ağaçören", "Eskil", "Gülağaç", "Güzelyurt", "Merkez", "Ortaköy", "Sarıyahşi"],
  "Amasya": ["Göynücek", "Gümüşhacıköy", "Hamamözü", "Merkez", "Merzifon", "Suluova", "Taşova"],
  "Ankara": ["Akyurt", "Altındağ", "Ayaş", "Bala", "Beypazarı", "Çamlıdere", "Çankaya", "Çubuk", "Elmadağ", "Etimesgut", "Evren", "Gölbaşı", "Güdül", "Haymana", "Kalecik", "Kazan", "Keçiören", "Kızılcahamam", "Mamak", "Nallıhan", "Polatlı", "Pursaklar", "Sincan", "Şereflikoçhisar", "Yenimahalle"],
  "Antalya": ["Akseki", "Aksu", "Alanya", "Demre", "Döşemealtı", "Elmalı", "Finike", "Gazipaşa", "Gündoğmuş", "İbradı", "Kaş", "Kemer", "Kepez", "Konyaaltı", "Korkuteli", "Kumluca", "Manavgat", "Muratpaşa", "Serik"],
  "Ardahan": ["Çıldır", "Damal", "Göle", "Hanak", "Merkez", "Posof"],
  "Artvin": ["Ardanuç", "Arhavi", "Borçka", "Hopa", "Merkez", "Murgul", "Şavşat", "Yusufeli"],
  "Aydın": ["Bozdoğan", "Buharkent", "Çine", "Didim", "Efeler", "Germencik", "İncirliova", "Karacasu", "Karpuzlu", "Koçarlı", "Köşk", "Kuşadası", "Kuyucak", "Nazilli", "Söke", "Sultanhisar", "Yenipazar"],
  "Balıkesir": ["Altıeylül", "Ayvalık", "Balya", "Bandırma", "Bigadiç", "Burhaniye", "Dursunbey", "Edremit", "Erdek", "Gömeç", "Gönen", "Havran", "İvrindi", "Karesi", "Kepsut", "Manyas", "Marmara", "Savaştepe", "Sındırgı", "Susurluk"],
  "Bartın": ["Amasra", "Kurucaşile", "Merkez", "Ulus"],
  "Batman": ["Beşiri", "Gercüş", "Hasankeyf", "Kozluk", "Merkez", "Sason"],
  "Bayburt": ["Aydıntepe", "Demirözü", "Merkez"],
  "Bilecik": ["Bozüyük", "Gölpazarı", "İnhisar", "Merkez", "Osmaneli", "Pazaryeri", "Söğüt", "Yenipazar"],
  "Bingöl": ["Adaklı", "Genç", "Karlıova", "Kiğı", "Merkez", "Solhan", "Yayladere", "Yedisu"],
  "Bitlis": ["Adilcevaz", "Ahlat", "Güroymak", "Hizan", "Merkez", "Mutki", "Tatvan"],
  "Bolu": ["Dörtdivan", "Gerede", "Göynük", "Kıbrıscık", "Mengen", "Merkez", "Mudurnu", "Seben", "Yeniçağa"],
  "Burdur": ["Ağlasun", "Altınyayla", "Bucak", "Çavdır", "Çeltikçi", "Gölhisar", "Karamanlı", "Kemer", "Merkez", "Tefenni", "Yeşilova"],
  "Bursa": ["Büyükorhan", "Gemlik", "Gürsu", "Harmancık", "İnegöl", "İznik", "Karacabey", "Keles", "Kestel", "Mudanya", "Mustafakemalpaşa", "Nilüfer", "Orhaneli", "Orhangazi", "Osmangazi", "Yenişehir", "Yıldırım"],
  "Çanakkale": ["Ayvacık", "Bayramiç", "Biga", "Bozcaada", "Çan", "Eceabat", "Ezine", "Gelibolu", "Gökçeada", "Lapseki", "Merkez", "Yenice"],
  "Çankırı": ["Atkaracalar", "Bayramören", "Çerkeş", "Eldivan", "Ilgaz", "Kızılırmak", "Korgun", "Kurşunlu", "Merkez", "Orta", "Şabanözü", "Yapraklı"],
  "Çorum": ["Alaca", "Bayat", "Boğazkale", "Dodurga", "İskilip", "Kargı", "Laçin", "Mecitözü", "Merkez", "Oğuzlar", "Ortaköy", "Osmancık", "Sungurlu", "Uğurludağ"],
  "Denizli": ["Acıpayam", "Babadağ", "Baklan", "Bekilli", "Beyağaç", "Bozkurt", "Buldan", "Çal", "Çameli", "Çardak", "Çivril", "Güney", "Honaz", "Kale", "Merkezefendi", "Pamukkale", "Sarayköy", "Serinhisar", "Tavas"],
  "Diyarbakır": ["Bağlar", "Bismil", "Çermik", "Çınar", "Çüngüş", "Dicle", "Eğil", "Ergani", "Hani", "Hazro", "Kayapınar", "Kocaköy", "Kulp", "Lice", "Silvan", "Sur", "Yenişehir"],
  "Düzce": ["Akçakoca", "Cumayeri", "Çilimli", "Gölyaka", "Gümüşova", "Kaynaşlı", "Merkez", "Yığılca"],
  "Edirne": ["Enez", "Havsa", "İpsala", "Keşan", "Lalapaşa", "Meriç", "Merkez", "Süloğlu", "Uzunköprü"],
  "Elazığ": ["Ağın", "Alacakaya", "Arıcak", "Baskil", "Karakoçan", "Keban", "Kovancılar", "Maden", "Merkez", "Palu", "Sivrice"],
  "Erzincan": ["Çayırlı", "İliç", "Kemah", "Kemaliye", "Merkez", "Otlukbeli", "Refahiye", "Tercan", "Üzümlü"],
  "Erzurum": ["Aşkale", "Aziziye", "Çat", "Hınıs", "Horasan", "İspir", "Karaçoban", "Karayazı", "Köprüköy", "Narman", "Oltu", "Olur", "Palandöken", "Pasinler", "Pazaryolu", "Şenkaya", "Tekman", "Tortum", "Uzundere", "Yakutiye"],
  "Eskişehir": ["Alpu", "Beylikova", "Çifteler", "Günyüzü", "Han", "İnönü", "Mahmudiye", "Mihalgazi", "Mihalıççık", "Odunpazarı", "Sarıcakaya", "Seyitgazi", "Sivrihisar", "Tepebaşı"],
  "Gaziantep": ["Araban", "İslahiye", "Karkamış", "Nizip", "Nurdağı", "Oğuzeli", "Şahinbey", "Şehitkamil", "Yavuzeli"],
  "Giresun": ["Alucra", "Bulancak", "Çamoluk", "Çanakçı", "Dereli", "Doğankent", "Espiye", "Eynesil", "Görele", "Güce", "Keşap", "Merkez", "Piraziz", "Şebinkarahisar", "Tirebolu", "Yağlıdere"],
  "Gümüşhane": ["Kelkit", "Köse", "Kürtün", "Merkez", "Şiran", "Torul"],
  "Hakkari": ["Çukurca", "Derecik", "Merkez", "Şemdinli", "Yüksekova"],
  "Hatay": ["Altınözü", "Antakya", "Arsuz", "Belen", "Defne", "Dörtyol", "Erzin", "Hassa", "İskenderun", "Kırıkhan", "Kumlu", "Payas", "Reyhanlı", "Samandağ", "Yayladağı"],
  "Iğdır": ["Aralık", "Karakoyunlu", "Merkez", "Tuzluca"],
  "Isparta": ["Aksu", "Atabey", "Eğirdir", "Gelendost", "Gönen", "Keçiborlu", "Merkez", "Senirkent", "Sütçüler", "Şarkikaraağaç", "Uluborlu", "Yalvaç", "Yenişarbademli"],
  "İstanbul": ["Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt", "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane", "Kartal", "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer", "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Tuzla", "Ümraniye", "Üsküdar", "Zeytinburnu"],
  "İzmir": ["Aliağa", "Balçova", "Bayındır", "Bayraklı", "Bergama", "Beydağ", "Bornova", "Buca", "Çeşme", "Çiğli", "Dikili", "Foça", "Gaziemir", "Güzelbahçe", "Karabağlar", "Karaburun", "Karşıyaka", "Kemalpaşa", "Kınık", "Kiraz", "Konak", "Menderes", "Menemen", "Narlıdere", "Ödemiş", "Seferihisar", "Selçuk", "Tire", "Torbalı", "Urla"],
  "Kahramanmaraş": ["Afşin", "Andırın", "Çağlayancerit", "Dulkadiroğlu", "Ekinözü", "Elbistan", "Göksun", "Nurhak", "Onikişubat", "Pazarcık", "Türkoğlu"],
  "Karabük": ["Eflani", "Eskipazar", "Merkez", "Ovacık", "Safranbolu", "Yenice"],
  "Karaman": ["Ayrancı", "Başyayla", "Ermenek", "Kazımkarabekir", "Merkez", "Sarıveliler"],
  "Kars": ["Akyaka", "Arpaçay", "Digor", "Kağızman", "Merkez", "Sarıkamış", "Selim", "Susuz"],
  "Kastamonu": ["Abana", "Ağlı", "Araç", "Azdavay", "Bozkurt", "Cide", "Çatalzeytin", "Daday", "Devrekani", "Doğanyurt", "Hanönü", "İhsangazi", "İnebolu", "Küre", "Merkez", "Pınarbaşı", "Seydiler", "Şenpazar", "Taşköprü", "Tosya"],
  "Kayseri": ["Akkışla", "Bünyan", "Develi", "Felahiye", "Hacılar", "İncesu", "Kocasinan", "Melikgazi", "Özvatan", "Pınarbaşı", "Sarıoğlan", "Sarız", "Talas", "Tomarza", "Yahyalı", "Yeşilhisar"],
  "Kırıkkale": ["Bahşılı", "Balışeyh", "Çelebi", "Delice", "Karakeçili", "Keskin", "Merkez", "Sulakyurt", "Yahşihan"],
  "Kırklareli": ["Babaeski", "Demirköy", "Kofçaz", "Lüleburgaz", "Merkez", "Pehlivanköy", "Pınarhisar", "Vize"],
  "Kırşehir": ["Akçakent", "Akpınar", "Boztepe", "Çiçekdağı", "Kaman", "Merkez", "Mucur"],
  "Kilis": ["Elbeyli", "Merkez", "Musabeyli", "Polateli"],
  "Kocaeli": ["Başiskele", "Çayırova", "Darıca", "Derince", "Dilovası", "Gebze", "Gölcük", "İzmit", "Kandıra", "Karamürsel", "Kartepe", "Körfez"],
  "Konya": ["Ahırlı", "Akören", "Akşehir", "Altınekin", "Beyşehir", "Bozkır", "Cihanbeyli", "Çeltik", "Çumra", "Derbent", "Derebucak", "Doğanhisar", "Emirgazi", "Ereğli", "Güneysınır", "Hadim", "Halkapınar", "Hüyük", "Ilgın", "Kadınhanı", "Karapınar", "Karatay", "Kulu", "Meram", "Sarayönü", "Selçuklu", "Seydişehir", "Taşkent", "Tuzlukçu", "Yalıhüyük", "Yunak"],
  "Kütahya": ["Altıntaş", "Aslanapa", "Çavdarhisar", "Domaniç", "Dumlupınar", "Emet", "Gediz", "Hisarcık", "Merkez", "Pazarlar", "Simav", "Şaphane", "Tavşanlı"],
  "Malatya": ["Akçadağ", "Arapgir", "Arguvan", "Battalgazi", "Darende", "Doğanşehir", "Doğanyol", "Hekimhan", "Kale", "Kuluncak", "Pütürge", "Yazıhan", "Yeşilyurt"],
  "Manisa": ["Ahmetli", "Akhisar", "Alaşehir", "Demirci", "Gölmarmara", "Gördes", "Kırkağaç", "Köprübaşı", "Kula", "Salihli", "Sarıgöl", "Saruhanlı", "Selendi", "Soma", "Şehzadeler", "Turgutlu", "Yunusemre"],
  "Mardin": ["Artuklu", "Dargeçit", "Derik", "Kızıltepe", "Mazıdağı", "Midyat", "Nusaybin", "Ömerli", "Savur", "Yeşilli"],
  "Mersin": ["Akdeniz", "Anamur", "Aydıncık", "Bozyazı", "Çamlıyayla", "Erdemli", "Gülnar", "Mezitli", "Mut", "Silifke", "Tarsus", "Toroslar", "Yenişehir"],
  "Muğla": ["Bodrum", "Dalaman", "Datça", "Fethiye", "Kavaklıdere", "Köyceğiz", "Marmaris", "Menteşe", "Milas", "Ortaca", "Seydikemer", "Ula", "Yatağan"],
  "Muş": ["Bulanık", "Hasköy", "Korkut", "Malazgirt", "Merkez", "Varto"],
  "Nevşehir": ["Acıgöl", "Avanos", "Derinkuyu", "Gülşehir", "Hacıbektaş", "Kozaklı", "Merkez", "Ürgüp"],
  "Niğde": ["Altunhisar", "Bor", "Çamardı", "Çiftlik", "Merkez", "Ulukışla"],
  "Ordu": ["Akkuş", "Altınordu", "Aybastı", "Çamaş", "Çatalpınar", "Çaybaşı", "Fatsa", "Gölköy", "Gülyalı", "Gürgentepe", "İkizce", "Kabadüz", "Kabataş", "Korgan", "Kumru", "Mesudiye", "Perşembe", "Ulubey", "Ünye"],
  "Osmaniye": ["Bahçe", "Düziçi", "Hasanbeyli", "Kadirli", "Merkez", "Sumbas", "Toprakkale"],
  "Rize": ["Ardeşen", "Çamlıhemşin", "Çayeli", "Derepazarı", "Fındıklı", "Güneysu", "Hemşin", "İkizdere", "İyidere", "Kalkandere", "Merkez", "Pazar"],
  "Sakarya": ["Adapazarı", "Akyazı", "Arifiye", "Erenler", "Ferizli", "Geyve", "Hendek", "Karapürçek", "Karasu", "Kaynarca", "Kocaali", "Pamukova", "Sapanca", "Serdivan", "Söğütlü", "Taraklı"],
  "Samsun": ["19 Mayıs", "Alaçam", "Asarcık", "Atakum", "Ayvacık", "Bafra", "Canik", "Çarşamba", "Havza", "İlkadım", "Kavak", "Ladik", "Ondokuzmayıs", "Salıpazarı", "Tekkeköy", "Terme", "Vezirköprü", "Yakakent"],
  "Siirt": ["Baykan", "Eruh", "Kurtalan", "Merkez", "Pervari", "Şirvan", "Tillo"],
  "Sinop": ["Ayancık", "Boyabat", "Dikmen", "Durağan", "Erfelek", "Gerze", "Merkez", "Saraydüzü", "Türkeli"],
  "Sivas": ["Akıncılar", "Altınyayla", "Divriği", "Doğanşar", "Gemerek", "Gölova", "Gürün", "Hafik", "İmranlı", "Kangal", "Koyulhisar", "Merkez", "Suşehri", "Şarkışla", "Ulaş", "Yıldızeli", "Zara"],
  "Şanlıurfa": ["Akçakale", "Birecik", "Bozova", "Ceylanpınar", "Eyyübiye", "Halfeti", "Haliliye", "Harran", "Hilvan", "Karaköprü", "Siverek", "Suruç", "Viranşehir"],
  "Şırnak": ["Beytüşşebap", "Cizre", "Güçlükonak", "İdil", "Merkez", "Silopi", "Uludere"],
  "Tekirdağ": ["Çerkezköy", "Çorlu", "Ergene", "Hayrabolu", "Kapaklı", "Malkara", "Marmaraereğlisi", "Muratlı", "Saray", "Süleymanpaşa", "Şarköy"],
  "Tokat": ["Almus", "Artova", "Başçiftlik", "Erbaa", "Merkez", "Niksar", "Pazar", "Reşadiye", "Sulusaray", "Turhal", "Yeşilyurt", "Zile"],
  "Trabzon": ["Akçaabat", "Araklı", "Arsin", "Beşikdüzü", "Çarşıbaşı", "Çaykara", "Dernekpazarı", "Düzköy", "Hayrat", "Köprübaşı", "Maçka", "Of", "Ortahisar", "Sürmene", "Şalpazarı", "Tonya", "Vakfıkebir", "Yomra"],
  "Tunceli": ["Çemişgezek", "Hozat", "Mazgirt", "Merkez", "Nazımiye", "Ovacık", "Pertek", "Pülümür"],
  "Uşak": ["Banaz", "Eşme", "Karahallı", "Merkez", "Sivaslı", "Ulubey"],
  "Van": ["Bahçesaray", "Başkale", "Çaldıran", "Çatak", "Edremit", "Erciş", "Gevaş", "Gürpınar", "İpekyolu", "Muradiye", "Özalp", "Saray", "Tuşba"],
  "Yalova": ["Altınova", "Armutlu", "Çınarcık", "Çiftlikköy", "Merkez", "Termal"],
  "Yozgat": ["Akdağmadeni", "Aydıncık", "Boğazlıyan", "Çandır", "Çayıralan", "Çekerek", "Kadışehri", "Merkez", "Saraykent", "Sarıkaya", "Sorgun", "Şefaatli", "Yenifakılı", "Yerköy"],
  "Zonguldak": ["Alaplı", "Çaycuma", "Devrek", "Ereğli", "Gökçebey", "Kilimli", "Kozlu", "Merkez"]
};

const CustomerRegistration = () => {
  // const { user } = useAuth(); // Şu an kullanılmıyor
  const navigate = useNavigate();
  
  // Süreç adımları
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationType, setRegistrationType] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Form verileri
  const [formData, setFormData] = useState({
    // Bireysel bilgiler
    first_name: '',
    last_name: '',
    tc_no: '',
    email: '',
    phone: '',
    delivery_address: '',
    delivery_city: '',
    delivery_district: '',
    billing_address: '',
    billing_city: '',
    billing_district: '',
    same_address: true,
    
    // Kurumsal bilgiler
    company_name: '',
    tax_office: '',
    tax_no: '',
    authorized_person: '',
    authorized_email: '',
    authorized_phone: '',
    company_address: '',
    company_city: '',
    company_district: '',
    
    // Referans listesi (max 10 kişi)
    references: [
      { name: '', surname: '', phone: '' }
    ],
    
    // Sözleşme onayları
    contract1_accepted: false,
    contract2_accepted: false
  });

  // Ürün bilgileri
  const products = [
    {
      id: 'product1',
      name: 'Premium Ürün',
      price: 72000,
      vat: 14400,
      total: 86400,
      image: '/product1.jpg' // Sonra eklenecek
    },
    {
      id: 'product2',
      name: 'Standart Ürün',
      price: 16000,
      vat: 3200,
      total: 19200,
      image: '/product2.jpg' // Sonra eklenecek
    }
  ];

  // Referans ekleme
  const addReference = () => {
    if (formData.references.length < 10) {
      setFormData({
        ...formData,
        references: [...formData.references, { name: '', surname: '', phone: '' }]
      });
    }
  };

  // Referans silme
  const removeReference = (index) => {
    if (formData.references.length > 1) {
      const newReferences = formData.references.filter((_, i) => i !== index);
      setFormData({ ...formData, references: newReferences });
    }
  };

  // Referans güncelleme
  const updateReference = (index, field, value) => {
    const newReferences = [...formData.references];
    newReferences[index][field] = value;
    setFormData({ ...formData, references: newReferences });
  };

  // Form doğrulama
  const isStep2Valid = () => {
    if (registrationType === 'individual') {
      return formData.first_name && formData.last_name && formData.tc_no && 
             formData.email && formData.phone && formData.delivery_address && 
             formData.delivery_city && formData.delivery_district;
    } else {
      return formData.company_name && formData.tax_office && formData.tax_no && 
             formData.authorized_person && formData.authorized_email && 
             formData.authorized_phone && formData.company_address && 
             formData.company_city && formData.company_district;
    }
  };

  return (
    <div style={{ padding: '0' }}>
      {/* Başlık ve İlerleme Çubuğu */}
      <div style={{
        backgroundColor: 'var(--card-gray)',
        borderRadius: '15px',
        padding: '30px',
        marginBottom: '30px',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: 'var(--primary-dark)', marginBottom: '20px' }}>
          Müşteri Kayıt Süreci
        </h1>
        
        {/* İlerleme Çubuğu */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <React.Fragment key={step}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: currentStep >= step ? 'var(--primary-dark)' : 'var(--border-color)',
                color: currentStep >= step ? 'var(--white)' : 'var(--text-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {step}
              </div>
              {step < 6 && (
                <div style={{
                  width: '30px',
                  height: '2px',
                  backgroundColor: currentStep > step ? 'var(--primary-dark)' : 'var(--border-color)'
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
        
        <div style={{ marginTop: '15px', color: 'var(--text-light)', fontSize: '14px' }}>
          {currentStep === 1 && 'Müşteri Türü Seçimi'}
          {currentStep === 2 && 'Müşteri Bilgileri'}
          {currentStep === 3 && 'Ürün Seçimi'}
          {currentStep === 4 && 'Sipariş Özeti'}
          {currentStep === 5 && 'Sözleşme Onayları'}
          {currentStep === 6 && 'Sipariş Tamamlama'}
        </div>
      </div>

      {/* Mesaj Alanı */}
      {message && (
        <div style={{
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '30px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          {message}
        </div>
      )}

      {/* ADIM 1: Müşteri Türü Seçimi */}
      {currentStep === 1 && (
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: 'var(--primary-dark)', marginBottom: '30px', fontSize: '28px' }}>
            Müşteri Türünü Seçin
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
            <div 
              onClick={() => {
                setRegistrationType('individual');
                setCurrentStep(2);
              }}
              style={{
                padding: '40px 30px',
                border: '3px solid var(--border-color)',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: 'var(--white)',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>👤</div>
              <h3 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>Bireysel Müşteri</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
                Kişisel bilgilerle müşteri kaydı
              </p>
            </div>
            
            <div 
              onClick={() => {
                setRegistrationType('corporate');
                setCurrentStep(2);
              }}
              style={{
                padding: '40px 30px',
                border: '3px solid var(--border-color)',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: 'var(--white)',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏢</div>
              <h3 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>Kurumsal Müşteri</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
                Şirket bilgileriyle müşteri kaydı
              </p>
            </div>
          </div>
        </div>
      )}  
    {/* ADIM 2: Müşteri Bilgileri */}
      {currentStep === 2 && (
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '40px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: 'var(--primary-dark)', marginBottom: '30px', textAlign: 'center' }}>
            {registrationType === 'individual' ? 'Bireysel Müşteri Bilgileri' : 'Kurumsal Müşteri Bilgileri'}
          </h2>
          
          {registrationType === 'individual' ? (
            <div>
              {/* Kişisel Bilgiler */}
              <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '18px' }}>
                👤 Kişisel Bilgiler
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    İsim *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '10px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    Soyad *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '10px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    TC Kimlik No *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength="11"
                    value={formData.tc_no}
                    onChange={(e) => setFormData({...formData, tc_no: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '10px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '10px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '10px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              {/* Teslimat Adresi */}
              <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '18px' }}>
                📦 Teslimat Adresi
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    İl *
                  </label>
                  <select
                    required
                    value={formData.delivery_city}
                    onChange={(e) => setFormData({...formData, delivery_city: e.target.value, delivery_district: ''})}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '10px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">İl Seçin</option>
                    {Object.keys(turkeyData).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    İlçe *
                  </label>
                  <select
                    required
                    value={formData.delivery_district}
                    onChange={(e) => setFormData({...formData, delivery_district: e.target.value})}
                    disabled={!formData.delivery_city}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '10px',
                      fontSize: '14px',
                      opacity: !formData.delivery_city ? 0.5 : 1
                    }}
                  >
                    <option value="">İlçe Seçin</option>
                    {formData.delivery_city && turkeyData[formData.delivery_city]?.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                  Teslimat Adresi Detayı *
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.delivery_address}
                  onChange={(e) => setFormData({...formData, delivery_address: e.target.value})}
                  placeholder="Mahalle, sokak, bina no, daire no vb. detayları yazın..."
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '10px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Fatura Adresi */}
              <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '18px' }}>
                🧾 Fatura Adresi
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.same_address}
                    onChange={(e) => {
                      setFormData({
                        ...formData, 
                        same_address: e.target.checked,
                        billing_address: e.target.checked ? formData.delivery_address : '',
                        billing_city: e.target.checked ? formData.delivery_city : '',
                        billing_district: e.target.checked ? formData.delivery_district : ''
                      });
                    }}
                    style={{ marginRight: '10px', transform: 'scale(1.2)' }}
                  />
                  <span style={{ fontSize: '14px', color: 'var(--text-dark)' }}>
                    Fatura adresi teslimat adresi ile aynı
                  </span>
                </label>
              </div>

              {!formData.same_address && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                        İl *
                      </label>
                      <select
                        required
                        value={formData.billing_city}
                        onChange={(e) => setFormData({...formData, billing_city: e.target.value, billing_district: ''})}
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '2px solid var(--border-color)',
                          borderRadius: '10px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">İl Seçin</option>
                        {Object.keys(turkeyData).map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                        İlçe *
                      </label>
                      <select
                        required
                        value={formData.billing_district}
                        onChange={(e) => setFormData({...formData, billing_district: e.target.value})}
                        disabled={!formData.billing_city}
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '2px solid var(--border-color)',
                          borderRadius: '10px',
                          fontSize: '14px',
                          opacity: !formData.billing_city ? 0.5 : 1
                        }}
                      >
                        <option value="">İlçe Seçin</option>
                        {formData.billing_city && turkeyData[formData.billing_city]?.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                      Fatura Adresi Detayı *
                    </label>
                    <textarea
                      required
                      rows="3"
                      value={formData.billing_address}
                      onChange={(e) => setFormData({...formData, billing_address: e.target.value})}
                      placeholder="Mahalle, sokak, bina no, daire no vb. detayları yazın..."
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid var(--border-color)',
                        borderRadius: '10px',
                        fontSize: '14px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Kurumsal Bilgiler */}
              <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '18px' }}>
                🏢 Şirket Bilgileri
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    Firma Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '10px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    Vergi Dairesi *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tax_office}
                    onChange={(e) => setFormData({...formData, tax_office: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '10px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    Vergi Numarası *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tax_no}
                    onChange={(e) => setFormData({...formData, tax_no: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '10px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    Yetkili Kişi *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.authorized_person}
                    onChange={(e) => setFormData({...formData, authorized_person: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '10px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.authorized_email}
                    onChange={(e) => setFormData({...formData, authorized_email: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '10px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                  Telefon *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.authorized_phone}
                  onChange={(e) => setFormData({...formData, authorized_phone: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Şirket Adresi */}
              <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '18px' }}>
                🏢 Şirket Adresi
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    İl *
                  </label>
                  <select
                    required
                    value={formData.company_city}
                    onChange={(e) => setFormData({...formData, company_city: e.target.value, company_district: ''})}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '10px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">İl Seçin</option>
                    {Object.keys(turkeyData).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    İlçe *
                  </label>
                  <select
                    required
                    value={formData.company_district}
                    onChange={(e) => setFormData({...formData, company_district: e.target.value})}
                    disabled={!formData.company_city}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '10px',
                      fontSize: '14px',
                      opacity: !formData.company_city ? 0.5 : 1
                    }}
                  >
                    <option value="">İlçe Seçin</option>
                    {formData.company_city && turkeyData[formData.company_city]?.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                  Şirket Adresi Detayı *
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.company_address}
                  onChange={(e) => setFormData({...formData, company_address: e.target.value})}
                  placeholder="Mahalle, sokak, bina no, daire no vb. detayları yazın..."
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '10px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          )}

          {/* Referans Listesi */}
          <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '18px', marginTop: '30px' }}>
            👥 Referans Listesi (Maksimum 10 Kişi)
          </h3>
          
          {formData.references.map((reference, index) => (
            <div key={index} style={{
              backgroundColor: 'var(--white)',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '15px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ color: 'var(--primary-dark)', margin: 0 }}>
                  Referans {index + 1}
                </h4>
                {formData.references.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeReference(index)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '5px 10px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Sil
                  </button>
                )}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                    İsim
                  </label>
                  <input
                    type="text"
                    value={reference.name}
                    onChange={(e) => updateReference(index, 'name', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '5px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                    Soyisim
                  </label>
                  <input
                    type="text"
                    value={reference.surname}
                    onChange={(e) => updateReference(index, 'surname', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '5px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                    Telefon No
                  </label>
                  <input
                    type="tel"
                    value={reference.phone}
                    onChange={(e) => updateReference(index, 'phone', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '5px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          {formData.references.length < 10 && (
            <button
              type="button"
              onClick={addReference}
              style={{
                backgroundColor: 'var(--primary-dark)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 20px',
                fontSize: '14px',
                cursor: 'pointer',
                marginBottom: '30px'
              }}
            >
              + Referans Ekle
            </button>
          )}
          
          <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
            <button
              onClick={() => setCurrentStep(1)}
              style={{
                flex: 1,
                padding: '15px',
                backgroundColor: 'var(--card-gray)',
                color: 'var(--text-dark)',
                border: '2px solid var(--border-color)',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ← Geri
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              disabled={!isStep2Valid()}
              style={{
                flex: 2,
                padding: '15px',
                backgroundColor: isStep2Valid() ? 'var(--primary-dark)' : 'var(--card-gray)',
                color: isStep2Valid() ? 'var(--white)' : 'var(--text-light)',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isStep2Valid() ? 'pointer' : 'not-allowed'
              }}
            >
              Ürün Seçimine Geç →
            </button>
          </div>
        </div>
      )} 
     {/* ADIM 3: Ürün Seçimi */}
      {currentStep === 3 && (
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '40px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: 'var(--primary-dark)', marginBottom: '30px', textAlign: 'center' }}>
            Ürün Seçimi
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Ürün 1 - Premium */}
            <div 
              onClick={() => setSelectedProduct('product1')}
              style={{
                padding: '30px',
                border: selectedProduct === 'product1' ? '3px solid var(--accent-gold)' : '3px solid var(--border-color)',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: 'var(--white)',
                boxShadow: selectedProduct === 'product1' ? '0 10px 30px rgba(255,215,0,0.3)' : '0 5px 15px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}
            >
              {/* Ürün Resmi Placeholder */}
              <div style={{
                width: '200px',
                height: '200px',
                backgroundColor: '#f0f0f0',
                borderRadius: '15px',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                color: '#ccc'
              }}>
                📱
              </div>
              
              <h3 style={{ color: 'var(--primary-dark)', marginBottom: '15px', fontSize: '20px' }}>
                Premium Ürün
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  fontSize: '16px', 
                  color: 'var(--text-dark)', 
                  marginBottom: '5px',
                  textDecoration: 'line-through',
                  opacity: 0.7
                }}>
                  72.000 ₺
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: 'var(--text-light)', 
                  marginBottom: '10px'
                }}>
                  + %20 KDV (14.400 ₺)
                </div>
                <div style={{ 
                  fontSize: '28px', 
                  color: 'var(--primary-dark)', 
                  fontWeight: 'bold'
                }}>
                  86.400 ₺
                </div>
              </div>

              <div style={{
                padding: '10px',
                backgroundColor: selectedProduct === 'product1' ? 'var(--accent-gold)' : 'var(--card-gray)',
                borderRadius: '10px',
                color: selectedProduct === 'product1' ? 'var(--primary-dark)' : 'var(--text-dark)',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {selectedProduct === 'product1' ? '✓ Seçildi' : 'Seç'}
              </div>
            </div>

            {/* Ürün 2 - Standart */}
            <div 
              onClick={() => setSelectedProduct('product2')}
              style={{
                padding: '30px',
                border: selectedProduct === 'product2' ? '3px solid var(--accent-gold)' : '3px solid var(--border-color)',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: 'var(--white)',
                boxShadow: selectedProduct === 'product2' ? '0 10px 30px rgba(255,215,0,0.3)' : '0 5px 15px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}
            >
              {/* Ürün Resmi Placeholder */}
              <div style={{
                width: '200px',
                height: '200px',
                backgroundColor: '#f0f0f0',
                borderRadius: '15px',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                color: '#ccc'
              }}>
                📱
              </div>
              
              <h3 style={{ color: 'var(--primary-dark)', marginBottom: '15px', fontSize: '20px' }}>
                Standart Ürün
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  fontSize: '16px', 
                  color: 'var(--text-dark)', 
                  marginBottom: '5px',
                  textDecoration: 'line-through',
                  opacity: 0.7
                }}>
                  16.000 ₺
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: 'var(--text-light)', 
                  marginBottom: '10px'
                }}>
                  + %20 KDV (3.200 ₺)
                </div>
                <div style={{ 
                  fontSize: '28px', 
                  color: 'var(--primary-dark)', 
                  fontWeight: 'bold'
                }}>
                  19.200 ₺
                </div>
              </div>

              <div style={{
                padding: '10px',
                backgroundColor: selectedProduct === 'product2' ? 'var(--accent-gold)' : 'var(--card-gray)',
                borderRadius: '10px',
                color: selectedProduct === 'product2' ? 'var(--primary-dark)' : 'var(--text-dark)',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {selectedProduct === 'product2' ? '✓ Seçildi' : 'Seç'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
            <button
              onClick={() => setCurrentStep(2)}
              style={{
                flex: 1,
                padding: '15px',
                backgroundColor: 'var(--card-gray)',
                color: 'var(--text-dark)',
                border: '2px solid var(--border-color)',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ← Geri
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              disabled={!selectedProduct}
              style={{
                flex: 2,
                padding: '15px',
                backgroundColor: selectedProduct ? 'var(--primary-dark)' : 'var(--card-gray)',
                color: selectedProduct ? 'var(--white)' : 'var(--text-light)',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: selectedProduct ? 'pointer' : 'not-allowed'
              }}
            >
              Sipariş Özetine Geç →
            </button>
          </div>
        </div>
      )}

      {/* ADIM 4: Sipariş Özeti */}
      {currentStep === 4 && (
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '40px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: 'var(--primary-dark)', marginBottom: '30px', textAlign: 'center' }}>
            Sipariş Özeti
          </h2>
          
          {/* Müşteri Bilgileri */}
          <div style={{
            backgroundColor: 'var(--white)',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px' }}>
              👤 Müşteri Bilgileri
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
              {registrationType === 'individual' ? (
                <>
                  <div><strong>İsim:</strong> {formData.first_name} {formData.last_name}</div>
                  <div><strong>TC No:</strong> {formData.tc_no}</div>
                  <div><strong>E-mail:</strong> {formData.email}</div>
                  <div><strong>Telefon:</strong> {formData.phone}</div>
                  <div><strong>Teslimat:</strong> {formData.delivery_address}, {formData.delivery_district}/{formData.delivery_city}</div>
                  <div><strong>Fatura:</strong> {formData.same_address ? 'Teslimat ile aynı' : `${formData.billing_address}, ${formData.billing_district}/${formData.billing_city}`}</div>
                </>
              ) : (
                <>
                  <div><strong>Firma:</strong> {formData.company_name}</div>
                  <div><strong>Vergi Dairesi:</strong> {formData.tax_office}</div>
                  <div><strong>Vergi No:</strong> {formData.tax_no}</div>
                  <div><strong>Yetkili:</strong> {formData.authorized_person}</div>
                  <div><strong>E-mail:</strong> {formData.authorized_email}</div>
                  <div><strong>Telefon:</strong> {formData.authorized_phone}</div>
                  <div style={{ gridColumn: '1 / -1' }}><strong>Adres:</strong> {formData.company_address}, {formData.company_district}/{formData.company_city}</div>
                </>
              )}
            </div>
          </div>

          {/* Seçilen Ürün */}
          <div style={{
            backgroundColor: 'var(--white)',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px' }}>
              🛍️ Seçilen Ürün
            </h3>
            {(() => {
              const product = products.find(p => p.id === selectedProduct);
              return (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                      {product?.name}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-light)' }}>
                      Perakende satış fiyatı + KDV
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                      {product?.total.toLocaleString()} ₺
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                      (KDV Dahil)
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Referans Listesi */}
          {formData.references.some(ref => ref.name || ref.surname || ref.phone) && (
            <div style={{
              backgroundColor: 'var(--white)',
              borderRadius: '15px',
              padding: '30px',
              marginBottom: '30px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px' }}>
                👥 Referans Listesi
              </h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {formData.references.filter(ref => ref.name || ref.surname || ref.phone).map((ref, index) => (
                  <div key={index} style={{ 
                    padding: '10px', 
                    backgroundColor: 'var(--card-gray)', 
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    <strong>{index + 1}.</strong> {ref.name} {ref.surname} - {ref.phone}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '20px' }}>
            <button
              onClick={() => setCurrentStep(3)}
              style={{
                flex: 1,
                padding: '15px',
                backgroundColor: 'var(--card-gray)',
                color: 'var(--text-dark)',
                border: '2px solid var(--border-color)',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ← Geri
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              style={{
                flex: 2,
                padding: '15px',
                backgroundColor: 'var(--primary-dark)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Sözleşmelere Geç →
            </button>
          </div>
        </div>
      )}

      {/* ADIM 5: Sözleşme Onayları */}
      {currentStep === 5 && (
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '40px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: 'var(--primary-dark)', marginBottom: '30px', textAlign: 'center' }}>
            Sözleşme Onayları
          </h2>
          
          {/* Sözleşme 1 - Satış Sözleşmesi */}
          <div style={{
            backgroundColor: 'var(--white)',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '20px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px' }}>
              1. Satış Sözleşmesi
            </h3>
            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              padding: '15px',
              backgroundColor: 'var(--card-gray)',
              borderRadius: '10px',
              fontSize: '14px',
              lineHeight: '1.5',
              marginBottom: '20px'
            }}>
              <p><strong>SATIŞ SÖZLEŞMESİ</strong></p>
              <p>İşbu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve ilgili yönetmelikler çerçevesinde düzenlenmiştir.</p>
              <p><strong>SATICI BİLGİLERİ:</strong></p>
              <p>Ünvan: HOOWELL Network Marketing Ltd. Şti.</p>
              <p>Adres: [Şirket Adresi]</p>
              <p>Telefon: [Telefon Numarası]</p>
              <p>E-posta: info@hoowell.com</p>
              <p><strong>ÜRÜN BİLGİLERİ:</strong></p>
              <p>Ürün: {products.find(p => p.id === selectedProduct)?.name}</p>
              <p>Fiyat: {products.find(p => p.id === selectedProduct)?.total.toLocaleString()} TL (KDV Dahil)</p>
              <p><strong>TESLİMAT:</strong></p>
              <p>Ürün, sipariş onayından sonra 7-14 iş günü içerisinde teslim edilecektir.</p>
              <p><strong>GARANTİ:</strong></p>
              <p>Ürün 2 yıl garantili olup, garanti koşulları ürün ile birlikte teslim edilecektir.</p>
            </div>
            
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.contract1_accepted}
                onChange={(e) => setFormData({...formData, contract1_accepted: e.target.checked})}
                style={{ marginRight: '10px', transform: 'scale(1.2)' }}
              />
              <span style={{ fontSize: '14px', color: 'var(--text-dark)' }}>
                Satış Sözleşmesi'ni okudum, anladım ve kabul ediyorum.
              </span>
            </label>
          </div>

          {/* Sözleşme 2 - Kişisel Verilerin Korunması */}
          <div style={{
            backgroundColor: 'var(--white)',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px' }}>
              2. Kişisel Verilerin Korunması Sözleşmesi
            </h3>
            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              padding: '15px',
              backgroundColor: 'var(--card-gray)',
              borderRadius: '10px',
              fontSize: '14px',
              lineHeight: '1.5',
              marginBottom: '20px'
            }}>
              <p><strong>KİŞİSEL VERİLERİN KORUNMASI AYDINLATMA METNİ</strong></p>
              <p>6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aşağıdaki bilgilendirmeyi yapmaktayız.</p>
              <p><strong>VERİ SORUMLUSU:</strong></p>
              <p>HOOWELL Network Marketing Ltd. Şti.</p>
              <p><strong>İŞLENEN KİŞİSEL VERİLER:</strong></p>
              <p>• Kimlik bilgileri (Ad, soyad, TC kimlik numarası)</p>
              <p>• İletişim bilgileri (Telefon, e-posta, adres)</p>
              <p>• Finansal bilgiler (Ödeme bilgileri)</p>
              <p><strong>İŞLEME AMAÇLARI:</strong></p>
              <p>• Satış işlemlerinin gerçekleştirilmesi</p>
              <p>• Müşteri hizmetlerinin sunulması</p>
              <p>• Yasal yükümlülüklerin yerine getirilmesi</p>
              <p><strong>HAKLARINIZ:</strong></p>
              <p>Kişisel verileriniz ile ilgili bilgi alma, düzeltme, silme haklarınız bulunmaktadır.</p>
            </div>
            
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.contract2_accepted}
                onChange={(e) => setFormData({...formData, contract2_accepted: e.target.checked})}
                style={{ marginRight: '10px', transform: 'scale(1.2)' }}
              />
              <span style={{ fontSize: '14px', color: 'var(--text-dark)' }}>
                Kişisel Verilerin Korunması Sözleşmesi'ni okudum, anladım ve kabul ediyorum.
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <button
              onClick={() => setCurrentStep(4)}
              style={{
                flex: 1,
                padding: '15px',
                backgroundColor: 'var(--card-gray)',
                color: 'var(--text-dark)',
                border: '2px solid var(--border-color)',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ← Geri
            </button>
            <button
              onClick={() => setCurrentStep(6)}
              disabled={!formData.contract1_accepted || !formData.contract2_accepted}
              style={{
                flex: 2,
                padding: '15px',
                backgroundColor: (formData.contract1_accepted && formData.contract2_accepted) ? 'var(--primary-dark)' : 'var(--card-gray)',
                color: (formData.contract1_accepted && formData.contract2_accepted) ? 'var(--white)' : 'var(--text-light)',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: (formData.contract1_accepted && formData.contract2_accepted) ? 'pointer' : 'not-allowed'
              }}
            >
              Siparişi Tamamla →
            </button>
          </div>
        </div>
      )}

      {/* ADIM 6: Sipariş Tamamlama */}
      {currentStep === 6 && (
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '40px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          {!loading && !message.includes('✅') ? (
            // Sipariş henüz tamamlanmadı
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>🛒</div>
              <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px' }}>
                Siparişi Tamamla
              </h2>
              <p style={{ color: 'var(--text-light)', fontSize: '16px', marginBottom: '30px' }}>
                Tüm bilgiler onaylandı. Siparişi tamamlamak için butona tıklayın.
              </p>
              
              <button
                onClick={async () => {
                  setLoading(true);
                  try {
                    // Loading simülasyonu
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Backend'e müşteri kayıt isteği gönder
                    const customerData = {
                      registration_type: registrationType,
                      first_name: formData.first_name,
                      last_name: formData.last_name,
                      tc_no: formData.tc_no,
                      email: formData.email,
                      phone: formData.phone,
                      delivery_address: formData.delivery_address,
                      delivery_city: formData.delivery_city,
                      delivery_district: formData.delivery_district,
                      billing_address: formData.same_address ? formData.delivery_address : formData.billing_address,
                      billing_city: formData.same_address ? formData.delivery_city : formData.billing_city,
                      billing_district: formData.same_address ? formData.delivery_district : formData.billing_district,
                      same_address: formData.same_address,
                      company_name: formData.company_name,
                      tax_office: formData.tax_office,
                      tax_no: formData.tax_no,
                      authorized_person: formData.authorized_person,
                      authorized_email: formData.authorized_email,
                      authorized_phone: formData.authorized_phone,
                      selected_product: selectedProduct,
                      product_price: products.find(p => p.id === selectedProduct)?.price,
                      product_vat: products.find(p => p.id === selectedProduct)?.vat,
                      total_amount: products.find(p => p.id === selectedProduct)?.total,
                      contract1_accepted: formData.contract1_accepted,
                      contract2_accepted: formData.contract2_accepted,
                      references: formData.references
                    };

                    const response = await axios.post('/api/customer/register', customerData, {
                      headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                      }
                    });

                    setMessage(`✅ Müşteri kaydı başarıyla tamamlandı!|${response.data.customer_code}|${response.data.order_id}|${response.data.total_amount}`);
                    
                  } catch (error) {
                    setMessage('❌ Sipariş hatası: ' + (error.message || 'Bilinmeyen hata'));
                    setLoading(false);
                  }
                }}
                disabled={loading}
                style={{
                  padding: '20px 50px',
                  backgroundColor: 'var(--primary-dark)',
                  color: 'var(--white)',
                  border: 'none',
                  borderRadius: '15px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                }}
              >
                {loading ? 'Sipariş Oluşturuluyor...' : 'Siparişi Tamamla'}
              </button>
            </div>
          ) : message.includes('✅') ? (
            // Sipariş başarılı
            <div>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
                <h2 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
                  Sipariş Başarıyla Oluşturuldu!
                </h2>
                <p style={{ color: 'var(--text-light)', fontSize: '16px' }}>
                  Müşteri siparişi kaydedildi. Aşağıdaki bilgileri not alın.
                </p>
              </div>

              {/* Müşteri Bilgileri */}
              {(() => {
                try {
                  const messageParts = message.split('|');
                  const customerCode = messageParts[1];
                  const orderId = messageParts[2];
                  const totalAmount = messageParts[3];
                  
                  return (
                    <div>
                      {/* Müşteri Bilgileri */}
                      <div style={{
                        backgroundColor: 'var(--white)',
                        borderRadius: '15px',
                        padding: '30px',
                        marginBottom: '30px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                      }}>
                        <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px', textAlign: 'center' }}>
                          📋 Müşteri Kayıt Bilgileri
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '16px' }}>
                          <div style={{ padding: '15px', backgroundColor: 'var(--card-gray)', borderRadius: '10px' }}>
                            <strong style={{ color: 'var(--primary-dark)' }}>Müşteri Kodu:</strong><br/>
                            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{customerCode}</span>
                          </div>
                          <div style={{ padding: '15px', backgroundColor: 'var(--card-gray)', borderRadius: '10px' }}>
                            <strong style={{ color: 'var(--primary-dark)' }}>Sipariş No:</strong><br/>
                            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{orderId}</span>
                          </div>
                          <div style={{ padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '10px', border: '2px solid #4caf50', gridColumn: '1 / -1' }}>
                            <strong style={{ color: '#2e7d32' }}>Toplam Tutar:</strong><br/>
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#2e7d32' }}>{parseInt(totalAmount)?.toLocaleString()} ₺</span>
                          </div>
                        </div>
                      </div>

                      {/* IBAN Bilgileri */}
                      <div style={{
                        backgroundColor: '#fff3cd',
                        borderRadius: '15px',
                        padding: '30px',
                        marginBottom: '30px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                        border: '2px solid #ffc107'
                      }}>
                        <h3 style={{ color: '#856404', marginBottom: '20px', textAlign: 'center' }}>
                          💳 Ödeme Bilgileri
                        </h3>
                        <div style={{ backgroundColor: 'var(--white)', padding: '25px', borderRadius: '10px', marginBottom: '20px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '16px' }}>
                            <div>
                              <strong style={{ color: 'var(--primary-dark)' }}>Banka:</strong><br/>
                              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Türkiye İş Bankası</span>
                            </div>
                            <div>
                              <strong style={{ color: 'var(--primary-dark)' }}>Hesap Sahibi:</strong><br/>
                              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>HOOWELL TEKNOLOJİ A.Ş.</span>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                              <strong style={{ color: 'var(--primary-dark)' }}>IBAN:</strong><br/>
                              <div style={{ 
                                fontSize: '20px', 
                                fontWeight: 'bold', 
                                backgroundColor: '#f8f9fa', 
                                padding: '15px', 
                                borderRadius: '8px',
                                border: '2px solid #dee2e6',
                                fontFamily: 'monospace',
                                letterSpacing: '2px',
                                textAlign: 'center',
                                marginTop: '10px'
                              }}>
                                TR64 0006 4000 0011 2345 6789 01
                              </div>
                            </div>
                          </div>
                        </div>
                        <div style={{ 
                          backgroundColor: '#f8d7da', 
                          padding: '20px', 
                          borderRadius: '10px',
                          border: '1px solid #f5c6cb'
                        }}>
                          <p style={{ color: '#721c24', margin: 0, fontWeight: 'bold', textAlign: 'center' }}>
                            ⚠️ Ödeme yaparken açıklama kısmına mutlaka Müşteri Kodu ({customerCode}) yazınız!
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                } catch (e) {
                  return null;
                }
              })()}

              {/* Aksiyon Butonları */}
              <div style={{ display: 'flex', gap: '20px' }}>
                <button
                  onClick={() => {
                    // Yeni sipariş için formu sıfırla
                    setCurrentStep(1);
                    setRegistrationType('');
                    setSelectedProduct('');
                    setFormData({
                      first_name: '', last_name: '', tc_no: '', email: '', phone: '',
                      delivery_address: '', delivery_city: '', delivery_district: '',
                      billing_address: '', billing_city: '', billing_district: '',
                      same_address: true, company_name: '', tax_office: '', tax_no: '',
                      authorized_person: '', authorized_email: '', authorized_phone: '',
                      company_address: '', company_city: '', company_district: '',
                      references: [{ name: '', surname: '', phone: '' }],
                      contract1_accepted: false, contract2_accepted: false
                    });
                    setMessage('');
                  }}
                  style={{
                    flex: 1,
                    padding: '15px',
                    backgroundColor: 'var(--primary-dark)',
                    color: 'var(--white)',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Yeni Sipariş Oluştur
                </button>
                
                <button
                  onClick={() => {
                    // Dashboard'a git
                    navigate('/');
                  }}
                  style={{
                    flex: 1,
                    padding: '15px',
                    backgroundColor: 'var(--card-gray)',
                    color: 'var(--text-dark)',
                    border: '2px solid var(--border-color)',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Dashboard'a Git
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default CustomerRegistration;