import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Ülke kodları listesi
const countryCodes = [
  { code: '+90', name: 'Türkiye', flag: '🇹🇷' },
  { code: '+1', name: 'ABD/Kanada', flag: '🇺🇸' },
  { code: '+44', name: 'İngiltere', flag: '🇬🇧' },
  { code: '+49', name: 'Almanya', flag: '🇩🇪' },
  { code: '+33', name: 'Fransa', flag: '🇫🇷' },
  { code: '+39', name: 'İtalya', flag: '🇮🇹' },
  { code: '+34', name: 'İspanya', flag: '🇪🇸' },
  { code: '+31', name: 'Hollanda', flag: '🇳🇱' },
  { code: '+32', name: 'Belçika', flag: '🇧🇪' },
  { code: '+41', name: 'İsviçre', flag: '🇨🇭' },
  { code: '+43', name: 'Avusturya', flag: '🇦🇹' },
  { code: '+46', name: 'İsveç', flag: '🇸🇪' },
  { code: '+47', name: 'Norveç', flag: '🇳🇴' },
  { code: '+45', name: 'Danimarka', flag: '🇩🇰' },
  { code: '+358', name: 'Finlandiya', flag: '🇫🇮' },
  { code: '+7', name: 'Rusya', flag: '🇷🇺' },
  { code: '+86', name: 'Çin', flag: '🇨🇳' },
  { code: '+81', name: 'Japonya', flag: '🇯🇵' },
  { code: '+82', name: 'Güney Kore', flag: '🇰🇷' },
  { code: '+91', name: 'Hindistan', flag: '🇮🇳' },
  { code: '+61', name: 'Avustralya', flag: '🇦🇺' },
  { code: '+55', name: 'Brezilya', flag: '🇧🇷' },
  { code: '+52', name: 'Meksika', flag: '🇲🇽' },
  { code: '+54', name: 'Arjantin', flag: '🇦🇷' },
  { code: '+971', name: 'BAE', flag: '🇦🇪' },
  { code: '+966', name: 'Suudi Arabistan', flag: '🇸🇦' },
  { code: '+20', name: 'Mısır', flag: '🇪🇬' },
  { code: '+27', name: 'Güney Afrika', flag: '🇿🇦' }
];

// Türkiye İl ve İlçe verileri (Tam kapsamlı 81 il)
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
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    registration_type: 'individual',
    first_name: '',
    last_name: '',
    tc_no: '',
    email: '',
    phone: '',
    country_code: '+90',
    city: '',
    district: '',
    delivery_address: '',
    company_name: '',
    tax_office: '',
    tax_no: '',
    authorized_person: '',
    authorized_email: '',
    authorized_phone: '',
    authorized_country_code: '+90',
    selected_product: '',
    contract1_accepted: false,
    contract2_accepted: false,
    contract3_accepted: false, // Mesafeli Satış Sözleşmesi
    contract4_accepted: false, // Ön Bilgilendirme Formu
    contract5_accepted: false  // Elektronik Ticaret Bilgilendirmesi
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

  // Basit validation - sadece gerekli alanları kontrol et
  const validateForm = () => {
    // Bu fonksiyon şu an kullanılmıyor, handleSubmit içinde validation var
    return true;
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
        total_amount: selectedProductData?.total || 0,   // TL cinsinden toplam
        // PayTR için gerekli ek sözleşme onayları
        contract3_accepted: formData.contract3_accepted, // Mesafeli Satış
        contract4_accepted: formData.contract4_accepted, // Ön Bilgilendirme
        contract5_accepted: formData.contract5_accepted  // E-Ticaret
      };

      const response = await axios.post('/api/customers', submitData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        // Başarı mesajını state'e kaydet
        setMessage(`✅ Müşteri kaydı başarıyla oluşturuldu!|${JSON.stringify({
          customer_id: response.data.customer_id,
          kkp_earned: response.data.kkp_earned,
          total_amount: selectedProductData?.total || 0,
          product_name: selectedProductData?.name || ''
        })}`);
        setCurrentStep(8);
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
          {[1, 2, 3, 4, 5, 6, 7].map((step) => (
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
          Adım {currentStep}/7: {
            currentStep === 1 ? 'Kayıt Türü' :
              currentStep === 2 ? 'Bilgiler' :
                currentStep === 3 ? 'Ürün Seçimi' :
                  currentStep === 4 ? 'Sipariş Özeti' :
                    currentStep === 5 ? 'Sözleşmeler' :
                      currentStep === 6 ? 'Özet' :
                        currentStep === 7 ? 'Ödeme' : 'Tamamlandı'
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
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select
                      value={formData.country_code}
                      onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
                      style={{
                        width: '120px',
                        padding: '12px',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: '#fff'
                      }}
                    >
                      {countryCodes.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="5XX XXX XX XX"
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
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
                    placeholder="Yetkili kişinin adı soyadı"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Yetkili E-posta *</label>
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
                    placeholder="yetkili@sirket.com"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Yetkili Telefon *</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select
                      value={formData.authorized_country_code}
                      onChange={(e) => setFormData({ ...formData, authorized_country_code: e.target.value })}
                      style={{
                        width: '120px',
                        padding: '12px',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: '#fff'
                      }}
                    >
                      {countryCodes.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={formData.authorized_phone}
                      onChange={(e) => setFormData({ ...formData, authorized_phone: e.target.value })}
                      placeholder="5XX XXX XX XX"
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
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

      {/* ADIM 4: Sipariş Özeti */}
      {currentStep === 4 && (
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
              <p><strong>Şehir:</strong> {formData.city}</p>
              <p><strong>İlçe:</strong> {formData.district}</p>
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

      {/* ADIM 5: Sözleşmeler */}
      {currentStep === 5 && (
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

            {/* Sözleşme 3 - Mesafeli Satış Sözleşmesi */}
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
              <h4>MESAFELİ SATIŞ SÖZLEŞMESİ</h4>
              <p><strong>MADDE 1 - TARAFLAR</strong></p>
              <p><strong>SATICI:</strong> HOOWELL GLOBAL SU ARITMA SİSTEMLERİ ANONİM ŞİRKETİ</p>
              <p>Adres: AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR</p>
              <p>Telefon: info@hoowell.com.tr</p>
              <p><strong>MADDE 2 - KONU</strong></p>
              <p>İşbu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun'un 48-84. maddeleri gereğince düzenlenmiştir.</p>
              <p><strong>MADDE 3 - CAYMA HAKKI</strong></p>
              <p>Tüketici, ürünü teslim aldığı tarihten itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayabilir.</p>
              <p><strong>MADDE 4 - TESLİMAT</strong></p>
              <p>Ürün, sipariş onayından sonra 7-14 iş günü içinde belirtilen adrese teslim edilecektir.</p>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.contract3_accepted}
                onChange={(e) => setFormData({ ...formData, contract3_accepted: e.target.checked })}
                style={{ marginRight: '10px', transform: 'scale(1.2)' }}
              />
              <span>Mesafeli satış sözleşmesini okudum, anladım ve kabul ediyorum.</span>
            </label>

            {/* Sözleşme 4 - Ön Bilgilendirme Formu */}
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
              <h4>ÖN BİLGİLENDİRME FORMU</h4>
              <p><strong>1. SATICI BİLGİLERİ</strong></p>
              <p>Ticaret Unvanı: HOOWELL GLOBAL SU ARITMA SİSTEMLERİ ANONİM ŞİRKETİ</p>
              <p>Ticaret Sicil No: 264080</p>
              <p><strong>2. ÜRÜN BİLGİLERİ</strong></p>
              <p>Ürün: {products.find(p => p.id === formData.selected_product)?.name}</p>
              <p>Fiyat: {products.find(p => p.id === formData.selected_product)?.total.toLocaleString()} TL (KDV Dahil)</p>
              <p><strong>3. ÖDEME VE TESLİMAT</strong></p>
              <p>Ödeme: IBAN ile havale/EFT</p>
              <p>Teslimat: 7-14 iş günü</p>
              <p><strong>4. CAYMA HAKKI</strong></p>
              <p>14 günlük cayma hakkınız bulunmaktadır.</p>
              <p><strong>5. ŞİKAYET VE İTİRAZ</strong></p>
              <p>Tüketici sorunları için: info@hoowell.com.tr</p>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.contract4_accepted}
                onChange={(e) => setFormData({ ...formData, contract4_accepted: e.target.checked })}
                style={{ marginRight: '10px', transform: 'scale(1.2)' }}
              />
              <span>Ön bilgilendirme formunu okudum, anladım ve kabul ediyorum.</span>
            </label>

            {/* Sözleşme 5 - Elektronik Ticaret Bilgilendirmesi */}
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
              <h4>ELEKTRONİK TİCARET BİLGİLENDİRMESİ</h4>
              <p><strong>6563 SAYILI ELEKTRONİK TİCARET KANUNU KAPSAMINDA</strong></p>
              <p><strong>1. HİZMET SAĞLAYICI</strong></p>
              <p>HOOWELL GLOBAL SU ARITMA SİSTEMLERİ ANONİM ŞİRKETİ</p>
              <p>Web sitesi üzerinden elektronik ticaret faaliyeti yürütmektedir.</p>
              <p><strong>2. GÜVENLİ ÖDEME</strong></p>
              <p>Ödeme bilgileriniz SSL sertifikası ile korunmaktadır.</p>
              <p>Kredi kartı bilgileri saklanmamaktadır.</p>
              <p><strong>3. TEKNİK GEREKSİNİMLER</strong></p>
              <p>Modern web tarayıcısı gereklidir.</p>
              <p>JavaScript aktif olmalıdır.</p>
              <p><strong>4. ÇEREZ KULLANIMI</strong></p>
              <p>Site deneyimini iyileştirmek için çerezler kullanılmaktadır.</p>
              <p><strong>5. FİKRİ MÜLKİYET</strong></p>
              <p>Site içeriği telif hakları ile korunmaktadır.</p>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.contract5_accepted}
                onChange={(e) => setFormData({ ...formData, contract5_accepted: e.target.checked })}
                style={{ marginRight: '10px', transform: 'scale(1.2)' }}
              />
              <span>Elektronik ticaret koşullarını okudum, anladım ve kabul ediyorum.</span>
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
              disabled={!formData.contract1_accepted || !formData.contract2_accepted || !formData.contract3_accepted || !formData.contract4_accepted || !formData.contract5_accepted}
              style={{
                backgroundColor: (formData.contract1_accepted && formData.contract2_accepted && formData.contract3_accepted && formData.contract4_accepted && formData.contract5_accepted) ? 'var(--primary-dark)' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 30px',
                fontSize: '16px',
                cursor: (formData.contract1_accepted && formData.contract2_accepted && formData.contract3_accepted && formData.contract4_accepted && formData.contract5_accepted) ? 'pointer' : 'not-allowed'
              }}
            >
              Devam Et →
            </button>
          </div>
        </div>
      )}

      {/* ADIM 6: Özet ve Onay */}
      {currentStep === 6 && (
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
              onClick={handleNext}
              style={{
                backgroundColor: 'var(--primary-dark)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 30px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Ödeme Sayfasına Git →
            </button>
          </div>
        </div>
      )}

      {/* ADIM 7: Ödeme Bilgileri */}
      {currentStep === 7 && (
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '40px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-dark)' }}>
            Ödeme Bilgileri
          </h2>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Sipariş Özeti */}
            <div style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '15px',
              marginBottom: '30px',
              border: '2px solid var(--accent-gold)'
            }}>
              <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px', textAlign: 'center' }}>
                📋 Sipariş Özeti
              </h3>
              
              {formData.selected_product && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
                    {products.find(p => p.id === formData.selected_product)?.name}
                  </div>
                  <div style={{ fontSize: '16px', marginBottom: '15px', color: 'var(--text-light)' }}>
                    {products.find(p => p.id === formData.selected_product)?.description}
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '20px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', color: 'var(--text-light)' }}>Net Fiyat</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        {products.find(p => p.id === formData.selected_product)?.price.toLocaleString()} TL
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', color: 'var(--text-light)' }}>KDV (%20)</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        {products.find(p => p.id === formData.selected_product)?.vat.toLocaleString()} TL
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', backgroundColor: 'var(--accent-gold)', padding: '10px', borderRadius: '10px' }}>
                      <div style={{ fontSize: '14px', color: 'var(--primary-dark)' }}>TOPLAM</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                        {products.find(p => p.id === formData.selected_product)?.total.toLocaleString()} TL
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ödeme Talimatları */}
            <div style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '15px',
              marginBottom: '30px'
            }}>
              <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px', textAlign: 'center' }}>
                💳 Ödeme Talimatları
              </h3>
              
              <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                <h4 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>
                  1️⃣ Banka Havalesi / EFT
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <p><strong>Banka:</strong> Türkiye İş Bankası</p>
                    <p><strong>Hesap Sahibi:</strong> HOOWELL GLOBAL ANONİM ŞİRKETİ</p>
                    <p><strong>IBAN:</strong> TR12 0006 4000 0011 2345 6789 01</p>
                  </div>
                  <div>
                    <p><strong>Şube Kodu:</strong> 1234</p>
                    <p><strong>Hesap No:</strong> 11234567-01</p>
                    <p><strong>Swift Kodu:</strong> ISBKTRIS</p>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#e8f5e8', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                <h4 style={{ color: 'var(--success-green)', marginBottom: '15px' }}>
                  2️⃣ Ödeme Sonrası İşlemler
                </h4>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Ödeme yaptıktan sonra dekont/makbuzunuzu kaydedin</li>
                  <li>Ödeme makbuzunu sistem üzerinden yükleyin</li>
                  <li>Açıklama kısmına müşteri adını yazın</li>
                  <li>Admin onayından sonra sipariş işleme alınacaktır</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '10px' }}>
                <h4 style={{ color: '#856404', marginBottom: '15px' }}>
                  ⚠️ Önemli Notlar
                </h4>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Ödeme açıklamasına mutlaka müşteri adını yazın</li>
                  <li>Farklı tutarda ödeme yapılması durumunda sipariş iptal edilebilir</li>
                  <li>Ödeme onayı 1-2 iş günü içinde yapılacaktır</li>
                  <li>Teslimat süresi ödeme onayından sonra 7-14 iş günüdür</li>
                </ul>
              </div>
            </div>

            {/* Müşteri Bilgileri Özeti */}
            <div style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '15px',
              marginBottom: '30px'
            }}>
              <h3 style={{ color: 'var(--primary-dark)', marginBottom: '20px', textAlign: 'center' }}>
                👤 Müşteri Bilgileri
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  {formData.registration_type === 'individual' ? (
                    <>
                      <p><strong>Ad Soyad:</strong> {formData.first_name} {formData.last_name}</p>
                      <p><strong>TC No:</strong> {formData.tc_no}</p>
                      <p><strong>E-posta:</strong> {formData.email}</p>
                      <p><strong>Telefon:</strong> {formData.phone}</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Şirket:</strong> {formData.company_name}</p>
                      <p><strong>Vergi Dairesi:</strong> {formData.tax_office}</p>
                      <p><strong>Vergi No:</strong> {formData.tax_no}</p>
                      <p><strong>Yetkili:</strong> {formData.authorized_person}</p>
                      <p><strong>E-posta:</strong> {formData.authorized_email}</p>
                      <p><strong>Telefon:</strong> {formData.authorized_phone}</p>
                    </>
                  )}
                </div>
                <div>
                  <p><strong>Şehir:</strong> {formData.city}</p>
                  <p><strong>İlçe:</strong> {formData.district}</p>
                  <p><strong>Teslimat Adresi:</strong></p>
                  <p style={{ fontSize: '14px', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
                    {formData.delivery_address}
                  </p>
                </div>
              </div>
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
                backgroundColor: 'var(--success-green)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 40px',
                fontSize: '18px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(39, 174, 96, 0.3)'
              }}
            >
              💾 Müşteri Kaydını Tamamla
            </button>
          </div>
        </div>
      )}

      {/* ADIM 8: Başarı */}
      {currentStep === 8 && (
        <div style={{
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
          <h2 style={{ color: 'var(--success-green)', marginBottom: '20px' }}>
            Müşteri Kaydı Başarıyla Tamamlandı!
          </h2>
          
          {message && message.includes('✅') && (
            <div style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '15px',
              marginBottom: '30px',
              maxWidth: '600px',
              margin: '0 auto 30px auto'
            }}>
              <h3 style={{ color: 'var(--primary-dark)', marginBottom: '15px' }}>
                📊 Kayıt Detayları
              </h3>
              {(() => {
                try {
                  const data = JSON.parse(message.split('|')[1]);
                  return (
                    <div>
                      <p><strong>Müşteri ID:</strong> {data.customer_id}</p>
                      <p><strong>Kazanılan KKP:</strong> {data.kkp_earned}</p>
                      <p><strong>Ürün:</strong> {data.product_name}</p>
                      <p><strong>Toplam Tutar:</strong> {data.total_amount?.toLocaleString()} TL</p>
                    </div>
                  );
                } catch (e) {
                  return <p>Kayıt başarıyla tamamlandı.</p>;
                }
              })()}
            </div>
          )}

          <p style={{ fontSize: '16px', marginBottom: '30px', color: 'var(--text-dark)' }}>
            Müşteri kaydınız oluşturuldu. Ödeme talimatları e-posta adresinize gönderilecektir.
          </p>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/payment')}
              style={{
                backgroundColor: 'var(--accent-gold)',
                color: 'var(--primary-dark)',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 30px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              💳 Ödeme Yap
            </button>
            
            <button
              onClick={() => navigate('/')}
              style={{
                backgroundColor: 'var(--primary-dark)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 30px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🏠 Ana Sayfa
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerRegistration