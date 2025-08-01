import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
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

const PartnerRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Süreç adımları
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationType, setRegistrationType] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Form verileri
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    tc_no: '',
    email: '',
    phone: '',
    city: '',
    district: '',
    address: '',
    company_name: '',
    tax_office: '',
    tax_no: '',
    authorized_first_name: '',
    authorized_last_name: '',
    contract1_accepted: false,
    contract2_accepted: false
  });

  // Eğitim tamamlanmamışsa erişim engelle (Admin hariç)
  if (!user || (!user.education_completed && user.role !== 'admin')) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '40px 20px'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px', opacity: 0.3 }}>🎓</div>
        <div style={{
          backgroundColor: 'var(--card-gray)',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          maxWidth: '600px'
        }}>
          <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px' }}>
            Eğitim Tamamlama Gerekli
          </h2>
          <p style={{ color: 'var(--text-light)', fontSize: '16px', lineHeight: '1.5' }}>
            İş Ortağı Kayıt Paneli'ne erişmek için önce eğitimlerinizi tamamlamanız gerekmektedir.
          </p>
          <a href="/education" style={{
            display: 'inline-block',
            marginTop: '20px',
            padding: '12px 30px',
            backgroundColor: 'var(--primary-dark)',
            color: 'var(--white)',
            textDecoration: 'none',
            borderRadius: '10px',
            fontWeight: 'bold'
          }}>
            Eğitimlere Git
          </a>
        </div>
      </div>
    );
  }

  // Form doğrulama
  const isStep2Valid = () => {
    if (registrationType === 'individual') {
      return formData.first_name && formData.last_name && formData.tc_no && 
             formData.email && formData.phone && formData.city && 
             formData.district && formData.address;
    } else {
      return formData.company_name && formData.tax_office && formData.tax_no && 
             formData.authorized_first_name && formData.authorized_last_name && 
             formData.email && formData.phone && formData.city && 
             formData.district && formData.address;
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
          İş Ortağı Kayıt Süreci
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
          {currentStep === 1 && 'Kayıt Türü Seçimi'}
          {currentStep === 2 && 'Bilgi Girişi'}
          {currentStep === 3 && 'Ürün Seçimi'}
          {currentStep === 4 && 'Sipariş Özeti'}
          {currentStep === 5 && 'Sözleşme Onayları'}
          {currentStep === 6 && 'Ödeme'}
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

      {/* ADIM 1: Kayıt Türü Seçimi */}
      {currentStep === 1 && (
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: 'var(--primary-dark)', marginBottom: '30px', fontSize: '28px' }}>
            Kayıt Türünü Seçin
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
              <h3 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>Bireysel Kayıt</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
                Kişisel bilgilerinizle kayıt olun
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
              <h3 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>Kurumsal Kayıt</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
                Şirket bilgilerinizle kayıt olun
              </p>
            </div>
          </div>
        </div>
      )} 
     {/* ADIM 2: Bilgi Girişi */}
      {currentStep === 2 && (
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '40px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: 'var(--primary-dark)', marginBottom: '30px', textAlign: 'center' }}>
            {registrationType === 'individual' ? 'Bireysel Bilgiler' : 'Kurumsal Bilgiler'}
          </h2>
          
          {registrationType === 'individual' ? (
            <div>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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
              </div>

              <div style={{ marginBottom: '20px' }}>
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

              {/* Adres Seçimi */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    İl *
                  </label>
                  <select
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value, district: ''})}
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
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                    disabled={!formData.city}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '10px',
                      fontSize: '14px',
                      opacity: !formData.city ? 0.5 : 1
                    }}
                  >
                    <option value="">İlçe Seçin</option>
                    {formData.city && turkeyData[formData.city]?.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                  Adres Detayı *
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
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
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    Şirket İsmi *
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    Sorumlu Kişi Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.authorized_first_name}
                    onChange={(e) => setFormData({...formData, authorized_first_name: e.target.value})}
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
                    Sorumlu Kişi Soyadı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.authorized_last_name}
                    onChange={(e) => setFormData({...formData, authorized_last_name: e.target.value})}
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

              {/* Adres Seçimi */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    İl *
                  </label>
                  <select
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value, district: ''})}
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
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                    disabled={!formData.city}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid var(--border-color)',
                      borderRadius: '10px',
                      fontSize: '14px',
                      opacity: !formData.city ? 0.5 : 1
                    }}
                  >
                    <option value="">İlçe Seçin</option>
                    {formData.city && turkeyData[formData.city]?.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                  Şirket Adresi *
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
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
              Kayıt Oluştur →
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
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: 'var(--primary-dark)', marginBottom: '30px' }}>
            Ürün Seçimi
          </h2>
          
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '40px',
            border: '3px solid var(--accent-gold)',
            borderRadius: '20px',
            backgroundColor: 'var(--white)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏢</div>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px', fontSize: '24px' }}>
              FRANCHISE SATIŞ PAKETİ
            </h3>
            
            <div style={{ marginBottom: '30px' }}>
              <div style={{ 
                fontSize: '18px', 
                color: 'var(--text-dark)', 
                marginBottom: '10px',
                textDecoration: 'line-through',
                opacity: 0.7
              }}>
                4.000 ₺
              </div>
              <div style={{ 
                fontSize: '16px', 
                color: 'var(--text-light)', 
                marginBottom: '10px'
              }}>
                + %20 KDV
              </div>
              <div style={{ 
                fontSize: '32px', 
                color: 'var(--primary-dark)', 
                fontWeight: 'bold',
                marginBottom: '20px'
              }}>
                4.800 ₺
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(4)}
              style={{
                padding: '15px 40px',
                backgroundColor: 'var(--primary-dark)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
              }}
            >
              Sipariş Ver
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
          
          <div style={{
            backgroundColor: 'var(--white)',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px' }}>
              Müşteri Bilgileri
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
              <div><strong>İsim:</strong> {registrationType === 'individual' ? `${formData.first_name} ${formData.last_name}` : formData.company_name}</div>
              <div><strong>E-mail:</strong> {formData.email}</div>
              <div><strong>Telefon:</strong> {formData.phone}</div>
              <div><strong>Adres:</strong> {formData.address}, {formData.district}/{formData.city}</div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--white)',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px' }}>
              Ürün Bilgileri
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                  Franchise Satış Paketi
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-light)' }}>
                  Network marketing franchise hakkı
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                  4.800 ₺
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                  (KDV Dahil)
                </div>
              </div>
            </div>
          </div>

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
              Devam Et →
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
          
          {/* Sözleşme 1 */}
          <div style={{
            backgroundColor: 'var(--white)',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '20px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px' }}>
              1. Uzaktan Satın Alma Sözleşmesi
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
              <p><strong>UZAKTAN SATIN ALMA SÖZLEŞMESİ</strong></p>
              <p>İşbu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince düzenlenmiştir.</p>
              <p><strong>SATICI BİLGİLERİ:</strong></p>
              <p>Ünvan: HOOWELL Network Marketing Ltd. Şti.</p>
              <p>Adres: [Şirket Adresi]</p>
              <p>Telefon: [Telefon Numarası]</p>
              <p>E-posta: info@hoowell.com</p>
              <p><strong>ÜRÜN/HİZMET BİLGİLERİ:</strong></p>
              <p>Franchise Satış Paketi - Network Marketing Franchise Hakkı</p>
              <p>Fiyat: 4.800 TL (KDV Dahil)</p>
              <p><strong>CAYMA HAKKI:</strong></p>
              <p>Tüketici, 14 gün içerisinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.</p>
              <p><strong>TESLİMAT:</strong></p>
              <p>Dijital içerik ve franchise hakları ödeme onayından sonra 24 saat içerisinde teslim edilecektir.</p>
            </div>
            
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.contract1_accepted}
                onChange={(e) => setFormData({...formData, contract1_accepted: e.target.checked})}
                style={{ marginRight: '10px', transform: 'scale(1.2)' }}
              />
              <span style={{ fontSize: '14px', color: 'var(--text-dark)' }}>
                Uzaktan Satın Alma Sözleşmesi'ni okudum, anladım ve kabul ediyorum.
              </span>
            </label>
          </div>

          {/* Sözleşme 2 */}
          <div style={{
            backgroundColor: 'var(--white)',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px' }}>
              2. Şirket İlkeleri Sözleşmesi
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
              <p><strong>HOOWELL ŞİRKET İLKELERİ VE ETİK KURALLARI</strong></p>
              <p><strong>1. GENEL İLKELER:</strong></p>
              <p>• Dürüstlük ve şeffaflık ilkelerine bağlı kalınacaktır.</p>
              <p>• Müşteri memnuniyeti öncelikli hedefimizdir.</p>
              <p>• Yasal düzenlemelere tam uyum sağlanacaktır.</p>
              <p><strong>2. İŞ ORTAĞI SORUMLULUKLARI:</strong></p>
              <p>• Ürün ve hizmetler hakkında doğru bilgi verilecektir.</p>
              <p>• Yanıltıcı reklam ve pazarlama yapılmayacaktır.</p>
              <p>• Şirket imajına zarar verecek davranışlardan kaçınılacaktır.</p>
              <p><strong>3. ETİK KURALLAR:</strong></p>
              <p>• Adil rekabet kurallarına uyulacaktır.</p>
              <p>• Kişisel verilerin korunması sağlanacaktır.</p>
              <p>• Çıkar çatışmalarından kaçınılacaktır.</p>
              <p><strong>4. CEZAI HÜKÜMLER:</strong></p>
              <p>Bu kurallara aykırı davranış durumunda iş ortaklığı feshedilebilir.</p>
            </div>
            
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.contract2_accepted}
                onChange={(e) => setFormData({...formData, contract2_accepted: e.target.checked})}
                style={{ marginRight: '10px', transform: 'scale(1.2)' }}
              />
              <span style={{ fontSize: '14px', color: 'var(--text-dark)' }}>
                Şirket İlkeleri Sözleşmesi'ni okudum, anladım ve kabul ediyorum.
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
              Ödeme Sayfasına Git →
            </button>
          </div>
        </div>
      )}

      {/* ADIM 6: Kayıt Tamamlama ve Kullanıcı Bilgileri */}
      {currentStep === 6 && (
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '40px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          {!loading && !message.includes('✅') ? (
            // Kayıt işlemi henüz yapılmadı
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>🚀</div>
              <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px' }}>
                Kayıt İşlemini Tamamla
              </h2>
              <p style={{ color: 'var(--text-light)', fontSize: '16px', marginBottom: '30px' }}>
                Tüm bilgiler onaylandı. Kayıt işlemini tamamlamak için butona tıklayın.
              </p>
              
              <button
                onClick={async () => {
                  setLoading(true);
                  try {
                    // Kayıt verilerini backend'e gönder
                    const response = await axios.post('/api/partner/register-new', {
                      registration_type: registrationType,
                      ...formData,
                      full_address: `${formData.address}, ${formData.district}/${formData.city}`,
                      total_amount: 4800,
                      contracts_accepted: true
                    });

                    setMessage(`✅ Kayıt başarıyla tamamlandı!|${JSON.stringify(response.data)}`);
                    
                  } catch (error) {
                    setMessage('❌ Kayıt hatası: ' + (error.response?.data?.message || 'Bilinmeyen hata'));
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
                {loading ? 'Kayıt Oluşturuluyor...' : 'Kayıt İşlemini Tamamla'}
              </button>
            </div>
          ) : message.includes('✅') ? (
            // Kayıt başarılı - Kullanıcı bilgilerini göster
            <div>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
                <h2 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
                  Kayıt Başarıyla Tamamlandı!
                </h2>
                <p style={{ color: 'var(--text-light)', fontSize: '16px' }}>
                  İş ortağı kaydı oluşturuldu. Aşağıdaki bilgileri not alın.
                </p>
              </div>

              {/* Kullanıcı Bilgileri */}
              {(() => {
                try {
                  const userData = JSON.parse(message.split('|')[1]);
                  return (
                    <div style={{
                      backgroundColor: 'var(--white)',
                      borderRadius: '15px',
                      padding: '30px',
                      marginBottom: '30px',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                    }}>
                      <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px', textAlign: 'center' }}>
                        🔐 Giriş Bilgileri
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '16px' }}>
                        <div style={{ padding: '15px', backgroundColor: 'var(--card-gray)', borderRadius: '10px' }}>
                          <strong style={{ color: 'var(--primary-dark)' }}>Sponsor ID:</strong><br/>
                          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{userData.sponsor_id}</span>
                        </div>
                        <div style={{ padding: '15px', backgroundColor: 'var(--card-gray)', borderRadius: '10px' }}>
                          <strong style={{ color: 'var(--primary-dark)' }}>E-mail:</strong><br/>
                          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{userData.email}</span>
                        </div>
                        <div style={{ padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '10px', border: '2px solid #4caf50', gridColumn: '1 / -1' }}>
                          <strong style={{ color: '#2e7d32' }}>Şifre:</strong><br/>
                          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2e7d32' }}>{userData.password}</span>
                        </div>
                      </div>
                      
                      <div style={{ 
                        marginTop: '20px', 
                        padding: '15px', 
                        backgroundColor: '#fff3cd', 
                        borderRadius: '10px',
                        border: '1px solid #ffc107',
                        textAlign: 'center'
                      }}>
                        <strong style={{ color: '#856404' }}>⚠️ Önemli:</strong>
                        <p style={{ color: '#856404', margin: '5px 0 0 0', fontSize: '14px' }}>
                          Bu bilgileri güvenli bir yerde saklayın. Şifre sadece bir kez gösterilmektedir.
                        </p>
                      </div>
                    </div>
                  );
                } catch (e) {
                  return null;
                }
              })()}

              {/* Ödeme Bilgileri */}
              <div style={{
                backgroundColor: 'var(--white)',
                borderRadius: '15px',
                padding: '30px',
                marginBottom: '30px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px', textAlign: 'center' }}>
                  💳 Ödeme Bilgileri
                </h3>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                    4.800 ₺
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-light)' }}>
                    (KDV Dahil - Franchise Satış Paketi)
                  </div>
                </div>
                
                <div style={{ 
                  padding: '20px', 
                  backgroundColor: 'var(--card-gray)', 
                  borderRadius: '10px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>IBAN Bilgileri:</h4>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '2px' }}>
                    TR77 0011 1000 0000 0153 1671 66
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '5px' }}>
                    HOOWELL Network Marketing Ltd. Şti.
                  </div>
                </div>
              </div>

              {/* Aksiyon Butonları */}
              <div style={{ display: 'flex', gap: '20px' }}>
                <button
                  onClick={() => {
                    // Ödeme kaydı oluştur (dekont yok)
                    navigate('/payment', {
                      state: {
                        partnerId: JSON.parse(message.split('|')[1]).partner_id,
                        amount: 4800,
                        partnerInfo: {
                          name: registrationType === 'individual' 
                            ? `${formData.first_name} ${formData.last_name}`
                            : formData.company_name,
                          email: formData.email,
                          type: registrationType
                        },
                        skipReceipt: true // Dekont yükleme atla
                      }
                    });
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
                  Ödeme Kaydı Oluştur
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

export default PartnerRegistration;